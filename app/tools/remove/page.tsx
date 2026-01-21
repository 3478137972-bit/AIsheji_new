"use client"

import React from "react"

import { useState, useCallback } from "react"
import { MainLayout } from "@/components/main-layout"
import { Upload, ArrowLeft, Sparkles, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AIRemovePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Simulate file drop
    setUploadedImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop")
  }, [])

  const handleUploadClick = () => {
    // Simulate file selection
    setUploadedImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop")
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
          <h1 className="text-xl font-semibold">AI消除</h1>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
          {uploadedImage ? (
            <div className="bg-card rounded-2xl border border-border p-8 max-w-2xl w-full">
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full" />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                  <p className="text-card bg-foreground/80 px-4 py-2 rounded-lg text-sm">
                    点击需要消除的区域
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setUploadedImage(null)}
                  className="flex-1 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                >
                  重新上传
                </button>
                <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  开始消除
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`bg-card rounded-2xl border-2 border-dashed p-16 max-w-xl w-full text-center transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-lg font-medium mb-2">点击/拖拽/粘贴图片至此处</h2>
              <p className="text-sm text-muted-foreground mb-6">
                支持 JPG、PNG 格式，单张图片不超过 10MB
              </p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                <Upload className="w-5 h-5" />
                上传图片
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
