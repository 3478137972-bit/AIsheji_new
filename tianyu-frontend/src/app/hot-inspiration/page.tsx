'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Home, 
  TrendingUp, 
  Clock, 
  Share2, 
  MoreHorizontal,
  Star,
  Flame,
  Zap,
  MessageSquare,
  ThumbsUp,
  ArrowRight,
  Search
} from 'lucide-react'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'
import { Tab, TabList, TabTrigger, TabContent } from '@/components/tab'

// 灵感卡片类型
interface InspirationCard {
  id: string
  title: string
  description: string
  author: string
  authorAvatar: string
  likes: number
  views: number
  tags: string[]
  imageUrl?: string
  isFeatured?: boolean
}

// 假数据
const featuredInspirations: InspirationCard[] = [
  {
    id: '1',
    title: '智能家居控制系统设计',
    description: '现代智能家居的创新设计思路，整合AI技术实现自动化控制',
    author: '张伟',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 124,
    views: 1523,
    tags: ['设计', 'AI', '智能家居'],
    isFeatured: true,
  },
  {
    id: '2',
    title: '移动端电商UI设计规范',
    description: '全面的移动端电商界面设计指南，提升用户体验',
    author: '李娜',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 98,
    views: 1234,
    tags: ['UI/UX', '电商', '移动端'],
  },
  {
    id: '3',
    title: '数据分析可视化方案',
    description: '使用D3.js和Chart.js的数据可视化最佳实践',
    author: '王强',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 87,
    views: 1156,
    tags: ['数据可视化', 'D3.js', 'Chart.js'],
  },
]

const recentInspirations: InspirationCard[] = [
  {
    id: '4',
    title: '创业公司品牌定位策略',
    description: '如何为初创公司打造独特的品牌定位',
    author: '刘洋',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 76,
    views: 987,
    tags: ['品牌', '创业', '营销'],
  },
  {
    id: '5',
    title: '远程团队协作工具推荐',
    description: '提升远程工作效率的10款实用工具',
    author: '陈静',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 65,
    views: 876,
    tags: ['远程工作', '协作工具'],
  },
  {
    id: '6',
    title: 'React性能优化技巧',
    description: '深入浅出React性能优化的10个实用技巧',
    author: '赵明',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 54,
    views: 765,
    tags: ['React', '性能优化', '前端'],
  },
]

const popularInspirations: InspirationCard[] = [
  {
    id: '7',
    title: '2024设计趋势白皮书',
    description: '年度设计趋势分析，掌握未来设计方向',
    author: '孙磊',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 234,
    views: 3456,
    tags: ['设计趋势', '白皮书', '2024'],
  },
  {
    id: '8',
    title: '产品经理技能矩阵',
    description: '完整的产品经理能力模型和培养路径',
    author: '周婷',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 189,
    views: 2876,
    tags: ['产品', '技能', '职业发展'],
  },
  {
    id: '9',
    title: '微服务架构实践',
    description: '从零开始构建微服务架构的完整指南',
    author: '吴刚',
    authorAvatar: 'https://via.placeholder.com/40',
    likes: 167,
    views: 2345,
    tags: ['微服务', '架构', '后端'],
  },
]

// 热点轮播组件
function SpotlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const featured = [
    {
      title: 'AI驱动的创意设计',
      description: '探索人工智能如何赋能创意设计领域，释放无限可能',
      image: 'https://via.placeholder.com/600x400/E67E22/FFFFFF',
      tags: ['AI', '设计', '创新'],
      views: 5432,
    },
    {
      title: '未来办公空间设计',
      description: '重新定义现代办公环境，打造高效灵活的工作空间',
      image: 'https://via.placeholder.com/600x400/FAF3E0/E67E22',
      tags: ['办公', '设计', '空间'],
      views: 3210,
    },
    {
      title: '数据可视化新范式',
      description: '探索数据可视化领域的最新趋势和技术突破',
      image: 'https://via.placeholder.com/600x400/292524/FFFFFF',
      tags: ['数据', '可视化', '技术'],
      views: 2876,
    },
  ]

  return (
    <div className="relative w-full mb-6 overflow-hidden rounded-2xl bg-cream-50">
      {/* Desktop: 60% width, Mobile: fixed 200px */}
      <div className="w-full md:w-[60%] md:mx-auto">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl">
          {featured.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
              }`}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream-900/90 via-cream-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary-100 text-primary-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-cream-50 mb-2">{item.title}</h2>
                <p className="text-sm md:text-base text-cream-200 mb-4">{item.description}</p>
                <div className="flex items-center text-cream-400 text-sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {item.views} 浏览
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {featured.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-primary-600' : 'w-2 bg-cream-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 灵感卡片组件
function InspirationCard({ item }: { item: InspirationCard }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {item.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
            {item.title}
          </CardTitle>
          {item.isFeatured && (
            <Badge variant="outline" className="text-xs bg-primary-100 text-primary-800 border-primary-200">
              精选
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-medium text-primary-600">
              {item.author.substring(0, 2)}
            </div>
            <span className="text-xs text-cream-600">{item.author}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-cream-400">
            <div className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {item.likes}
            </div>
            <div className="flex items-center">
              <Share2 className="h-3 w-3 mr-1" />
              {item.views}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {item.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 热门榜单组件
function RankingList() {
  const rankings = [
    { id: 1, title: 'AI设计工具推荐榜', views: 12345, users: 3456, trend: 'up' },
    { id: 2, title: '编程语言热度榜', views: 9876, users: 2345, trend: 'up' },
    { id: 3, title: '设计师必备插件榜', views: 8765, users: 2123, trend: 'down' },
    { id: 4, title: '效率工具精选榜', views: 7654, users: 1987, trend: 'unchanged' },
    { id: 5, title: '最佳学习资源榜', views: 6543, users: 1876, trend: 'up' },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Flame className="h-5 w-5 text-primary-600 mr-2" />
            <CardTitle className="text-lg">热门榜单</CardTitle>
          </div>
          <Link href="/rankings" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            更多 <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-cream-100">
          {rankings.map((ranking, index) => (
            <div key={ranking.id} className="flex items-center justify-between p-4 hover:bg-cream-50 transition-colors">
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-cream-50 text-cream-600'
                }`}>
                  {ranking.id}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-cream-900">{ranking.title}</p>
                  <p className="text-xs text-cream-500">
                    {ranking.users}人关注 • {ranking.views}浏览
                  </p>
                </div>
              </div>
              {ranking.trend === 'up' && <span className="text-xs text-success-600">↑</span>}
              {ranking.trend === 'down' && <span className="text-xs text-error-600">↓</span>}
              {ranking.trend === 'unchanged' && <span className="text-xs text-cream-400">→</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Tag Cloud组件
function TagCloud() {
  const tags = [
    '设计', '开发', '产品', '运营', '营销', 'AI', '大数据', '云计算', 
    '移动开发', '前端', '后端', 'UX', 'UI', '创业', '职场'
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full bg-cream-50 text-cream-700 text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

// Tab导航组件
function InspirationTabs() {
  const [activeTab, setActiveTab] = useState('recommended')

  return (
    <div className="mb-6">
      <Tab value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabList className="flex space-x-1 overflow-x-auto pb-2 md:pb-0">
          <TabTrigger 
            value="recommended" 
            className="flex-1 md:flex-none md:w-24"
          >
            推荐
          </TabTrigger>
          <TabTrigger 
            value="recent" 
            className="flex-1 md:flex-none md:w-24"
          >
            最新
          </TabTrigger>
          <TabTrigger 
            value="popular" 
            className="flex-1 md:flex-none md:w-24"
          >
            热门
          </TabTrigger>
        </TabList>
        
        <div className="mt-4 min-h-[400px]">
          <TabContent value="recommended">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cream-900 mb-4">为您精选</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredInspirations.map(item => (
                  <InspirationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabContent>
          
          <TabContent value="recent">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cream-900 mb-4">最新发布</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentInspirations.map(item => (
                  <InspirationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabContent>
          
          <TabContent value="popular">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cream-900 mb-4">热门内容</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularInspirations.map(item => (
                  <InspirationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </TabContent>
        </div>
      </Tab>
    </div>
  )
}

// 页面组件
function HotInspirationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 (64px) */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ti</span>
            </div>
            <span className="text-xl font-bold text-cream-900 hidden sm:block">TIANyu</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-md text-sm font-medium text-cream-700 hover:text-primary-600 hover:bg-cream-100 transition-colors">
              首页
            </Link>
            <Link href="/hot-inspiration" className="px-4 py-2 rounded-md text-sm font-medium text-primary-600 bg-primary-50 transition-colors">
              热点灵感
            </Link>
            <Link href="/projects" className="px-4 py-2 rounded-md text-sm font-medium text-cream-700 hover:text-primary-600 hover:bg-cream-100 transition-colors">
              项目
            </Link>
            <Link href="/team" className="px-4 py-2 rounded-md text-sm font-medium text-cream-700 hover:text-primary-600 hover:bg-cream-100 transition-colors">
              团队
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-400" />
              <input
                type="text"
                placeholder="搜索灵感..."
                className="pl-10 pr-4 py-2 rounded-full bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all w-48"
              />
            </div>
            <Button size="sm" variant="ghost" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="sm" className="hidden md:flex bg-primary-600 hover:bg-primary-700">
              登录
            </Button>
          </div>
        </div>
      </header>
      
      {/* 主要内容区域 */}
      <main className="pt-24 pb-20 px-4 container mx-auto">
        {/* 热点轮播区 */}
        <section className="mb-8">
          <SpotlightCarousel />
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧内容 (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab 切换 */}
            <InspirationTabs />
          </div>
          
          {/* 右侧边栏 (40%) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 热门榜单 */}
            <section className="lg:sticky lg:top-24">
              <RankingList />
            </section>
            
            {/* 热门标签 */}
            <section>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-amber-500 mr-2" />
                    <CardTitle className="text-lg">热门标签</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <TagCloud />
                </CardContent>
              </Card>
            </section>
            
            {/* 广告位/推广 */}
            <section>
              <Card className="bg-gradient-to-br from-primary-600 to-orange-500 text-cream-50">
                <CardContent className="p-6 text-center">
                  <Flame className="h-12 w-12 mx-auto mb-4 text-cream-100" />
                  <h3 className="text-lg font-bold mb-2">成为灵感作者</h3>
                  <p className="text-sm text-cream-100 mb-4">
                    分享您的经验和见解，影响更多人
                  </p>
                  <Button variant="secondary" className="w-full bg-cream-50 text-primary-700 hover:bg-cream-100">
                    立即投稿
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      
      {/* 底部 TabBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-primary-600">
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">首页</span>
          </Link>
          <Link href="/hot-inspiration" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-primary-600">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs font-medium">灵感</span>
          </Link>
          <Link href="/find" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-cream-500 hover:text-primary-600">
            <Search className="h-6 w-6" />
            <span className="text-xs font-medium">发现</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-cream-500 hover:text-primary-600">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs font-medium">消息</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-cream-500 hover:text-primary-600">
            <div className="h-6 w-6 rounded-full bg-cream-200 flex items-center justify-center">
              <span className="text-[10px]">我</span>
            </div>
            <span className="text-xs font-medium">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default HotInspirationPage
