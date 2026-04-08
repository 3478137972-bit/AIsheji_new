'use client';

import { useState } from 'react';
import { Link as LinkIcon, History, Sparkles } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, PageHeader } from '@/components/forms/FormComponents';

export default function XiaohongshuAnalysisPage() {
  const [title, setTitle] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!workLink) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 8000);
  };

  const handleHistory = () => {
    console.log('查看历史记录');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="小红书账号分析" 
        subtitle="深度拆解爆款作品逻辑"
      />

      <div className="px-4 py-6 space-y-6">
        {/* 标题（选填） */}
        <FormCard>
          <FormLabel>任务标题（选填）</FormLabel>
          <FormInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给本次分析起个名字，方便后续查找..."
          />
        </FormCard>

        {/* 作品链接（必填） */}
        <FormCard>
          <FormLabel required>作品链接</FormLabel>
          <FormTextarea
            value={workLink}
            onChange={(e) => setWorkLink(e.target.value)}
            placeholder="请输入小红书作品链接或博主主页链接..."
            rows={4}
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
              onClick={handleAnalyze}
              disabled={!workLink || isAnalyzing}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !workLink || isAnalyzing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-tech-blue to-tech-cyan text-white shadow-glow hover:shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>解析中...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>立即解析拆解</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
