'use client';

import { useState } from 'react';
import { PenTool, Image, Video, FileText, Palette, Mic, Send, Sparkles } from 'lucide-react';

const creationTypes = [
  { id: 'image', name: '图像', icon: Image, color: 'from-blue-500 to-cyan-500' },
  { id: 'video', name: '视频', icon: Video, color: 'from-purple-500 to-pink-500' },
  { id: 'text', name: '文案', icon: FileText, color: 'from-green-500 to-teal-500' },
  { id: 'design', name: '设计', icon: Palette, color: 'from-orange-500 to-red-500' },
  { id: 'audio', name: '音频', icon: Mic, color: 'from-indigo-500 to-purple-500' },
];

export default function CreatePage() {
  const [selectedType, setSelectedType] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const styleOptions = {
    image: ['写实', '插画', '3D', '动漫', '油画', '水彩'],
    video: ['电影感', '纪录片', '广告', 'Vlog', '动画'],
    text: ['营销文案', '社交媒体', '新闻稿', '故事', '诗歌'],
    design: ['极简', '复古', '现代', '商务', '创意'],
    audio: ['男声', '女声', '童声', '情感', '新闻'],
  };

  const [selectedStyle, setSelectedStyle] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setResult('generated');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">自由创作</h1>
          <p className="text-sm text-gray-500">AI 辅助，释放无限创意</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 创作类型选择 */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {creationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-glow`
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <Icon size={20} className="mr-2" />
                <span className="font-medium">{type.name}</span>
              </button>
            );
          })}
        </div>

        {/* 提示词输入 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-800 flex items-center">
              <PenTool size={20} className="text-tech-blue mr-2" />
              创作描述
            </label>
            <button className="text-tech-blue text-sm flex items-center">
              <Sparkles size={16} className="mr-1" />
              AI 优化
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="详细描述你想要的创作内容，越详细效果越好..."
            className="w-full h-32 p-3 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-tech-blue"
          />
        </div>

        {/* 风格选项 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="font-semibold text-gray-800 mb-3 block">
            风格选择（可选）
          </label>
          <div className="flex flex-wrap gap-2">
            {styleOptions[selectedType as keyof typeof styleOptions].map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? 'bg-tech-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* 高级选项 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="font-semibold text-gray-800 mb-3 block">
            高级参数
          </label>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">创意程度</span>
                <span className="text-sm text-tech-blue font-medium">70%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tech-blue"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">细节精度</span>
                <span className="text-sm text-tech-blue font-medium">85%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="85"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tech-blue"
              />
            </div>
          </div>
        </div>

        {/* 生成结果预览 */}
        {result && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <label className="font-semibold text-gray-800 mb-3 block">
              生成结果
            </label>
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Image size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">生成结果预览</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 py-3 bg-tech-blue text-white rounded-xl font-medium">
                下载
              </button>
              <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">
                重新生成
              </button>
            </div>
          </div>
        )}

        {/* 生成按钮 */}
        <div className="sticky bottom-20">
          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center space-x-2 transition-all ${
              !prompt || isGenerating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-tech-blue to-tech-cyan shadow-glow hover:shadow-lg'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI 创作中...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>开始创作</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
