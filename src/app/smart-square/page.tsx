'use client';

import { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  MessageCircle,
  Video,
  FileText,
  Image,
  Star,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// 分类 Tab - 按业务场景（4 大分类）
const categories = [
  { id: 'all', name: '全部' },
  { id: 'boss', name: '老板必用' },
  { id: 'private', name: '私域变现' },
  { id: 'public', name: '公域获客' },
  { id: 'tools', name: '常用工具' },
];

// AI 智能体矩阵 - 按 4 大业务场景分类（23 个完整功能）
const aiAgents = [
  // ===== 老板必用 (6 个) =====
  {
    id: 1,
    category: 'boss',
    name: 'IP 账号定位',
    desc: '帮你找到最适合的 IP 定位方向',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    tag: '热门',
    usageCount: '2.3 万',
    targetPath: '/smart-square-form?type=ip-positioning'
  },
  {
    id: 2,
    category: 'boss',
    name: 'AI 商业思维',
    desc: '提升商业认知，洞察行业趋势',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    tag: '热门',
    usageCount: '1.8 万',
    targetPath: '/smart-square-form?type=business'
  },
  {
    id: 3,
    category: 'boss',
    name: '品牌故事创作',
    desc: '打造动人品牌故事',
    icon: FileText,
    color: 'from-violet-500 to-purple-500',
    usageCount: '7632',
    targetPath: '/smart-square-form?type=brand-story'
  },
  {
    id: 4,
    category: 'boss',
    name: '企业 IP 打造',
    desc: '塑造企业品牌形象',
    icon: Users,
    color: 'from-indigo-500 to-blue-500',
    tag: '新品',
    usageCount: '5421',
    targetPath: '/smart-square-form?type=enterprise-ip'
  },
  {
    id: 5,
    category: 'boss',
    name: '商业模式设计',
    desc: '设计创新商业模式',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-500',
    usageCount: '9876',
    targetPath: '/smart-square-form?type=business-model'
  },
  {
    id: 6,
    category: 'boss',
    name: '战略规划助手',
    desc: '制定企业战略规划',
    icon: TrendingUp,
    color: 'from-slate-500 to-gray-500',
    usageCount: '6543',
    targetPath: '/smart-square-form?type=strategy-plan'
  },
  
  // ===== 私域变现 (6 个) =====
  {
    id: 7,
    category: 'private',
    name: 'AI 卖点提炼',
    desc: '快速提炼产品核心卖点',
    icon: Zap,
    color: 'from-orange-500 to-amber-500',
    tag: '新品',
    usageCount: '8956',
    targetPath: '/smart-square-form?type=moment-marketing'
  },
  {
    id: 8,
    category: 'private',
    name: 'AI 营销话术',
    desc: '生成高转化营销文案',
    icon: MessageCircle,
    color: 'from-green-500 to-teal-500',
    tag: '热门',
    usageCount: '1.5 万',
    targetPath: '/smart-square-form?type=live-sales'
  },
  {
    id: 9,
    category: 'private',
    name: '社群运营助手',
    desc: '社群活跃与转化话术',
    icon: MessageCircle,
    color: 'from-emerald-500 to-green-500',
    usageCount: '1.1 万',
    targetPath: '/smart-square-form?type=moment-duplicate'
  },
  {
    id: 10,
    category: 'private',
    name: '私域裂变方案',
    desc: '设计私域裂变活动',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    tag: '热门',
    usageCount: '1.3 万',
    targetPath: '/smart-square-form?type=private-growth'
  },
  {
    id: 11,
    category: 'private',
    name: '客户画像分析',
    desc: '深度分析目标客户',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    usageCount: '8765',
    targetPath: '/smart-square-form?type=customer-profile'
  },
  {
    id: 12,
    category: 'private',
    name: '销售话术生成',
    desc: '高转化销售话术',
    icon: MessageCircle,
    color: 'from-red-500 to-pink-500',
    tag: '热门',
    usageCount: '1.7 万',
    targetPath: '/smart-square-form?type=live-sales'
  },
  
  // ===== 公域获客 (6 个) =====
  {
    id: 13,
    category: 'public',
    name: '短视频选题专家',
    desc: '帮你找到爆款视频选题',
    icon: Video,
    color: 'from-indigo-500 to-purple-500',
    tag: '热门',
    usageCount: '3.1 万',
    targetPath: '/smart-square-form?type=quick-video'
  },
  {
    id: 14,
    category: 'public',
    name: '抖音账号诊断',
    desc: '深度分析账号问题，给出优化建议',
    icon: TrendingUp,
    color: 'from-red-500 to-rose-500',
    usageCount: '1.2 万',
    targetPath: '/smart-square-form?type=douyin'
  },
  {
    id: 15,
    category: 'public',
    name: '小红书爆款笔记',
    desc: '生成小红书爆款内容',
    icon: FileText,
    color: 'from-red-500 to-pink-500',
    tag: '热门',
    usageCount: '2.8 万',
    targetPath: '/smart-square-form?type=xiaohongshu'
  },
  {
    id: 16,
    category: 'public',
    name: 'B 站视频策划',
    desc: 'B 站视频内容策划',
    icon: Video,
    color: 'from-blue-500 to-cyan-500',
    usageCount: '9876',
    targetPath: '/smart-square-form?type=quick-video'
  },
  {
    id: 17,
    category: 'public',
    name: '全网热点追踪',
    desc: '实时追踪全网热点',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    tag: '新品',
    usageCount: '1.5 万',
    targetPath: '/smart-square-form?type=inspiration'
  },
  {
    id: 18,
    category: 'public',
    name: 'SEO 优化助手',
    desc: '搜索引擎优化建议',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    usageCount: '7654',
    targetPath: '/smart-square-form?type=seo-optimization'
  },
  
  // ===== 常用工具 (5 个) =====
  {
    id: 19,
    category: 'tools',
    name: '朋友圈文案大师',
    desc: '每日朋友圈文案自动生成',
    icon: FileText,
    color: 'from-cyan-500 to-blue-500',
    tag: '热门',
    usageCount: '4.5 万',
    targetPath: '/smart-square-form?type=moment-rewrite'
  },
  {
    id: 20,
    category: 'tools',
    name: '海报文案生成',
    desc: '一键生成海报宣传文案',
    icon: Image,
    color: 'from-pink-500 to-rose-500',
    usageCount: '9823',
    targetPath: '/smart-square-form?type=poster'
  },
  {
    id: 21,
    category: 'tools',
    name: '周报总结助手',
    desc: '智能生成工作周报',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    tag: '热门',
    usageCount: '2.1 万',
    targetPath: '/smart-square-form?type=weekly-report'
  },
  {
    id: 22,
    category: 'tools',
    name: 'PPT 大纲生成',
    desc: '快速生成 PPT 框架',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    usageCount: '1.6 万',
    targetPath: '/smart-square-form?type=ppt-outline'
  },
  {
    id: 23,
    category: 'tools',
    name: '活动策划方案',
    desc: '完整活动策划生成',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    tag: '新品',
    usageCount: '8765',
    targetPath: '/smart-square-form?type=event-plan'
  },
];

export default function SmartSquarePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAgents = selectedCategory === 'all'
    ? aiAgents
    : aiAgents.filter(agent => agent.category === selectedCategory);

  return (
    <div className="min-h-screen bg-beige-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">AI 智能体广场</h1>
          <p className="text-sm text-neutral-600">100+ AI 员工，赋能业务全流程</p>
        </div>

        {/* 分类 Tab */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 智能体网格 */}
      <div className="px-4 py-4">
        {/* 统计信息 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            共 <span className="font-semibold text-primary">{aiAgents.length}</span> 个 AI 智能体
          </p>
        </div>

        {/* 智能体卡片网格 */}
        <div className="grid grid-cols-2 gap-3">
          {filteredAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Link 
                key={agent.id} 
                href={agent.targetPath}
                className="card-hover bg-white rounded-xl p-3 shadow-card cursor-pointer relative overflow-hidden border border-neutral-200"
              >
                {/* 热门标签 */}
                {agent.tag && (
                  <div className={`absolute top-2 right-2 flex items-center px-1.5 py-0.5 text-xs rounded-md ${
                    agent.tag === '热门' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  }`}>
                    <Star size={10} className="mr-0.5" />
                    {agent.tag}
                  </div>
                )}

                {/* 图标 */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-2`}>
                  <Icon size={20} className="text-white" />
                </div>

                {/* 名称和描述 */}
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">{agent.name}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{agent.desc}</p>

                {/* 使用数据 */}
                <div className="flex items-center text-xs text-neutral-400 mb-2">
                  <Users size={12} className="mr-1" />
                  {agent.usageCount}人已使用
                </div>

                {/* 使用按钮 */}
                <button className="w-full py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-medium rounded-lg transition-colors flex items-center justify-center">
                  立即使用
                  <ArrowRight size={12} className="ml-1" />
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
