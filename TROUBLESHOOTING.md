# 故障排除文档 (Troubleshooting Guide)

> 记录项目开发和部署过程中遇到的问题及解决方案

最后更新: 2026-01-24

---

## 📑 目录

- [Vercel 部署问题](#vercel-部署问题)
- [本地开发问题](#本地开发问题)
- [API 调用问题](#api-调用问题)
- [依赖包问题](#依赖包问题)

---

## Vercel 部署问题

### 问题 1: 构建失败 - Module not found: Can't resolve 'form-data'

**发生时间**: 2026-01-24

**错误信息**:
```
20:02:38.428  Error: Turbopack build failed with 1 errors:
20:02:38.428  ./lib/backend/kieai-illustration.js:2:18
20:02:38.429  Module not found: Can't resolve 'form-data'
20:02:38.429    1 | const axios = require('axios');
20:02:38.429  > 2 | const FormData = require('form-data');
```

**问题原因**:
1. 从 `ai-logo-backend` 迁移代码到 `lib/backend/` 时
2. `kieai-illustration.js` 使用了 `form-data` 包来上传参考图片
3. 但 `form-data` 依赖没有添加到前端项目的 `package.json` 中
4. Vercel 构建时无法找到该模块

**解决方案**:

**步骤 1**: 安装缺失的依赖
```bash
npm install form-data
```

**步骤 2**: 确认已添加到 package.json
```bash
grep "form-data" package.json
# 应该看到: "form-data": "^4.0.5",
```

**步骤 3**: 提交并推送
```bash
git add package.json package-lock.json
git commit -m "Add form-data dependency"
git push origin main
```

**步骤 4**: Vercel 会自动重新部署

**预防措施**:
- 迁移后端代码时，检查所有 `require()` 语句
- 确保所有依赖都在 `package.json` 的 `dependencies` 中
- 可以使用以下命令检查未安装的依赖：
  ```bash
  # 在迁移的文件中查找所有 require
  grep -r "require(" lib/backend/

  # 检查 package.json 中是否有对应的包
  ```

**相关文件**:
- `lib/backend/kieai-illustration.js`
- `package.json`
- `package-lock.json`

**状态**: ✅ 已解决 (提交: 34c21a3)

---

### 问题 2: 环境变量未生效

**症状**:
- API 调用返回 401 或 403 错误
- 服务器日志显示 API key 为 undefined
- DeepSeek 或 KIEAI 调用失败

**可能原因**:
1. 环境变量未在 Vercel 中配置
2. 环境变量名称拼写错误
3. 环境变量配置后未重新部署

**解决方案**:

**步骤 1**: 检查 Vercel 环境变量
```
Vercel Dashboard → 项目 → Settings → Environment Variables
```

确认以下变量存在：
- `DEEPSEEK_API_KEY`
- `KIEAI_API_KEY`

**步骤 2**: 检查环境选择
确保勾选了所有环境：
- ✅ Production
- ✅ Preview
- ✅ Development

**步骤 3**: 重新部署
```
Vercel Dashboard → Deployments → 最新部署 → ⋯ → Redeploy
```

或推送新的提交：
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

**验证方法**:
1. 部署完成后，访问网站测试功能
2. 查看 Vercel Functions 日志，确认没有 "undefined" 错误
3. 在浏览器控制台检查 API 响应

**状态**: 📝 待验证

---

### 问题 3: Serverless Function 超时

**症状**:
- API 调用超过 10 秒后返回 504 错误
- Vercel 日志显示 "Function execution timed out"

**原因**:
- Vercel 免费计划限制函数执行时间为 10 秒
- AI 生图任务可能需要更长时间

**我们的解决方案**:
✅ **已通过异步架构避免此问题**

1. API 快速创建任务并返回（< 3 秒）
2. 前端轮询查询状态（每次查询 < 1 秒）
3. 长时间等待由前端处理，不占用服务器执行时间

**代码示例**:
```typescript
// ✅ 正确：快速返回任务 ID
export async function POST(request: NextRequest) {
  const tasks = await createBatchTasks(prompts) // < 3 秒
  const batchId = `batch_${Date.now()}`
  taskStore.set(batchId, { tasks })

  return NextResponse.json({ batchId }) // 立即返回
}

// ❌ 错误：等待任务完成
export async function POST(request: NextRequest) {
  const tasks = await createBatchTasks(prompts)
  await waitForCompletion(tasks) // ❌ 可能超过 10 秒！
  return NextResponse.json({ results })
}
```

**如果仍然超时**:
1. 检查 DeepSeek API 调用是否过慢
2. 检查 KIEAI API 调用是否过慢
3. 考虑升级到 Vercel Pro（60 秒限制）
4. 或使用独立服务器部署

**状态**: ✅ 已通过架构设计避免

---

## 本地开发问题

### 问题 4: 环境变量不生效（本地）

**症状**:
- API 调用失败
- 控制台显示 API key 为 undefined
- `.env.local` 已配置但不生效

**原因**:
- Next.js 启动时读取环境变量，修改后需要重启

**解决方案**:

**步骤 1**: 检查 `.env.local` 是否存在
```bash
ls -la .env.local
```

如果不存在，从模板创建：
```bash
cp .env.example .env.local
```

**步骤 2**: 编辑 `.env.local`，填入真实值
```env
DEEPSEEK_API_KEY=sk-你的密钥
KIEAI_API_KEY=你的密钥
```

**步骤 3**: 重启开发服务器
```bash
# Ctrl+C 停止服务器
npm run dev  # 重新启动
```

**验证方法**:
查看启动日志，应该显示：
```
- Environments: .env.local
```

**状态**: ✅ 已知解决方案

---

### 问题 5: 端口被占用

**症状**:
```
Port 3000 is in use by process 1880
```

**解决方案**:

**方法 1**: 停止占用端口的进程（推荐）
```bash
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"
npm run dev
```

**方法 2**: 使用其他端口
```bash
PORT=3001 npm run dev
```

**方法 3**: 查找并手动终止进程
```bash
# 查找占用 3000 端口的进程
netstat -ano | grep 3000

# 终止特定进程（替换 <PID>）
powershell -Command "Stop-Process -Id <PID> -Force"
```

**状态**: ✅ 已知解决方案

---

### 问题 6: TypeScript 类型错误

**症状**:
```
Type 'X' is not assignable to type 'Y'
```

**常见场景**:

**场景 1**: API 路由参数类型
```typescript
// ❌ 错误
export async function GET(request: NextRequest, params: any) {
  const { batchId } = params
}

// ✅ 正确
export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  const { batchId } = params
}
```

**场景 2**: 环境变量类型
```typescript
// ❌ 可能为 undefined
const apiKey = process.env.DEEPSEEK_API_KEY

// ✅ 提供默认值
const apiKey = process.env.DEEPSEEK_API_KEY || ""
```

**解决方法**:
1. 检查 TypeScript 错误信息
2. 参考现有代码的类型定义
3. 查看 [Next.js 文档](https://nextjs.org/docs)

**状态**: 📝 持续更新

---

## API 调用问题

### 问题 7: CORS 错误

**症状**:
```
Access to fetch at 'http://localhost:3001/api/...' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**原因**:
- 现在已不应该出现此问题（前后端同域）
- 如果出现，说明还在使用外部后端

**解决方案**:

**检查 API 调用地址**:
```typescript
// ✅ 正确：相对路径
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
fetch(`${API_BASE_URL}/api/generate-logo`)

// ❌ 错误：硬编码外部地址
fetch('http://localhost:3001/api/generate-logo')
```

**如果确实需要外部 API**:
在外部 API 服务器添加 CORS 头：
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.vercel.app']
}))
```

**状态**: ✅ 架构已解决

---

### 问题 8: API 返回 500 错误

**症状**:
- API 调用返回 500 Internal Server Error
- 浏览器控制台显示错误

**排查步骤**:

**步骤 1**: 查看服务器日志
本地开发时，查看终端输出的错误信息

**步骤 2**: 检查 API 密钥
```bash
# 本地
cat .env.local | grep API_KEY

# Vercel
检查 Environment Variables 配置
```

**步骤 3**: 测试第三方 API
```bash
# 测试 DeepSeek API
curl https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer sk-你的密钥"

# 测试 KIEAI API（根据具体接口调整）
```

**步骤 4**: 检查代码逻辑
- 查看 `lib/backend/deepseek.js`
- 查看 `lib/backend/kieai.js`
- 检查错误处理逻辑

**常见错误原因**:
1. ❌ API 密钥无效或过期
2. ❌ API 额度用尽
3. ❌ 网络连接问题
4. ❌ 请求参数格式错误

**状态**: 📝 持续更新

---

## 依赖包问题

### 问题 9: npm install 失败

**症状**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案**:

**方法 1**: 清除缓存并重新安装
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**方法 2**: 使用 --legacy-peer-deps
```bash
npm install --legacy-peer-deps
```

**方法 3**: 检查 Node.js 版本
```bash
node --version  # 应该是 18.x 或更高

# 如果版本过低，升级 Node.js
```

**状态**: 📝 备用方案

---

### 问题 10: 缺少依赖包

**症状**:
```
Module not found: Can't resolve 'xxx'
```

**排查清单**:

**步骤 1**: 检查是否是后端代码使用的包
```bash
# 查找所有 require 语句
grep -r "require(" lib/backend/

# 常见后端依赖：
# - axios
# - dotenv
# - form-data
```

**步骤 2**: 安装缺失的包
```bash
npm install 包名
```

**步骤 3**: 确认已添加到 package.json
```bash
grep "包名" package.json
```

**步骤 4**: 提交更改
```bash
git add package.json package-lock.json
git commit -m "Add missing dependency: 包名"
git push origin main
```

**预防措施**:
- 迁移代码前，先检查所有依赖
- 使用 `npm install --save` 确保保存到 package.json
- 提交前运行 `npm run build` 测试构建

**状态**: ✅ 已知解决方案

---

## 快速诊断指南

### 本地开发问题

```bash
# 1. 检查环境变量
ls .env.local && cat .env.local | grep API_KEY

# 2. 检查依赖安装
npm list axios dotenv form-data

# 3. 清理并重启
rm -rf .next
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"
npm run dev

# 4. 检查端口
netstat -ano | grep 3000
```

### Vercel 部署问题

**检查清单**:
- [ ] 环境变量已配置（Settings → Environment Variables）
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] package.json 包含所有必需的依赖
- [ ] 代码已推送到 GitHub
- [ ] 查看 Deployments 日志确认错误信息

**常用链接**:
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Deployments 日志](https://vercel.com/dashboard)
- [Functions 日志](https://vercel.com/dashboard)

---

## 有用的命令

### 调试命令

```bash
# 查看环境变量（本地）
env | grep DEEPSEEK
env | grep KIEAI

# 测试 API 端点（本地）
curl http://localhost:3000/api/health

# 查看端口占用
netstat -ano | grep 3000

# 查看 Node.js 进程
ps aux | grep node

# 清理所有缓存
rm -rf .next node_modules/.cache
npm cache clean --force
```

### Git 命令

```bash
# 查看未提交的更改
git status

# 查看最近的提交
git log --oneline -5

# 强制触发重新部署（空提交）
git commit --allow-empty -m "Trigger redeploy"
git push origin main

# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1
```

---

## 报告新问题

如果遇到本文档未涵盖的问题：

1. **记录错误信息**
   - 完整的错误堆栈
   - 发生时间
   - 操作步骤

2. **记录环境信息**
   - Node.js 版本: `node --version`
   - npm 版本: `npm --version`
   - 操作系统: Windows/Mac/Linux

3. **更新本文档**
   - 添加问题描述
   - 记录解决方案
   - 注明状态和日期

---

## 版本历史

| 日期 | 问题 | 状态 | 备注 |
|------|------|------|------|
| 2026-01-24 | Module not found: form-data | ✅ 已解决 | 添加依赖到 package.json |
| 2026-01-24 | 后端迁移到 API Routes | ✅ 已完成 | 前后端一体化 |

---

**最后更新**: 2026-01-24
**维护者**: 开发团队
**文档版本**: 1.0

---

**💡 提示**: 遇到问题时，先查看本文档，大部分常见问题都有解决方案！
