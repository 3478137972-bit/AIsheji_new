'use client';

import { useState } from 'react';
import { Film, FileText, Palette, Clock, Trash2, Download, ExternalLink } from 'lucide-react';

// 历史记录数据类型
interface HistoryItem {
  id: number;
  type: 'video' | 'text' | 'design';
  title: string;
  createdAt: string;
  status: 'completed' | 'generating' | 'failed';
  cost: number;
  thumbnail?: string;
}

// 模拟数据
const historyData: HistoryItem[] = [
  { id: 1, type: 'video', title: '产品宣传视频 - 现代简约', createdAt: '2026-04-08 10:30', status: 'completed', cost: 10 },
  { id: 2, type: 'text', title: '朋友圈营销文案', createdAt: '2026-04-08 09:15', status: 'completed', cost: 2 },
  { id: 3, type: 'design', title: '产品海报设计', createdAt: '2026-04-07 16:45', status: 'completed', cost: 5 },
  { id: 4, type: 'video', title: '节日祝福视频', createdAt: '2026-04-07 14:20', status: 'completed', cost: 10 },
  { id: 5, type: 'text', title: '小红书种草文案', createdAt: '2026-04-07 11:30', status: 'completed', cost: 2 },
  { id: 6, type: 'video', title: '知识分享视频', createdAt: '2026-04-06 15:00', status: 'failed', cost: 0 },
  { id: 7, type: 'design', title: '活动封面设计', createdAt: '2026-04-06 10:20', status: 'completed', cost: 5 },
  { id: 8, type: 'text', title: '直播引流话术', createdAt: '2026-04-05 17:30', status: 'completed', cost: 3 },
];

const typeConfig = {
  video: { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50' },
  text: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  design: { icon: Palette, color: 'text-orange-500', bg: 'bg-orange-50' },
};

const statusConfig = {
  completed: { text: '已完成', color: 'text-green-600', bg: 'bg-green-50' },
  generating: { text: '生成中', color: 'text-blue-600', bg: 'bg-blue-50' },
  failed: { text: '失败', color: 'text-red-600', bg: 'bg-red-50' },
};

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'video' | 'text' | 'design'>('all');

  const filteredData = filter === 'all' 
    ? historyData 
    : historyData.filter(item => item.type === filter);

  const totalCost = historyData
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">使用记录</h1>
          <p className="text-sm text-gray-500">查看历史创作记录</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-tech-blue to-tech-cyan rounded-2xl p-4 text-white">
            <div className="text-3xl font-bold">{historyData.length}</div>
            <div className="text-white/80 text-sm">总记录数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="text-3xl font-bold text-tech-blue">{totalCost}</div>
            <div className="text-gray-500 text-sm">已消耗算力</div>
          </div>
        </div>

        {/* 筛选 Tab */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: '全部' },
            { id: 'video', label: '视频' },
            { id: 'text', label: '文案' },
            { id: 'design', label: '设计' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 记录列表 */}
        <div className="space-y-3">
          {filteredData.map((item) => {
            const TypeIcon = typeConfig[item.type].icon;
            const status = statusConfig[item.status];
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-start space-x-3">
                  {/* 类型图标 */}
                  <div className={`w-12 h-12 rounded-xl ${typeConfig[item.type].bg} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon size={24} className={typeConfig[item.type].color} />
                  </div>
                  
                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-800 truncate pr-2">{item.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${status.bg} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {item.createdAt}
                      </span>
                      {item.status === 'completed' && (
                        <span className="text-orange-500">-{item.cost} 算力</span>
                      )}
                    </div>
                    
                    {/* 操作按钮 */}
                    {item.status === 'completed' && (
                      <div className="flex items-center space-x-2 mt-3">
                        <button className="flex items-center px-3 py-1.5 bg-tech-blue/10 text-tech-blue text-sm rounded-lg hover:bg-tech-blue/20 transition-colors">
                          <Download size={14} className="mr-1" />
                          下载
                        </button>
                        <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                          <ExternalLink size={14} className="mr-1" />
                          查看
                        </button>
                      </div>
                    )}
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
              <Clock size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500">暂无记录</p>
            <p className="text-sm text-gray-400 mt-2">开始你的第一次创作吧</p>
          </div>
        )}

        {/* 清空按钮 */}
        {filteredData.length > 0 && (
          <div className="text-center pb-8">
            <button className="flex items-center justify-center mx-auto px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 size={18} className="mr-2" />
              清空记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
