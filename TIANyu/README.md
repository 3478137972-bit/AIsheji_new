# TIANyu - AI 获客系统 WEB UI

> 小程序 UI → WEB UI 转换项目  
> 设计风格：琥珀橙 + 奶油米 + 冷灰

## 🎨 设计系统

### 色彩系统
- **主色**: 琥珀橙 `#E67E22`
- **辅助色**: 奶油米 `#FAF3E0`
- **中性色**: 冷灰 `#F0F0F0`

### 技术栈
- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: Vercel

## 📁 项目结构

```
TIANyu/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── Button.tsx     # 按钮组件
│   │   ├── Input.tsx      # 输入框组件
│   │   ├── TextArea.tsx   # 多行输入框
│   │   ├── Card.tsx       # 卡片组件
│   │   ├── Badge.tsx      # 标签组件
│   │   ├── Tabs.tsx       # Tab 切换
│   │   └── Layout.tsx     # 布局组件
│   ├── pages/             # 页面
│   │   ├── ai-plaza.tsx       # AI 智能体广场
│   │   └── ai-live-script.tsx # AI 直播脚本
│   └── styles/            # 全局样式
│       └── globals.css
├── docs/                  # 项目文档
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🚀 快速开始

### 安装依赖
```bash
cd TIANyu
pnpm install
# 或
npm install
```

### 开发模式
```bash
pnpm dev
# 访问 http://localhost:3000
```

### 构建生产版本
```bash
pnpm build
pnpm start
```

## 📋 已完成功能

### 核心组件
- ✅ Button - 按钮（主按钮/次按钮/奶油按钮）
- ✅ Input - 单行输入框
- ✅ TextArea - 多行输入框
- ✅ Card - 卡片（普通卡片/AI 工具卡片）
- ✅ Badge - 标签（8 种颜色）
- ✅ Tabs - Tab 切换（3 种样式）
- ✅ Layout - 布局（Header/TabBar）

### 页面
- ✅ AI 智能体广场页
- ✅ AI 直播脚本表单页

## 🎯 下一步计划

1. 完成首页设计
2. 完成热点灵感页
3. 完成个人中心页
4. 实现所有 18 个功能表单
5. 添加 API 调用
6. 部署到 Vercel

## 📖 文档

- [01-快速入门指南](./docs/01-快速入门指南.md) - 新手入门必读
- [02-需求分析](./docs/02-需求分析.md) - 项目需求与功能清单
- [03-设计规范系统](./docs/03-设计规范系统.md) - 设计系统规范
- [04-UI 设计指南](./docs/04-UI 设计指南.md) - UI 设计指南
- [05-组件使用文档](./docs/05-组件使用文档.md) - 组件使用手册
- [06-页面开发文档](./docs/06-页面开发文档.md) - 页面开发指南
- [07-响应式适配指南](./docs/07-响应式适配指南.md) - 响应式设计
- [08-API 集成指南](./docs/08-API 集成指南.md) - API 集成
- [09-测试指南](./docs/09-测试指南.md) - 测试指南
- [10-开发流程说明](./docs/10-开发流程说明.md) - 开发流程

## 📱 响应式支持

- Mobile: <768px (2 列网格)
- Tablet: 768-1024px (3 列网格)
- Desktop: >1024px (4 列网格)

## 🎨 设计原则

1. **温暖活力**: 琥珀橙主色调传递热情与行动力
2. **高级轻奢**: 奶油米背景营造品质感
3. **现代简洁**: 冷灰中性色保持专业平衡
4. **响应式优先**: Mobile First 设计策略

---

**版本**: v1.0  
**最后更新**: 2026-04-11  
**维护者**: TIANyu 团队
