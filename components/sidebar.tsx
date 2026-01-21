"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Sparkles,
  Clock,
  FolderOpen,
  Layers,
  Users,
  Plus,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Sparkles, label: "AI 工具", href: "/ai-tools" },
  { icon: Clock, label: "最近打开", href: "/recent" },
  { icon: FolderOpen, label: "项目空间", href: "/projects" },
  { icon: Layers, label: "套图配方", href: "/batch-recipes" },
  { icon: Users, label: "团队协作", href: "/team", badge: "Pro" },
]

const bottomItems = [
  { icon: HelpCircle, label: "帮助中心", href: "/help" },
  { icon: Settings, label: "设置", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50 border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-sidebar-foreground tracking-tight">秒懂AI</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Super Employee</span>
          </div>
        </Link>
      </div>

      {/* Create Button */}
      <div className="px-4 mb-2">
        <Link
          href="/create"
          className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>创建设计</span>
          <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">菜单</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="my-6 mx-3 border-t border-sidebar-border" />

        <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">支持</p>
        <ul className="space-y-1">
          {bottomItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 backdrop-blur-sm">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground text-sm font-bold">D</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">设计师</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-muted-foreground">免费版</p>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
