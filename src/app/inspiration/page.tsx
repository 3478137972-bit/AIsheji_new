'use client';

import { useState } from 'react';
import { TrendingUp, Flame, Clock, Star } from 'lucide-react';

const platforms = [
  { id: 'all', name: '全部' },
  { id: 'douyin', name: '抖音' },
  { id: 'xiaohongshu', name: '小红书' },
  { id: 'bilibili', name: 'B 站' },
  { id: 'weibo', name: '微博' },
];

const hotTopics = [
  {
    id: 1,
    platform: 'douyin',
    rank: 1,
    title: 'AI 生成视频爆火，创作者如何抓住机遇？',
    heat: '2345.6w',
    trend: 'up',
    tags: ['AI 创作', '视频制作'],
  },
  {
    id: 2,
    platform: 'xiaohongshu',
    rank: 2,
    title: '打工人必备！5 分钟搞定周报 PPT',
    heat: '1892.3w',
    trend: 'up',
    tags: ['职场', '效率工具'],
  },
  {
    id: 3,
    platform: 'bilibili',
    rank: 3,
    title: '用 AI 画出了我心中的二次元世界',
    heat: '1567.8w',
    trend: 'stable',
    tags: ['AI 绘画', '二次元'],
  },
  {
    id: 4,
    platform: 'douyin',
    rank: 4,
    title: '春节营销文案大全，直接套用！',
    heat: '1234.5w',
    trend: 'down',
    tags: ['营销', '文案'],
  },
  {
    id: 5,
    platform: 'weibo',
    rank: 5,
    title: '2026 年最火的 AI 工具盘点',
    heat: '987.2w',
    trend: 'up',
    tags: ['AI 工具', '科技'],
  },
  {
    id: 6,
    platform: 'xiaohongshu',
    rank: 6,
    title: '零基础做自媒体，从这条开始',
    heat: '876.4w',
    trend: 'up',
    tags: ['自媒体', '教程'],
  },
];

export default function InspirationPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const filteredTopics = selectedPlatform === 'all' 
    ? hotTopics 
    : hotTopics.filter(t => t.platform === selectedPlatform);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-red-500';
    if (rank === 2) return 'bg-orange-500';
    if (rank === 3) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-red-500" />;
    if (trend === 'down') return <TrendingUp size={16} className="text-green-500 rotate-180" />;
    return <Clock size={16} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">热点灵感</h1>
          <p className="text-sm text-gray-500">追踪全网热点，获取创作灵感</p>
        </div>

        {/* 平台切换 Tab */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedPlatform === platform.id
                    ? 'bg-tech-blue text-white shadow-glow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 热点列表 */}
      <div className="px-4 py-4 space-y-3">
        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>今日热点 {filteredTopics.length} 个</span>
          <span className="flex items-center">
            <Flame size={16} className="text-orange-500 mr-1" />
            实时更新
          </span>
        </div>

        {/* 热点卡片列表 */}
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl p-4 shadow-card card-hover cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {/* 排名 */}
              <div className={`flex-shrink-0 w-8 h-8 ${getRankColor(topic.rank)} rounded-lg flex items-center justify-center text-white font-bold`}>
                {topic.rank}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">
                  {topic.title}
                </h3>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {topic.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Flame size={14} className="text-orange-500 mr-1" />
                      {topic.heat}
                    </span>
                    {getTrendIcon(topic.trend)}
                  </div>
                  <button className="text-tech-blue text-sm font-medium">
                    使用此灵感 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
