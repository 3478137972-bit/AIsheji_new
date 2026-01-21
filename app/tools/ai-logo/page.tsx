"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles, Download, ChevronDown } from "lucide-react"
import Link from "next/link"

const industries = [
  "科技互联网",
  "电子商务",
  "餐饮美食",
  "教育培训",
  "医疗健康",
  "金融服务",
  "房产建筑",
  "文化娱乐",
]

const styles = [
  "简约现代",
  "文字Logo",
  "图形Logo",
  "徽章风格",
  "手绘风格",
  "渐变风格",
]

// Mock generated logos
const mockLogos = [
  { id: 1, color: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { id: 2, color: "bg-gradient-to-br from-purple-500 to-purple-600" },
  { id: 3, color: "bg-gradient-to-br from-green-500 to-green-600" },
  { id: 4, color: "bg-gradient-to-br from-orange-500 to-orange-600" },
  { id: 5, color: "bg-gradient-to-br from-pink-500 to-pink-600" },
  { id: 6, color: "bg-gradient-to-br from-cyan-500 to-cyan-600" },
  { id: 7, color: "bg-gradient-to-br from-red-500 to-red-600" },
  { id: 8, color: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
]

export default function AILogoPage() {
  const [logoName, setLogoName] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [slogan, setSlogan] = useState("")
  const [generatedLogos, setGeneratedLogos] = useState<typeof mockLogos>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null)

  const handleGenerate = () => {
    if (!logoName.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedLogos(mockLogos)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold">AI Logo</h1>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Form */}
          <div className="w-80 flex-shrink-0 bg-card rounded-2xl border border-border p-6 flex flex-col">
            <div className="space-y-5 flex-1">
              {/* Logo Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Logo名称 *</label>
                <input
                  type="text"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  placeholder="输入品牌或公司名称"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">行业类型</label>
                <div className="relative">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full p-3 bg-muted rounded-xl border-none outline-none appearance-none cursor-pointer"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-2">Logo风格</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedStyle === style
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-sm font-medium mb-2">Slogan（选填）</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="输入品牌口号"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!logoName.trim() || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "生成中..." : "生成Logo"}
            </button>
          </div>

          {/* Right Panel - Generated Logos Grid */}
          <div className="flex-1 bg-card rounded-2xl border border-border p-6 overflow-y-auto">
            {generatedLogos.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {generatedLogos.map((logo) => (
                  <div
                    key={logo.id}
                    onClick={() => setSelectedLogo(logo.id)}
                    className={`aspect-square rounded-2xl ${logo.color} cursor-pointer transition-all hover:scale-105 relative overflow-hidden group ${
                      selectedLogo === logo.id ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    {/* Mock logo content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-white/20 flex items-center justify-center">
                          <span className="text-2xl font-bold">{logoName.charAt(0) || "M"}</span>
                        </div>
                        <span className="text-sm font-medium">{logoName || "秒懂AI"}</span>
                      </div>
                    </div>
                    {/* Download overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="p-3 bg-card rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>输入Logo名称并点击生成</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
