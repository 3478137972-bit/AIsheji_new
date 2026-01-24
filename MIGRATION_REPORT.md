# 后端迁移到 Next.js API Routes 完成报告

迁移完成时间: 2026-01-24

## 迁移总结

成功将独立的 Node.js + Express 后端服务迁移到 Next.js API Routes，实现前后端一体化部署。

---

## 架构变化

### 迁移前
```
前端项目 (Next.js)  →  HTTP  →  后端项目 (Express)  →  第三方 API
   端口: 3000                        端口: 3001           (DeepSeek + KIEAI)
```

### 迁移后
```
Next.js 全栈项目
├── 前端页面 (app/tools/)
└── API Routes (app/api/)  →  第三方 API (DeepSeek + KIEAI)
    端口: 3000 (统一)
```

---

## 新增文件

### API Routes (3个)

1. **[app/api/generate-logo/route.ts](app/api/generate-logo/route.ts)**
   - 处理 Logo 生成请求
   - 调用 DeepSeek 生成提示词
   - 调用 KIEAI 创建生图任务

2. **[app/api/generate-illustration/route.ts](app/api/generate-illustration/route.ts)**
   - 处理插画生成请求
   - 支持参考图片上传
   - 批量创建生图任务

3. **[app/api/task-status/[batchId]/route.ts](app/api/task-status/[batchId]/route.ts)**
   - 动态路由，查询任务状态
   - 支持 Logo 和插画任务查询
   - 返回生成进度和结果

### 后端工具函数 (4个)

复制到 `lib/backend/` 目录：
- **config.js** - 环境变量配置
- **deepseek.js** - DeepSeek API 调用
- **kieai.js** - KIEAI Logo API
- **kieai-illustration.js** - KIEAI 插画 API

---

## 修改文件

### 前端页面 (4个)

所有页面的 API 调用地址改为相对路径：

```typescript
// 修改前
const API_BASE_URL = "http://localhost:3001"

// 修改后
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
```

修改的文件:
- [app/tools/ai-logo/page.tsx](app/tools/ai-logo/page.tsx)
- [app/tools/ai-illustration/page.tsx](app/tools/ai-illustration/page.tsx)
- [app/tools/ai-ip-illustration-1/page.tsx](app/tools/ai-ip-illustration-1/page.tsx)
- [app/tools/ai-font/page.tsx](app/tools/ai-font/page.tsx)

### 环境变量配置

**[.env.example](.env.example)** - 更新为包含 API 密钥配置
**[.env.local](.env.local)** - 新增本地开发环境变量

---

## 环境变量配置

### 必填变量 (2个)

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxxxx` |
| `KIEAI_API_KEY` | KIEAI API 密钥 | `xxxxxx` |

### 可选变量 (3个)

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | DeepSeek API 地址 |
| `KIEAI_BASE_URL` | `https://api.kie.ai` | KIEAI API 地址 |
| `NEXT_PUBLIC_API_BASE_URL` | 空（使用内置API） | 外部 API 地址（留空即可） |

---

## API 端点映射

| 原端点 (Express) | 新端点 (Next.js) | 方法 |
|------------------|------------------|------|
| `POST /api/generate-logo` | `POST /api/generate-logo` | POST |
| `POST /api/generate-illustration` | `POST /api/generate-illustration` | POST |
| `GET /api/task-status/:batchId` | `GET /api/task-status/[batchId]` | GET |

前端调用示例:
```typescript
// 相对路径，自动使用当前域名
fetch('/api/generate-logo', { method: 'POST', ... })
fetch('/api/task-status/batch_123', { method: 'GET' })
```

---

## 本地开发

### 启动服务
```bash
npm run dev
```

访问地址:
- **前端**: http://localhost:3000
- **API**: http://localhost:3000/api/...

### 测试 API

**测试 AI Logo**:
http://localhost:3000/tools/ai-logo

**测试 AI 插画**:
http://localhost:3000/tools/ai-illustration

**测试 AI IP 插画 1 号员工**:
http://localhost:3000/tools/ai-ip-illustration-1

---

## Vercel 部署

### 环境变量配置

在 Vercel Dashboard → Settings → Environment Variables 中配置:

```env
DEEPSEEK_API_KEY=sk-你的密钥
KIEAI_API_KEY=你的密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com
KIEAI_BASE_URL=https://api.kie.ai
```

### 部署步骤

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

**无需任何额外配置！** Next.js API Routes 会自动部署为 Serverless Functions。

---

## 优势

### ✅ 简化部署
- **1 个项目** vs 2 个项目
- **1 次部署** vs 2 次部署
- **0 个域名配置**

### ✅ 降低成本
- 无需单独的后端服务器
- Vercel 免费计划完全够用
- 无额外的运维成本

### ✅ 提升开发效率
- 前后端代码在同一仓库
- 共享类型定义
- 统一的开发环境

### ✅ 更好的性能
- 前后端同域，无需 CORS
- 减少网络延迟
- Vercel Edge Network 全球加速

---

## 后续功能开发流程

新增 AI 工具功能卡片时，按照以下步骤：

### 1. 创建前端页面
```
app/tools/新功能/page.tsx
```

### 2. 创建 API 路由
```
app/api/新功能接口/route.ts
```

### 3. 实现业务逻辑
- 在 API 路由中调用 DeepSeek + KIEAI
- 使用 `lib/backend/` 中的工具函数

### 4. 测试 → 提交 → 部署
```bash
git add .
git commit -m "Add 新功能"
git push origin main
```

Vercel 会自动部署！

---

## 下一步工作

### 可以删除的内容

**独立后端项目已不再需要**，可以删除：
- `ai-logo-backend/` 目录
- `ai-logo-backend/.env.example`

**保留作为参考**，暂不删除：
- 可用于对比和学习
- 未来如需独立部署可恢复

### 待办事项

- [x] 迁移后端到 API Routes
- [x] 配置环境变量
- [x] 测试本地开发
- [ ] 测试生产部署
- [ ] 删除独立后端项目（可选）

---

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript
- **后端**: Next.js API Routes (Serverless)
- **AI 服务**: DeepSeek + KIEAI
- **部署**: Vercel
- **运行时**: Node.js 18+

---

## 注意事项

### Vercel 限制

**免费计划**:
- ✅ 10 秒执行时间限制 (我们的异步架构完美避开)
- ✅ 每个 API 调用 < 3 秒
- ✅ 长时间任务通过前端轮询处理

**Pro 计划** (如需升级):
- 60 秒执行时间
- 更多带宽和函数调用次数

### API 密钥安全

- ✅ 密钥存储在环境变量中
- ✅ 不使用 `NEXT_PUBLIC_` 前缀
- ✅ 仅在服务端使用，不暴露给浏览器

---

**迁移完成！** 🎉

项目现在是一个完整的 Next.js 全栈应用，可以直接部署到 Vercel。
