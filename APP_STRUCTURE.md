# App 目录结构文档

> 本文档详细记录了 `app/` 目录的完整结构，方便快速查找和理解项目架构。

## 📁 目录树结构

```
app/
├── ai-tools/                    # AI工具总览页面
├── api/                         # API路由（后端接口）
│   ├── design-agent/           # 设计智能体API
│   │   └── chat/               # 聊天接口
│   ├── generate-aiip-illustration/      # IP插画生成API
│   ├── generate-aiip-illustration-2/    # IP插画生成API（2号员工）
│   ├── generate-event-poster/           # 活动海报生成API
│   ├── generate-illustration/           # 插画生成API
│   ├── generate-logo/                   # Logo生成API
│   ├── generate-package-design/         # 包装设计生成API
│   ├── history/                         # 历史记录API
│   │   ├── clear/              # 清除历史
│   │   ├── list/               # 获取历史列表
│   │   └── record/             # 记录历史
│   └── task-status/            # 任务状态查询API
│       └── [batchId]/          # 动态路由：批次ID
├── auth/                        # 认证相关
│   └── callback/               # 认证回调页面
├── batch-recipes/              # 批量配方页面
├── create/                     # 创建页面
├── design-agent/               # 设计智能体主页面
├── history/                    # 历史记录页面
├── projects/                   # 项目页面
├── recent/                     # 最近打开页面
├── team/                       # 团队页面
├── tools/                      # 具体工具页面
│   ├── ai-event-poster/        # AI活动海报设计
│   ├── ai-font/                # AI字体设计
│   ├── ai-illustration/        # AI插画
│   ├── ai-ip-illustration-1/   # AI IP插画（1号员工）
│   ├── ai-ip-illustration-2/   # AI IP插画（2号员工）
│   ├── ai-logo/                # AI Logo设计
│   ├── ai-package-design/      # AI平面包装设计
│   ├── ai-scene-poster/        # AI场景海报设计
│   ├── id-photo/               # 证件照
│   ├── product-set/            # AI商品套图
│   └── remove/                 # AI消除
├── globals.css                 # 全局样式
├── layout.tsx                  # 根布局组件
└── page.tsx                    # 首页
```

## 📄 核心文件说明

### 根目录文件

| 文件 | 说明 |
|------|------|
| `page.tsx` | 首页，展示工具分类和快捷入口 |
| `layout.tsx` | 全局布局，包含侧边栏、顶部栏等 |
| `globals.css` | 全局CSS样式 |

### 页面路由 (Pages)

| 路由 | 文件路径 | 功能说明 |
|------|---------|---------|
| `/` | `app/page.tsx` | 首页，展示所有工具分类 |
| `/ai-tools` | `app/ai-tools/page.tsx` | AI工具总览页面 |
| `/design-agent` | `app/design-agent/page.tsx` | 设计智能体交互页面（核心功能） |
| `/history` | `app/history/page.tsx` | 历史记录查看页面 |
| `/recent` | `app/recent/page.tsx` | 最近打开的工具 |
| `/projects` | `app/projects/page.tsx` | 项目管理页面 |
| `/team` | `app/team/page.tsx` | 团队协作页面 |
| `/create` | `app/create/page.tsx` | 创建新项目页面 |
| `/batch-recipes` | `app/batch-recipes/page.tsx` | 批量配方页面 |
| `/auth/callback` | `app/auth/callback/page.tsx` | 认证回调处理 |

### 工具页面路由 (Tools)

| 路由 | 文件路径 | 功能说明 | 分类 |
|------|---------|---------|------|
| `/tools/ai-logo` | `app/tools/ai-logo/page.tsx` | AI Logo设计工具 | AI设计 |
| `/tools/ai-illustration` | `app/tools/ai-illustration/page.tsx` | AI插画生成 | AI设计 |
| `/tools/ai-ip-illustration-1` | `app/tools/ai-ip-illustration-1/page.tsx` | AI IP插画（1号员工） | AI设计 |
| `/tools/ai-ip-illustration-2` | `app/tools/ai-ip-illustration-2/page.tsx` | AI IP插画（2号员工） | AI设计 |
| `/tools/ai-package-design` | `app/tools/ai-package-design/page.tsx` | AI平面包装设计 | AI设计 |
| `/tools/ai-font` | `app/tools/ai-font/page.tsx` | AI字体设计 | AI设计 |
| `/tools/ai-scene-poster` | `app/tools/ai-scene-poster/page.tsx` | AI场景海报设计 | AI设计 |
| `/tools/ai-event-poster` | `app/tools/ai-event-poster/page.tsx` | AI活动海报设计 | AI设计 |
| `/tools/product-set` | `app/tools/product-set/page.tsx` | AI商品套图 | AI商拍 |
| `/tools/id-photo` | `app/tools/id-photo/page.tsx` | 证件照制作 | 图像处理 |
| `/tools/remove` | `app/tools/remove/page.tsx` | AI消除工具 | 图像处理 |

### API 路由 (Backend)

| API路由 | 文件路径 | 功能说明 |
|---------|---------|---------|
| `POST /api/design-agent/chat` | `app/api/design-agent/chat/route.ts` | 设计智能体聊天接口（核心） |
| `POST /api/generate-logo` | `app/api/generate-logo/route.ts` | Logo生成接口 |
| `POST /api/generate-illustration` | `app/api/generate-illustration/route.ts` | 插画生成接口 |
| `POST /api/generate-aiip-illustration` | `app/api/generate-aiip-illustration/route.ts` | IP插画生成接口（1号） |
| `POST /api/generate-aiip-illustration-2` | `app/api/generate-aiip-illustration-2/route.ts` | IP插画生成接口（2号） |
| `POST /api/generate-event-poster` | `app/api/generate-event-poster/route.ts` | 活动海报生成接口 |
| `POST /api/generate-package-design` | `app/api/generate-package-design/route.ts` | 包装设计生成接口 |
| `GET /api/history/list` | `app/api/history/list/route.ts` | 获取历史记录列表 |
| `POST /api/history/record` | `app/api/history/record/route.ts` | 保存历史记录 |
| `DELETE /api/history/clear` | `app/api/history/clear/route.ts` | 清除历史记录 |
| `GET /api/task-status/[batchId]` | `app/api/task-status/[batchId]/route.ts` | 查询任务状态 |

## 🎯 核心功能模块

### 1. 设计智能体 (Design Agent)
**最重要的核心功能**

- **前端页面**: `app/design-agent/page.tsx`
- **API接口**: `app/api/design-agent/chat/route.ts`
- **功能**:
  - 智能对话式设计助手
  - 自动识别设计意图
  - 交互式问答收集需求
  - 生成专业设计提示词

### 2. AI设计工具
**各类设计生成工具**

- Logo设计: `app/tools/ai-logo/`
- 插画生成: `app/tools/ai-illustration/`
- IP插画: `app/tools/ai-ip-illustration-1/`, `app/tools/ai-ip-illustration-2/`
- 包装设计: `app/tools/ai-package-design/`
- 字体设计: `app/tools/ai-font/`
- 海报设计: `app/tools/ai-scene-poster/`, `app/tools/ai-event-poster/`

### 3. 历史记录系统
**用户操作历史管理**

- **页面**: `app/history/page.tsx`
- **API**:
  - 列表: `app/api/history/list/route.ts`
  - 记录: `app/api/history/record/route.ts`
  - 清除: `app/api/history/clear/route.ts`

## 📊 目录统计

- **总页面数**: 20+ 个页面
- **API接口数**: 11 个接口
- **工具页面数**: 11 个工具
- **核心模块**: 设计智能体、历史记录、工具集

## 🔄 路由规则

### Next.js App Router 规则

1. **页面路由**: 每个 `page.tsx` 文件对应一个路由
2. **API路由**: `app/api/` 下的 `route.ts` 文件对应API端点
3. **动态路由**: 使用 `[参数名]` 语法，如 `[batchId]`
4. **布局**: `layout.tsx` 为子路由提供共享布局

### 路由示例

```typescript
// 页面路由
app/design-agent/page.tsx → /design-agent

// API路由
app/api/generate-logo/route.ts → POST /api/generate-logo

// 动态路由
app/api/task-status/[batchId]/route.ts → GET /api/task-status/123
```

## 🚀 快速查找指南

### 需要修改首页？
→ 编辑 `app/page.tsx`

### 需要添加新工具？
→ 在 `app/tools/` 下创建新目录和 `page.tsx`

### 需要添加新API？
→ 在 `app/api/` 下创建新目录和 `route.ts`

### 需要修改全局布局？
→ 编辑 `app/layout.tsx`

### 需要修改设计智能体？
→ 编辑 `app/design-agent/page.tsx` 和 `app/api/design-agent/chat/route.ts`

## 📝 命名规范

- **页面文件**: 统一使用 `page.tsx`
- **API文件**: 统一使用 `route.ts`
- **布局文件**: 统一使用 `layout.tsx`
- **加载文件**: 统一使用 `loading.tsx`
- **目录命名**: 使用小写字母和连字符，如 `ai-logo`

## 🔗 相关文档

- [项目完整文件结构](./PROJECT_FILES_STRUCTURE.md)
- [网站结构说明](./STRUCTURE.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)

---

**文档生成时间**: 2026-01-29
**维护者**: Claude Code
**更新频率**: 每次重大结构变更后更新
