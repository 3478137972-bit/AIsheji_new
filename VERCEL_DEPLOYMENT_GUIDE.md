# Vercel 部署指南

本文档说明如何将项目部署到 Vercel 平台。

## 前置要求

- GitHub 账号
- Vercel 账号（可使用 GitHub 登录）
- 已获取 DeepSeek 和 KIEAI 的 API 密钥

## 部署架构

本项目采用前后端分离架构：

```
┌─────────────┐         ┌─────────────┐
│   前端      │  HTTP   │   后端      │
│  (Next.js)  │ ──────► │  (Node.js)  │
│   Vercel    │         │   Vercel    │
└─────────────┘         └─────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   第三方 API     │
                    │ DeepSeek + KIEAI │
                    └────���─────────────┘
```

## 部署步骤

### 一、部署后端服务

#### 方案 1: 使用 Vercel Serverless Functions (推荐)

1. **准备后端代码**
   - 将 `ai-logo-backend` 目录改造为 Vercel Serverless Functions
   - 创建 `api` 目录，将路由改为 serverless 函数

2. **创建新的 Vercel 项目**
   ```bash
   cd ai-logo-backend
   # 初始化 Vercel 项目
   vercel
   ```

3. **配置环境变量**

   在 Vercel Dashboard 中配置：
   - 项目设置 → Environment Variables
   - 添加以下环境变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `DEEPSEEK_API_KEY` | `sk-xxxxx` | DeepSeek API 密钥 |
   | `KIEAI_API_KEY` | `xxxxxx` | KIEAI API 密钥 |
   | `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | (可选) DeepSeek API 地址 |
   | `KIEAI_BASE_URL` | `https://api.kie.ai` | (可选) KIEAI API 地址 |

4. **部署**
   ```bash
   vercel --prod
   ```

5. **记录后端 URL**
   - 部署完成后，记录生成的 URL（如 `https://ai-logo-backend.vercel.app`）

#### 方案 2: 使用独立服务器

如果使用独立服务器（如阿里云、AWS 等）：

1. 上传后端代码到服务器
2. 配置环境变量（创建 `.env` 文件）
3. 使用 PM2 启动服务
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name ai-logo-backend
   ```
4. 配置 Nginx 反向代理（可选）

### 二、部署前端服务

1. **更新前端代码**

   确保所有 API 调用已使用环境变量（已完成）：
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
   ```

2. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Update API base URL for production"
   git push origin main
   ```

3. **导入项目到 Vercel**

   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库
   - 配置项目：
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

4. **配置环境变量**

   在 Vercel Dashboard 中配置：
   - 项目设置 → Environment Variables
   - 添加以下环境变量：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://ai-logo-backend.vercel.app` | 后端 API 地址 |

   **重要**: 将值替换为你在步骤一中部署的后端 URL

5. **部署**

   - 点击 "Deploy" 按钮
   - 等待构建完成

6. **访问网站**

   - 部署完成后，访问 Vercel 提供的 URL（如 `https://your-project.vercel.app`）

## 环境变量配置总结

### 前端项目 (主项目)

在 Vercel 项目设置中配置：

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.vercel.app
```

### 后端项目 (ai-logo-backend)

在 Vercel 项目设置中配置：

```env
DEEPSEEK_API_KEY=sk-1ee9dfb1d0bc4080992a1aaa7798e23a
KIEAI_API_KEY=606900131123347553ac876bf42a1566
DEEPSEEK_BASE_URL=https://api.deepseek.com
KIEAI_BASE_URL=https://api.kie.ai
```

**注意**: 以上密钥仅为示例，请使用你自己的真实密钥。

## 本地开发环境配置

### 前端

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 后端

在 `ai-logo-backend` 目录下创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=your_key_here
KIEAI_API_KEY=your_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
KIEAI_BASE_URL=https://api.kie.ai
PORT=3001
```

## 验证部署

### 1. 检查后端 API

访问后端健康检查接口：
```
https://your-backend-api.vercel.app/api/health
```

应该返回：
```json
{
  "status": "ok",
  "time": "2026-01-24T..."
}
```

### 2. 测试前端功能

访问前端网站，测试各个 AI 工具：
- AI Logo: `/tools/ai-logo`
- AI 插画: `/tools/ai-illustration`
- AI IP 插画 1 号员工: `/tools/ai-ip-illustration-1`

### 3. 检查浏览器控制台

确保没有 CORS 错误或 API 连接失败的错误。

## 常见问题

### Q1: API 调用失败，CORS 错误

**解决方案**: 确保后端已正确配置 CORS：

```javascript
// ai-logo-backend/src/app.js
app.use(cors());
```

### Q2: 环境变量不生效

**解决方案**:
1. 检查环境变量名称是否正确（前端必须以 `NEXT_PUBLIC_` 开头）
2. 重新部署项目（环境变量更新后需要重新构建）
3. 清除浏览器缓存

### Q3: 后端 API 超时

**解决方案**:
1. 检查 DeepSeek 和 KIEAI 的 API 密钥是否有效
2. 查看 Vercel 函数日志，检查错误信息
3. Vercel Serverless Functions 有 10 秒执行时间限制，可能需要升级到 Pro 计划

### Q4: 图片无法显示

**解决方案**:
1. 检查 `next.config.mjs` 中的图片域名配置：
   ```javascript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'tempfile.aiquickdraw.com',
       },
     ],
   }
   ```

## 成本估算

### Vercel 免费计划限制

- 带宽: 100GB/月
- Serverless Function 执行时间: 100GB-小时/月
- 构建时间: 6000 分钟/年

### 第三方 API 成本

- **DeepSeek API**: 按 token 计费
- **KIEAI API**: 按生图次数计费

建议在开发初期使用免费额度，根据实际使用情况升级。

## 监控和日志

### Vercel Analytics

在项目设置中启用 Analytics 以监控：
- 页面访问量
- 性能指标
- 用户地理分布

### 函数日志

查看 Serverless Functions 的执行日志：
- Vercel Dashboard → Deployments → Functions

## 更新部署

### 自动部署

配置 GitHub 自动部署：
1. 每次推送到 `main` 分支自动部署到生产环境
2. 每次推送到其他分支自动创建预览环境

### 手动部署

使用 Vercel CLI：

```bash
# 部署到生产环境
vercel --prod

# 部署到预览环境
vercel
```

## 安全建议

1. **不要在代码中硬编码密钥**
   - ✅ 使用环境变量
   - ❌ 在代码中写入 API 密钥

2. **保护敏感的环境变量**
   - 后端 API 密钥不要暴露给前端
   - 使用 `NEXT_PUBLIC_` 前缀的变量会暴露给浏览器

3. **定期轮换 API 密钥**
   - 建议每 3-6 个月更换一次

4. **添加访问限制**
   - 为 API 添加速率限制
   - 实施身份验证机制

## 参考链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)

---

**最后更新**: 2026-01-24
**维护者**: 开发团队
