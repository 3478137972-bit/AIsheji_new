# 工具卡片图片配置指南

本文档说明如何为工具卡片添加或更换展示图片。

## 概述

工具卡片支持两种显示模式：
1. **图标模式**：显示小图标（48x48px）
2. **图片模式**：显示大图片（168x126px）

## 图片要求

### 尺寸规格
- **宽度**：168px
- **高度**：126px
- **宽高比**：4:3
- **格式**：PNG、JPG、WEBP

### 设计建议
- 使用清晰、高质量的图片
- 确保图片内容在小尺寸下仍然清晰可辨
- 建议使用功能演示截图或相关视觉元素
- 避免过多文字，保持视觉简洁

## 配置步骤

### 1. 准备图片文件

将准备好的图片文件复制到项目的 `public/tools/` 目录：

```bash
# 创建目录（如果不存在）
mkdir -p public/tools

# 复制图片文件
cp /path/to/your/image.png public/tools/tool-name.png
```

**命名规范**：
- 使用小写字母和连字符
- 与工具的 href 路径保持一致
- 例如：`ai-illustration.png`、`ai-logo.png`

### 2. 更新配置文件

打开 `components/dashboard/tool-grid.tsx` 文件，找到对应的工具配置。

**修改前**：
```typescript
{
  icon: Brush,
  label: "AI插画",
  description: "多风格的非IP插画",
  href: "/tools/ai-illustration",
  image: "placeholder"
}
```

**修改后**：
```typescript
{
  icon: Brush,
  label: "AI插画",
  description: "多风格的非IP插画",
  href: "/tools/ai-illustration",
  image: "/tools/ai-illustration.png"
}
```

### 3. 验证效果

启动开发服务器查看效果：

```bash
npm run dev
```

访问 `http://localhost:3000` 查看工具卡片是否正确显示图片。

## 技术实现

### 渲染逻辑

工具卡片组件会根据 `image` 属性的值决定显示方式：

```typescript
{tool.image ? (
  <div className="w-[168px] h-[126px] rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
    {tool.image === "placeholder" ? (
      // 显示占位符渐变背景
      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
    ) : (
      // 显示实际图片
      <img src={tool.image} alt={tool.label} className="w-full h-full object-cover" />
    )}
  </div>
) : (
  // 显示图标模式
  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
    <tool.icon className="w-6 h-6" />
  </div>
)}
```

### 图片属性说明

- `image: undefined` - 使用图标模式（48x48px）
- `image: "placeholder"` - 显示占位符渐变背景（168x126px）
- `image: "/tools/xxx.png"` - 显示实际图片（168x126px）

## 批量配置示例

如果需要为多个工具配置图片：

1. 准备所有图片文件，统一放在 `public/tools/` 目录
2. 批量更新配置：

```typescript
const toolCategories: ToolCategory[] = [
  {
    title: "AI设计",
    tools: [
      { icon: Hexagon, label: "AI Logo", description: "智能生成Logo设计", href: "/tools/ai-logo", image: "/tools/ai-logo.png" },
      { icon: Brush, label: "AI插画", description: "多风格的非IP插画", href: "/tools/ai-illustration", image: "/tools/ai-illustration.png" },
      { icon: FileText, label: "AI图文笔记", description: "一键生成图文笔记", href: "/tools/ai-note", image: "/tools/ai-note.png" },
      // ... 更多工具
    ],
  },
]
```

## 注意事项

1. **图片路径**：必须以 `/` 开头，表示从 public 目录开始的绝对路径
2. **文件大小**：建议单个图片文件不超过 200KB，以优化加载速度
3. **图片优化**：可以使用工具压缩图片，如 TinyPNG、ImageOptim 等
4. **Git 提交**：记得将新增的图片文件添加到 Git 版本控制
5. **缓存问题**：如果更新图片后未生效，尝试清除浏览器缓存或使用硬刷新（Ctrl+F5）

## 示例：AI插画图片配置

以下是完整的配置示例：

### 步骤 1：复制图片
```bash
cp "c:/Users/0000/Desktop/小程序成果演示文件夹/封面/AI插画-01.png" public/tools/ai-illustration.png
```

### 步骤 2：更新配置
在 `components/dashboard/tool-grid.tsx` 第 60 行：
```typescript
{ icon: Brush, label: "AI插画", description: "多风格的非IP插画", href: "/tools/ai-illustration", image: "/tools/ai-illustration.png" },
```

### 步骤 3：提交更改
```bash
git add components/dashboard/tool-grid.tsx public/tools/
git commit -m "配置AI插画功能图片展示"
git push
```

## 故障排查

### 图片不显示
- 检查图片路径是否正确
- 确认图片文件存在于 `public/tools/` 目录
- 检查浏览器控制台是否有 404 错误

### 图片变形
- 确认图片原始尺寸接近 4:3 宽高比
- 检查 CSS 类 `object-cover` 是否正确应用

### 图片加载慢
- 压缩图片文件大小
- 考虑使用 WebP 格式
- 使用图片优化工具

## 相关文件

- 配置文件：`components/dashboard/tool-grid.tsx`
- 图片目录：`public/tools/`
- 类型定义：`ToolItem` 接口（第 41-47 行）

## 更新历史

- 2026-01-29：初始版本，添加AI插画图片配置示例
