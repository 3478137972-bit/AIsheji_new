"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles, Zap, Wand2, Camera, Palette } from "lucide-react"

const floatingIcons = [
  { icon: Sparkles, delay: "0s", x: "10%", y: "20%", size: "w-6 h-6" },
  { icon: Zap, delay: "0.5s", x: "85%", y: "15%", size: "w-5 h-5" },
  { icon: Wand2, delay: "1s", x: "75%", y: "70%", size: "w-7 h-7" },
  { icon: Camera, delay: "1.5s", x: "15%", y: "65%", size: "w-5 h-5" },
  { icon: Palette, delay: "2s", x: "50%", y: "10%", size: "w-6 h-6" },
]

export function HeroSection() {
  const [prompt, setPrompt] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // 跳转到设计智能体页面，并传递提示词
      router.push(`/design-agent?prompt=${encodeURIComponent(prompt)}`)
    }
  }

  return (
    <section className="relative px-8 pt-12 pb-8 overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="absolute text-primary/30 animate-pulse"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: item.delay,
            animationDuration: "3s",
          }}
        >
          <item.icon className={item.size} />
        </div>
      ))}

      {/* Hero Content */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI 驱动的设计工具平台</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight text-balance">
          让 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">AI</span> 成为你的
          <br />
          超级设计员工
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          输入一句话，秒懂AI帮你完成商品图、证件照、Logo等设计工作，释放你的创造力
        </p>
      </div>

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-cyan-500/50 to-primary/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
          
          <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-2xl shadow-black/20">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要的设计，例如：帮我设计一个科技公司的Logo..."
              className="w-full py-5 pl-6 pr-36 text-base bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              <span>开始创作</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["证件照换背景", "Logo设计"].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 text-sm text-muted-foreground bg-card/50 border border-border/50 rounded-lg hover:border-primary/50 hover:text-primary transition-all duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </section>
  )
}
