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
      { icon: Hexagon, label: "AI Logo", description: "智能生成Logo设计", href: "/tools/ai-logo", image: "/tools/ai-logo.png" },
      { icon: Brush, label: "AI插画", description: "多风格的非IP插画", href: "/tools/ai-illustration", image: "/tools/ai-illustration.png" },
      { icon: Smile, label: "AI IP插画 1号员工", description: "用于制作品牌IP插画", href: "/tools/ai-ip-illustration-1", image: "/tools/ai-ip-illustration-1.png" },
      { icon: Heart, label: "AI IP插画 2号员工", description: "更具创意的IP插画", href: "/tools/ai-ip-illustration-2", image: "/tools/ai-ip-illustration-2.png" },
      { icon: Box, label: "AI平面包装设计", description: "用于制作平面的包装图", href: "/tools/ai-package-design", image: "/tools/ai-package-design.png" },
      { icon: Type, label: "AI字体设计", description: "用于制作商标、logo等字体", href: "/tools/ai-font", image: "/tools/ai-font.png" },
      { icon: Mountain, label: "AI场景海报设计", description: "用于制作品牌的场景展示海报", href: "/tools/ai-scene-poster", image: "/tools/ai-scene-poster.png" },
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
