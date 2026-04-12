"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles, Download } from "lucide-react"
import Link from "next/link"

// API 地址 - 使用相对路径调用 Next.js API Routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

const fontTypes = [
  "矩形",
  "路径",
]

// 字体结果类型
interface FontResult {
  index: number
  taskId: string
  status: string
  imageUrl?: string
  error?: string
}

export default function AIFontPage() {
  const [fontDescription, setFontDescription] = useState("")
  const [industry, setIndustry] = useState("")
  const [feeling, setFeeling] = useState("")
  const [selectedType, setSelectedType] = useState(fontTypes[0])
  const [sessionId, setSessionId] = useState("")
  const [generatedFonts, setGeneratedFonts] = useState<FontResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFont, setSelectedFont] = useState<number | null>(null)
  const [batchId, setBatchId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

  // 调用后端生成字体
  const handleGenerate = async () => {
    if (!fontDescription.trim() || !sessionId.trim()) return

    setIsGenerating(true)
    setGeneratedFonts([])
    setStatusMessage("正在调用 AI 生成字体设计方案...")

    try {
      // 步骤1: 调用后端创建任务
      const response = await fetch(`${API_BASE_URL}/api/generate-font`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fontDescription,
          industry,
          feeling,
          type: selectedType,
          sessionId,
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

        // 更新生成的字体列表
        setGeneratedFonts(data.results)

        // 检查是否全部完成
        const successCount = data.results.filter((r: FontResult) => r.status === "success").length
        const totalCount = data.results.length

        setStatusMessage(`已完成 ${successCount}/${totalCount} 个设计`)

        if (data.status === "completed") {
          setIsGenerating(false)
          setStatusMessage(`成功生成 ${successCount} 个字体设计`)
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
          <h1 className="text-xl font-semibold">字体设计</h1>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Form */}
          <div className="w-80 flex-shrink-0 bg-card rounded-2xl border border-border p-6 flex flex-col">
            <div className="space-y-5 flex-1">
              {/* Font Description */}
              <div>
                <label className="block text-sm font-medium mb-2">字体描述 *</label>
                <textarea
                  value={fontDescription}
                  onChange={(e) => setFontDescription(e.target.value)}
                  placeholder="描述你想要的字体风格和特点"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none h-24 resize-none"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">行业</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="例如：科技、教育、餐饮等"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none"
                />
              </div>

              {/* Feeling */}
              <div>
                <label className="block text-sm font-medium mb-2">呈现出的感觉</label>
                <input
                  type="text"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="例如：现代、优雅、活力等"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">类型</label>
                <div className="flex gap-2">
                  {fontTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm transition-colors ${
                        selectedType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session ID */}
              <div>
                <label className="block text-sm font-medium mb-2">sessionId *</label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="输入会话ID"
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none font-mono text-sm"
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
              disabled={!fontDescription.trim() || !sessionId.trim() || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "生成中..." : "生成字体"}
            </button>
          </div>

          {/* Right Panel - Generated Fonts Grid */}
          <div className="flex-1 bg-card rounded-2xl border border-border p-6 overflow-y-auto">
            {generatedFonts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {generatedFonts.map((font) => (
                  <div
                    key={font.index}
                    onClick={() => setSelectedFont(font.index)}
                    className={`aspect-square rounded-2xl cursor-pointer transition-all hover:scale-105 relative overflow-hidden group bg-muted ${
                      selectedFont === font.index ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    {/* Font 图片 */}
                    {font.status === "success" && font.imageUrl ? (
                      <>
                        <img
                          src={font.imageUrl}
                          alt={`字体设计 ${font.index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Download overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a
                            href={font.imageUrl}
                            download={`font-${fontDescription}-${font.index + 1}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-card rounded-full shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </>
                    ) : font.status === "error" ? (
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
                  <p>输入字体描述并点击生成</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
