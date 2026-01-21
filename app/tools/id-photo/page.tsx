"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ArrowLeft, Download, Check } from "lucide-react"
import Link from "next/link"

const sizes = [
  { label: "一寸", value: "1inch", dimensions: "25×35mm" },
  { label: "二寸", value: "2inch", dimensions: "35×49mm" },
  { label: "小二寸", value: "small2inch", dimensions: "33×48mm" },
  { label: "护照", value: "passport", dimensions: "33×48mm" },
  { label: "签证", value: "visa", dimensions: "35×45mm" },
]

const bgColors = [
  { label: "白色", value: "#FFFFFF", color: "bg-white" },
  { label: "蓝色", value: "#438EDB", color: "bg-[#438EDB]" },
  { label: "红色", value: "#D03F3F", color: "bg-[#D03F3F]" },
  { label: "灰色", value: "#F0F0F0", color: "bg-[#F0F0F0]" },
]

export default function IDPhotoPage() {
  const [selectedSize, setSelectedSize] = useState(sizes[0].value)
  const [selectedBgColor, setSelectedBgColor] = useState(bgColors[1].value)
  const [sliderPosition, setSliderPosition] = useState(50)

  const originalImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
  const processedImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold">证件照</h1>
          </div>
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            下载
          </button>
        </div>

        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Tools */}
          <div className="w-64 flex-shrink-0 bg-card rounded-2xl border border-border p-6 space-y-6">
            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">尺寸规格</h3>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-colors ${
                      selectedSize === size.value
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-medium">{size.label}</span>
                    <span className="text-xs text-muted-foreground">{size.dimensions}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <h3 className="text-sm font-medium mb-3">背景颜色</h3>
              <div className="flex gap-3">
                {bgColors.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setSelectedBgColor(bg.value)}
                    className={`w-10 h-10 rounded-xl ${bg.color} border-2 transition-all flex items-center justify-center ${
                      selectedBgColor === bg.value
                        ? "border-primary scale-110"
                        : "border-border hover:scale-105"
                    }`}
                  >
                    {selectedBgColor === bg.value && (
                      <Check className={`w-5 h-5 ${bg.value === "#FFFFFF" || bg.value === "#F0F0F0" ? "text-foreground" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Canvas with Before/After Slider */}
          <div className="flex-1 bg-card rounded-2xl border border-border p-6 flex items-center justify-center">
            <div className="relative w-80 h-[400px] overflow-hidden rounded-xl">
              {/* Before Image (Original) */}
              <div className="absolute inset-0">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* After Image (Processed with background) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: selectedBgColor }}
                >
                  <img
                    src={processedImage || "/placeholder.svg"}
                    alt="Processed"
                    className="w-80 h-full object-cover mix-blend-multiply"
                  />
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => {
                  const container = e.currentTarget.parentElement
                  if (!container) return

                  const handleMove = (moveEvent: MouseEvent) => {
                    const rect = container.getBoundingClientRect()
                    const x = moveEvent.clientX - rect.left
                    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
                    setSliderPosition(percentage)
                  }

                  const handleUp = () => {
                    document.removeEventListener("mousemove", handleMove)
                    document.removeEventListener("mouseup", handleUp)
                  }

                  document.addEventListener("mousemove", handleMove)
                  document.addEventListener("mouseup", handleUp)
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                    <div className="w-0.5 h-3 bg-muted-foreground rounded-full" />
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 px-2 py-1 bg-foreground/80 text-background text-xs rounded">
                处理后
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-foreground/80 text-background text-xs rounded">
                原图
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
