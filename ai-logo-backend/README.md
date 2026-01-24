# AI Logo 后端服务

这是一个基于 Node.js + Express 的 AI Logo 生成后端服务。

## 功能流程

1. 接收前端表单数据（品牌名、行业、风格、Slogan）
2. 调用 DeepSeek API 生成 5 个不同的设计提示词
3. 将提示词提交给 KIEAI 生图服务
4. 轮询查询生图任务状态
5. 返回生成的图片链接给前端

## 技术栈

- Node.js + Express
- DeepSeek API（生成提示词）
- KIEAI API（生成图片）
- Axios（HTTP 请求）

## 安装依赖

```bash
npm install
```

## 启动服务

```bash
npm start
# 或
npm run dev
```

服务将运行在 `http://localhost:3001`

## API 接口

### 1. 健康检查
```bash
GET /api/health
```

### 2. 异步生成 Logo（推荐）
```bash
POST /api/generate-logo
Content-Type: application/json

{
  "logoName": "极客科技",
  "industry": "科技互联网",
  "style": "简约现代",
  "slogan": "科技改变生活"
}

# 返回示例
{
  "success": true,
  "batchId": "batch_1768978052582",
  "message": "任务已创建，请使用 batchId 查询进度",
  "promptCount": 5,
  "tasks": [...]
}
```

### 3. 查询任务状态
```bash
GET /api/task-status/:batchId

# 返回示例
{
  "success": true,
  "batchId": "batch_1768978052582",
  "status": "completed",
  "results": [
    {
      "index": 0,
      "taskId": "xxx",
      "status": "success",
      "imageUrl": "https://tempfile.aiquickdraw.com/workers/nano/image_xxx.png"
    },
    ...
  ]
}
```

### 4. 同步生成 Logo（等待全部完成）
```bash
POST /api/generate-logo-sync
Content-Type: application/json

{
  "logoName": "极客科技",
  "industry": "科技互联网",
  "style": "简约现代",
  "slogan": ""
}
```

## 环境变量配置

创建 `.env` 文件：

```env
# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# KIEAI API
KIEAI_API_KEY=your_kieai_api_key
KIEAI_BASE_URL=https://api.kie.ai

# Server
PORT=3001
```

## 部署到云服务器

1. 将代码上传到云服务器
2. 配置环境变量
3. 安装依赖：`npm install`
4. 启动服务：`npm start`
5. 使用 PM2 等工具保持服务运行：`pm2 start src/app.js --name ai-logo-backend`

## 注意事项

- 确保服务器能访问 DeepSeek 和 KIEAI 的 API
- 生图任务通常需要 5-15 秒完成
- 任务状态存储在内存中，服务重启后会丢失（生产环境建议使用 Redis）
