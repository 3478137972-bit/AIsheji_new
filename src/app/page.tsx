'use client';

import { PenTool, Zap, Grid, BookOpen } from 'lucide-react';
import Link from 'next/link';

// 快捷功能卡片组件
function QuickActionCard({ 
  icon: Icon, 
  title, 
  desc, 
  href,
  gradient 
}: { 
  icon: any; 
  title: string; 
  desc: string; 
  href: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <div className={`card-hover p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white cursor-pointer`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Icon size={24} />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-white/80">{desc}</p>
      </div>
    </Link>
  );
}

// 模板卡片组件
function TemplateCard({ 
  image, 
  title, 
  tag 
}: { 
  image: string; 
  title: string; 
  tag: string;
}) {
  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer">
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute top-2 left-2 px-2 py-1 bg-tech-blue/90 text-white text-xs rounded-full">
          {tag}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-800 truncate">{title}</h4>
      </div>
    </div>
  );
}

export default function HomePage() {
  const quickActions = [
    {
      icon: PenTool,
      title: '自由创作',
      desc: 'AI 辅助，无限创意',
      href: '/create',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: '一键成片',
      desc: '输入文案，秒出视频',
      href: '/quick-video',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Grid,
      title: '智能工具',
      desc: '100+ AI 工具任选',
      href: '/smart-square',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: BookOpen,
      title: '模板中心',
      desc: '海量模板直接套用',
      href: '/templates',
      gradient: 'from-green-500 to-teal-500',
    },
  ];

  const templates = [
    { title: '产品宣传视频', tag: '热门' },
    { title: '社交媒体封面', tag: '新品' },
    { title: '节日贺卡', tag: '精选' },
    { title: '企业介绍片', tag: '商务' },
    { title: '教学演示视频', tag: '教育' },
    { title: '活动预告片', tag: '热门' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 主要内容区 */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl mx-auto">
        {/* 欢迎语 - 桌面端显示 */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">欢迎来到秒懂 AI 超级员工</h1>
          <p className="text-gray-600">开始你的 AI 创作之旅</p>
        </div>

        {/* 快捷功能网格 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">快捷功能</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </section>

        {/* 模板推荐 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">模板推荐</h2>
            <Link href="/templates" className="text-sm text-tech-blue font-medium hover:underline">
              查看更多 →
            </Link>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {templates.map((template, index) => (
              <TemplateCard 
                key={index}
                image={`/templates/${index}.jpg`}
                title={template.title}
                tag={template.tag}
              />
            ))}
          </div>
        </section>

        {/* 使用指南 */}
        <section className="bg-gradient-to-r from-tech-blue/10 to-tech-cyan/10 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-2">💡 新手指南</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-tech-blue text-white rounded-full text-xs flex items-center justify-center mr-2">1</span>
              选择创作模式：自由创作或一键成片
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-tech-blue text-white rounded-full text-xs flex items-center justify-center mr-2">2</span>
              输入你的创意或文案
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-tech-blue text-white rounded-full text-xs flex items-center justify-center mr-2">3</span>
              AI 智能生成，实时预览调整
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
