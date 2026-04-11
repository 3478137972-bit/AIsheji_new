"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Check, Copy, MessageCircle, CreditCard, Sparkles } from "lucide-react"

const packages = [
  {
    name: "体验包",
    credits: 100,
    bonus: 0,
    price: 9.9,
    total: 100,
    savings: 0,
    badge: null,
    popular: false,
  },
  {
    name: "人气包",
    credits: 500,
    bonus: 50,
    price: 49.9,
    total: 550,
    savings: 4.50,
    badge: "🔥 人气推荐",
    popular: true,
  },
  {
    name: "超值包",
    credits: 1000,
    bonus: 200,
    price: 99.9,
    total: 1200,
    savings: 18.00,
    badge: "💎 超值推荐",
    popular: false,
  },
  {
    name: "旗舰包",
    credits: 5000,
    bonus: 1500,
    price: 499.9,
    total: 6500,
    savings: 135.00,
    badge: "👑 旗舰套餐",
    popular: false,
  },
]

const steps = [
  {
    icon: MessageCircle,
    step: "1",
    title: "添加客服微信",
    desc: "搜索并添加【妙懂 AI 客服】",
  },
  {
    icon: CreditCard,
    step: "2",
    title: "说明充值套餐",
    desc: "告知客服您要购买的套餐",
  },
  {
    icon: Check,
    step: "3",
    title: "微信转账支付",
    desc: "支付完成后积分实时到账",
  },
]

export default function PricingPage() {
  const [copied, setCopied] = useState(false)
  const wechatId = "m347820705"

  const handleCopy = () => {
    navigator.clipboard.writeText(wechatId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            充值积分，解锁无限创意
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            选择适合你的积分套餐
          </h1>
          <p className="text-muted-foreground text-lg">
            灵活充值，按需使用，积分永久有效
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl border bg-card p-6 transition-all hover:shadow-lg ${
                  pkg.popular
                    ? "border-primary shadow-md scale-[1.02]"
                    : "border-border"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {pkg.badge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ¥{pkg.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.credits} 积分{pkg.bonus > 0 && ` + 赠送${pkg.bonus}积分`}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">实际到手</span>
                    <span className="font-medium">{pkg.total} 积分</span>
                  </div>
                  {pkg.savings > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">立省</span>
                      <span className="font-medium text-green-600">
                        ¥{pkg.savings.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  立即充值
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How to Recharge */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-center mb-8">💳 如何充值？</h2>
          <p className="text-center text-muted-foreground mb-8">
            3 步完成充值，积分实时到账
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm text-primary font-medium mb-2">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Limited Time Offer */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-200 p-8">
            <h2 className="text-xl font-bold text-center mb-4">
              🎯 限时福利开启中
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              购买人气包及以上套餐可获赠额外积分！
              <br />
              旗舰套餐赠送 1500 积分，相当于额外赠送价值约 ¥135 的生成次数
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* WeChat ID */}
              <div className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl border border-border">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">添加微信号</div>
                  <div className="font-mono font-medium">{wechatId}</div>
                </div>
                <button
                  onClick={handleCopy}
                  className="ml-2 p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img src="/wechat-qr.jpeg" alt="微信二维码" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">扫码充值</div>
                  <div className="text-sm">微信扫码 → 添加客服 → 充值积分</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="text-center text-sm text-muted-foreground">
            💡 温馨提示：添加客服微信后，告知您要充值的套餐名称（如"我要购买超值包"），
            客服会发送收款码，支付完成后积分实时到账。
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
