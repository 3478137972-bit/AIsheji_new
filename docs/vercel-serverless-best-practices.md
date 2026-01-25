# Vercel 无服务器开发最佳实践

## 核心问题:无服务器架构的无状态特性

### 问题描述

在 Vercel 部署的项目中,**不能使用进程内存来存储跨请求的数据**。

**错误示例:**
```javascript
// ❌ 错误:使用全局变量/内存存储
const taskStore = new Map();

// API 1: 存储数据
export async function POST(request) {
  const taskId = generateId();
  taskStore.set(taskId, data);  // 存储在实例 A 的内存
  return { taskId };
}

// API 2: 读取数据 (可能在不同实例运行)
export async function GET(request) {
  const data = taskStore.get(taskId);  // 在实例 B 的内存中查找,找不到!
  return data;  // undefined - 任务不存在
}
```

### 为什么会这样?

Vercel 的 Lambda 函数特性:

1. **每个请求可能运行在不同的 Lambda 实例**
2. **实例之间内存完全隔离,不共享数据**
3. **实例随时可能被销毁/重启/替换**
4. **本地开发 (npm run dev) 是单进程,不会暴露这个问题**

### 架构对比图

```
传统服务器 (单进程):
┌──────────────────────────┐
│    Node.js 进程          │
│                          │
│  全局变量: taskStore     │ ← 所有请求共享同一块内存
│                          │
│  请求1 → 请求2 → 请求3   │
└──────────────────────────┘

Vercel 无服务器 (多实例):
请求1 (生成任务)              请求2 (查询任务,10秒后)
┌─────────────────┐         ┌─────────────────┐
│ Lambda 实例 A   │         │ Lambda 实例 B   │
│ taskStore = {}  │  ✗      │ taskStore = {}  │ ← 全新的空对象
└─────────────────┘         └─────────────────┘
     ↓                           ↓
   存储数据                   查询失败 (数据在实例A)
```

---

## 解决方案:使用外部持久化存储

### 方案对比

| 存储方案 | 适用场景 | 优点 | 缺点 | 推荐度 |
|---------|---------|------|------|--------|
| **Supabase (PostgreSQL)** | 任何需要持久化的数据 | 免费额度大,功能强大,有 GUI 管理 | 查询稍慢 (50-200ms) | ⭐⭐⭐⭐⭐ |
| **Vercel KV (Redis)** | 临时缓存,会话管理 | 极快 (5-20ms),Vercel 原生支持 | 免费额度小,数据可能丢失 | ⭐⭐⭐⭐ |
| **Vercel Postgres** | 关系型数据 | Vercel 原生支持,部署简单 | 免费额度较小 | ⭐⭐⭐⭐ |
| **MongoDB Atlas** | 文档型数据 | 免费额度大,适合非结构化数据 | 需要额外注册账号 | ⭐⭐⭐ |
| **进程内存 (Map/变量)** | ❌ 不适用 Vercel | 快 | **无法跨实例共享** | ❌ 禁用 |

---

## 最佳实践:Supabase 集成方案

### 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 2. 创建数据库表

在 Supabase SQL Editor 中执行:

```sql
-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_expires_at ON tasks(expires_at);
```

### 3. 创建数据存储模块

```javascript
// lib/backend/data-store.js
const { createClient } = require('@supabase/supabase-js');

let supabase;

function getClient() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      console.error('未配置 Supabase 环境变量');
      return null;
    }

    supabase = createClient(url, key);
  }
  return supabase;
}

// ✅ 正确:存储到外部数据库
async function setData(id, data) {
  const client = getClient();
  if (!client) throw new Error('数据库未配置');

  const { error } = await client
    .from('tasks')
    .upsert({
      id: id,
      data: data,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

  if (error) throw error;
}

// ✅ 正确:从外部数据库读取
async function getData(id) {
  const client = getClient();
  if (!client) throw new Error('数据库未配置');

  const { data, error } = await client
    .from('tasks')
    .select('data')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // 未找到
    throw error;
  }

  return data?.data;
}

module.exports = { setData, getData };
```

### 4. 在 API 中使用

```javascript
// app/api/create-task/route.ts
import { setData } from '@/lib/backend/data-store';

export async function POST(request) {
  const taskId = `task_${Date.now()}`;
  const taskData = { status: 'processing', result: null };

  // ✅ 存储到 Supabase
  await setData(taskId, taskData);

  return Response.json({ taskId });
}

// app/api/get-task/[id]/route.ts
import { getData } from '@/lib/backend/data-store';

export async function GET(request, { params }) {
  const taskId = params.id;

  // ✅ 从 Supabase 读取
  const taskData = await getData(taskId);

  if (!taskData) {
    return Response.json({ error: '任务不存在' }, { status: 404 });
  }

  return Response.json(taskData);
}
```

### 5. 配置环境变量

在 Vercel 项目设置中添加:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key
```

**重要提示:**
- `NEXT_PUBLIC_*` 前缀的变量会暴露到浏览器,只用于公开数据
- `SUPABASE_SERVICE_KEY` 不要加 `NEXT_PUBLIC_` 前缀,仅在服务端使用

---

## 常见陷阱检查清单

开发 Vercel 项目时,检查以下问题:

### ❌ 禁止的模式

```javascript
// ❌ 1. 全局变量存储状态
const cache = {};
const userSessions = new Map();
const requestCount = 0;

// ❌ 2. 文件系统存储 (Lambda 文件系统是只读的)
fs.writeFileSync('/tmp/data.json', JSON.stringify(data));

// ❌ 3. 假设请求在同一个进程
let lastRequestTime;
export function handler() {
  const timeSinceLastRequest = Date.now() - lastRequestTime; // 不可靠!
}
```

### ✅ 正确的模式

```javascript
// ✅ 1. 使用外部数据库
await supabase.from('cache').insert({ key, value });

// ✅ 2. 使用 Vercel Blob 存储文件
import { put } from '@vercel/blob';
await put('data.json', JSON.stringify(data), { access: 'public' });

// ✅ 3. 每个请求都是独立的
export function handler() {
  const requestTime = Date.now(); // 从请求参数/数据库获取数据,不依赖全局状态
}
```

---

## 快速检查工具

在提交代码前,运行以下检查:

```bash
# 搜索可能有问题的模式
grep -r "new Map()" app/api/
grep -r "const.*=.*\[\]" app/api/
grep -r "let.*=" app/api/ | grep -v "const"
grep -r "fs.writeFile" app/api/
```

如果在 API 路由中发现这些模式,**立即改用外部存储**。

---

## 本地开发 vs 生产环境

| 特性 | 本地开发 (npm run dev) | Vercel 生产环境 |
|------|----------------------|----------------|
| 进程模型 | 单进程,持续运行 | 多个 Lambda 实例,随时启动/销毁 |
| 内存共享 | ✅ 所有请求共享内存 | ❌ 每个实例独立内存 |
| 文件写入 | ✅ 可以写入本地文件 | ❌ 只读文件系统 (除 /tmp) |
| 全局变量 | ✅ 跨请求保持状态 | ❌ 每个实例独立状态 |

**经验法则**: 如果代码依赖"上一个请求的结果",在 Vercel 上肯定会出问题!

---

## 调试技巧

### 1. 添加实例 ID 日志

```javascript
const INSTANCE_ID = Math.random().toString(36).substring(7);

export async function GET() {
  console.log(`[实例 ${INSTANCE_ID}] 处理请求`);
  // ...
}
```

在 Vercel 日志中,如果看到不同的实例 ID 处理同一个任务的不同阶段,说明遇到了跨实例问题。

### 2. 本地模拟多实例

```bash
# 启动多个进程模拟 Vercel 环境
PORT=3001 npm run dev &
PORT=3002 npm run dev &
PORT=3003 npm run dev &

# 通过负载均衡器访问,可以暴露跨实例问题
```

### 3. 检查 Vercel 日志

在 Vercel 项目 → Deployments → 点击部署 → Functions 标签,查看每个 API 的日志。

---

## 推荐的项目结构

```
project/
├── app/
│   └── api/
│       ├── create-task/
│       │   └── route.ts          # API 路由,只处理请求
│       └── get-task/[id]/
│           └── route.ts          # API 路由,只处理请求
├── lib/
│   └── backend/
│       ├── data-store.js         # ✅ 统一的数据存储层
│       ├── supabase-client.js    # ✅ Supabase 客户端
│       └── business-logic.js     # 业务逻辑
└── docs/
    └── vercel-serverless-best-practices.md  # 本文档
```

**关键原则**:
- API 路由只负责接收请求和返回响应
- 所有数据存储逻辑封装在 `lib/backend/data-store.js`
- 禁止在 API 路由中直接使用 Map、全局变量等

---

## 总结

### 核心规则

1. **永远不要在 API 路由中使用全局变量存储状态**
2. **所有跨请求数据必须存储在外部数据库**
3. **本地能运行不代表 Vercel 能运行**
4. **每个请求都假设在全新的实例中运行**

### 推荐方案

- **首选**: Supabase (PostgreSQL) - 免费额度大,功能强大
- **备选**: Vercel KV (Redis) - 适合临时数据,原生集成
- **文件存储**: Vercel Blob - 适合图片/文件上传

### 检查清单

部署前检查:
- [ ] 没有使用全局 Map/Set/Array 存储数据
- [ ] 没有使用全局变量跨请求传递数据
- [ ] 没有依赖文件系统写入 (除 /tmp 临时文件)
- [ ] 所有持久化数据都存储在外部数据库
- [ ] 环境变量已在 Vercel 配置
- [ ] 本地测试通过且理解了无服务器架构限制

---

## 参考资源

- [Vercel Serverless Functions 文档](https://vercel.com/docs/functions/serverless-functions)
- [Supabase 官方文档](https://supabase.com/docs)
- [Vercel KV (Redis) 文档](https://vercel.com/docs/storage/vercel-kv)
- [Next.js API Routes 最佳实践](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**最后更新**: 2026-01-25
**适用于**: Vercel、Netlify、AWS Lambda、Cloudflare Workers 等所有无服务器平台
