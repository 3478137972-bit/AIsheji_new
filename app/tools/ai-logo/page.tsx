"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles, Download, ChevronDown } from "lucide-react"
import Link from "next/link"

// 后端 API 地址
const API_BASE_URL = "http://localhost:3001"

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

// Logo 结果类型
interface LogoResult {
  index: number
  taskId: string
  status: string
  imageUrl?: string
  error?: string
}

export default function AILogoPage() {
  const [logoName, setLogoName] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0])
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [slogan, setSlogan] = useState("")
  const [generatedLogos, setGeneratedLogos] = useState<LogoResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

  // 调用后端生成 Logo
  const handleGenerate = async () => {
    if (!logoName.trim()) return

    setIsGenerating(true)
    setGeneratedLogos([])
    setStatusMessage("正在调用 AI 生成设计方案...")

    try {
      // 步骤1: 调用后端创建任务
      const response = await fetch(`${API_BASE_URL}/api/generate-logo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          logoName,
          industry: selectedIndustry,
          style: selectedStyle,
          slogan,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "生成失败")
      }

      setBatchId(data.batchId)
      setStatusMessage(`已创建 ${data.promptCount} 个设计任务，正在生图...`)

      // 步骤2: 轮询查询结果
      pollTaskStatus(data.batchId)
    } catch (error) {
      console.error("生成失败:", error)
      setStatusMessage("生成失败: " + (error as Error).message)
      setIsGenerating(false)
    }
  }

  // 轮询查询任务状态
  const pollTaskStatus = async (batchId: string) => {
    const maxRetries = 60 // 最多查询60次
    const interval = 3000 // 每3秒查询一次

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/task-status/${batchId}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "查询失败")
        }

        // 更新生成的 Logo 列表
        setGeneratedLogos(data.results)

        // 检查是否全部完成
        const successCount = data.results.filter((r: LogoResult) => r.status === "success").length
        const totalCount = data.results.length

        setStatusMessage(`已完成 ${successCount}/${totalCount} 个设计`)

        if (data.status === "completed") {
          setIsGenerating(false)
          setStatusMessage(`成功生成 ${successCount} 个 Logo 设计`)
          break
        }

        // 等待后继续查询
        await new Promise((resolve) => setTimeout(resolve, interval))
      } catch (error) {
        console.error("查询状态失败:", error)
        setStatusMessage("查询状态失败: " + (error as Error).message)
        setIsGenerating(false)
        break
      }
    }
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

            {/* Status Message */}
            {statusMessage && (
              <div className="text-sm text-muted-foreground text-center py-2">
                {statusMessage}
              </div>
            )}

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
                    key={logo.index}
                    onClick={() => setSelectedLogo(logo.index)}
                    className={`aspect-square rounded-2xl cursor-pointer transition-all hover:scale-105 relative overflow-hidden group bg-muted ${
                      selectedLogo === logo.index ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    {/* Logo 图片 */}
                    {logo.status === "success" && logo.imageUrl ? (
                      <>
                        <img
                          src={logo.imageUrl}
                          alt={`Logo ${logo.index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Download overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a
                            href={logo.imageUrl}
                            download={`logo-${logoName}-${logo.index + 1}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-card rounded-full shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </>
                    ) : logo.status === "error" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-red-500 text-sm p-4">
                          生成失败
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <span className="text-sm">生成中...</span>
                        </div>
                      </div>
                    )}
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
