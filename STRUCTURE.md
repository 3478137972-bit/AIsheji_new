# 秒懂AI超级员工 - 网站结构

## 首页布局

### 1. 常用工具区域
展示最常用的快捷功能入口，包含：
- 智能抠图
- AI消除
- 变清晰
- 商品套图
- 证件照
- 查看全部（链接到完整工具列表）

### 2. AI工具分类

#### 2.1 AI商拍
专注于电商商品拍摄相关的AI工具

| 工具名称 | 功能简介 | 路由 |
|---------|---------|------|
| AI商品套图 | 一键生成多平台商品图 | `/tools/product-set` |
| AI商品图 | 智能生成商品展示图 | `/tools/product-image` |
| 人像换背景 | 一键更换人像背景 | `/tools/portrait-bg` |
| AI模特 | 智能生成模特展示图 | `/tools/ai-model` |
| AI试鞋 | 虚拟试鞋效果展示 | `/tools/try-shoes` |
| AI试衣 | 虚拟试衣效果展示 | `/tools/try-clothes` |
| AI服装换色 | 一键更换服装颜色 | `/tools/clothes-color` |
| 服装去皱 | 智能去除服装褶皱 | `/tools/clothes-unwrinkle` |
| AI带货视频 | 一键生成带货短视频 | `/tools/video-commerce` |
| 图片翻译 | 智能翻译图片文字 | `/tools/image-translate` |

#### 2.2 图像处理
通用图片编辑和优化工具

| 工具名称 | 功能简介 | 路由 |
|---------|---------|------|
| 图片编辑 | 专业图片编辑工具 | `/tools/image-edit` |
| 智能抠图 | 一键去除图片背景 | `/tools/smart-cutout` |
| AI消除 | 智能消除图片内容 | `/tools/remove` |
| 变清晰 | AI提升图片清晰度 | `/tools/enhance` |
| 证件照 | 一键制作证件照 | `/tools/id-photo` |
| 无损改尺寸 | 无损放大缩小图片 | `/tools/resize` |
| 拼图 | 多图拼接组合 | `/tools/collage` |
| AI扩图 | 智能扩展图片内容 | `/tools/expand` |
| 形象照 | 一键生成形象照 | `/tools/portrait` |

#### 2.3 AI设计
创意设计和内容生成工具

| 工具名称 | 功能简介 | 路由 |
|---------|---------|------|
| AI Logo | 智能生成Logo设计 | `/tools/ai-logo` |
| AI图文笔记 | 一键生成图文笔记 | `/tools/ai-note` |
| AI文案 | 智能生成营销文案 | `/tools/ai-copywriting` |
| AI海报 | 一键生成海报设计 | `/tools/ai-poster` |
| AI文生图 | 文字描述生成图片 | `/tools/text-to-image` |

### 3. 最近打开
- 显示用户最近使用的工具
- 支持本地存储记录
- 方便快速访问常用功能
- 路由：`/recent`

## 技术实现

### 组件结构
```
app/
├── page.tsx                 # 首页
├── recent/                  # 最近打开
│   └── page.tsx
├── ai-tools/               # AI工具总览
│   └── page.tsx
└── tools/                  # 具体工具页面
    ├── product-set/        # AI商品套图
    ├── remove/             # AI消除
    ├── id-photo/           # 证件照
    ├── ai-logo/           # AI Logo
    └── ...                 # 其他工具
```

### 数据模型

#### 工具分类
```typescript
type ToolCategory = 'ai-commerce' | 'image-processing' | 'ai-design'

interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  route: string
  icon?: string
  isPopular?: boolean  // 是否显示在常用工具
}
```

#### 最近打开记录
```typescript
interface RecentItem {
  toolId: string
  timestamp: number
  route: string
}
```

## 本地存储方案
使用 `localStorage` 保存用户的使用记录：
- `recent_tools`: 最近使用的工具列表
- `user_preferences`: 用户偏好设置
