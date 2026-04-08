'use client';

import { useState } from 'react';
import { History, Sparkles } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, PageHeader } from '@/components/forms/FormComponents';

export default function HotspotPersonaPage() {
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [positioning, setPositioning] = useState('');
  const [persona, setPersona] = useState('');
  const [experience, setExperience] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [mainProduct, setMainProduct] = useState('');
  const [coreSellingPoint, setCoreSellingPoint] = useState('');
  const [hotspotEvent, setHotspotEvent] = useState('');
  const [productHook, setProductHook] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!industry) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 6000);
  };

  const handleHistory = () => {
    console.log('查看历史记录');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="全网热点人设二创" 
        subtitle="结合热点，打造个人 IP"
      />

      <div className="px-4 py-6 space-y-4">
        {/* 标题（选填） */}
        <FormCard>
          <FormLabel>任务标题（选填）</FormLabel>
          <FormInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给本次任务起个名字，方便后续查找..."
          />
        </FormCard>

        {/* 所属行业 */}
        <FormCard>
          <FormLabel required>所属行业</FormLabel>
          <FormInput
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="您从事的行业领域"
            required
          />
        </FormCard>

        {/* 一句话定位 */}
        <FormCard>
          <FormLabel required>一句话定位</FormLabel>
          <FormInput
            value={positioning}
            onChange={(e) => setPositioning(e.target.value)}
            placeholder="用一句话描述您的专业定位"
            required
          />
        </FormCard>

        {/* 人设 */}
        <FormCard>
          <FormLabel required>人设</FormLabel>
          <FormInput
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="您想要打造的人设形象（如：专业导师、温暖陪伴者等）"
            required
          />
        </FormCard>

        {/* 从业经历 */}
        <FormCard>
          <FormLabel required>从业经历</FormLabel>
          <FormTextarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="您的从业背景、成就和亮点经历"
            rows={4}
            required
          />
        </FormCard>

        {/* 目标客群 */}
        <FormCard>
          <FormLabel required>目标客群</FormLabel>
          <FormTextarea
            value={targetCustomer}
            onChange={(e) => setTargetCustomer(e.target.value)}
            placeholder="您的目标客户画像（年龄、职业、痛点等）"
            rows={3}
            required
          />
        </FormCard>

        {/* 主营产品 */}
        <FormCard>
          <FormLabel required>主营产品</FormLabel>
          <FormInput
            value={mainProduct}
            onChange={(e) => setMainProduct(e.target.value)}
            placeholder="您的核心产品或服务"
            required
          />
        </FormCard>

        {/* 核心卖点 */}
        <FormCard>
          <FormLabel required>核心卖点</FormLabel>
          <FormTextarea
            value={coreSellingPoint}
            onChange={(e) => setCoreSellingPoint(e.target.value)}
            placeholder="您产品的核心优势和独特卖点"
            rows={3}
            required
          />
        </FormCard>

        {/* 热点事件 */}
        <FormCard>
          <FormLabel required>热点事件</FormLabel>
          <FormTextarea
            value={hotspotEvent}
            onChange={(e) => setHotspotEvent(e.target.value)}
            placeholder="当前想要结合的热点事件或话题"
            rows={3}
            required
          />
        </FormCard>

        {/* 产品钩子 */}
        <FormCard>
          <FormLabel required>产品钩子</FormLabel>
          <FormInput
            value={productHook}
            onChange={(e) => setProductHook(e.target.value)}
            placeholder="吸引客户咨询的钩子（免费资料、体验课等）"
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
              disabled={!industry || isGenerating}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !industry || isGenerating
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
