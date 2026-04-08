'use client';

import { useState } from 'react';
import { Zap, CreditCard, Gift, TrendingUp, Check } from 'lucide-react';

const rechargePackages = [
  {
    id: 1,
    amount: 100,
    bonus: 0,
    price: 9.9,
    tag: '',
  },
  {
    id: 2,
    amount: 300,
    bonus: 30,
    price: 29.9,
    tag: '热销',
    popular: true,
  },
  {
    id: 3,
    amount: 500,
    bonus: 80,
    price: 49.9,
    tag: '超值',
  },
  {
    id: 4,
    amount: 1000,
    bonus: 200,
    price: 99.9,
    tag: '最划算',
    best: true,
  },
  {
    id: 5,
    amount: 2000,
    bonus: 500,
    price: 199.9,
    tag: '企业优选',
  },
  {
    id: 6,
    amount: 5000,
    bonus: 1500,
    price: 499.9,
    tag: '大客户',
  },
];

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💳' },
  { id: 'alipay', name: '支付宝', icon: '💳' },
  { id: 'card', name: '银行卡', icon: '💳' },
];

export default function RechargePage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(2);
  const [selectedPayment, setSelectedPayment] = useState('wechat');

  const selectedPkg = rechargePackages.find(p => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">算力充值</h1>
          <p className="text-sm text-gray-500">充值算力，解锁更多 AI 创作能力</p>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 当前算力 */}
        <div className="bg-gradient-to-br from-tech-blue to-tech-cyan rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">当前算力</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold">856</span>
                <span className="text-white/80">点</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Zap size={32} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">本月已使用</span>
              <span className="font-medium">1,144 点</span>
            </div>
          </div>
        </div>

        {/* 算力说明 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp size={18} className="text-tech-blue mr-2" />
            算力消耗参考
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">AI 文案</span>
              <span className="font-medium text-tech-blue">1-5 点</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">AI 图像</span>
              <span className="font-medium text-tech-blue">5-10 点</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">AI 视频</span>
              <span className="font-medium text-tech-blue">10-50 点</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">AI 配音</span>
              <span className="font-medium text-tech-blue">2-8 点</span>
            </div>
          </div>
        </div>

        {/* 充值套餐 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">充值套餐</h2>
          <div className="grid grid-cols-2 gap-3">
            {rechargePackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-to-br from-tech-blue to-tech-cyan text-white shadow-glow ring-2 ring-white'
                    : 'bg-white shadow-card'
                }`}
              >
                {pkg.popular && (
                  <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                    selectedPackage === pkg.id ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {pkg.tag}
                  </div>
                )}
                {pkg.best && (
                  <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                    selectedPackage === pkg.id ? 'bg-white/20 text-white' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  }`}>
                    {pkg.tag}
                  </div>
                )}
                
                <div className="mb-3">
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-2xl font-bold ${selectedPackage === pkg.id ? 'text-white' : 'text-gray-800'}`}>
                      {pkg.amount}
                    </span>
                    <span className={`text-sm ${selectedPackage === pkg.id ? 'text-white/80' : 'text-gray-500'}`}>
                      点
                    </span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className={`text-xs mt-1 ${selectedPackage === pkg.id ? 'text-white/80' : 'text-green-500'}`}>
                      赠{pkg.bonus}点
                    </div>
                  )}
                </div>
                
                <div className={`text-lg font-bold ${selectedPackage === pkg.id ? 'text-white' : 'text-tech-blue'}`}>
                  ¥{pkg.price}
                </div>
                
                {selectedPackage === pkg.id && (
                  <div className="absolute top-2 left-2">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard size={18} className="text-tech-blue mr-2" />
            支付方式
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPayment === method.id
                    ? 'border-tech-blue bg-tech-blue/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-gray-800">{method.name}</span>
                </div>
                {selectedPayment === method.id && (
                  <Check size={20} className="text-tech-blue" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 充值按钮 */}
        <div className="sticky bottom-20">
          <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">充值金额</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">¥{selectedPkg?.price}</div>
                <div className="text-sm text-green-500">
                  获得 {selectedPkg ? selectedPkg.amount + (selectedPkg.bonus || 0) : 0} 算力点
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-4 bg-gradient-to-r from-tech-blue to-tech-cyan text-white rounded-2xl font-semibold shadow-glow hover:shadow-lg transition-all">
            立即充值
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            充值后自动到账，有效期永久
          </p>
        </div>
      </div>
    </div>
  );
}
