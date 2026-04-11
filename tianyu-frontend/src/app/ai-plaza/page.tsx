'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Star, Share2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { Tab, TabList, TabTrigger, TabContent } from '@/components/tab'

// 定义 AI 工具类型
interface AITool {
  id: string
  name: string
  description: string
  category: 'all' | 'boss' | 'private' | 'public' | 'practical'
  tags: string[]
  rating: number
  users: number
  image: string
  featured?: boolean
}

// 模拟数据
const AI_TOOLS: AITool[] = [
  {
    id: '1',
    name: '智能写作助手',
    description: '基于大语言模型的智能写作工具，支持文章、邮件、社交媒体内容生成',
    category: 'all',
    tags: ['写作', 'AI生成', '多语言'],
    rating: 4.8,
    users: 12500,
    image: '/placeholder-ai-tool-1.png',
    featured: true,
  },
  {
    id: '2',
    name: '老板决策支持',
    description: '为企业高管提供数据分析和决策建议的智能系统',
    category: 'boss',
    tags: ['商业智能', '数据分析', '决策支持'],
    rating: 4.9,
    users: 8200,
    image: '/placeholder-ai-tool-2.png',
    featured: true,
  },
  {
    id: '3',
    name: '私域流量管理',
    description: '帮助企业和个人管理私域流量，提升客户转化率',
    category: 'private',
    tags: ['私域运营', 'CRM', '客户管理'],
    rating: 4.7,
    users: 15300,
    image: '/placeholder-ai-tool-3.png',
    featured: true,
  },
  {
    id: '4',
    name: '社交媒体营销',
    description: '智能社交媒体营销工具，自动发布和优化内容',
    category: 'public',
    tags: ['社交媒体', '营销', '自动发布'],
    rating: 4.6,
    users: 9800,
    image: '/placeholder-ai-tool-4.png',
  },
  {
    id: '5',
    name: '数据分析仪表板',
    description: '实时数据监控和可视化仪表板，支持多种数据源',
    category: 'practical',
    tags: ['数据分析', '可视化', '实时监控'],
    rating: 4.8,
    users: 11200,
    image: '/placeholder-ai-tool-5.png',
  },
  {
    id: '6',
    name: '客户支持机器人',
    description: '24/7自动客户支持机器人，提升服务效率',
    category: 'practical',
    tags: ['客户服务', '聊天机器人', '自动回复'],
    rating: 4.5,
    users: 13400,
    image: '/placeholder-ai-tool-6.png',
  },
  {
    id: '7',
    name: '内容创作平台',
    description: '一站式内容创作平台，支持图文、视频、音频多种格式',
    category: 'all',
    tags: ['内容创作', '多媒体', '协作'],
    rating: 4.7,
    users: 16500,
    image: '/placeholder-ai-tool-7.png',
  },
  {
    id: '8',
    name: '市场调研分析',
    description: '智能市场调研工具，提供精准的市场洞察',
    category: 'boss',
    tags: ['市场调研', '数据分析', '竞争力分析'],
    rating: 4.6,
    users: 7600,
    image: '/placeholder-ai-tool-8.png',
  },
  {
    id: '9',
    name: '社群运营助手',
    description: '智能社群运营工具，提升社群活跃度和转化率',
    category: 'private',
    tags: ['社群运营', '自动化', '用户互动'],
    rating: 4.8,
    users: 10100,
    image: '/placeholder-ai-tool-9.png',
    featured: true,
  },
  {
    id: '10',
    name: '搜索引擎优化',
    description: 'AI驱动的SEO工具，自动优化网站排名',
    category: 'public',
    tags: ['SEO', '关键词', '排名优化'],
    rating: 4.4,
    users: 8900,
    image: '/placeholder-ai-tool-10.png',
  },
  {
    id: '11',
    name: '项目管理助手',
    description: '智能项目管理工具，自动分配任务和跟踪进度',
    category: 'practical',
    tags: ['项目管理', '任务分配', '进度跟踪'],
    rating: 4.7,
    users: 14200,
    image: '/placeholder-ai-tool-11.png',
  },
  {
    id: '12',
    name: '高管会议秘书',
    description: '智能会议助手，自动记录和整理会议纪要',
    category: 'boss',
    tags: ['会议纪要', '语音识别', '自动总结'],
    rating: 4.9,
    users: 6500,
    image: '/placeholder-ai-tool-12.png',
  },
]

// 分类定义
const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'boss', label: '老板必用' },
  { id: 'private', label: '私域变现' },
  { id: 'public', label: '公域获客' },
  { id: 'practical', label: '实用工具' },
] as const

export default function AISquarePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoading, setIsLoading] = useState(false)

  // 过滤工具列表
  const filteredTools = AI_TOOLS.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const visibleTools = filteredTools.slice(0, visibleCount)

  // 加载更多
  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8)
      setIsLoading(false)
    }, 500)
  }

  // 获取分类计数
  const getCategoryCount = (category: string) => {
    if (category === 'all') return filteredTools.length
    return filteredTools.filter((tool) => tool.category === category).length
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* 顶部导航栏（64px） */}
      <div className="sticky top-0 z-40 border-b border-cool-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 h-16 flex items-center px-4 md:px-6">
        <h1 className="text-2xl font-bold text-primary-600">AI智能广场</h1>
      </div>

      {/* 搜索筛选区 */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cool-400" />
            <input
              type="text"
              placeholder="搜索AI工具名称、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-cool-200 bg-white text-cool-900 placeholder:text-cool-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cool-400 hover:text-cool-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* 分类 Tab */}
          <Tab value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabList className="flex flex-wrap gap-2 p-1 bg-cream-100 rounded-lg">
              {CATEGORIES.map((category) => (
                <TabTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary-600 data-[state=active]:text-cream-50"
                >
                  {category.label}
                  <span className="ml-2 rounded-full bg-cream-200 px-2 py-0.5 text-xs text-cool-800">
                    {getCategoryCount(category.id)}
                  </span>
                </TabTrigger>
              ))}
            </TabList>
            <div className="mt-4">
              <TabContent value="all">
                <div className="text-sm text-cool-500">展示所有AI工具</div>
              </TabContent>
              <TabContent value="boss">
                <div className="text-sm text-cool-500">老板必备的智能决策工具</div>
              </TabContent>
              <TabContent value="private">
                <div className="text-sm text-cool-500">私域流量运营和变现工具</div>
              </TabContent>
              <TabContent value="public">
                <div className="text-sm text-cool-500">公域流量获客和营销工具</div>
              </TabContent>
              <TabContent value="practical">
                <div className="text-sm text-cool-500">日常实用的AI生产力工具</div>
              </TabContent>
            </div>
          </Tab>
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between text-sm text-cool-500">
          <span>找到 {filteredTools.length} 款AI工具</span>
          <div className="flex items-center gap-2">
            <span>排序：</span>
            <select className="h-9 rounded-md border border-cool-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none">
              <option>推荐排序</option>
              <option>用户数量</option>
              <option>评分</option>
              <option>最新发布</option>
            </select>
          </div>
        </div>

        {/* AI工具网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleTools.map((tool) => (
            <Card key={tool.id} className="group overflow-hidden border-cool-200 transition-all hover:shadow-lg">
              {tool.featured && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="warning" className="shadow-sm">
                    精选推荐
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{tool.name}</CardTitle>
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{tool.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-cool-600 line-clamp-2">{tool.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tool.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tool.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tool.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                {/* User count */}
                <div className="flex items-center text-xs text-cool-500">
                  <span className="mr-1">👤</span>
                  {tool.users.toLocaleString()} 用户
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-cool-100 bg-cream-50/50 p-3">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  详情
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-cool-500 hover:text-primary-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 加载更多按钮 */}
        {filteredTools.length > visibleCount && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-3"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  加载中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  加载更多
                </span>
              )}
            </Button>
          </div>
        )}

        {/* 空状态 */}
        {filteredTools.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-cream-100 p-6 mb-4">
              <Search className="h-12 w-12 text-cool-400" />
            </div>
            <h3 className="text-xl font-semibold text-cool-900 mb-2">没有找到相关AI工具</h3>
            <p className="text-cool-500 mb-6 max-w-md">
              请尝试调整搜索关键词或选择其他分类
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              清空筛选
            </Button>
          </div>
        )}
      </div>

      {/* 移动端底部 TabBar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-cool-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-cool-400 hover:text-cool-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs">首页</span>
          </Link>
          <Link href="/ai-plaza" className="flex flex-col items-center gap-1 text-primary-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-xs font-medium">广场</span>
          </Link>
          <Link href="/ai-plugins" className="flex flex-col items-center gap-1 text-cool-400 hover:text-cool-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs">插件</span>
          </Link>
          <Link href="/ai-knowledge" className="flex flex-col items-center gap-1 text-cool-400 hover:text-cool-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs">知识库</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-cool-400 hover:text-cool-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">我的</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
