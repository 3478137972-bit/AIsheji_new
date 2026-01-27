"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// 模型配置
const MODEL_OPTIONS = [
  { value: "nano-banana-pro", label: "Nano banana pro" },
  { value: "nano-banana", label: "nano banana" },
  { value: "seedream4.5", label: "seedream4.5" },
]

// 尺寸配置
const ASPECT_RATIOS = {
  "nano-banana-pro": [
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
    { value: "auto", label: "Auto" },
  ],
  "nano-banana": [
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
    { value: "auto", label: "Auto" },
  ],
  "seedream4.5": [
    { value: "1:1", label: "1:1" },
    { value: "4:3", label: "4:3" },
    { value: "3:4", label: "3:4" },
    { value: "16:9", label: "16:9" },
    { value: "9:16", label: "9:16" },
    { value: "2:3", label: "2:3" },
    { value: "3:2", label: "3:2" },
    { value: "21:9", label: "21:9" },
  ],
}

// 分辨率配置
const RESOLUTION_OPTIONS = {
  "nano-banana-pro": [
    { value: "2k", label: "2K" },
    { value: "4k", label: "4K" },
  ],
  "nano-banana": [],
  "seedream4.5": [],
}

export default function DesignAgentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 模型选择状态
  const [selectedModel, setSelectedModel] = useState("nano-banana-pro")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1")
  const [selectedResolution, setSelectedResolution] = useState("2k")

  // 处理模型切换
  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    // 重置为该模型的第一个尺寸选项
    const aspectRatios = ASPECT_RATIOS[model as keyof typeof ASPECT_RATIOS]
    if (aspectRatios && aspectRatios.length > 0) {
      setSelectedAspectRatio(aspectRatios[0].value)
    }
    // 重置为该模型的第一个分辨率选项
    const resolutions = RESOLUTION_OPTIONS[model as keyof typeof RESOLUTION_OPTIONS]
    if (resolutions && resolutions.length > 0) {
      setSelectedResolution(resolutions[0].value)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // TODO: 调用设计智能体 API
    // 暂时模拟回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "我是设计智能体，正在处理您的需求...",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧对话区域 - 35% */}
      <div className="w-[35%] border-r flex flex-col">
        {/* 对话标题 */}
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">设计智能体</h1>
          <p className="text-sm text-muted-foreground">AI 驱动的设计工具平台</p>
        </div>

        {/* 消息列表 */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>开始对话</p>
                <p className="text-sm mt-2">描述你想要的设计</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 输入框 */}
        <div className="p-6 border-t space-y-4">
          {/* 输入框 */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="描述你想要的设计..."
              disabled={isLoading}
              className="h-10 rounded-full"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-10 w-10 bg-purple-600 hover:bg-purple-700 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* 选项区域 */}
          <div className="grid grid-cols-3 gap-2">
            {/* 模型选择 */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">模型</label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="h-8 text-xs rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 尺寸选择 */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">尺寸</label>
              <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                <SelectTrigger className="h-8 text-xs rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS[selectedModel as keyof typeof ASPECT_RATIOS]?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 分辨率选择 */}
            {RESOLUTION_OPTIONS[selectedModel as keyof typeof RESOLUTION_OPTIONS]?.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">分辨率</label>
                <Select value={selectedResolution} onValueChange={setSelectedResolution}>
                  <SelectTrigger className="h-8 text-xs rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTION_OPTIONS[selectedModel as keyof typeof RESOLUTION_OPTIONS]?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧图片展示区域 - 65% */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {/* 顶部导航栏 */}
        <div className="h-16 border-b bg-background flex items-center justify-between px-6">
          {/* 左侧：产品图标和名称 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold">秒懂AI</h2>
              <p className="text-xs text-muted-foreground">SUPER EMPLOYEE</p>
            </div>
          </div>

          {/* 右侧：用户账号 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">王</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">×子王</p>
                <p className="text-xs text-muted-foreground">3478137972@qq.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center mb-4">
              <p className="text-muted-foreground">画布区域</p>
            </div>
            <p className="text-sm text-muted-foreground">生成的图片将在这里显示</p>
          </div>
        </div>
      </div>
    </div>
  )
}
