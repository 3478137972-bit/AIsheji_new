'use client';

import { useState } from 'react';
import { History, Sparkles } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, FormSelect, PageHeader } from '@/components/forms/FormComponents';

export default function VideoShortRewritePage() {
  const [title, setTitle] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [industryStyle, setIndustryStyle] = useState('');
  const [simplifyText, setSimplifyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!originalContent) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 5000);
  };

  const handleHistory = () => {
    console.log('查看历史记录');
  };

  const industryOptions = [
    { value: 'education', label: '教育培训' },
    { value: 'finance', label: '金融理财' },
    { value: 'health', label: '健康养生' },
    { value: 'beauty', label: '美妆护肤' },
    { value: 'food', label: '美食餐饮' },
    { value: 'travel', label: '旅游出行' },
    { value: 'tech', label: '科技数码' },
    { value: 'fashion', label: '时尚穿搭' },
    { value: 'parenting', label: '亲子育儿' },
    { value: 'business', label: '商业职场' },
  ];

  const simplifyOptions = [
    { value: 'slight', label: '轻微精简（保留 80% 内容）' },
    { value: 'moderate', label: '适度精简（保留 60% 内容）' },
    { value: 'heavy', label: '大幅精简（保留 40% 内容）' },
    { value: 'extreme', label: '极致精简（保留 20% 内容）' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="爆款短视频二创" 
        subtitle="优化脚本，打造爆款内容"
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

        {/* 原稿内容 */}
        <FormCard>
          <FormLabel required>原稿内容</FormLabel>
          <FormTextarea
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
            placeholder="粘贴您的短视频脚本或文案原稿..."
            rows={8}
            required
          />
        </FormCard>

        {/* 行业风格 */}
        <FormCard>
          <FormLabel required>行业风格</FormLabel>
          <FormSelect
            value={industryStyle}
            onChange={(e) => setIndustryStyle(e.target.value)}
            options={industryOptions}
            placeholder="请选择您的行业风格"
          />
        </FormCard>

        {/* 精简文字 */}
        <FormCard>
          <FormLabel required>精简文字</FormLabel>
          <FormSelect
            value={simplifyText}
            onChange={(e) => setSimplifyText(e.target.value)}
            options={simplifyOptions}
            placeholder="请选择精简程度"
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
              disabled={!originalContent || !industryStyle || !simplifyText || isGenerating}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !originalContent || !industryStyle || !simplifyText || isGenerating
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
