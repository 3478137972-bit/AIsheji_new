# 秒懂AI超级员工 - 开发文档

> 📖 **重要提示**: 修改代码前，请先阅读本文档！避免浪费时间找不到关键位置。

最后更新: 2026-01-24

---

## 📁 项目结构

```
秒懂AI超级员工【设计系统】/
├── app/                          # Next.js App Router
│   ├── api/                     # 🔥 后端 API 路由（重要！）
│   │   ├── generate-logo/       # Logo 生成 API
│   │   │   └── route.ts
│   │   ├── generate-illustration/ # 插画生成 API
│   │   │   └── route.ts
│   │   └── task-status/         # 任务状态查询 API
│   │       └── [batchId]/
│   │           └── route.ts
│   │
│   ├── tools/                   # 🔥 前端工具页面（重要！）
│   │   ├── ai-logo/            # AI Logo 生成器
│   │   │   └── page.tsx
│   │   ├── ai-illustration/    # AI 插画生成器
│   │   │   └── page.tsx
│   │   ├── ai-ip-illustration-1/ # AI IP 插画 1 号员工
│   │   │   └── page.tsx
│   │   └── ai-font/            # AI 字体设计
│   │       └── page.tsx
│   │
│   ├── page.tsx                # 首页
│   └── layout.tsx              # 根布局
│
├── lib/                        # 工具函数库
│   └── backend/                # 🔥 后端工具函数（重要！）
│       ├── config.js           # 环境变量配置
│       ├── deepseek.js         # DeepSeek API 调用
│       ├── kieai.js            # KIEAI Logo API
│       └── kieai-illustration.js # KIEAI 插画 API
│
├── components/                 # React 组件
│   ├── dashboard/              # 仪表盘组件
│   │   ├── tool-grid.tsx      # 🔥 工具网格（添加工具入口）
│   │   └── quick-tools.tsx    # 快速工具
│   ├── main-layout.tsx         # 主布局
│   └── sidebar.tsx             # 侧边栏
│
├── .env.local                  # 🔥 本地环境变量（不提交 Git）
├── .env.example                # 环境变量模板
├── package.json                # 项目依赖
└── next.config.mjs             # Next.js 配置
```

---

## 🎯 快速定位指南

### 想添加新的 AI 工具？

**步骤 1**: 创建前端页面
```
📁 app/tools/新功能名称/page.tsx
```

**步骤 2**: 创建 API 路由
```
📁 app/api/新功能接口/route.ts
```

**步骤 3**: 添加到工具网格
```
📁 components/dashboard/tool-grid.tsx
找到 toolCategories 数组，添加新工具
```

### 想修改现有功能？

| 修改内容 | 文件位置 |
|---------|---------|
| AI Logo 界面 | `app/tools/ai-logo/page.tsx` |
| AI Logo 后端逻辑 | `app/api/generate-logo/route.ts` |
| AI 插画界面 | `app/tools/ai-illustration/page.tsx` |
| AI 插画后端逻辑 | `app/api/generate-illustration/route.ts` |
| 任务状态查询 | `app/api/task-status/[batchId]/route.ts` |
| DeepSeek 调用逻辑 | `lib/backend/deepseek.js` |
| KIEAI 调用逻辑 | `lib/backend/kieai.js` 或 `kieai-illustration.js` |
| 首页工具列表 | `components/dashboard/tool-grid.tsx` |
| 侧边栏导航 | `components/sidebar.tsx` |
| 环境变量配置 | `.env.local` (本地) 或 Vercel 设置 (生产) |

### 想修改 API 密钥？

**本地开发**:
```
📁 .env.local
修改 DEEPSEEK_API_KEY 或 KIEAI_API_KEY
```

**生产环境 (Vercel)**:
```
Vercel Dashboard → 项目 → Settings → Environment Variables
```

---

## 🔧 如何添加新的 AI 工具功能

### 完整示例: 添加"AI 海报设计"工具

#### 1️⃣ 创建前端页面

**文件**: `app/tools/ai-poster/page.tsx`

```typescript
"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

// API 地址 - 使用相对路径
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export default function AIPosterPage() {
  const [theme, setTheme] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    const response = await fetch(`${API_BASE_URL}/api/generate-poster`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme })
    })
    const data = await response.json()
    // 处理结果...
  }

  return (
    <MainLayout>
      {/* 你的 UI 代码 */}
    </MainLayout>
  )
}
```

#### 2️⃣ 创建 API 路由

**文件**: `app/api/generate-poster/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const { generatePosterPrompts } = require('@/lib/backend/deepseek')
const { createBatchTasks } = require('@/lib/backend/kieai')

// 导入共享的 taskStore
let taskStore: Map<string, any>
try {
  const logoRoute = require('../generate-logo/route')
  taskStore = logoRoute.taskStore
} catch {
  taskStore = new Map()
}

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json()

    // 1. 调用 DeepSeek 生成提示词
    const promptResult = await generatePosterPrompts({ theme })

    // 2. 创建生图任务
    const tasks = await createBatchTasks(promptResult.prompts)

    // 3. 保存任务状态
    const batchId = `batch_${Date.now()}`
    taskStore.set(batchId, {
      status: 'processing',
      tasks: tasks,
      prompts: promptResult.prompts,
      createdAt: new Date().toISOString()
    })

    // 4. 返回任务 ID
    return NextResponse.json({
      success: true,
      batchId: batchId,
      promptCount: promptResult.prompts.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

#### 3️⃣ 添加到工具网格

**文件**: `components/dashboard/tool-grid.tsx`

找到 `toolCategories` 数组，在"AI设计"分类中添加：

```typescript
const toolCategories: ToolCategory[] = [
  {
    title: "AI设计",
    tools: [
      { icon: Hexagon, label: "AI Logo", description: "智能生成Logo设计", href: "/tools/ai-logo" },
      // ... 其他工具
      { icon: FileImage, label: "AI海报设计", description: "一键生成海报", href: "/tools/ai-poster" }, // 👈 新增
    ],
  },
  // ...
]
```

#### 4️⃣ (可选) 添加 DeepSeek 提示词生成函数

**文件**: `lib/backend/deepseek.js`

```javascript
async function generatePosterPrompts({ theme }) {
  // 调用 DeepSeek API，生成海报设计提示词
  // 参考 generateLogoPrompts 的实现
}

module.exports = {
  generateLogoPrompts,
  generateIllustrationPrompts,
  generatePosterPrompts, // 👈 导出新函数
}
```

#### 5️⃣ 测试

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:3000/tools/ai-poster
```

---

## 🔑 环境变量配置

### 本地开发

**文件**: `.env.local` (需要手动创建，已在 .gitignore 中)

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-你的密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com

# KIEAI API
KIEAI_API_KEY=你的密钥
KIEAI_BASE_URL=https://api.kie.ai

# API 地址 (可选，留空使用内置 API Routes)
# NEXT_PUBLIC_API_BASE_URL=
```

### Vercel 部署

在 Vercel Dashboard 配置以下环境变量：

| 变量名 | 值 | 必填 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `sk-xxxxx` | ✅ |
| `KIEAI_API_KEY` | `xxxxxx` | ✅ |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | ❌ |
| `KIEAI_BASE_URL` | `https://api.kie.ai` | ❌ |

**重要**:
- ✅ 不要在代码中硬编码 API 密钥
- ✅ `.env.local` 不要提交到 Git
- ✅ 生产环境在 Vercel 中配置

---

## 📡 API 路由说明

### 现有 API 端点

| 端点 | 方法 | 说明 | 参数 |
|------|------|------|------|
| `/api/generate-logo` | POST | 生成 Logo | `{ logoName, industry, style, slogan }` |
| `/api/generate-illustration` | POST | 生成插画 | `{ description, style, aspectRatio, referenceImages }` |
| `/api/task-status/[batchId]` | GET | 查询任务状态 | 路径参数: `batchId` |

### API 调用示例

**前端调用**:
```typescript
// ✅ 推荐：使用相对路径
const response = await fetch('/api/generate-logo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ logoName: "测试", industry: "科技", style: "简约", slogan: "" })
})

// ❌ 不推荐：硬编码完整 URL
// const response = await fetch('http://localhost:3000/api/generate-logo', ...)
```

### 任务流程

```
1. 前端调用 /api/generate-logo
   ↓
2. API 调用 DeepSeek 生成提示词 (2-3秒)
   ↓
3. API 调用 KIEAI 创建生图任务 (1秒)
   ↓
4. API 返回 batchId
   ↓
5. 前端每 3 秒轮询 /api/task-status/{batchId}
   ↓
6. API 查询 KIEAI 任务状态 (1秒)
   ↓
7. 任务完成，返回图片 URL
```

---

## 🐛 常见问题排查

### 问题 1: API 调用失败，返回 500 错误

**可能原因**:
- 环境变量未配置
- API 密钥无效
- DeepSeek 或 KIEAI 服务故障

**排查步骤**:
1. 检查 `.env.local` 是否存在且配置正确
2. 查看浏览器控制台的错误信息
3. 查看服务器终端的错误日志
4. 测试 API 密钥是否有效

```bash
# 重启开发服务器，重新加载环境变量
npm run dev
```

### 问题 2: 前端页面空白或报错

**可能原因**:
- 组件导入路径错误
- 类型定义错误
- 缺少依赖

**排查步骤**:
1. 检查浏览器控制台错误
2. 检查服务器终端编译错误
3. 确认所有导入路径正确（使用 `@/` 别名）
4. 运行 `npm install` 确保依赖安装完整

### 问题 3: 环境变量不生效

**原因**: Next.js 需要重启才能读取新的环境变量

**解决**:
```bash
# 停止服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 问题 4: 图片无法显示

**可能原因**:
- 图片域名未在 `next.config.mjs` 中配置
- 图片 URL 无效
- CORS 问题

**解决**:

编辑 `next.config.mjs`:
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tempfile.aiquickdraw.com', // KIEAI 图片域名
      },
      // 添加其他图片域名
    ],
  },
}
```

### 问题 5: 部署到 Vercel 后 API 调用失败

**排查清单**:
- [ ] Vercel 环境变量已配置
- [ ] 环境变量名称正确（注意大小写）
- [ ] 前端使用相对路径调用 API (`/api/...`)
- [ ] 检查 Vercel 函数日志（Deployments → Functions）

---

## 🚀 部署流程

### 1. 本地测试

```bash
# 确保环境变量已配置
ls .env.local

# 启动开发服务器
npm run dev

# 测试所有功能
# http://localhost:3000/tools/ai-logo
# http://localhost:3000/tools/ai-illustration
```

### 2. 提交代码

```bash
git add .
git commit -m "Add new feature: AI Poster"
git push origin main
```

### 3. 部署到 Vercel

**首次部署**:
1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置环境变量（见上文）
4. 点击 Deploy

**后续部署**:
- 推送到 `main` 分支自动部署
- 或在 Vercel Dashboard 手动触发

### 4. 验证部署

```bash
# ���查健康状态（如果有的话）
curl https://你的域名.vercel.app/api/health

# 测试功能
访问: https://你的域名.vercel.app/tools/ai-logo
```

---

## 📝 代码规范

### 文件命名

- ✅ 组件文件: `kebab-case.tsx` (如 `tool-grid.tsx`)
- ✅ API 路由: `route.ts`
- ✅ 页面: `page.tsx`

### 导入规范

```typescript
// ✅ 使用路径别名
import { MainLayout } from "@/components/main-layout"

// ❌ 避免相对路径
import { MainLayout } from "../../../components/main-layout"
```

### API 调用规范

```typescript
// ✅ 使用相对路径
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""
fetch(`${API_BASE_URL}/api/generate-logo`, ...)

// ❌ 硬编码
fetch('http://localhost:3001/api/generate-logo', ...)
```

### 环境变量规范

```typescript
// ✅ 服务端 API 密钥（不使用 NEXT_PUBLIC_ 前缀）
DEEPSEEK_API_KEY=xxx
KIEAI_API_KEY=xxx

// ✅ 客户端变量（使用 NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_API_BASE_URL=xxx

// ❌ 不要暴露密钥给客户端
NEXT_PUBLIC_DEEPSEEK_API_KEY=xxx  // ❌ 错误！
```

---

## 🔄 Git 工作流

### 分支策略

```
main (主分支，自动部署到生产)
  ↑
  └── feature/新功能名称 (功能分支)
  └── fix/问题描述 (修复分支)
```

### 提交规范

```bash
# 新功能
git commit -m "feat: 添加 AI 海报设计功能"

# 修复
git commit -m "fix: 修复 Logo 生成 API 超时问题"

# 优化
git commit -m "perf: 优化图片加载性能"

# 文档
git commit -m "docs: 更新开发文档"
```

---

## 📚 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 16.0.10 |
| 运行时 | React | 19.2.0 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.1.9 |
| AI 服务 | DeepSeek API | - |
| 图片生成 | KIEAI API | - |
| 部署 | Vercel | - |
| HTTP 客户端 | Axios | Latest |

---

## 🆘 需要帮助？

### 文档资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Vercel 文档](https://vercel.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 项目文档

- [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) - 后端迁移报告
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Vercel 部署指南
- [STRUCTURE.md](./STRUCTURE.md) - 项目结构说明

### 快速链接

| 需求 | 位置 |
|------|------|
| 修改首页工具列表 | `components/dashboard/tool-grid.tsx` |
| 添加新工具页面 | `app/tools/新工具名/page.tsx` |
| 添加新 API | `app/api/新接口/route.ts` |
| 修改 DeepSeek 逻辑 | `lib/backend/deepseek.js` |
| 修改 KIEAI 逻辑 | `lib/backend/kieai.js` |
| 配置环境变量 | `.env.local` (本地) 或 Vercel (生产) |

---

## ⚡ 快捷命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码检查
npm run lint         # 运行 ESLint

# Git
git status           # 查看状态
git add .            # 添加所有更改
git commit -m "..."  # 提交
git push origin main # 推送到 GitHub

# 部署
# 推送到 main 分支，Vercel 自动部署
```

---

## 📌 重要提醒

### ⚠️ 不要做的事

1. ❌ **不要提交 `.env.local` 到 Git**
   - 包含敏感的 API 密钥
   - 已在 `.gitignore` 中忽略

2. ❌ **不要在代码中硬编码 API 密钥**
   - 使用环境变量
   - 生产环境在 Vercel 配置

3. ❌ **不要硬编码 API URL**
   - 使用 `process.env.NEXT_PUBLIC_API_BASE_URL`
   - 本地和生产环境自动适配

4. ❌ **不要直接修改 `node_modules`**
   - 修改会在重新安装时丢失
   - 需要改动请修改源码并提 PR

### ✅ 应该做的事

1. ✅ **修改代码前先拉取最新代码**
   ```bash
   git pull origin main
   ```

2. ✅ **提交前测试功能**
   ```bash
   npm run dev
   # 测试所有修改的功能
   ```

3. ✅ **写清楚的提交信息**
   ```bash
   git commit -m "feat: 添加 AI 海报设计功能"
   ```

4. ✅ **更新文档**
   - 添加新功能后更新本文档
   - 记录重要的修改

---

**最后更新**: 2026-01-24
**维护者**: 开发团队
**文档版本**: 1.0

---

**🎉 现在你可以放心修改代码了！有任何问题请先查阅本文档。**
