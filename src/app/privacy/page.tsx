'use client';

import { useState } from 'react';
import { Lock, Eye, UserX, Shield, Globe, Bell } from 'lucide-react';

// 开关组件
function ToggleSwitch({ 
  enabled, 
  onChange 
}: { 
  enabled: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-tech-blue' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );
}

// 设置项组件
function SettingItem({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: any;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState({
    profileVisible: true,      // 主页可见
    activityVisible: false,    // 活动状态可见
    allowMessages: true,       // 允许私信
    showOnlineStatus: true,    // 显示在线状态
    allowTagging: true,        // 允许被@
    dataTracking: false,       // 数据追踪
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">隐私设置</h1>
          <p className="text-sm text-gray-500">管理您的隐私权限</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 可见性设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">可见性设置</h2>
          <SettingItem
            icon={Eye}
            title="主页可见"
            description="其他人可以查看您的个人主页"
          >
            <ToggleSwitch 
              enabled={settings.profileVisible} 
              onChange={(v) => updateSetting('profileVisible', v)}
            />
          </SettingItem>
          <SettingItem
            icon={UserX}
            title="活动状态可见"
            description="显示您的在线活动和创作记录"
          >
            <ToggleSwitch 
              enabled={settings.activityVisible} 
              onChange={(v) => updateSetting('activityVisible', v)}
            />
          </SettingItem>
          <SettingItem
            icon={Globe}
            title="显示在线状态"
            description="他人可以看到您是否在线"
          >
            <ToggleSwitch 
              enabled={settings.showOnlineStatus} 
              onChange={(v) => updateSetting('showOnlineStatus', v)}
            />
          </SettingItem>
        </div>

        {/* 互动权限 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">互动权限</h2>
          <SettingItem
            icon={MessageCircle}
            title="允许私信"
            description="允许其他用户给您发送私信"
          >
            <ToggleSwitch 
              enabled={settings.allowMessages} 
              onChange={(v) => updateSetting('allowMessages', v)}
            />
          </SettingItem>
          <SettingItem
            icon={Bell}
            title="允许被@"
            description="允许其他用户在评论中@您"
          >
            <ToggleSwitch 
              enabled={settings.allowTagging} 
              onChange={(v) => updateSetting('allowTagging', v)}
            />
          </SettingItem>
        </div>

        {/* 数据隐私 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">数据隐私</h2>
          <SettingItem
            icon={Shield}
            title="个性化推荐"
            description="根据您的使用习惯推荐内容"
          >
            <ToggleSwitch 
              enabled={settings.dataTracking} 
              onChange={(v) => updateSetting('dataTracking', v)}
            />
          </SettingItem>
          <SettingItem
            icon={Lock}
            title="数据导出"
            description="导出您的个人数据和使用记录"
          >
            <button className="text-tech-blue text-sm font-medium hover:underline">
              导出数据 →
            </button>
          </SettingItem>
          <SettingItem
            icon={UserX}
            title="账号注销"
            description="永久删除账号和所有数据"
          >
            <button className="text-red-500 text-sm font-medium hover:underline">
              注销账号 →
            </button>
          </SettingItem>
        </div>

        {/* 隐私政策 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">隐私政策</h2>
          <div className="space-y-2">
            <a href="#" className="block py-3 text-gray-700 hover:text-tech-blue border-b border-gray-100 last:border-0">
              隐私政策条款 →
            </a>
            <a href="#" className="block py-3 text-gray-700 hover:text-tech-blue border-b border-gray-100 last:border-0">
              用户协议 →
            </a>
            <a href="#" className="block py-3 text-gray-700 hover:text-tech-blue">
              数据安全说明 →
            </a>
          </div>
        </div>

        {/* 最后更新 */}
        <p className="text-center text-xs text-gray-400 pb-8">
          最后更新：2026 年 4 月 1 日
        </p>
      </div>
    </div>
  );
}

function MessageCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
