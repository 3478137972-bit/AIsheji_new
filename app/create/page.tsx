"use client"

import React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Send, Sparkles } from "lucide-react"
import Link from "next/link"

const suggestions = [
  "帮我设计一张电商产品主图",
  "生成一个科技公司的Logo",
  "制作一张促销活动海报",
  "设计一套社交媒体配图",
]

export default function CreatePage() {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      console.log("Creating design with prompt:", prompt)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">创建设计</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center mb-2">
            告诉我你想要什么
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            描述你的设计需求，秒懂AI超级员工将为你生成
          </p>

          {/* Input */}
          <form onSubmit={handleSubmit} className="w-full mb-8">
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的设计..."
                className="w-full p-4 pr-14 text-base bg-transparent outline-none resize-none min-h-[120px]"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="absolute right-3 bottom-3 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-3">试试这些：</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:bg-muted transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
