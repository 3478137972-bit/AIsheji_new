'use client'

import Link from 'next/link'
import { Button } from '@/components/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card'
import { Badge } from '@/components/badge'
import { 
  Home, 
  List, 
  Settings, 
  Menu, 
  X, 
  ArrowRight, 
  Users, 
  Target, 
  TrendingUp,
  Clock,
  Folder,
  Zap,
  Share2,
  Briefcase,
  Calendar,
  Search,
  Shield
} from 'lucide-react'
import { useState, useEffect } from 'react'

// 图标包装器组件
const IconWrapper = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Icon className="h-5 w-5" />
  </div>
)

// 组件：顶部导航栏 (64px)
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: '首页', href: '#' },
    { name: '功能', href: '#features' },
    { name: '工具', href: '#tools' },
    { name: '分类', href: '#categories' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
      style={{ height: '64px' }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 z-50">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Ti</span>
          </div>
          <span className="text-xl font-bold text-cream-900 hidden sm:block">TIANyu</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-md text-sm font-medium text-cream-700 hover:text-primary-600 hover:bg-cream-100 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
            免费试用
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 md:hidden shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-md text-base font-medium text-cream-700 hover:bg-cream-100 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-cream-200 my-2" />
            <Button variant="outline" className="w-full mb-2">
              登录
            </Button>
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              免费试用
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

// 组件：底部移动导航栏 (TabBar)
function MobileTabBar() {
  const tabs = [
    { name: '首页', icon: Home, href: '#', active: true },
    { name: '快捷', icon: Zap, href: '#shortcuts' },
    { name: '发现', icon: Search, href: '#categories' },
    { name: '我的', icon: Users, href: '#profile' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-cream-500 hover:text-primary-600 transition-colors"
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// 组件：Banner 区域 (280px Desktop / 180px Mobile)
function Banner() {
  return (
    <section 
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      style={{ minHeight: '180px', maxHeight: '280px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-cream-50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cream-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl">
          <Badge 
            className="bg-primary-100 text-primary-800 hover:bg-primary-200 border-transparent"
            variant="outline"
          >
            🎉 v2.0 全新上线
          </Badge>
          
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-cream-900"
            style={{ lineHeight: '1.15' }}
          >
            管理项目 <span className="text-primary-600">从未如此简单</span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-cream-600 max-w-2xl mx-auto">
            TIANyu 为团队提供一站式项目管理解决方案，助您高效协作、快速交付。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 text-cream-50 h-12 px-8 text-base"
            >
              开始免费试用 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm"
            >
              了解更多
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// 组件：快捷功能区 (5个入口)
interface ShortcutCardProps {
  title: string
  description: string
  icon: React.ElementType
  color: string
  href: string
}

function ShortcutCard({ title, description, icon: Icon, color, href }: ShortcutCardProps) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }

  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-cream-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-cream-900 mb-2">{title}</h3>
      <p className="text-sm text-cream-500">{description}</p>
    </Link>
  )
}

function QuickShortcuts() {
  const shortcuts = [
    { title: '创建项目', description: '快速创建新项目', icon: Folder, color: 'orange', href: '#create' },
    { title: '任务列表', description: '查看所有任务', icon: List, color: 'blue', href: '#tasks' },
    { title: '团队协作', description: '邀请团队成员', icon: Users, color: 'purple', href: '#team' },
    { title: '数据分析', description: '查看项目报表', icon: TrendingUp, color: 'green', href: '#analytics' },
    { title: '设置', description: '配置个人偏好', icon: Settings, color: 'red', href: '#settings' },
  ]

  return (
    <section id="shortcuts" className="py-16 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-cream-900 mb-4">快捷功能</h2>
          <p className="text-cream-600">常用功能一触即达</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {shortcuts.map((shortcut) => (
            <ShortcutCard key={shortcut.title} {...shortcut} />
          ))}
        </div>
      </div>
    </section>
  )
}

// 组件：推荐工具区 (4列网格)
interface ToolCardProps {
  title: string
  description: string
  icon: React.ElementType
  users: string
  href: string
}

function ToolCard({ title, description, icon: Icon, users, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col p-5 rounded-2xl bg-white border border-cream-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-cream-50 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <Badge variant="outline" className="bg-cream-100 text-cream-700 border-cream-200">
          热门
        </Badge>
      </div>
      <h3 className="text-lg font-semibold text-cream-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-cream-500 mb-4 flex-grow">{description}</p>
      <div className="flex items-center text-xs text-cream-400">
        <Users className="h-3 w-3 mr-1" />
        {users} 用户
      </div>
    </Link>
  )
}

function RecommendedTools() {
  const tools = [
    { title: '项目看板', description: '直观的 Kanban 视图，轻松管理任务进度', users: '10k+', href: '#board', icon: Briefcase },
    { title: '甘特图', description: '清晰展示项目时间线和依赖关系', users: '8.5k+', href: '#gantt', icon: Calendar },
    { title: '文档协作', description: '实时编辑，多人协同撰写文档', users: '12k+', href: '#docs', icon: Share2 },
    { title: '任务追踪', description: '精细化任务管理，跟进每个细节', users: '9.2k+', href: '#tasks', icon: ArrowRight },
    { title: '数据分析', description: '多维度统计，洞察项目健康度', users: '7.8k+', href: '#analytics', icon: TrendingUp },
    { title: '团队管理', description: '高效团队协同，提升协作效率', users: '15k+', href: '#team', icon: Users },
    { title: '时间管理', description: '智能时间规划，告别拖延', users: '6.5k+', href: '#time', icon: Clock },
    { title: '目标设定', description: 'SMART 目标管理，持续改进', users: '5.3k+', href: '#goals', icon: Target },
  ]

  return (
    <section id="tools" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-cream-900 mb-3">推荐工具</h2>
            <p className="text-cream-600">精选高性价比项目管理工具</p>
          </div>
          <Link href="#all-tools" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
            查看全部 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  )
}

// 组件：分类浏览区
interface CategoryCardProps {
  title: string
  icon: React.ElementType
  count: string
  href: string
  color: string
}

function CategoryCard({ title, icon: Icon, count, href, color }: CategoryCardProps) {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  }

  return (
    <Link
      href={href}
      className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      style={{ border: '1px solid #f3f4f6' }}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-cream-900">{title}</h3>
          <p className="text-xs text-cream-500">{count} 个项目</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-cream-300" />
    </Link>
  )
}

function CategoryBrowse() {
  const categories = [
    { title: '软件开发', icon: Zap, count: '2.4k', href: '#dev', color: 'blue' },
    { title: '市场营销', icon: Target, count: '1.8k', href: '#marketing', color: 'orange' },
    { title: '产品管理', icon: Briefcase, count: '1.6k', href: '#product', color: 'purple' },
    { title: '设计创作', icon: Share2, count: '1.2k', href: '#design', color: 'red' },
    { title: '内容创作', icon: Calendar, count: '980', href: '#content', color: 'teal' },
    { title: '团队协作', icon: Users, count: '3.2k', href: '#team', color: 'green' },
    { title: '数据分析', icon: TrendingUp, count: '850', href: '#analytics', color: 'blue' },
    { title: '任务管理', icon: List, count: '2.1k', href: '#tasks', color: 'orange' },
  ]

  return (
    <section id="categories" className="py-16 md:py-24 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-cream-900 mb-4">分类浏览</h2>
          <p className="text-cream-600">按需选择合适的产品分类</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}

// 组件：工具特色介绍
function FeatureSection() {
  const features = [
    { title: '实时协作', description: '多人 simultaneous 编辑，秒级同步', icon: Users, color: 'primary' },
    { title: '智能提醒', description: '自动任务提醒，不错过任何截止日期', icon: Clock, color: 'primary' },
    { title: '数据分析', description: '多维度数据可视化，决策更有依据', icon: TrendingUp, color: 'primary' },
    { title: '安全可靠', description: '企业级数据加密，保障您的信息安全', icon: Shield, color: 'primary' },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-cream-900">
              为团队打造的<span className="text-primary-600">全能工具</span>
            </h2>
            <p className="text-cream-600 text-lg">
              TIANyu 提供完整的项目管理解决方案，满足不同规模团队的多样化需求。
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                    <feature.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream-900">{feature.title}</h3>
                    <p className="text-sm text-cream-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-orange-500 rounded-2xl transform rotate-3 opacity-20" />
            <div className="relative bg-cream-100 rounded-2xl p-8 border border-cream-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="h-8 w-8 bg-primary-100 rounded-lg mb-3" />
                  <div className="h-2 w-24 bg-cream-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-cream-100 rounded" />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg mb-3" />
                  <div className="h-2 w-24 bg-cream-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-cream-100 rounded" />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="h-8 w-8 bg-green-100 rounded-lg mb-3" />
                  <div className="h-2 w-24 bg-cream-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-cream-100 rounded" />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="h-8 w-8 bg-orange-100 rounded-lg mb-3" />
                  <div className="h-2 w-24 bg-cream-200 rounded mb-2" />
                  <div className="h-2 w-16 bg-cream-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 页面组件
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pb-24 md:pb-0">
        <Banner />
        <QuickShortcuts />
        <FeatureSection />
        <RecommendedTools />
        <CategoryBrowse />
        
        {/* 统计数据区域 */}
        <section className="py-16 md:py-24 bg-primary-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-cream-50">
                <div className="text-3xl md:text-4xl font-bold mb-2">10k+</div>
                <div className="text-primary-100 text-sm md:text-base">活跃用户</div>
              </div>
              <div className="text-cream-50">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-100 text-sm md:text-base">企业客户</div>
              </div>
              <div className="text-cream-50">
                <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
                <div className="text-primary-100 text-sm md:text-base">服务可用性</div>
              </div>
              <div className="text-cream-50">
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-100 text-sm md:text-base">支持服务</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <MobileTabBar />
    </div>
  )
}

export default HomePage
