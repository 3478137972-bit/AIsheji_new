"use client"

import { useState, useRef } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles, Download, Check, Upload, X } from "lucide-react"
import Link from "next/link"

// API 地址 - 使用相对路径调用 Next.js API Routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// 比例选项
const aspectRatios = [
  { value: "1:1", label: "1:1" },
  { value: "2:3", label: "2:3" },
  { value: "3:2", label: "3:2" },
  { value: "3:4", label: "3:4" },
  { value: "4:3", label: "4:3" },
  { value: "4:5", label: "4:5" },
  { value: "5:4", label: "5:4" },
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" },
  { value: "21:9", label: "21:9" },
  { value: "auto", label: "auto" },
]


// 插画结果类型
interface IllustrationResult {
  index: number
  taskId: string
  status: string
  imageUrl?: string
  error?: string
}

export default function AIIPIllustrationPage() {
  // IP角色相关
  const [species, setSpecies] = useState("")
  const [color, setColor] = useState("")
  const [bodyType, setBodyType] = useState("")

  // 场景与节日相关
  const [action, setAction] = useState("")
  const [location, setLocation] = useState("")
  const [festival, setFestival] = useState("")

  // 品牌信息
  const [brandInfo, setBrandInfo] = useState("")

  const [selectedRatio, setSelectedRatio] = useState("1:1")
  const [showRatioDialog, setShowRatioDialog] = useState(false)
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [generatedImages, setGeneratedImages] = useState<IllustrationResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 压缩图片
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // 限制最大尺寸为 1024px
          const maxSize = 1024
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          // 压缩质量 0.8
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 4 - referenceImages.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    for (const file of filesToProcess) {
      if (file.type.startsWith('image/')) {
        try {
          const compressedImage = await compressImage(file)
          setReferenceImages(prev => [...prev, compressedImage])
        } catch (error) {
          console.error('图片压缩失败:', error)
        }
      }
    }

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 删除参考图
  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  // 调用后端生成插画
  const handleGenerate = async () => {
    if (!species.trim() || !action.trim()) return

    setIsGenerating(true)
    setGeneratedImages([])
    setStatusMessage("正在调用 AI 生成 AIIP 插画...")

    try {
      // 步骤1: 调用后端创建任务
      const response = await fetch(`${API_BASE_URL}/api/generate-aiip-illustration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          species,
          color,
          bodyType,
          action,
          location,
          festival,
          brandInfo,
          aspectRatio: selectedRatio,
          referenceImages: referenceImages,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "生成失败")
      }

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

        // 更新生成的插画列表
        setGeneratedImages(data.results)

        // 检查是否全部完成
        const successCount = data.results.filter((r: IllustrationResult) => r.status === "success").length
        const totalCount = data.results.length

        setStatusMessage(`已完成 ${successCount}/${totalCount} 个设计`)

        if (data.status === "completed") {
          setIsGenerating(false)
          setStatusMessage(`成功生成 ${successCount} 个 AIIP 插画`)
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
          <h1 className="text-xl font-semibold">IP 插画 1 号员工</h1>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Form */}
          <div className="w-80 flex-shrink-0 bg-card rounded-2xl border border-border p-6 flex flex-col overflow-y-auto">
            <div className="space-y-3 flex-1">
              {/* IP角色 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">IP角色</label>

                {/* 物种 */}
                <div className="mb-2">
                  <label className="block text-xs text-muted-foreground mb-0.5">物种 *</label>
                  <input
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    placeholder="例如：猫、熊猫、兔子等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>

                {/* 颜色 */}
                <div className="mb-2">
                  <label className="block text-xs text-muted-foreground mb-0.5">颜色</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="例如：橙色、白色、彩色等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>

                {/* 体型 */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-0.5">体型</label>
                  <input
                    type="text"
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    placeholder="例如：圆润、修长、Q版等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>
              </div>

              {/* 场景与节日 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">场景与节日</label>

                {/* 动作 */}
                <div className="mb-2">
                  <label className="block text-xs text-muted-foreground mb-0.5">做什么动作 *</label>
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="例如：跳舞、玩耍、睡觉等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>

                {/* 地点 */}
                <div className="mb-2">
                  <label className="block text-xs text-muted-foreground mb-0.5">在哪里</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="例如：公园、家里、海边等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>

                {/* 节日 */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-0.5">什么节日</label>
                  <input
                    type="text"
                    value={festival}
                    onChange={(e) => setFestival(e.target.value)}
                    placeholder="例如：春节、圣诞节、中秋节等"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>
              </div>

              {/* 品牌信息 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">品牌信息、理念</label>
                <input
                  type="text"
                  value={brandInfo}
                  onChange={(e) => setBrandInfo(e.target.value)}
                  placeholder="例如：环保品牌、科技创新等"
                  className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-sm font-medium mb-1.5">比例</label>
                <button
                  onClick={() => setShowRatioDialog(true)}
                  className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none text-left flex items-center justify-between hover:bg-muted/80 transition-colors"
                >
                  <span>{selectedRatio}</span>
                  <span className="text-muted-foreground text-xs">点击选择</span>
                </button>
              </div>

              {/* Reference Images */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  参考图 ({referenceImages.length}/4)
                </label>

                {/* Upload Button */}
                {referenceImages.length < 4 && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-2 text-sm bg-muted rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>点击上传参考图</span>
                    </button>
                  </div>
                )}

                {/* Image Previews */}
                {referenceImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {referenceImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                      >
                        <img
                          src={img}
                          alt={`参考图 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeReferenceImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              disabled={!species.trim() || !action.trim() || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "生成中..." : "生成插画"}
            </button>
          </div>

          {/* Right Panel - Generated Images Grid */}
          <div className="flex-1 bg-card rounded-2xl border border-border p-6 overflow-y-auto">
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {generatedImages.map((image) => (
                  <div
                    key={image.index}
                    onClick={() => setSelectedImage(image.index)}
                    className={`aspect-square rounded-2xl cursor-pointer transition-all hover:scale-105 relative overflow-hidden group bg-muted ${
                      selectedImage === image.index ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    {/* Image */}
                    {image.status === "success" && image.imageUrl ? (
                      <>
                        <img
                          src={image.imageUrl}
                          alt={`AIIP 插画 ${image.index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Download overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a
                            href={image.imageUrl}
                            download={`aiip-illustration-${species}-${image.index + 1}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-card rounded-full shadow-lg hover:scale-110 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </>
                    ) : image.status === "error" ? (
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
                  <p>输入主题和场景描述并点击生成</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aspect Ratio Dialog */}
        {showRatioDialog && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowRatioDialog(false)}
          >
            <div
              className="bg-card rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">选择比例</h3>
              <div className="grid grid-cols-3 gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => {
                      setSelectedRatio(ratio.value)
                      setShowRatioDialog(false)
                    }}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 relative ${
                      selectedRatio === ratio.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted hover:border-primary/50"
                    }`}
                  >
                    <div className="text-center font-medium">{ratio.label}</div>
                    {selectedRatio === ratio.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRatioDialog(false)}
                className="w-full mt-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
