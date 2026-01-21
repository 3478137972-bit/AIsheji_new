"use client"

import Link from "next/link"
import {
  Scissors,
  Eraser,
  Sparkles,
  Package,
  UserSquare,
  Presentation,
} from "lucide-react"

const quickTools = [
  { icon: Scissors, label: "智能抠图", href: "/tools/cutout", gradient: "from-blue-500 to-cyan-500" },
  { icon: Eraser, label: "AI消除", href: "/tools/remove", gradient: "from-purple-500 to-pink-500" },
  { icon: Sparkles, label: "变清晰", href: "/tools/enhance", gradient: "from-emerald-500 to-teal-500" },
  { icon: Package, label: "商品套图", href: "/tools/product-set", gradient: "from-orange-500 to-amber-500" },
  { icon: UserSquare, label: "证件照", href: "/tools/id-photo", gradient: "from-rose-500 to-pink-500" },
  { icon: Presentation, label: "LivePPT", href: "/tools/live-ppt", gradient: "from-indigo-500 to-purple-500" },
]

export function QuickTools() {
  return (
    <section className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">常用工具</h2>
        <Link href="/ai-tools" className="text-sm text-primary hover:text-primary/80 transition-colors">
          查看全部
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative flex flex-col items-center gap-3 p-5 bg-card rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            {/* Hover Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
            
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} p-[1px] shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                <tool.icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${tool.gradient} group-hover:text-white transition-colors duration-300`} style={{ color: 'inherit' }} />
              </div>
            </div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">{tool.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
