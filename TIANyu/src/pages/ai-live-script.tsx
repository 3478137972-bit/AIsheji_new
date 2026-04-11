import React, { useState, ChangeEvent } from 'react';
import { Header, TabBar } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Card } from '@/components/Card';

interface FormData {
  title: string;
  productDetails: string;
  productSellingPoints: string;
  anchorPersona: string;
  targetAudience: string;
}

export default function AILiveScriptPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    productDetails: '',
    productSellingPoints: '',
    anchorPersona: '',
    targetAudience: '',
  });
  
  const handleSubmit = () => {
    // TODO: 提交表单
    console.log('提交数据:', formData);
  };
  
  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-[#FAF3E0] to-white">
      <Header title="AI 直播脚本" />
      
      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Banner */}
        <Card cream className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E67E22] to-[#D35400] rounded-full flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#333333]">AI 直播脚本生成器</h2>
              <p className="text-sm text-gray-500 mt-1">
                一键生成专业直播稿，提升转化率
              </p>
            </div>
          </div>
        </Card>
        
        {/* 表单 */}
        <div className="space-y-5">
          <Input
            label="1. 标题"
            placeholder="请输入本次对话的标题，方便后续查找"
            value={formData.title}
            onChange={handleChange('title')}
            required={false}
          />
          
          <TextArea
            label="2. 产品详情"
            placeholder="用客观、准确的语言，确保客户看完后能明白产品的基本情况"
            rows={4}
            value={formData.productDetails}
            onChange={handleChange('productDetails')}
            required
            fieldNumber={2}
          />
          
          <TextArea
            label="3. 产品卖点"
            placeholder="总结您的核心竞争优势和差异化价值，说明为什么客户应该选择您，如：效果承诺、个人经历等"
            rows={3}
            value={formData.productSellingPoints}
            onChange={handleChange('productSellingPoints')}
            required
            fieldNumber={3}
          />
          
          <Input
            label="4. 主播人设"
            placeholder="输入一个核心人设，确保人设在直播中能稳定呈现，形成记忆点，有画面感"
            value={formData.anchorPersona}
            onChange={handleChange('anchorPersona')}
            required
            fieldNumber={4}
          />
          
          <TextArea
            label="5. 目标客群"
            placeholder="描述您的目标客户画像，包括年龄段、身份特征 (如:25-40 岁职场女性)"
            rows={2}
            value={formData.targetAudience}
            onChange={handleChange('targetAudience')}
            required
            fieldNumber={5}
          />
        </div>
        
        {/* 提交按钮 */}
        <div className="fixed bottom-20 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#E0E0E0] p-4">
          <div className="max-w-[600px] mx-auto flex gap-3">
            <Button variant="secondary" className="flex-1">
              历史记录
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSubmit}>
              立刻生成
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            本次生成需消耗 8 秒 · 内容由 AI 生成
          </p>
        </div>
      </main>
    </div>
  );
}
