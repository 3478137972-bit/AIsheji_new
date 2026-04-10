'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  Send, 
  History,
  Zap,
  TrendingUp,
  Users,
  MessageCircle,
  Video,
  FileText,
  Image,
  Star
} from 'lucide-react';

// 表单配置映射 - 根据 type 返回对应的表单配置
const formConfigs: Record<string, {
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'tags';
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>;
  generateLabel: string;
}> = {
  // ===== 老板必用 =====
  'ip-positioning': {
    title: 'IP 账号定位',
    subtitle: '帮你找到最适合的 IP 定位方向',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    generateLabel: '生成定位方案',
    fields: [
      { name: 'industry', label: '所在行业', type: 'text', placeholder: '如：美妆、教育、科技...', required: true },
      { name: 'target', label: '目标受众', type: 'textarea', placeholder: '描述你的目标用户群体...', required: true },
      { name: 'strengths', label: '个人优势', type: 'textarea', placeholder: '你的专业背景、特长、资源等...', required: true },
      { name: 'style', label: '内容风格', type: 'select', options: ['专业干货', '轻松幽默', '温暖治愈', '犀利吐槽', '高端大气'], required: true },
    ]
  },
  'business': {
    title: 'AI 商业思维',
    subtitle: '提升商业认知，洞察行业趋势',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    generateLabel: '生成商业分析',
    fields: [
      { name: 'topic', label: '分析主题', type: 'text', placeholder: '如：直播电商趋势、AI 行业前景...', required: true },
      { name: 'depth', label: '分析深度', type: 'select', options: ['快速概览', '深度分析', '全面研究'], required: true },
      { name: 'focus', label: '关注重点', type: 'textarea', placeholder: '你最想了解哪些方面？...', required: false },
    ]
  },
  'brand-story': {
    title: '品牌故事创作',
    subtitle: '打造动人品牌故事',
    icon: FileText,
    color: 'from-violet-500 to-purple-500',
    generateLabel: '生成品牌故事',
    fields: [
      { name: 'brandName', label: '品牌名称', type: 'text', placeholder: '你的品牌名...', required: true },
      { name: 'brandHistory', label: '品牌历程', type: 'textarea', placeholder: '品牌创立背景、发展历程...', required: true },
      { name: 'values', label: '品牌价值观', type: 'textarea', placeholder: '品牌核心理念、价值观...', required: true },
      { name: 'tone', label: '故事调性', type: 'select', options: ['温情感人', '励志奋进', '创新突破', '匠心传承'], required: true },
    ]
  },
  'enterprise-ip': {
    title: '企业 IP 打造',
    subtitle: '塑造企业品牌形象',
    icon: Users,
    color: 'from-indigo-500 to-blue-500',
    generateLabel: '生成 IP 方案',
    fields: [
      { name: 'companyName', label: '企业名称', type: 'text', required: true },
      { name: 'industry', label: '所属行业', type: 'text', required: true },
      { name: 'targetAudience', label: '目标客户', type: 'textarea', required: true },
      { name: 'differentiation', label: '差异化优势', type: 'textarea', placeholder: '与竞争对手的区别...', required: true },
    ]
  },
  'business-model': {
    title: '商业模式设计',
    subtitle: '设计创新商业模式',
    icon: TrendingUp,
    color: 'from-cyan-500 to-blue-500',
    generateLabel: '生成商业模式',
    fields: [
      { name: 'business', label: '业务描述', type: 'textarea', required: true },
      { name: 'revenue', label: '收入来源', type: 'textarea', placeholder: '现有的或期望的收入方式...', required: false },
      { name: 'customers', label: '客户群体', type: 'textarea', required: true },
    ]
  },
  'strategy-plan': {
    title: '战略规划助手',
    subtitle: '制定企业战略规划',
    icon: TrendingUp,
    color: 'from-slate-500 to-gray-500',
    generateLabel: '生成战略规划',
    fields: [
      { name: 'company', label: '公司名称', type: 'text', required: true },
      { name: 'currentStatus', label: '现状分析', type: 'textarea', required: true },
      { name: 'goals', label: '战略目标', type: 'textarea', placeholder: '1-3 年目标...', required: true },
      { name: 'period', label: '规划周期', type: 'select', options: ['1 年', '3 年', '5 年'], required: true },
    ]
  },
  
  // ===== 私域变现 =====
  'moment-marketing': {
    title: 'AI 卖点提炼',
    subtitle: '快速提炼产品核心卖点',
    icon: Zap,
    color: 'from-orange-500 to-amber-500',
    generateLabel: '提炼卖点',
    fields: [
      { name: 'product', label: '产品名称', type: 'text', required: true },
      { name: 'features', label: '产品功能', type: 'textarea', placeholder: '列出产品主要功能...', required: true },
      { name: 'competitors', label: '竞品对比', type: 'textarea', placeholder: '与竞品的差异...', required: false },
      { name: 'audience', label: '目标用户', type: 'text', required: true },
    ]
  },
  'live-sales': {
    title: 'AI 营销话术',
    subtitle: '生成高转化营销文案',
    icon: MessageCircle,
    color: 'from-green-500 to-teal-500',
    generateLabel: '生成话术',
    fields: [
      { name: 'product', label: '产品/服务', type: 'text', required: true },
      { name: 'price', label: '价格信息', type: 'text', placeholder: '原价、活动价...', required: false },
      { name: 'sellingPoints', label: '核心卖点', type: 'textarea', required: true },
      { name: 'urgency', label: '紧迫感元素', type: 'select', options: ['限时折扣', '限量抢购', '赠品优惠', '会员专享'], required: false },
      { name: 'platform', label: '使用平台', type: 'select', options: ['直播间', '朋友圈', '社群', '私信'], required: true },
    ]
  },
  'moment-duplicate': {
    title: '社群运营助手',
    subtitle: '社群活跃与转化话术',
    icon: MessageCircle,
    color: 'from-emerald-500 to-green-500',
    generateLabel: '生成运营方案',
    fields: [
      { name: 'communityType', label: '社群类型', type: 'select', options: ['付费会员群', '产品用户群', '学习交流群', '行业资源群'], required: true },
      { name: 'goal', label: '运营目标', type: 'select', options: ['活跃气氛', '促进转化', '知识分享', '资源对接'], required: true },
      { name: 'situation', label: '当前情况', type: 'textarea', placeholder: '描述社群当前状态...', required: true },
    ]
  },
  'private-growth': {
    title: '私域裂变方案',
    subtitle: '设计私域裂变活动',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    generateLabel: '生成裂变方案',
    fields: [
      { name: 'product', label: '裂变产品', type: 'text', required: true },
      { name: 'target', label: '目标人数', type: 'text', placeholder: '如：1000 人...', required: true },
      { name: 'budget', label: '活动预算', type: 'text', placeholder: '可选...', required: false },
      { name: 'reward', label: '奖励机制', type: 'textarea', placeholder: '邀请奖励、阶梯奖励...', required: true },
    ]
  },
  'customer-profile': {
    title: '客户画像分析',
    subtitle: '深度分析目标客户',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-500',
    generateLabel: '生成客户画像',
    fields: [
      { name: 'product', label: '产品/服务', type: 'text', required: true },
      { name: 'industry', label: '所属行业', type: 'text', required: true },
      { name: 'existingCustomers', label: '现有客户特征', type: 'textarea', placeholder: '已有的客户信息...', required: false },
    ]
  },
  
  // ===== 公域获客 =====
  'quick-video': {
    title: '短视频选题专家',
    subtitle: '帮你找到爆款视频选题',
    icon: Video,
    color: 'from-indigo-500 to-purple-500',
    generateLabel: '生成选题',
    fields: [
      { name: 'niche', label: '账号领域', type: 'text', placeholder: '如：美妆、健身、职场...', required: true },
      { name: 'audience', label: '目标观众', type: 'text', required: true },
      { name: 'videoCount', label: '需要选题数量', type: 'select', options: ['5 个', '10 个', '20 个', '30 个'], required: true },
      { name: 'style', label: '内容风格', type: 'select', options: ['干货教程', '剧情演绎', '测评种草', '日常 Vlog', '热点评论'], required: true },
    ]
  },
  'douyin': {
    title: '抖音账号诊断',
    subtitle: '深度分析账号问题，给出优化建议',
    icon: TrendingUp,
    color: 'from-red-500 to-rose-500',
    generateLabel: '开始诊断',
    fields: [
      { name: 'accountName', label: '账号名称', type: 'text', required: true },
      { name: 'followerCount', label: '粉丝数量', type: 'text', required: true },
      { name: 'content', label: '主要内容', type: 'textarea', required: true },
      { name: 'problems', label: '遇到的问题', type: 'textarea', placeholder: '如：播放量低、不涨粉、转化差...', required: true },
      { name: 'avgViews', label: '平均播放量', type: 'text', placeholder: '可选...', required: false },
    ]
  },
  'xiaohongshu': {
    title: '小红书爆款笔记',
    subtitle: '生成小红书爆款内容',
    icon: FileText,
    color: 'from-red-500 to-pink-500',
    generateLabel: '生成笔记',
    fields: [
      { name: 'topic', label: '笔记主题', type: 'text', required: true },
      { name: 'product', label: '推广产品', type: 'text', placeholder: '可选...', required: false },
      { name: 'keyPoints', label: '核心要点', type: 'textarea', required: true },
      { name: 'style', label: '笔记风格', type: 'select', options: ['干货分享', '好物推荐', '经验总结', '对比测评', '日常种草'], required: true },
      { name: 'emoji', label: '表情风格', type: 'select', options: ['丰富活泼', '适度点缀', '简洁专业'], required: true },
    ]
  },
  'inspiration': {
    title: '全网热点追踪',
    subtitle: '实时追踪全网热点',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    generateLabel: '获取热点',
    fields: [
      { name: 'industry', label: '关注行业', type: 'text', required: true },
      { name: 'platforms', label: '关注平台', type: 'tags', options: ['抖音', '小红书', '微博', 'B 站', '知乎'], required: true },
      { name: 'timeRange', label: '时间范围', type: 'select', options: ['24 小时内', '3 天内', '7 天内'], required: true },
    ]
  },
  'seo-optimization': {
    title: 'SEO 优化助手',
    subtitle: '搜索引擎优化建议',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    generateLabel: '生成优化方案',
    fields: [
      { name: 'website', label: '网站/页面 URL', type: 'text', required: true },
      { name: 'keywords', label: '目标关键词', type: 'textarea', placeholder: '多个关键词用逗号分隔...', required: true },
      { name: 'competitors', label: '竞争对手', type: 'textarea', placeholder: '竞品网站...', required: false },
    ]
  },
  
  // ===== 常用工具 =====
  'moment-rewrite': {
    title: '朋友圈文案大师',
    subtitle: '每日朋友圈文案自动生成',
    icon: FileText,
    color: 'from-cyan-500 to-blue-500',
    generateLabel: '生成文案',
    fields: [
      { name: 'content', label: '原始内容', type: 'textarea', placeholder: '输入你想表达的内容...', required: true },
      { name: 'style', label: '文案风格', type: 'select', options: ['幽默风趣', '温暖治愈', '高端大气', '简洁有力', '情感共鸣'], required: true },
      { name: 'purpose', label: '发布目的', type: 'select', options: ['日常分享', '产品推广', '个人 IP', '互动引流'], required: true },
    ]
  },
  'poster': {
    title: '海报文案生成',
    subtitle: '一键生成海报宣传文案',
    icon: Image,
    color: 'from-pink-500 to-rose-500',
    generateLabel: '生成文案',
    fields: [
      { name: 'event', label: '活动/产品', type: 'text', required: true },
      { name: 'highlights', label: '核心亮点', type: 'textarea', required: true },
      { name: 'cta', label: '行动号召', type: 'text', placeholder: '如：立即扫码、限时抢购...', required: false },
      { name: 'style', label: '文案风格', type: 'select', options: ['震撼大气', '温馨治愈', '活力年轻', '高端简约'], required: true },
    ]
  },
  'weekly-report': {
    title: '周报总结助手',
    subtitle: '智能生成工作周报',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    generateLabel: '生成周报',
    fields: [
      { name: 'position', label: '职位', type: 'text', required: true },
      { name: 'workDone', label: '本周完成工作', type: 'textarea', placeholder: '列出主要工作内容...', required: true },
      { name: 'problems', label: '遇到的问题', type: 'textarea', placeholder: '可选...', required: false },
      { name: 'nextWeek', label: '下周计划', type: 'textarea', placeholder: '可选...', required: false },
    ]
  },
  'ppt-outline': {
    title: 'PPT 大纲生成',
    subtitle: '快速生成 PPT 框架',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    generateLabel: '生成大纲',
    fields: [
      { name: 'topic', label: 'PPT 主题', type: 'text', required: true },
      { name: 'audience', label: '听众对象', type: 'text', placeholder: '如：客户、领导、团队...', required: true },
      { name: 'purpose', label: '演示目的', type: 'select', options: ['方案汇报', '产品介绍', '培训分享', '融资路演', '年终总结'], required: true },
      { name: 'duration', label: '演示时长', type: 'select', options: ['10 分钟', '20 分钟', '30 分钟', '1 小时'], required: true },
    ]
  },
  'event-plan': {
    title: '活动策划方案',
    subtitle: '完整活动策划生成',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    generateLabel: '生成方案',
    fields: [
      { name: 'eventType', label: '活动类型', type: 'select', options: ['线上直播', '线下沙龙', '产品发布会', '促销活动', '周年庆'], required: true },
      { name: 'goal', label: '活动目标', type: 'textarea', required: true },
      { name: 'budget', label: '活动预算', type: 'text', placeholder: '可选...', required: false },
      { name: 'scale', label: '活动规模', type: 'select', options: ['50 人以内', '50-200 人', '200-500 人', '500 人以上'], required: true },
    ]
  },
};

export default function SmartSquareForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // 从 URL 获取 type 参数
  const type = searchParams.get('type') || 'ip-positioning';
  const config = formConfigs[type] || formConfigs['ip-positioning'];
  
  // 初始化表单数据
  useEffect(() => {
    const initialData: Record<string, string> = {};
    config.fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [type]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    // 验证必填字段
    const requiredFields = config.fields.filter(f => f.required);
    for (const field of requiredFields) {
      if (!formData[field.name]?.trim()) {
        alert(`请填写${field.label}`);
        return;
      }
    }

    setIsGenerating(true);
    
    // TODO: 调用 API 生成结果
    // 模拟 API 调用
    setTimeout(() => {
      setIsGenerating(false);
      setResult('生成成功！结果将在这里显示...');
    }, 2000);
  };

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-beige-50">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="px-4 py-3">
          <div className="flex items-center mb-3">
            <button 
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-neutral-600" />
            </button>
            <div className="flex-1 text-center pr-8">
              <h1 className="text-xl font-bold text-neutral-900">{config.title}</h1>
              {config.subtitle && (
                <p className="text-xs text-neutral-500">{config.subtitle}</p>
              )}
            </div>
          </div>
          
          {/* 功能图标和标签 */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-md font-medium">
                <Star size={10} className="inline mr-1" />
                热门
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                <Users size={10} className="inline mr-1" />
                2.3 万 人已使用
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* 表单字段 */}
        {config.fields.map((field) => (
          <div key={field.name} className="bg-white rounded-xl p-4 shadow-card">
            <label className="font-semibold text-neutral-800 mb-3 block">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' && (
              <textarea
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full p-3 bg-neutral-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            )}
            
            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            )}
            
            {field.type === 'select' && field.options && (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full p-3 bg-neutral-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="">请选择{field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            
            {field.type === 'tags' && field.options && (
              <div className="flex flex-wrap gap-2">
                {field.options.map((opt) => {
                  const isSelected = (formData[field.name] || '').includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        const current = formData[field.name] || '';
                        const tags = current ? current.split(',') : [];
                        if (isSelected) {
                          const newTags = tags.filter(t => t !== opt);
                          handleInputChange(field.name, newTags.join(','));
                        } else {
                          tags.push(opt);
                          handleInputChange(field.name, tags.join(','));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* 生成结果 */}
        {result && (
          <div className="bg-white rounded-xl p-4 shadow-card">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles size={20} className="text-primary" />
              <h3 className="font-semibold text-neutral-800">生成结果</h3>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-sm text-neutral-700 whitespace-pre-wrap">
              {result}
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="flex-1 py-3 bg-primary text-white rounded-xl font-medium text-sm">
                复制结果
              </button>
              <button 
                onClick={() => setResult(null)}
                className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-medium text-sm"
              >
                重新生成
              </button>
            </div>
          </div>
        )}

        {/* 生成按钮 */}
        <div className="sticky bottom-4 pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isGenerating
                ? 'bg-neutral-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI 生成中...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>{config.generateLabel}</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-neutral-400 mt-2">
            AI 生成内容仅供参考，请结合实际情况使用
          </p>
        </div>
      </div>
    </div>
  );
}
