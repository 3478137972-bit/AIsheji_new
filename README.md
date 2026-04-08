# 秒懂 AI 超级员工 - UI 复刻项目

基于 React 18 + TypeScript + TailwindCSS 构建的移动端 AI 创作应用 UI。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **样式**: TailwindCSS 3
- **图标**: Lucide React
- **设计**: 移动端优先，响应式设计

## 📁 项目结构

```
miaodong-ai-employee/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局（含底部导航）
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # 全局样式
│   │   ├── inspiration/        # 热点灵感页
│   │   ├── smart-square/       # 智能广场页
│   │   ├── profile/            # 我的页面
│   │   ├── quick-video/        # 一键成片页
│   │   ├── create/             # 自由创作页
│   │   ├── benefits/           # 权益详情页
│   │   └── recharge/           # 算力充值页
│   └── components/             # 可复用组件
│       └── BottomNav.tsx       # 底部导航栏
├── public/                     # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.mjs
```

## 📱 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 自由创作、一键成片、快捷功能网格、模板推荐 |
| 热点灵感 | `/inspiration` | 多平台切换 Tab、热点列表 |
| 智能广场 | `/smart-square` | 分类 Tab、工具卡片网格 |
| 我的 | `/profile` | 个人信息、权益管理、设置项 |
| 一键成片 | `/quick-video` | 视频生成页面 |
| 自由创作 | `/create` | 多类型创作页面 |
| 权益详情 | `/benefits` | 会员套餐、VIP 权益 |
| 算力充值 | `/recharge` | 充值套餐、支付方式 |

## 🎨 设计特点

- **配色**: 蓝色系科技感（tech-blue #0066FF, tech-cyan #00D4FF）
- **圆角**: 大圆角卡片（rounded-2xl, rounded-xl）
- **阴影**: 柔和阴影 + 发光效果（shadow-card, shadow-glow）
- **导航**: 固定底部导航栏
- **响应式**: 移动端优先，适配各种屏幕尺寸

## 🛠️ 快速开始

```bash
# 安装依赖
cd miaodong-ai-employee
pnpm install  # 或 npm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 📦 依赖说明

- `react` & `react-dom`: React 18
- `next`: Next.js 14 框架
- `lucide-react`: 现代图标库
- `tailwindcss`: 原子化 CSS 框架
- `typescript`: 类型支持

## 🎯 组件复用

项目采用组件化开发，主要可复用组件：

- `BottomNav`: 底部导航栏（4 个 Tab）
- 卡片组件：统一使用 `card-hover` 类实现悬停效果
- 按钮组件：渐变背景 + 阴影效果

## 📝 注意事项

1. 图片资源需放入 `public/` 目录
2. 图标统一使用 Lucide React
3. 样式优先使用 Tailwind 工具类
4. 组件需添加 `'use client'` 指令以使用 hooks

## 📄 License

MIT
