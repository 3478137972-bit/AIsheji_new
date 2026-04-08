'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, Settings, Zap, Gift, MessageCircle } from 'lucide-react';

// 通知数据类型
interface Notification {
  id: number;
  type: 'system' | 'activity' | 'message';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  icon?: any;
}

// 模拟数据
const notificationsData: Notification[] = [
  { 
    id: 1, 
    type: 'system', 
    title: '算力充值成功', 
    content: '您已成功充值 300 算力，赠送 30 算力已到账', 
    time: '10 分钟前',
    isRead: false,
    icon: Zap
  },
  { 
    id: 2, 
    type: 'activity', 
    title: '新模板上线', 
    content: '新增 6 个节日营销模板，快去看看吧', 
    time: '2 小时前',
    isRead: false,
    icon: Gift
  },
  { 
    id: 3, 
    type: 'message', 
    title: '系统消息', 
    content: '您的作品"产品宣传视频"已生成完成', 
    time: '昨天 15:30',
    isRead: true,
    icon: MessageCircle
  },
  { 
    id: 4, 
    type: 'system', 
    title: '会员到期提醒', 
    content: '您的 VIP 会员还有 7 天到期，及时续费享受优惠', 
    time: '昨天 09:00',
    isRead: true,
    icon: Bell
  },
  { 
    id: 5, 
    type: 'activity', 
    title: '活动通知', 
    content: '双 11 特惠活动即将开始，算力充值 5 折起', 
    time: '3 天前',
    isRead: true,
    icon: Gift
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredData = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-500';
      case 'activity': return 'bg-orange-500';
      case 'message': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">消息通知</h1>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} 条未读` : '暂无未读消息'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-tech-blue font-medium hover:underline"
                >
                  全部已读
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 筛选 Tab */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            全部消息
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            未读
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* 通知列表 */}
        <div className="space-y-3">
          {filteredData.map((notification) => {
            const Icon = notification.icon || Bell;
            
            return (
              <div 
                key={notification.id} 
                className={`bg-white rounded-2xl p-4 shadow-card ${!notification.isRead ? 'border-2 border-tech-blue/20' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {/* 图标 */}
                  <div className={`w-10 h-10 rounded-xl ${getTypeColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-tech-blue rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{notification.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500">
              {filter === 'unread' ? '暂无未读消息' : '暂无消息通知'}
            </p>
          </div>
        )}

        {/* 通知设置入口 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">通知设置</h3>
                <p className="text-sm text-gray-500">管理通知类型和接收方式</p>
              </div>
            </div>
            <Settings size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
