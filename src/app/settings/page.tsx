'use client';

import { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Globe, 
  Smartphone, 
  Wifi, 
  Database,
  ChevronRight,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

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
  right,
  onClick
}: {
  icon: any;
  title: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between py-4 border-b border-gray-100 last:border-0 ${
        onClick ? 'cursor-pointer hover:bg-gray-50 -mx-4 px-4' : ''
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon size={20} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {right || <ChevronRight size={20} className="text-gray-400" />}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,           // 深色模式
    notifications: true,       // 通知开关
    soundEnabled: true,        // 提示音
    vibration: true,           // 震动反馈
    autoPlay: true,            // 自动播放
    wifiOnly: false,           // 仅 WiFi 下载
    clearCache: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">通用设置</h1>
          <p className="text-sm text-gray-500">个性化您的使用体验</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 外观设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">外观设置</h2>
          <SettingItem
            icon={Moon}
            title="深色模式"
            description="切换深色/浅色主题"
            right={
              <ToggleSwitch 
                enabled={settings.darkMode} 
                onChange={(v) => updateSetting('darkMode', v)}
              />
            }
          />
          <SettingItem
            icon={Globe}
            title="语言"
            description="简体中文"
            right={<ChevronRight size={20} className="text-gray-400" />}
          />
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">通知设置</h2>
          <SettingItem
            icon={Bell}
            title="通知开关"
            description="接收系统通知和更新"
            right={
              <ToggleSwitch 
                enabled={settings.notifications} 
                onChange={(v) => updateSetting('notifications', v)}
              />
            }
          />
          <SettingItem
            icon={Bell}
            title="提示音"
            description="播放操作提示音"
            right={
              <ToggleSwitch 
                enabled={settings.soundEnabled} 
                onChange={(v) => updateSetting('soundEnabled', v)}
              />
            }
          />
          <SettingItem
            icon={Smartphone}
            title="震动反馈"
            description="操作时震动反馈"
            right={
              <ToggleSwitch 
                enabled={settings.vibration} 
                onChange={(v) => updateSetting('vibration', v)}
              />
            }
          />
        </div>

        {/* 播放设置 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">播放设置</h2>
          <SettingItem
            icon={Wifi}
            title="自动播放"
            description="WiFi 环境下自动播放视频"
            right={
              <ToggleSwitch 
                enabled={settings.autoPlay} 
                onChange={(v) => updateSetting('autoPlay', v)}
              />
            }
          />
          <SettingItem
            icon={Wifi}
            title="仅 WiFi 下载"
            description="仅在 WiFi 环境下下载内容"
            right={
              <ToggleSwitch 
                enabled={settings.wifiOnly} 
                onChange={(v) => updateSetting('wifiOnly', v)}
              />
            }
          />
        </div>

        {/* 存储管理 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">存储管理</h2>
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Database size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">缓存管理</h3>
                <p className="text-sm text-gray-500 mt-0.5">当前缓存：128.5 MB</p>
              </div>
            </div>
            {/* 缓存进度条 */}
            <div className="ml-13">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-tech-blue w-1/3 rounded-full" />
              </div>
            </div>
          </div>
          <SettingItem
            icon={Trash2}
            title="清除缓存"
            description="清理临时文件和缓存数据"
            right={
              <button className="px-4 py-2 bg-red-50 text-red-500 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
                清除
              </button>
            }
          />
          <SettingItem
            icon={Download}
            title="下载管理"
            description="查看和管理已下载内容"
          />
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">数据管理</h2>
          <SettingItem
            icon={Upload}
            title="数据备份"
            description="备份您的创作记录和设置"
            right={<ChevronRight size={20} className="text-gray-400" />}
          />
          <SettingItem
            icon={Download}
            title="数据恢复"
            description="从备份恢复数据"
            right={<ChevronRight size={20} className="text-gray-400" />}
          />
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">关于</h2>
          <SettingItem
            icon={Smartphone}
            title="版本号"
            description="v1.0.0"
            right={
              <span className="text-xs text-gray-400">已是最新版本</span>
            }
          />
          <SettingItem
            icon={Globe}
            title="检查更新"
          />
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-gray-400 pb-8">
          部分设置修改后需要重启应用生效
        </p>
      </div>
    </div>
  );
}
