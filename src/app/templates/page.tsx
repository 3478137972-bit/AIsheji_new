'use client';

import { useState } from 'react';
import { Search, Film, FileText, Palette, Star, Play, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

// 模板数据类型
interface Template {
  id: number;
  title: string;
  category: 'video' | 'text' | 'design';
  subCategory: string;
  cover: string;
  usageCount: number;
  description: string;
  tags: string[];
  presetData: {
    style?: string;
    ratio?: string;
    prompt?: string;
    type?: string;
  };
}

// 模板数据（前端写死，后期可改后端）
const templatesData: Template[] = [
  // 视频模板
  {
    id: 1,
    title: '产品宣传视频',
    category: 'video',
    subCategory: '营销推广',
    cover: '/templates/video-product.jpg',
    usageCount: 2341,
    description: '专业级产品展示，突出核心卖点',
    tags: ['热门', '营销'],
    presetData: { style: 'modern', ratio: '9:16', prompt: '展示产品特点和优势，突出核心价值' }
  },
  {
    id: 2,
    title: '节日祝福视频',
    category: 'video',
    subCategory: '节日热点',
    cover: '/templates/video-festival.jpg',
    usageCount: 1876,
    description: '节日营销必备，温馨有温度',
    tags: ['节日', '祝福'],
    presetData: { style: 'warm', ratio: '9:16', prompt: '节日祝福内容，传递温暖情感' }
  },
  {
    id: 3,
    title: '知识分享视频',
    category: 'video',
    subCategory: '教育科普',
    cover: '/templates/video-education.jpg',
    usageCount: 1523,
    description: '清晰易懂的知识讲解模板',
    tags: ['教育', '科普'],
    presetData: { style: 'minimal', ratio: '16:9', prompt: '知识点讲解，逻辑清晰，通俗易懂' }
  },
  {
    id: 4,
    title: '品牌故事视频',
    category: 'video',
    subCategory: '品牌宣传',
    cover: '/templates/video-brand.jpg',
    usageCount: 1287,
    description: '讲述品牌故事，建立情感连接',
    tags: ['品牌', '故事'],
    presetData: { style: 'creative', ratio: '16:9', prompt: '品牌发展历程，核心价值观传递' }
  },
  {
    id: 5,
    title: '活动预告视频',
    category: 'video',
    subCategory: '活动宣传',
    cover: '/templates/video-event.jpg',
    usageCount: 1156,
    description: '活动预热引流，制造期待感',
    tags: ['活动', '预告'],
    presetData: { style: 'tech', ratio: '9:16', prompt: '活动亮点介绍，时间地点清晰展示' }
  },
  {
    id: 6,
    title: '客户见证视频',
    category: 'video',
    subCategory: '口碑营销',
    cover: '/templates/video-testimonial.jpg',
    usageCount: 987,
    description: '真实客户反馈，增强信任感',
    tags: ['口碑', '见证'],
    presetData: { style: 'warm', ratio: '1:1', prompt: '客户使用体验，真实感受和效果' }
  },
  
  // 文案模板
  {
    id: 7,
    title: '朋友圈营销文案',
    category: 'text',
    subCategory: '营销文案',
    cover: '/templates/text-marketing.jpg',
    usageCount: 3421,
    description: '高转化朋友圈文案模板',
    tags: ['热门', '营销'],
    presetData: { type: 'marketing', prompt: '产品卖点 + 用户痛点 + 限时优惠' }
  },
  {
    id: 8,
    title: '小红书种草文案',
    category: 'text',
    subCategory: '社交媒体',
    cover: '/templates/text-xiaohongshu.jpg',
    usageCount: 2987,
    description: '小红书风格种草笔记',
    tags: ['小红书', '种草'],
    presetData: { type: 'social', prompt: '真实体验分享，emoji 点缀，标签引流' }
  },
  {
    id: 9,
    title: '直播引流话术',
    category: 'text',
    subCategory: '直播运营',
    cover: '/templates/text-live.jpg',
    usageCount: 2156,
    description: '直播间引流爆单话术',
    tags: ['直播', '引流'],
    presetData: { type: 'live', prompt: '开场留人 + 产品介绍 + 促单话术' }
  },
  {
    id: 10,
    title: '短视频脚本',
    category: 'text',
    subCategory: '视频文案',
    cover: '/templates/text-script.jpg',
    usageCount: 1876,
    description: '爆款短视频脚本结构',
    tags: ['脚本', '短视频'],
    presetData: { type: 'script', prompt: '黄金 3 秒开头 + 内容展开 + 互动引导' }
  },
  {
    id: 11,
    title: '节日祝福文案',
    category: 'text',
    subCategory: '节日热点',
    cover: '/templates/text-festival.jpg',
    usageCount: 1654,
    description: '节日借势营销文案',
    tags: ['节日', '祝福'],
    presetData: { type: 'festival', prompt: '节日祝福 + 品牌关联 + 优惠活动' }
  },
  {
    id: 12,
    title: '产品介绍文案',
    category: 'text',
    subCategory: '产品推广',
    cover: '/templates/text-product.jpg',
    usageCount: 1432,
    description: '产品卖点清晰展示',
    tags: ['产品', '介绍'],
    presetData: { type: 'product', prompt: '核心卖点 + 使用场景 + 用户评价' }
  },
  
  // 设计模板
  {
    id: 13,
    title: '产品海报',
    category: 'design',
    subCategory: '营销海报',
    cover: '/templates/design-poster.jpg',
    usageCount: 1876,
    description: '产品促销海报模板',
    tags: ['海报', '营销'],
    presetData: { type: 'poster', prompt: '产品主图 + 核心卖点 + 价格信息' }
  },
  {
    id: 14,
    title: '活动封面',
    category: 'design',
    subCategory: '活动宣传',
    cover: '/templates/design-cover.jpg',
    usageCount: 1543,
    description: '活动宣传封面设计',
    tags: ['封面', '活动'],
    presetData: { type: 'cover', prompt: '活动主题 + 时间地点 + 视觉冲击' }
  },
  {
    id: 15,
    title: '知识卡片',
    category: 'design',
    subCategory: '内容分享',
    cover: '/templates/design-card.jpg',
    usageCount: 1287,
    description: '知识点卡片设计',
    tags: ['知识', '卡片'],
    presetData: { type: 'card', prompt: '核心观点 + 简洁排版 + 品牌标识' }
  },
  {
    id: 16,
    title: '日签海报',
    category: 'design',
    subCategory: '日常运营',
    cover: '/templates/design-daily.jpg',
    usageCount: 1156,
    description: '每日签到/日签模板',
    tags: ['日签', '日常'],
    presetData: { type: 'daily', prompt: '励志语录 + 日期 + 品牌元素' }
  },
];

const categories = [
  { id: 'all', name: '全部', icon: Zap },
  { id: 'video', name: '视频', icon: Film },
  { id: 'text', name: '文案', icon: FileText },
  { id: 'design', name: '设计', icon: Palette },
];

const subCategories = [
  '全部',
  '营销推广',
  '节日热点',
  '教育科普',
  '品牌宣传',
  '活动宣传',
  '口碑营销',
  '社交媒体',
  '直播运营',
  '视频文案',
  '产品推广',
  '营销海报',
  '内容分享',
  '日常运营',
];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredTemplates = templatesData.filter(template => {
    const matchCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchSubCategory = selectedSubCategory === '全部' || template.subCategory === selectedSubCategory;
    const matchSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchCategory && matchSubCategory && matchSearch;
  });

  const getTargetPath = (template: Template) => {
    switch (template.category) {
      case 'video':
        return `/quick-video?template=${template.id}`;
      case 'text':
        return `/create?type=text&template=${template.id}`;
      case 'design':
        return `/create?type=design&template=${template.id}`;
      default:
        return '/create';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* 页面标题 - 桌面端显示 */}
        <div className="hidden lg:block mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">模板中心</h1>
          <p className="text-neutral-600">海量模板，一键套用</p>
        </div>

        {/* 搜索框 */}
        <div className="relative max-w-2xl">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板名称、标签..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* 分类 Tab */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubCategory('全部');
                }}
                className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <Icon size={18} className="mr-2" />
                <span className="font-medium text-sm md:text-base">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* 子分类筛选 */}
        <div className="flex flex-wrap gap-2">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedSubCategory === sub
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* 热门标签 */}
        <div className="flex flex-wrap gap-2">
          {['热门', '营销', '节日', '新品', '推荐'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1 bg-orange-50 text-orange-600 text-sm rounded-full hover:bg-orange-100 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 模板列表 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {filteredTemplates.map((template) => (
            <Link 
              key={template.id} 
              href={getTargetPath(template)}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all group-hover:-translate-y-1">
                {/* 封面图 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {template.category === 'video' && <Film size={48} className="text-gray-400" />}
                    {template.category === 'text' && <FileText size={48} className="text-gray-400" />}
                    {template.category === 'design' && <Palette size={48} className="text-gray-400" />}
                  </div>
                  
                  {/* 标签 */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {template.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          tag === '热门' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-tech-blue/90 text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 收藏按钮 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(template.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart 
                      size={16} 
                      className={favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                  
                  {/* 使用次数 */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs flex items-center">
                    <Play size={12} className="mr-1" />
                    {template.usageCount.toLocaleString()}
                  </div>
                </div>
                
                {/* 信息区 */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 truncate mb-1">{template.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{template.subCategory}</span>
                    <span className="text-xs text-tech-blue font-medium group-hover:translate-x-1 transition-transform">
                      使用 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 空状态 */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500">暂无匹配的模板</p>
            <p className="text-sm text-gray-400 mt-2">试试其他关键词或分类</p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="text-center text-sm text-gray-400 pb-8">
          共 {filteredTemplates.length} 个模板
        </div>
      </div>
    </div>
  );
}
