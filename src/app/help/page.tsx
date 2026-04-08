'use client';

import { useState } from 'react';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// FAQ 数据
const faqData = [
  {
    category: '新手入门',
    questions: [
      {
        q: '如何开始第一次创作？',
        a: '在首页选择"自由创作"或"一键成片"，输入您的创意或文案，AI 将自动为您生成内容。首次使用建议先查看新手指南。'
      },
      {
        q: '算力是什么？如何获取？',
        a: '算力是用于 AI 创作的虚拟货币。不同创作类型消耗不同算力（文案 1-5 点，图像 5-10 点，视频 10-50 点）。可通过充值或活动获取。'
      },
      {
        q: '生成的内容可以商用吗？',
        a: '可以。您使用秒懂 AI 生成的所有内容都归您所有，可用于商业用途。但请确保输入的内容不侵犯他人权益。'
      },
    ]
  },
  {
    category: '创作相关',
    questions: [
      {
        q: '视频生成需要多长时间？',
        a: '视频生成通常需要 30-60 秒，具体时长取决于视频长度和复杂度。生成过程中请勿关闭页面。'
      },
      {
        q: '如何优化生成效果？',
        a: '提供详细的描述和提示词，选择合适的风格和参数。可以参考模板中心的优质模板学习最佳实践。'
      },
      {
        q: '生成不满意可以重新生成吗？',
        a: '可以。每次重新生成都需要消耗相应算力。建议先调整参数和提示词后再试。'
      },
    ]
  },
  {
    category: '账户与付费',
    questions: [
      {
        q: 'VIP 会员有什么权益？',
        a: 'VIP 会员享有更多算力、优先生成、专属模板、高清下载等权益。详见"我的权益"页面。'
      },
      {
        q: '充值的算力会过期吗？',
        a: '充值的算力永久有效，不会过期。但赠送的算力可能有有效期，请注意查看。'
      },
      {
        q: '如何申请退款？',
        a: '如遇到技术问题导致无法使用，可联系客服申请退款。已消耗的算力不支持退款。'
      },
    ]
  },
  {
    category: '技术支持',
    questions: [
      {
        q: '生成失败怎么办？',
        a: '生成失败会退还消耗的算力。如频繁失败，请检查网络连接或联系客服处理。'
      },
      {
        q: '支持哪些浏览器？',
        a: '推荐使用 Chrome、Safari、Edge 等现代浏览器的最新版本。不支持 IE 浏览器。'
      },
      {
        q: '如何导出我的作品？',
        a: '在"使用记录"中找到作品，点击下载按钮即可。支持 MP4、JPG、PNG 等格式。'
      },
    ]
  },
];

const contactMethods = [
  { icon: MessageCircle, name: '在线客服', desc: '工作日 9:00-18:00', color: 'bg-green-500' },
  { icon: Phone, name: '电话咨询', desc: '400-xxx-xxxx', color: 'bg-blue-500' },
  { icon: Mail, name: '邮件支持', desc: 'support@example.com', color: 'bg-orange-500' },
  { icon: Video, name: '视频教程', desc: '查看详细教程', color: 'bg-purple-500' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">帮助中心</h1>
          <p className="text-sm text-gray-500">有任何问题？我们在这里帮助您</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 搜索框 */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索问题或关键词..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tech-blue"
          />
        </div>

        {/* 联系方式 */}
        <div className="grid grid-cols-2 gap-3">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-card">
                <div className={`w-10 h-10 rounded-xl ${method.color} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-medium text-gray-800">{method.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 快捷入口 */}
        <div className="bg-gradient-to-br from-tech-blue to-tech-cyan rounded-2xl p-5 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Book size={24} />
            <h2 className="text-lg font-bold">新手指南</h2>
          </div>
          <p className="text-white/90 text-sm mb-4">
            第一次使用？花 3 分钟了解如何快速上手
          </p>
          <button className="w-full py-3 bg-white/20 backdrop-blur rounded-xl font-medium hover:bg-white/30 transition-colors">
            查看新手教程 →
          </button>
        </div>

        {/* 常见问题 */}
        <div className="space-y-4">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-2xl p-4 shadow-card">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center">
                <FileText size={20} className="text-tech-blue mr-2" />
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = catIndex * 10 + faqIndex;
                  const isExpanded = expandedIndex === globalIndex;
                  
                  return (
                    <div key={faqIndex} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 仍有问题 */}
        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">仍有问题？</h3>
          <p className="text-gray-600 mb-4">我们的客服团队随时为您服务</p>
          <button className="px-8 py-3 bg-gradient-to-r from-tech-blue to-tech-cyan text-white font-medium rounded-xl hover:shadow-lg transition-all">
            联系客服
          </button>
        </div>

        {/* 底部反馈 */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-400 mb-2">这篇帮助对您有用吗？</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
              👍 有用
            </button>
            <button className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              👎 无用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
