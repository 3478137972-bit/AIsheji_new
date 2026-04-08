'use client';

import { useState } from 'react';
import { 
  Image, 
  Video, 
  FileText, 
  Palette, 
  Music, 
  Type,
  Sparkles,
  Zap
} from 'lucide-react';

const categories = [
  { id: 'all', name: '全部', icon: Sparkles },
  { id: 'image', name: '图像', icon: Image },
  { id: 'video', name: '视频', icon: Video },
  { id: 'text', name: '文案', icon: FileText },
  { id: 'design', name: '设计', icon: Palette },
  { id: 'audio', name: '音频', icon: Music },
  { id: 'font', name: '字体', icon: Type },
];

const tools = [
  {
    id: 1,
    category: 'image',
    name: 'AI Logo 设计',
    desc: '智能生成品牌 Logo',
    icon: Palette,
    gradient: 'from-blue-500 to-cyan-500',
    popular: true,
  },
  {
    id: 2,
    category: 'video',
    name: '一键成片',
    desc: '文案转视频，秒级生成',
    icon: Video,
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 3,
    category: 'image',
    name: 'AI 插画生成',
    desc: '文字描述生成精美插画',
    icon: Image,
    gradient: 'from-green-500 to-teal-500',
    popular: false,
  },
  {
    id: 4,
    category: 'text',
    name: '智能文案',
    desc: '营销文案自动生成',
    icon: FileText,
    gradient: 'from-orange-500 to-red-500',
    popular: true,
  },
  {
    id: 5,
    category: 'design',
    name: '海报设计',
    desc: '活动海报快速制作',
    icon: Palette,
    gradient: 'from-indigo-500 to-purple-500',
    popular: false,
  },
  {
    id: 6,
    category: 'image',
    name: '商品套图',
    desc: '电商产品图批量生成',
    icon: Image,
    gradient: 'from-pink-500 to-rose-500',
    popular: true,
  },
  {
    id: 7,
    category: 'font',
    name: 'AI 字体设计',
    desc: '创意字体一键生成',
    icon: Type,
    gradient: 'from-cyan-500 to-blue-500',
    popular: false,
  },
  {
    id: 8,
    category: 'audio',
    name: 'AI 配音',
    desc: '文本转自然语音',
    icon: Music,
    gradient: 'from-amber-500 to-orange-500',
    popular: true,
  },
  {
    id: 9,
    category: 'video',
    name: '视频剪辑',
    desc: '智能剪辑与特效',
    icon: Video,
    gradient: 'from-red-500 to-pink-500',
    popular: false,
  },
  {
    id: 10,
    category: 'image',
    name: 'IP 形象设计',
    desc: '品牌 IP 角色创作',
    icon: Image,
    gradient: 'from-violet-500 to-purple-500',
    popular: true,
  },
  {
    id: 11,
    category: 'text',
    name: '标题生成器',
    desc: '爆款标题智能创作',
    icon: FileText,
    gradient: 'from-emerald-500 to-green-500',
    popular: false,
  },
  {
    id: 12,
    category: 'design',
    name: '包装设计',
    desc: '产品包装智能设计',
    icon: Palette,
    gradient: 'from-sky-500 to-blue-500',
    popular: false,
  },
];

export default function SmartSquarePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">智能广场</h1>
          <p className="text-sm text-gray-500">100+ AI 工具，赋能创作全流程</p>
        </div>

        {/* 分类 Tab */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-tech-blue text-white shadow-glow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 工具网格 */}
      <div className="px-4 py-4">
        {/* 搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索 AI 工具..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tech-blue focus:border-transparent"
          />
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-2 gap-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="card-hover bg-white rounded-2xl p-4 shadow-card cursor-pointer relative overflow-hidden"
              >
                {/* 热门标签 */}
                {tool.popular && (
                  <div className="absolute top-2 right-2 flex items-center px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full">
                    <Zap size={12} className="mr-1" />
                    热门
                  </div>
                )}

                {/* 图标 */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3`}>
                  <Icon size={24} className="text-white" />
                </div>

                {/* 名称和描述 */}
                <h3 className="font-semibold text-gray-800 mb-1">{tool.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{tool.desc}</p>

                {/* 使用按钮 */}
                <button className="mt-3 w-full py-2 bg-gray-50 hover:bg-tech-blue hover:text-white text-gray-600 text-sm font-medium rounded-lg transition-colors">
                  立即使用
                </button>
              </div>
            );
          })}
        </div>

        {/* 加载更多 */}
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            加载更多工具
          </button>
        </div>
      </div>
    </div>
  );
}
