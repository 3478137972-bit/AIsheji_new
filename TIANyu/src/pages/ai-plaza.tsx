import React, { useState } from 'react';
import { Header, TabBar } from '@/components/Layout';
import { AIToolCard } from '@/components/Card';
import { Tabs } from '@/components/Tabs';
import { Badge } from '@/components/Badge';

export default function AIPlazaPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: '全部' },
    { id: 'boss', label: '老板必用' },
    { id: 'private', label: '私域变现' },
    { id: 'public', label: '公域获客' },
    { id: 'utility', label: '实用' },
  ];
  
  const aiTools = [
    {
      id: 1,
      title: 'IP 账号定位',
      description: '帮你设计账号 IP 定位',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 2,
      title: 'AI 爆款选题',
      description: '洞察赛道，赋能爆款选题生产',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 3,
      title: 'AI 卖点提炼',
      description: '洞见价值，精准提炼核心卖点',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 4,
      title: 'AI 直播脚本',
      description: '一键生产专业直播稿',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 5,
      title: '短视频选题专家',
      description: '打开你的选题思路',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 6,
      title: '抖音博主账号拆解',
      description: '360°无死角拆解博主账号',
      badge: { text: '老板必用', type: 'premium' as const },
    },
    {
      id: 7,
      title: '短视频批量二创',
      description: '批量生成二创视频',
      badge: { text: '绿色', type: 'green' as const },
    },
    {
      id: 8,
      title: '小红书账号分析',
      description: '深度分析小红书账号',
      badge: { text: '红色', type: 'premium' as const },
    },
  ];
  
  return (
    <div className="min-h-screen pb-20">
      <Header title="AI 智能体广场" />
      
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {/* 分类 Tab */}
        <div className="mb-6 overflow-x-auto">
          <Tabs
            tabs={categories}
            activeTab={activeCategory}
            onChange={setActiveCategory}
            variant="cream"
          />
        </div>
        
        {/* AI 工具网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {aiTools.map((tool) => (
            <AIToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              badge={tool.badge}
            />
          ))}
        </div>
      </main>
      
      <TabBar />
    </div>
  );
}
