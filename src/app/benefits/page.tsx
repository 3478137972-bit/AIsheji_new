'use client';

import { Crown, Zap, Infinity, Gift, Check, Star } from 'lucide-react';

const membershipPlans = [
  {
    id: 'free',
    name: '免费版',
    price: '0',
    period: '永久',
    icon: Gift,
    color: 'from-gray-400 to-gray-500',
    features: [
      '每日 10 点基础算力',
      '标准生成速度',
      '基础模板使用',
      '720P 导出',
      '社区支持',
    ],
    notIncluded: [
      '优先生成队列',
      '高级模板',
      '4K 导出',
      '商业授权',
      '专属客服',
    ],
    cta: '当前套餐',
    disabled: true,
  },
  {
    id: 'pro',
    name: '专业版',
    price: '39',
    period: '月',
    icon: Star,
    color: 'from-tech-blue to-tech-cyan',
    popular: true,
    features: [
      '每月 1000 点算力',
      '优先生成队列',
      '全部模板使用',
      '1080P 导出',
      '商业授权',
      '邮件支持',
      '无水印导出',
    ],
    notIncluded: [
      '4K 导出',
      '专属客服',
    ],
    cta: '立即升级',
    disabled: false,
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '199',
    period: '月',
    icon: Crown,
    color: 'from-yellow-400 to-orange-500',
    features: [
      '无限算力',
      '极速生成队列',
      '定制模板',
      '4K 导出',
      '商业授权',
      '专属客服',
      'API 访问',
      '团队协作',
      '数据看板',
    ],
    notIncluded: [],
    cta: '联系销售',
    disabled: false,
  },
];

const vipBenefits = [
  { icon: Zap, title: '极速生成', desc: 'VIP 专属队列，优先处理' },
  { icon: Infinity, title: '高级功能', desc: '解锁所有 AI 工具高级参数' },
  { icon: Gift, title: '专属模板', desc: '每周更新 VIP 专属模板' },
  { icon: Crown, title: '商业授权', desc: '生成内容可商用无顾虑' },
];

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">权益管理</h1>
          <p className="text-sm text-gray-500">升级会员，解锁更多 AI 能力</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-8">
        {/* 当前会员状态 */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Crown size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">VIP 会员</h2>
                <p className="text-white/80 text-sm">专业版 · 有效期至 2026.12.31</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold">856</div>
              <div className="text-white/70 text-xs">剩余算力</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold">12</div>
              <div className="text-white/70 text-xs">剩余天数</div>
            </div>
          </div>
        </div>

        {/* VIP 专属权益 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">VIP 专属权益</h2>
          <div className="grid grid-cols-2 gap-3">
            {vipBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-4 shadow-card">
                  <div className="w-10 h-10 bg-gradient-to-br from-tech-blue to-tech-cyan rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 会员套餐 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">会员套餐</h2>
          <div className="space-y-4">
            {membershipPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-card relative ${
                    plan.popular ? 'ring-2 ring-tech-blue' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-tech-blue text-white text-xs font-medium rounded-bl-xl">
                      最受欢迎
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-800">¥{plan.price}</span>
                            <span className="text-gray-500 ml-1">/{plan.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 功能列表 */}
                    <div className="space-y-2 mb-5">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check size={16} className="text-gray-300 mr-2 flex-shrink-0" />
                          <span className="text-gray-400 line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={plan.disabled}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        plan.disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${plan.color} text-white shadow-glow hover:shadow-lg`
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
