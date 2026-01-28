# 秒懂AI超级员工【设计系统】- 完整文件结构

## 📁 核心目录结构

### 1. 设计智能体核心 (design-agent/)
**最重要的核心模块**

```
design-agent/
├── design-agent.ts              # 主控制器，整合所有模块
├── deepseek-client.ts           # DeepSeek API 客户端
├── skills-guide-manager.ts      # Skills 知识库管理器
├── quality-checker.ts           # 提示词质量检查器
├── image-analyzer.ts            # 图像分析器（眼睛）
├── design-decision-maker.ts     # 设计决策器（大脑）
├── design-skills.json           # 设计知识库（核心数据）
├── product-info.json            # 产品信息配置
└── types.ts                     # TypeScript 类型定义
```

### 2. API 路由 (app/api/)
**后端接口**

```
app/api/
├── design-agent/
│   └── chat/route.ts           # 设计智能体聊天接口（核心）
├── generate-logo/route.ts      # Logo 生成接口
├── generate-illustration/route.ts  # 插画生成接口
├── generate-aiip-illustration/route.ts  # IP 插画生成接口
├── generate-event-poster/route.ts  # 海报生成接口
├── generate-package-design/route.ts  # 包装设计生成接口
└── history/                    # 历史记录接口
    ├── list/route.ts
    ├── record/route.ts
    └── clear/route.ts
```

### 3. 前端页面 (app/)
**用户界面**

```
app/
├── design-agent/page.tsx       # 设计智能体页面（核心）
├── tools/                      # 各种设计工具页面
│   ├── ai-logo/page.tsx
│   ├── ai-illustration/page.tsx
│   ├── ai-event-poster/page.tsx
│   └── ai-package-design/page.tsx
├── history/page.tsx            # 历史记录页面
├── page.tsx                    # 首页
└── layout.tsx                  # 全局布局
```

### 4. UI 组件 (components/)
**可复用组件**

```
components/
├── ui/                         # shadcn/ui 组件库
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ... (50+ 组件)
├── sidebar.tsx                 # 侧边栏
├── top-bar.tsx                 # 顶部栏
├── user-menu.tsx               # 用户菜单
└── main-layout.tsx             # 主布局
```

### 5. 文档 (docs/)
**开发文档**

```
docs/
├── DESIGN_AGENT_INTERACTIVE_QA.md  # 交互式问答功能文档
├── PROJECT_STRUCTURE.md            # 项目结构说明
├── DEVELOPMENT_LESSONS_LEARNED.md  # 开发经验总结
└── vercel-serverless-best-practices.md  # Vercel 部署最佳实践
```

## 📄 核心文件说明

### 设计智能体核心文件

#### 1. design-agent/design-agent.ts
- **作用**：设计智能体主控制器
- **功能**：
  - 整合所有模块（DeepSeek、Skills、质量检查等）
  - 提供 `generateInteractive()` 方法（交互式生成）
  - 提供 `generate()` 方法（直接生成）
  - 提供 `generateFromImage()` 方法（图片生成）

#### 2. design-agent/deepseek-client.ts
- **作用**：DeepSeek API 客户端
- **功能**：
  - 意图识别（analyzeIntentWithContext）
  - 需求分析（analyzeRequirementsWithContext）
  - 提示词生成（generatePromptWithContext）
  - 通用聊天（chat）

#### 3. design-agent/skills-guide-manager.ts
- **作用**：Skills 知识库管理器
- **功能**：
  - 加载和管理设计知识库
  - 根据类别和用户输入智能选择模板
  - 提供设计指南和规则

#### 4. design-agent/design-skills.json
- **作用**：设计知识库（核心数据）
- **内容**：
  - 5 大设计类别（Logo、插画、海报、包装、IP 形象）
  - 每个类别的模板、规则、关键词
  - 通用设计原则和质量标准

#### 5. app/api/design-agent/chat/route.ts
- **作用**：设计智能体 API 接口
- **功能**：
  - 接收用户消息
  - 快速意图识别（设计 vs 聊天）
  - 调用设计智能体生成提示词
  - 处理问答流程
  - 错误处理和兜底逻辑

#### 6. app/design-agent/page.tsx
- **作用**：设计智能体前端页面
- **功能**：
  - 聊天界面
  - 问答界面（多选题）
  - 结果展示
  - 历史记录

## 🔧 配置文件

```
.env.local                      # 环境变量（API 密钥等）
next.config.mjs                 # Next.js 配置
tsconfig.json                   # TypeScript 配置
package.json                    # 项目依赖
components.json                 # shadcn/ui 配置
```

## 📚 重要文档

```
README.md                       # 项目说明
CHANGELOG.md                    # 更新日志
DEVELOPMENT_GUIDE.md            # 开发指南
TROUBLESHOOTING.md              # 故障排除
VERCEL_DEPLOYMENT_GUIDE.md      # Vercel 部署指南
```

## 🎯 核心流程文件关系

```
用户消息
  ↓
app/design-agent/page.tsx (前端)
  ↓
app/api/design-agent/chat/route.ts (API)
  ↓
design-agent/design-agent.ts (主控制器)
  ↓
design-agent/deepseek-client.ts (AI 调用)
  ↓
design-agent/skills-guide-manager.ts (知识库)
  ↓
design-agent/design-skills.json (数据)
```

## 📊 文件统计

- **总文件数**：约 150+ 个文件
- **核心文件**：约 20 个
- **UI 组件**：约 50+ 个
- **API 路由**：约 15 个
- **文档文件**：约 10 个

## 🔑 关键修改记录

### 最近的重要修改（本次会话）

1. **修复问答回调函数错误处理** (commit: 1d0da90)
   - 文件：app/api/design-agent/chat/route.ts
   - 修复：onQuestion 回调抛出标准 Error 对象

2. **增强错误处理的健壮性** (commit: e50e36b)
   - 文件：design-agent/design-agent.ts
   - 修复：添加防御性错误处理

3. **修复问答流程** (commit: 9d1d3ee)
   - 文件：design-agent/design-agent.ts
   - 修复：正确处理 NEED_ANSWERS 错误

4. **优化需求分析逻辑** (commit: 91fce90, f6f280d)
   - 文件：design-agent/deepseek-client.ts
   - 优化：智能判断何时需要询问

5. **增强系统健壮性** (commit: 9206c9e)
   - 文件：app/api/design-agent/chat/route.ts
   - 优化：添加兜底聊天模式

## 📝 备注

- 所有核心逻辑都在 `design-agent/` 目录
- 所有 API 接口都在 `app/api/` 目录
- 所有前端页面都在 `app/` 目录
- 所有 UI 组件都在 `components/` 目录
- 所有文档都在 `docs/` 目录和根目录

生成时间：2026-01-28
