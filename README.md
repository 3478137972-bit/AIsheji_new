# AI 超级员工 - 秒懂 AI 智能工作平台

一个基于 Next.js 14 和 Supabase Auth 构建的现代 Web 应用程序，提供智能自动化解决方案。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **认证系统**: Supabase Auth
- **语言**: TypeScript
- **样式**: Tailwind CSS

## 功能特性

- ✅ 用户注册/登录（邮箱密码认证）
- ✅ 会话管理（AuthContext）
- ✅ 路由保护（中间件）
- ✅ 受保护的 dashboard 页面
- ✅ 退出登录功能

## 项目结构

```
a-isheji/
├── src/
│   ├── app/                  # Next.js App Router 页面
│   │   ├── dashboard/        # 受保护的 dashboard 页面
│   │   ├── login/            # 登录页面
│   │   ├── register/         # 注册页面
│   │   ├── layout.tsx        # 根布局（包含 AuthProvider）
│   │   └── page.tsx          # 首页
│   ├── contexts/             # React Contexts
│   │   └── AuthContext.tsx   # 认证上下文
│   ├── lib/
│   │   └── supabase.ts       # Supabase 客户端配置
│   ├── types/
│   │   └── auth.ts           # TypeScript 类型定义
│   └── proxy.ts              # 路由保护中间件
├── .env.example              # 环境变量模板
└── package.json
```

## 本地开发

### 1. 安装依赖

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local` 并填入您的 Supabase 配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. 启动开发服务器

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 部署

### Vercel 部署

最简单的部署方式是使用 Vercel Platform：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### 手动部署

您也可以手动部署到任何支持 Next.js 的平台。

## Supabase 配置

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目设置中找到 `Project URL` 和 `anon/public key`
3. 将这些值添加到您的 `.env.local` 文件
4. 在 Supabase Dashboard 中启用邮箱密码认证

## 许可证

MIT License
