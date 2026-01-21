"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Upload, ChevronDown, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

const platforms = ["淘宝", "京东", "拼多多", "抖音", "小红书"]
const markets = ["中国", "美国", "欧洲", "东南亚", "日本"]
const languages = ["中文", "英文", "日文", "韩文"]

export default function ProductSetPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0])
  const [selectedMarket, setSelectedMarket] = useState(markets[0])
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [sellingPoints, setSellingPoints] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!uploadedImage) return
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setGeneratedImages([
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1491553895911-0055uj9663a6?w=400&h=400&fit=crop",
      ])
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
          <h1 className="text-xl font-semibold">AI商品套图</h1>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Configuration */}
          <div className="w-80 flex-shrink-0 bg-card rounded-2xl border border-border p-6 flex flex-col">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer mb-6"
              onClick={() => {
                // Simulate upload
                setUploadedImage("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop")
              }}
            >
              {uploadedImage ? (
                <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">点击或拖拽上传商品图片</p>
                </>
              )}
            </div>

            {/* Selectors */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium mb-2">平台</label>
                <div className="relative">
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full p-3 bg-muted rounded-xl border-none outline-none appearance-none cursor-pointer"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">市场</label>
                <div className="relative">
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full p-3 bg-muted rounded-xl border-none outline-none appearance-none cursor-pointer"
                  >
                    {markets.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">语言</label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-3 bg-muted rounded-xl border-none outline-none appearance-none cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">核心卖点</label>
                <textarea
                  value={sellingPoints}
                  onChange={(e) => setSellingPoints(e.target.value)}
                  placeholder="输入商品核心卖点..."
                  className="w-full p-3 bg-muted rounded-xl border-none outline-none resize-none h-24"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "生成中..." : "生成套图"}
            </button>
          </div>

          {/* Right Panel - Results (Bento Grid) */}
          <div className="flex-1 bg-card rounded-2xl border border-border p-6">
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
                {/* Large image */}
                <div className="col-span-2 row-span-2 rounded-xl overflow-hidden">
                  <img
                    src={generatedImages[0] || "/placeholder.svg"}
                    alt="Generated 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Small images */}
                {generatedImages.slice(1, 5).map((img, index) => (
                  <div key={index} className="rounded-xl overflow-hidden">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Generated ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>上传图片并点击生成查看结果</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
