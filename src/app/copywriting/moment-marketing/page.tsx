'use client';

import { useState } from 'react';
import { History, Sparkles, User, FileText } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, PageHeader } from '@/components/forms/FormComponents';

export default function MomentMarketingPage() {
  const [title, setTitle] = useState('');
  const [persona, setPersona] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!content) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 4000);
  };

  const handleHistory = () => {
    console.log('查看历史记录');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="营销朋友圈智能体" 
        subtitle="打造专业人设，精准营销"
      />

      <div className="px-4 py-6 space-y-6">
        {/* 标题（选填） */}
        <FormCard>
          <FormLabel>任务标题（选填）</FormLabel>
          <FormInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给本次任务起个名字，方便后续查找..."
          />
        </FormCard>

        {/* 您的人设（2-4 关键词） */}
        <FormCard>
          <FormLabel required>您的人设</FormLabel>
          <FormInput
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="输入 2-4 个关键词，如：资深导师 / 创业教练 / 温暖陪伴..."
            required
          />
          <p className="text-xs text-gray-500 mt-2">用 2-4 个关键词描述您的专业身份和特点</p>
        </FormCard>

        {/* 想发布的内容 */}
        <FormCard>
          <FormLabel required>想发布的内容</FormLabel>
          <FormTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="描述您想在朋友圈发布的内容主题、产品信息或想要传达的核心信息..."
            rows={6}
            required
          />
        </FormCard>

        {/* 操作按钮 */}
        <div className="sticky bottom-20">
          <div className="flex space-x-3">
            <button
              onClick={handleHistory}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <History size={20} />
              <span>历史记录</span>
            </button>
            <button
              onClick={handleGenerate}
              disabled={!content || isGenerating}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !content || isGenerating
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>立刻生成</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
