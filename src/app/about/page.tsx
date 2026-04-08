'use client';

import { 
  Heart, 
  Users, 
  Award, 
  Mail, 
  Globe, 
  MapPin,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const teamMembers = [
  { name: '张三', role: '创始人 & CEO', avatar: '👨‍💼' },
  { name: '李四', role: 'CTO', avatar: '👩‍💻' },
  { name: '王五', role: '产品总监', avatar: '👨‍🎨' },
  { name: '赵六', role: '技术负责人', avatar: '👩‍🔬' },
];

const milestones = [
  { date: '2025.01', event: '公司成立' },
  { date: '2025.03', event: '秒懂 AI 超级员工上线' },
  { date: '2025.06', event: '用户突破 10 万' },
  { date: '2025.09', event: '获得天使轮融资' },
  { date: '2025.12', event: '用户突破 50 万' },
  { date: '2026.03', event: '企业版发布' },
];

const stats = [
  { icon: Users, label: '注册用户', value: '500,000+' },
  { icon: Award, label: '生成作品', value: '2,000,000+' },
  { icon: Heart, label: '用户满意度', value: '98%' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">关于我们</h1>
          <p className="text-sm text-gray-500">了解秒懂 AI 的故事</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 品牌介绍 */}
        <div className="bg-gradient-to-br from-tech-blue to-tech-cyan rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-3">秒懂 AI 超级员工</h2>
          <p className="text-white/90 leading-relaxed mb-4">
            我们致力于让 AI 创作变得更简单。通过先进的人工智能技术，
            帮助用户快速生成高质量的视频、文案和设计内容，
            让每个人都能成为创意达人。
          </p>
          <div className="flex items-center space-x-2 text-sm text-white/80">
            <MapPin size={16} />
            <span>中国 · 北京</span>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-card text-center">
                <div className="w-10 h-10 rounded-xl bg-tech-blue/10 flex items-center justify-center mx-auto mb-2">
                  <Icon size={20} className="text-tech-blue" />
                </div>
                <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* 使命愿景 */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">使命与愿景</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800">使命</h3>
                <p className="text-sm text-gray-600 mt-1">
                  让 AI 创作触手可及，帮助每个人释放创意潜能
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-tech-cyan text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800">愿景</h3>
                <p className="text-sm text-gray-600 mt-1">
                  成为全球领先的 AI 创作平台，服务 1 亿创作者
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800">价值观</h3>
                <p className="text-sm text-gray-600 mt-1">
                  用户第一、创新驱动、诚信负责、协作共赢
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 发展历程 */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">发展历程</h2>
          <div className="space-y-4">
            {milestones.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 flex-shrink-0 text-sm font-medium text-tech-blue">
                  {item.date}
                </div>
                <div className="flex-1 h-px bg-gray-200 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-tech-blue rounded-full" />
                </div>
                <div className="flex-1 text-gray-700">{item.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 核心团队 */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">核心团队</h2>
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-2">{member.avatar}</div>
                <div className="font-medium text-gray-800">{member.name}</div>
                <div className="text-sm text-gray-500 mt-1">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">联系我们</h2>
          <div className="space-y-4">
            <a href="mailto:contact@example.com" className="flex items-center space-x-3 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors">
              <Mail size={20} className="text-tech-blue" />
              <span className="text-gray-700">contact@example.com</span>
            </a>
            <a href="#" className="flex items-center space-x-3 py-3 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors">
              <Globe size={20} className="text-tech-blue" />
              <span className="text-gray-700">www.example.com</span>
            </a>
            <div className="flex items-center space-x-3 py-3">
              <MapPin size={20} className="text-tech-blue" />
              <span className="text-gray-700">北京市海淀区中关村科技园</span>
            </div>
          </div>
        </div>

        {/* 社交媒体 */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">关注我们</h2>
          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Github size={20} className="text-gray-700" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Twitter size={20} className="text-gray-700" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Linkedin size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-400 mb-2">
            © 2025-2026 秒懂 AI. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <a href="#" className="hover:text-tech-blue">隐私政策</a>
            <span>·</span>
            <a href="#" className="hover:text-tech-blue">用户协议</a>
            <span>·</span>
            <a href="#" className="hover:text-tech-blue">京 ICP 备 xxxxxxxx 号</a>
          </div>
        </div>
      </div>
    </div>
  );
}
