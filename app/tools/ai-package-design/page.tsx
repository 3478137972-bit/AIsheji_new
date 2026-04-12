"use client"

import { useState, useRef } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Sparkles, Download, Upload, X } from "lucide-react"
import Link from "next/link"

// API 地址
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// 包装设计结果类型
interface PackageDesignResult {
  index: number
  taskId: string
  status: string
  imageUrl?: string
  error?: string
}

export default function AIPackageDesignPage() {
  // 表单字段
  const [productInfo, setProductInfo] = useState("")
  const [heightCm, setHeightCm] = useState("")
  const [widthCm, setWidthCm] = useState("")
  const [visualPreference, setVisualPreference] = useState("")

  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [generatedImages, setGeneratedImages] = useState<PackageDesignResult[]>([])
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

  // 调用后端生成包装设计
  const handleGenerate = async () => {
    if (!productInfo.trim()) return

    setIsGenerating(true)
    setGeneratedImages([])
    setStatusMessage("正在调用 AI 生成包装设计...")

    try {
      // 步骤1: 调用后端创建任务
      const response = await fetch(`${API_BASE_URL}/api/generate-package-design`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productInfo,
          heightCm,
          widthCm,
          visualPreference,
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

        // 更新生成的包装设计列表
        setGeneratedImages(data.results)

        // 检查是否全部完成
        const successCount = data.results.filter((r: PackageDesignResult) => r.status === "success").length
        const totalCount = data.results.length

        setStatusMessage(`已完成 ${successCount}/${totalCount} 个设计`)

        if (data.status === "completed") {
          setIsGenerating(false)
          setStatusMessage(`成功生成 ${successCount} 个包装设计`)
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
          <h1 className="text-xl font-semibold">平面包装设计</h1>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Form */}
          <div className="w-80 flex-shrink-0 bg-card rounded-2xl border border-border p-6 flex flex-col overflow-y-auto">
            <div className="space-y-3 flex-1">
              {/* 产品基本信息 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">产品基本信息 *</label>
                <textarea
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  placeholder="请输入产品的文字、品牌属性、设计元素等..."
                  rows={4}
                  className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none resize-none"
                />
              </div>

              {/* 产品尺寸 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">产品尺寸</label>

                {/* 高度 */}
                <div className="mb-2">
                  <label className="block text-xs text-muted-foreground mb-0.5">高度 (cm)</label>
                  <input
                    type="text"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="例如：15"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>

                {/* 宽度 */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-0.5">宽度 (cm)</label>
                  <input
                    type="text"
                    value={widthCm}
                    onChange={(e) => setWidthCm(e.target.value)}
                    placeholder="例如：10"
                    className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none"
                  />
                </div>
              </div>

              {/* 视觉偏好 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">视觉偏好</label>
                <textarea
                  value={visualPreference}
                  onChange={(e) => setVisualPreference(e.target.value)}
                  placeholder="请描述您期望的视觉风格、颜色、图案等..."
                  rows={3}
                  className="w-full p-2 text-sm bg-muted rounded-xl border-none outline-none resize-none"
                />
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
              disabled={!productInfo.trim() || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "生成中..." : "生成"}
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
                          alt={`包装设计 ${image.index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Download overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a
                            href={image.imageUrl}
                            download={`package-design-${image.index + 1}.png`}
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
                  <p>输入产品信息并点击生成</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
