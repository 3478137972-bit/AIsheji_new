'use client';

import { 
  User, 
  Crown, 
  Settings, 
  CreditCard, 
  Clock, 
  HelpCircle,
  ChevronRight,
  LogOut,
  Bell,
  Shield
} from 'lucide-react';

const menuGroups = [
  {
    title: '账户管理',
    items: [
      { icon: Crown, label: '我的权益', href: '/benefits', badge: 'VIP', badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
      { icon: CreditCard, label: '算力充值', href: '/recharge' },
      { icon: Clock, label: '使用记录', href: '/history' },
    ],
  },
  {
    title: '设置',
    items: [
      { icon: Bell, label: '消息通知', href: '/notifications' },
      { icon: Shield, label: '隐私设置', href: '/privacy' },
      { icon: Settings, label: '通用设置', href: '/settings' },
    ],
  },
  {
    title: '帮助',
    items: [
      { icon: HelpCircle, label: '帮助中心', href: '/help' },
      { icon: User, label: '关于我们', href: '/about' },
    ],
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 个人信息卡片 */}
      <div className="bg-gradient-to-br from-tech-blue to-tech-cyan px-4 pt-8 pb-16">
        <div className="flex items-center space-x-4">
          {/* 头像 */}
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
            U
          </div>
          
          {/* 信息 */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">用户名</h1>
            <p className="text-white/80 text-sm mb-2">ID: 88888888</p>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full flex items-center">
                <Crown size={12} className="mr-1" />
                VIP 会员
              </span>
              <span className="text-white/80 text-xs">有效期至 2026.12.31</span>
            </div>
          </div>
        </div>

        {/* 权益概览 */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">2,580</div>
            <div className="text-white/70 text-xs">剩余算力</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">156</div>
            <div className="text-white/70 text-xs">已生成作品</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-white text-lg font-bold">23</div>
            <div className="text-white/70 text-xs">收藏模板</div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="px-4 -mt-8 space-y-4">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-2xl overflow-hidden shadow-card">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500">{group.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <a
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`px-2 py-1 ${item.badgeColor} text-white text-xs rounded-full`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}

        {/* 退出登录 */}
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-4 bg-white rounded-2xl shadow-card text-red-500 font-medium">
          <LogOut size={20} />
          <span>退出登录</span>
        </button>

        {/* 版本信息 */}
        <p className="text-center text-sm text-gray-400 pb-8">
          秒懂 AI 超级员工 v1.0.0
        </p>
      </div>
    </div>
  );
}
