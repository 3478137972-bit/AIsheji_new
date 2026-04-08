'use client';

import { useState } from 'react';
import { History, Sparkles } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, PageHeader } from '@/components/forms/FormComponents';

export default function MomentAntifoldPage() {
  const [title, setTitle] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!originalText) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleHistory = () => {
    console.log('查看历史记录');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="朋友圈防折叠" 
        subtitle="避免文案被折叠，提升曝光率"
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

        {/* 原文案 */}
        <FormCard>
          <FormLabel required>原文案</FormLabel>
          <FormTextarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="粘贴您的原文案，AI 将为您优化排版，避免被朋友圈折叠..."
            rows={6}
            required
          />
          <p className="text-xs text-gray-500 mt-2">长文案容易被折叠，AI 会智能调整格式</p>
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
              disabled={!originalText || isGenerating}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !originalText || isGenerating
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
