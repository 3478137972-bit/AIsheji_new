# TIANyu Frontend

Next.js 14 项目，采用 App Router、Tailwind CSS 和 Shadcn/ui 组件库。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + CSS Modules
- **组件**: Shadcn/ui 基础组件
- **部署**: Vercel

## 主题色

- **琥珀橙** (Primary): #ea580c
- **奶油米** (Cream): #57534e (米色基调)
- **冷灰** (Cool Gray): #1f2937 (辅助灰度)

## 快速开始

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start
```

## 项目结构

```
tianyu-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── tab.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── layout/
│   │       ├── layout.tsx
│   │       ├── components.tsx
│   │       └── index.ts
│   └── lib/
│       └── utils.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 组件使用

```tsx
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { Badge } from '@/components/badge'

// 示例
<Button variant="default" size="default">Click me</Button>
<Input placeholder="Enter text" />
<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>
<Badge variant="default">New</Badge>
```

## 部署

该项目已配置好 Vercel 部署。推送代码到连接的仓库即可自动部署。

## License

MIT