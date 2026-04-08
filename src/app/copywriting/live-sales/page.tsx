'use client';

import { useState } from 'react';
import { History, Sparkles } from 'lucide-react';
import { FormCard, FormLabel, FormInput, FormTextarea, PageHeader } from '@/components/forms/FormComponents';

export default function LiveSalesPage() {
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [priceSystem, setPriceSystem] = useState('');
  const [customerIndustry, setCustomerIndustry] = useState('');
  const [lateNightProblem, setLateNightProblem] = useState('');
  const [commonMistakes, setCommonMistakes] = useState('');
  const [resumeCase, setResumeCase] = useState('');
  const [competitorDiff, setCompetitorDiff] = useState('');
  const [whyBuyNow, setWhyBuyNow] = useState('');
  const [giftPrep, setGiftPrep] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!productName) return;
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
        title="直播引流爆单话术" 
        subtitle="打造高转化直播脚本"
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

        {/* 产品名称 */}
        <FormCard>
          <FormLabel required>产品名称</FormLabel>
          <FormInput
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="请输入您的产品或服务名称"
            required
          />
        </FormCard>

        {/* 解决问题 */}
        <FormCard>
          <FormLabel required>解决问题</FormLabel>
          <FormTextarea
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
            placeholder="您的产品能解决客户的什么核心问题？"
            rows={3}
            required
          />
        </FormCard>

        {/* 价格体系 */}
        <FormCard>
          <FormLabel required>价格体系</FormLabel>
          <FormTextarea
            value={priceSystem}
            onChange={(e) => setPriceSystem(e.target.value)}
            placeholder="描述您的产品价格、套餐、优惠等信息"
            rows={3}
            required
          />
        </FormCard>

        {/* 客户行业 */}
        <FormCard>
          <FormLabel required>客户行业</FormLabel>
          <FormInput
            value={customerIndustry}
            onChange={(e) => setCustomerIndustry(e.target.value)}
            placeholder="您的目标客户属于什么行业？"
            required
          />
        </FormCard>

        {/* 深夜问题 */}
        <FormCard>
          <FormLabel required>深夜问题</FormLabel>
          <FormTextarea
            value={lateNightProblem}
            onChange={(e) => setLateNightProblem(e.target.value)}
            placeholder="客户深夜会为什么问题焦虑失眠？"
            rows={3}
            required
          />
        </FormCard>

        {/* 容易犯错 */}
        <FormCard>
          <FormLabel required>容易犯错</FormLabel>
          <FormTextarea
            value={commonMistakes}
            onChange={(e) => setCommonMistakes(e.target.value)}
            placeholder="客户在这个领域容易犯哪些错误？"
            rows={3}
            required
          />
        </FormCard>

        {/* 履历案例 */}
        <FormCard>
          <FormLabel required>履历案例</FormLabel>
          <FormTextarea
            value={resumeCase}
            onChange={(e) => setResumeCase(e.target.value)}
            placeholder="您的成功案例或客户见证"
            rows={4}
            required
          />
        </FormCard>

        {/* 竞品不同 */}
        <FormCard>
          <FormLabel required>竞品不同</FormLabel>
          <FormTextarea
            value={competitorDiff}
            onChange={(e) => setCompetitorDiff(e.target.value)}
            placeholder="您与竞争对手的差异化优势是什么？"
            rows={3}
            required
          />
        </FormCard>

        {/* 为什么现在买 */}
        <FormCard>
          <FormLabel required>为什么现在买</FormLabel>
          <FormTextarea
            value={whyBuyNow}
            onChange={(e) => setWhyBuyNow(e.target.value)}
            placeholder="给客户一个立即下单的理由（限时、限量等）"
            rows={3}
            required
          />
        </FormCard>

        {/* 赠品准备 */}
        <FormCard>
          <FormLabel required>赠品准备</FormLabel>
          <FormInput
            value={giftPrep}
            onChange={(e) => setGiftPrep(e.target.value)}
            placeholder="准备什么赠品来促进成交？"
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
              disabled={!productName || isGenerating}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                !productName || isGenerating
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
