"use client"

import React from "react"

import Link from "next/link"
import {
  Package,
  ImageIcon,
  UserCircle,
  Shirt,
  Footprints,
  Palette,
  Wand2,
  Video,
  Languages,
  Edit3,
  Scissors,
  Eraser,
  Sparkles,
  UserSquare,
  Maximize,
  LayoutGrid,
  Expand,
  Camera,
  Hexagon,
  FileText,
  PenTool,
  ImagePlus,
  Cpu,
  Shield,
  Brush,
  Smile,
  Heart,
  Box,
  Type,
  Mountain,
  Award,
  CalendarDays,
} from "lucide-react"

interface ToolItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  href: string
  image?: string // 可选的图片URL，用于显示图片占位符
}

interface ToolCategory {
  title: string
  tools: ToolItem[]
}

const toolCategories: ToolCategory[] = [
  {
    title: "AI设计",
    tools: [
      { icon: Hexagon, label: "AI Logo", description: "智能生成Logo设计", href: "/tools/ai-logo", image: "placeholder" },
      { icon: Shield, label: "AI Logo 2号员工", description: "更具美学的LOGO", href: "/tools/ai-logo-2", image: "placeholder" },
      { icon: Brush, label: "AI插画", description: "多风格的非IP插画", href: "/tools/ai-illustration", image: "/tools/ai-illustration.png" },
      { icon: Smile, label: "AI IP插画 1号员工", description: "用于制作品牌IP插画", href: "/tools/ai-ip-illustration-1", image: "/tools/ai-ip-illustration-1.png" },
      { icon: Box, label: "AI平面包装设计", description: "用于制作平面的包装图", href: "/tools/ai-package-design", image: "placeholder" },
      { icon: Type, label: "AI字体设计", description: "用于制作商标、logo等字体", href: "/tools/ai-font", image: "placeholder" },
      { icon: Mountain, label: "AI场景海报设计", description: "用于制作品牌的场景展示海报", href: "/tools/ai-scene-poster", image: "/tools/ai-scene-poster.png" },
      { icon: Award, label: "AI品牌海报设计", description: "用于制作品牌海报", href: "/tools/ai-brand-poster", image: "placeholder" },
      { icon: CalendarDays, label: "AI活动海报设计", description: "用于制作活动宣传海报", href: "/tools/ai-event-poster", image: "/tools/ai-event-poster.png" },
      { icon: FileText, label: "AI图文笔记", description: "一键生成图文笔记", href: "/tools/ai-note", image: "placeholder" },
      { icon: PenTool, label: "AI文案", description: "智能生成营销文案", href: "/tools/ai-copy", image: "placeholder" },
      { icon: ImagePlus, label: "AI海报", description: "一键生成海报设计", href: "/tools/ai-poster", image: "placeholder" },
      { icon: Cpu, label: "AI文生图", description: "文字描述生成图片", href: "/tools/text-to-image", image: "placeholder" },
    ],
  },
  {
    title: "AI商拍",
    tools: [
      { icon: Package, label: "AI商品套图", description: "一键生成多平台商品图", href: "/tools/product-set", image: "placeholder" },
      { icon: ImageIcon, label: "AI商品图", description: "智能生成商品展示图", href: "/tools/product-image", image: "placeholder" },
      { icon: UserCircle, label: "人像换背景", description: "一键更换人像背景", href: "/tools/portrait-bg", image: "placeholder" },
      { icon: Camera, label: "AI模特", description: "智能生成模特展示图", href: "/tools/ai-model", image: "placeholder" },
      { icon: Footprints, label: "AI试鞋", description: "虚拟试鞋效果展示", href: "/tools/ai-shoes", image: "placeholder" },
      { icon: Shirt, label: "AI试衣", description: "虚拟试衣效果展示", href: "/tools/ai-clothes", image: "placeholder" },
      { icon: Palette, label: "AI服装换色", description: "一键更换服装颜色", href: "/tools/clothes-color", image: "placeholder" },
      { icon: Wand2, label: "服装去皱", description: "智能去除服装褶皱", href: "/tools/clothes-smooth", image: "placeholder" },
      { icon: Video, label: "AI带货视频", description: "一键生成带货短视频", href: "/tools/ai-video", image: "placeholder" },
      { icon: Languages, label: "图片翻译", description: "智能翻译图片文字", href: "/tools/image-translate", image: "placeholder" },
    ],
  },
  {
    title: "图像处理",
    tools: [
      { icon: Edit3, label: "图片编辑", description: "专业图片编辑工具", href: "/tools/image-edit", image: "placeholder" },
      { icon: Scissors, label: "智能抠图", description: "一键去除图片背景", href: "/tools/cutout", image: "placeholder" },
      { icon: Eraser, label: "AI消除", description: "智能消除图片内容", href: "/tools/remove", image: "placeholder" },
      { icon: Sparkles, label: "变清晰", description: "AI提升图片清晰度", href: "/tools/enhance", image: "placeholder" },
      { icon: UserSquare, label: "证件照", description: "一键制作证件照", href: "/tools/id-photo", image: "placeholder" },
      { icon: Maximize, label: "无损改尺寸", description: "无损放大缩小图片", href: "/tools/resize", image: "placeholder" },
      { icon: LayoutGrid, label: "拼图", description: "多图拼接组合", href: "/tools/collage", image: "placeholder" },
      { icon: Expand, label: "AI扩图", description: "智能扩展图片内容", href: "/tools/expand", image: "placeholder" },
      { icon: Camera, label: "形象照", description: "一键生成形象照", href: "/tools/portrait", image: "placeholder" },
    ],
  },
]

function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-start justify-between p-4 bg-card rounded-2xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <div className="flex-1 pr-3">
        <h3 className="font-semibold text-card-foreground mb-1.5 text-lg">{tool.label}</h3>
        <p className="text-xs text-muted-foreground">{tool.description}</p>
      </div>
      {tool.image ? (
        <div className="w-[168px] h-[126px] rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {tool.image === "placeholder" ? (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
          ) : (
            <img src={tool.image} alt={tool.label} className="w-full h-full object-cover" />
          )}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
          <tool.icon className="w-6 h-6" />
        </div>
      )}
    </Link>
  )
}

export function ToolGrid() {
  return (
    <section className="px-8 py-6 space-y-8">
      {toolCategories.map((category) => (
        <div key={category.title}>
          <h2 className="text-lg font-semibold text-foreground mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.tools.map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
