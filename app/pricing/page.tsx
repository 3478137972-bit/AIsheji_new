"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Check, Copy, MessageCircle, CreditCard, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null)
  const wechatId = "m347820705"

  const handleCopy = () => {
    navigator.clipboard.writeText(wechatId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRecharge = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg)
    setDialogOpen(true)
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
                  onClick={() => handleRecharge(pkg)}
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

      {/* 充值弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>充值积分</DialogTitle>
            <DialogDescription>
              {selectedPackage && (
                <span>
                  您选择了 <strong>{selectedPackage.name}</strong>，
                  支付 <strong>¥{selectedPackage.price}</strong> 获得 <strong>{selectedPackage.total} 积分</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 积分信息 */}
            {selectedPackage && (
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">套餐详情</div>
                  <div className="text-xl font-bold text-primary mb-2">
                    {selectedPackage.name}
                  </div>
                  <div className="flex justify-center gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">基础积分：</span>
                      <span className="font-medium">{selectedPackage.credits}</span>
                    </div>
                    {selectedPackage.bonus > 0 && (
                      <div>
                        <span className="text-muted-foreground">赠送积分：</span>
                        <span className="font-medium text-green-600">+{selectedPackage.bonus}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-primary/10">
                    <span className="text-muted-foreground">总计获得：</span>
                    <span className="text-lg font-bold text-primary">{selectedPackage.total} 积分</span>
                  </div>
                </div>
              </div>
            )}

            {/* 客服信息 - 横版布局 */}
            <div className="text-sm font-medium text-center">请添加客服微信完成充值</div>
            
            <div className="flex gap-4">
              {/* 左侧：微信号 */}
              <div className="flex-1 flex flex-col gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">客服微信号</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{wechatId}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-auto">
                  复制微信号添加客服
                </div>
              </div>

              {/* 右侧：二维码 */}
              <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-xl">
                <div className="w-28 h-28 bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/wechat-qr-new.jpg"
                    alt="微信二维码"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  微信扫码添加客服
                </div>
              </div>
            </div>

            {/* 充值步骤提示 */}
            <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
              <div>1. 添加客服微信 → 2. 告知套餐名称 → 3. 支付后积分实时到账</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
