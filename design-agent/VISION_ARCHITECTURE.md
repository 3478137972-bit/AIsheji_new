# 视觉模块架构说明

## 🎯 核心理念：眼睛 vs 大脑

### 架构设计原则

```
👁️ DeepSeek-VL = 眼睛（只看，不判断）
🧠 Skills指南 = 大脑（思考，做决策）
```

## 📐 模块职责划分

### 1. ImageAnalyzer（眼睛）👁️

**职责：**
- ✅ 识别图片内容（客观描述）
- ✅ 提取色彩信息（hex格式）
- ✅ 分析构图特点（布局、平衡）
- ✅ 识别视觉特征（形状、线条、质感）

**不做：**
- ❌ 不做设计评价（不说"好看"、"专业"）
- ❌ 不做风格判断（不说"现代"、"复古"）
- ❌ 不提供设计建议

**输出示例：**
```json
{
  "content": "一个由几何形状组成的标识",
  "colors": {
    "primary": ["#0066FF", "#FFFFFF"],
    "secondary": ["#333333"]
  },
  "composition": {
    "layout": "居中",
    "balance": "对称",
    "focal_point": "中心"
  },
  "visual_features": {
    "shapes": ["圆形", "方形", "几何"],
    "lines": ["直线", "粗线"],
    "texture": "平滑渐变"
  }
}
```

### 2. DesignDecisionMaker（大脑）🧠

**职责：**
- ✅ 基于客观信息做设计决策
- ✅ 匹配合适的设计类别
- ✅ 判断设计风格
- ✅ 应用Skills指南规则
- ✅ 生成设计建议

**决策依据：**
- Skills指南中的类别定义
- Skills指南中的设计规则
- Skills指南中的风格标准

**输出示例：**
```json
{
  "matched_category": "Logo设计",
  "design_style": "现代简约",
  "applicable_rules": [
    "保持简洁，避免过于复杂的细节",
    "确保在不同尺寸下都清晰可辨",
    "颜色不超过3种主色"
  ],
  "recommendations": {
    "color_scheme": "#0066FF, #FFFFFF",
    "style_direction": "现代简约",
    "improvements": ["建议简化配色方案"]
  }
}
```

## 🔄 完整工作流程

```
用户上传图片 + 需求描述
         ↓
┌────────────────────────────────────┐
│  👁️ Step 1: DeepSeek-VL（眼睛）   │
│  - 识别图片内容                     │
│  - 提取色彩：#0066FF, #FFFFFF      │
│  - 分析构图：居中、对称             │
│  - 识别形状：几何、圆形             │
└────────────┬───────────────────────┘
             │ 输出：客观视觉信息
             ▼
┌────────────────────────────────────┐
│  🧠 Step 2: Skills指南（大脑）     │
│  - 匹配类别：Logo设计              │
│  - 判断风格：现代简约              │
│  - 应用规则：简洁、可缩放          │
│  - 生成建议：配色方案、改进点      │
└────────────┬───────────────────────┘
             │ 输出：设计决策
             ▼
┌────────────────────────────────────┐
│  ✨ Step 3: 生成提示词             │
│  结合：                             │
│  - 客观视觉信息（眼睛）            │
│  - 设计决策（大脑）                │
│  - 用户需求                         │
│  - Skills模板                       │
└────────────┬───────────────────────┘
             │
             ▼
      专业设计提示词
```

## 💻 使用示例

### 基于图片生成设计

```typescript
import { DesignAgent } from './design-agent';
import * as fs from 'fs';

const agent = new DesignAgent(apiKey, skillsPath);

// 读取图片
const image = fs.readFileSync('reference.jpg');
const imageBase64 = image.toString('base64');

// 生成提示词
const result = await agent.generateFromImage(
  imageBase64,
  '我想要一个类似风格的科技公司Logo'
);

console.log('👁️ 眼睛看到的：');
console.log(result.imageAnalysis);

console.log('\n🧠 大脑的决策：');
console.log(result.designDecision);

console.log('\n✨ 最终提示词：');
console.log(result.prompt);
```

### 输出示例

```
👁️ 眼睛看到的：
{
  content: "一个蓝色渐变的几何Logo",
  colors: { primary: ["#0066FF", "#FFFFFF"] },
  composition: { layout: "居中", balance: "对称" }
}

🧠 大脑的决策：
{
  matched_category: "Logo设计",
  design_style: "现代简约",
  recommendations: {
    color_scheme: "#0066FF, #FFFFFF",
    style_direction: "现代简约"
  }
}

✨ 最终提示词：
modern minimalist tech company logo, blue gradient (#0066FF),
geometric shapes, centered composition, symmetric balance,
clean design, professional, vector style, high quality, 8k
```

## 🎨 为什么这样设计？

### 优势

1. **职责清晰**
   - 眼睛只负责看，不做判断
   - 大脑负责思考，基于Skills规则

2. **可控性强**
   - 设计决策完全由Skills指南控制
   - 不会被AI的主观判断影响

3. **可扩展**
   - 更换视觉模型不影响设计逻辑
   - 更新Skills规则立即生效

4. **可解释**
   - 每一步决策都有明确依据
   - 用户可以看到完整的推理过程

### 对比：如果让DeepSeek-VL直接做设计决策

❌ **问题：**
- AI可能给出主观的设计建议
- 不符合你的Skills规范
- 难以控制输出质量
- 无法保证一致性

✅ **现在的方案：**
- AI只提供客观信息
- Skills指南控制所有决策
- 输出质量可控
- 符合专业规范

## 📁 文件结构

```
design-agent/
├── image-types.ts              # 图像相关类型定义
├── image-analyzer.ts           # 👁️ 眼睛：图像识别
├── design-decision-maker.ts    # 🧠 大脑：设计决策
└── design-agent.ts             # 主控制器（整合眼睛和大脑）
```

## 🚀 下一步

- [ ] 测试图像识别功能
- [ ] 优化决策算法
- [ ] 添加更多视觉特征提取
- [ ] 支持批量图片处理
