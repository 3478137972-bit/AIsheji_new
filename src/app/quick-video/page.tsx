'use client';

import { useState } from 'react';
import { Zap, Upload, Film, Music, Type, Sparkles } from 'lucide-react';

export default function QuickVideoPage() {
  const [script, setScript] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedRatio, setSelectedRatio] = useState('9:16');
  const [isGenerating, setIsGenerating] = useState(false);

  const videoStyles = [
    { id: 'modern', name: '现代简约', preview: '🎬' },
    { id: 'tech', name: '科技未来', preview: '🚀' },
    { id: 'warm', name: '温馨治愈', preview: '☀️' },
    { id: 'business', name: '商务专业', preview: '💼' },
    { id: 'creative', name: '创意动感', preview: '✨' },
    { id: 'minimal', name: '极简主义', preview: '⚪' },
  ];

  const videoRatios = [
    { id: '9:16', name: '竖屏 9:16', desc: '抖音/快手' },
    { id: '16:9', name: '横屏 16:9', desc: 'B 站/YouTube' },
    { id: '1:1', name: '正方形 1:1', desc: '朋友圈/小红书' },
    { id: '4:5', name: '竖屏 4:5', desc: '小红书/Instagram' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">一键成片</h1>
          <p className="text-sm text-gray-500">输入文案，AI 自动生成视频</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 文案输入 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-800 flex items-center">
              <Type size={20} className="text-tech-blue mr-2" />
              视频文案
            </label>
            <span className="text-sm text-gray-500">{script.length}/500</span>
          </div>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="请输入视频文案，AI 将智能分析并生成匹配的画面..."
            className="w-full h-40 p-3 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-tech-blue"
            maxLength={500}
          />
          <div className="mt-3 flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors">
              <Upload size={16} className="mr-2" />
              导入文档
            </button>
            <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors">
              <Sparkles size={16} className="mr-2" />
              AI 润色
            </button>
          </div>
        </div>

        {/* 视频风格 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="font-semibold text-gray-800 flex items-center mb-3">
            <Film size={20} className="text-tech-blue mr-2" />
            视频风格
          </label>
          <div className="grid grid-cols-3 gap-3">
            {videoStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedStyle === style.id
                    ? 'border-tech-blue bg-tech-blue/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{style.preview}</div>
                <div className="text-sm font-medium text-gray-700">{style.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 画面比例 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="font-semibold text-gray-800 flex items-center mb-3">
            <Upload size={20} className="text-tech-blue mr-2" />
            画面比例
          </label>
          <div className="grid grid-cols-2 gap-3">
            {videoRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedRatio === ratio.id
                    ? 'border-tech-blue bg-tech-blue/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-800">{ratio.id}</div>
                <div className="text-xs text-gray-500">{ratio.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 背景音乐 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="font-semibold text-gray-800 flex items-center mb-3">
            <Music size={20} className="text-tech-blue mr-2" />
            背景音乐
          </label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-tech-blue/10 flex items-center justify-center">
                <Music size={20} className="text-tech-blue" />
              </div>
              <div>
                <div className="font-medium text-gray-800">智能匹配</div>
                <div className="text-xs text-gray-500">AI 根据文案自动选择</div>
              </div>
            </div>
            <button className="text-tech-blue text-sm font-medium">
              手动选择 →
            </button>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="sticky bottom-20">
          <button
            onClick={handleGenerate}
            disabled={!script || isGenerating}
            className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center space-x-2 transition-all ${
              !script || isGenerating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-tech-blue to-tech-cyan shadow-glow hover:shadow-lg'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI 生成中...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>立即生成视频</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
