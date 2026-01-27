"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Send, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserMenu } from "@/components/user-menu"

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
    const userInput = input
    setInput("")
    setIsLoading(true)

    try {
      // 调用设计智能体 API
      const response = await fetch('/api/design-agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '请求失败')
      }

      // 根据响应类型处理
      if (data.type === 'result') {
        // 成功生成提示词
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message + '\n\n📝 提示词：\n' + data.result.prompt,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])

        // TODO: 在画布区域显示生成的图片
        console.log('生成结果:', data.result)
      } else if (data.type === 'error') {
        // 错误
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error: any) {
      console.error('发送消息失败:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ 抱歉，发生了错误：" + error.message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* 左侧：产品图标和名称 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
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
          </Link>

          {/* 右侧：用户菜单 */}
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* 主内容区域 - 左右分栏 */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 左侧对话区域 */}
        <div
          className={`flex flex-col border-r border-border bg-background transition-all duration-300 ${
            isSidebarOpen ? "w-[400px]" : "w-0"
          }`}
        >
          {isSidebarOpen && (
            <>
              {/* 对话标题 */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold">设计智能体</h1>
                  <p className="text-sm text-muted-foreground">AI 驱动的设计工具平台</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4">
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
              </div>

              {/* 底部输入区域 */}
              <div className="p-4 border-t border-border">
                <div className="bg-muted/30 rounded-2xl border border-border p-3">
                  {/* 多行文本输入框 */}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="描述你想要的设计..."
                    disabled={isLoading}
                    className="w-full min-h-[80px] max-h-[200px] resize-none bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                    style={{ scrollbarWidth: 'thin' }}
                  />

                  {/* 底部选项和发送按钮 */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    {/* 左侧：选项按钮 */}
                    <div className="flex items-center gap-2">
                      {/* 模型选择 */}
                      <Select value={selectedModel} onValueChange={handleModelChange}>
                        <SelectTrigger className="h-8 px-3 text-xs rounded-full bg-purple-200 text-purple-800 border-0 hover:bg-purple-300">
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

                      {/* 尺寸选择 */}
                      <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                        <SelectTrigger className="h-8 px-3 text-xs rounded-full bg-purple-200 text-purple-800 border-0 hover:bg-purple-300">
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

                      {/* 分辨率选择 */}
                      {RESOLUTION_OPTIONS[selectedModel as keyof typeof RESOLUTION_OPTIONS]?.length > 0 && (
                        <Select value={selectedResolution} onValueChange={setSelectedResolution}>
                          <SelectTrigger className="h-8 px-3 text-xs rounded-full bg-purple-200 text-purple-800 border-0 hover:bg-purple-300">
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
                      )}
                    </div>

                    {/* 右侧：发送按钮 */}
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="h-9 w-9 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 展开按钮（当侧边栏收缩时显示） */}
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 h-10 w-10 bg-background/80 backdrop-blur hover:bg-background border border-border"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        )}

        {/* 右侧画布区域 */}
        <div
          className="flex-1 flex items-center justify-center bg-muted/20 overflow-auto relative"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '21px 21px'
          }}
        >
          <div className="text-center p-8">
            <div className="w-96 h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center mb-4">
              <p className="text-muted-foreground">画布区域</p>
            </div>
            <p className="text-sm text-muted-foreground">生成的图片将在这里显示</p>
          </div>
        </div>
      </div>
    </div>
  )
}
