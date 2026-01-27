# Omni-Design Agent: Skills 系统

基于 DeepSeek + Skills 的全能设计智能体系统。

## 📋 系统概述

这是一个完整的设计智能体系统，包含：

1. **交互协议** - 主动澄清模糊需求
2. **策略中枢** - 智能识别设计类型
3. **视觉引擎** - 应用专业设计法则
4. **场景适配** - 针对不同场景优化
5. **质检回路** - 自动检查和修正

## 🏗️ 系统架构

```
design-agent/
├── omni-design-skills.json    # Skills 配置文件
├── deepseek-client.ts          # DeepSeek API 客户端
├── skills-manager.ts           # Skills 管理器（核心）
├── test-skills.ts              # 测试脚本
└── README-SKILLS.md            # 本文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install axios
npm install -D typescript @types/node ts-node
```

### 2. 设置环境变量

```bash
# Windows
set DEEPSEEK_API_KEY=your_api_key_here

# Linux/Mac
export DEEPSEEK_API_KEY=your_api_key_here
```

### 3. 运行测试

```bash
cd design-agent
npx ts-node test-skills.ts
```

## 💡 使用示例

### 基础用法

```typescript
import { DeepSeekClient } from './deepseek-client';
import { SkillsManager } from './skills-manager';

// 初始化
const deepseek = new DeepSeekClient('your-api-key');
const skillsManager = new SkillsManager(deepseek);

// 处理设计需求
const result = await skillsManager.processDesignRequest(
  '为一家科技公司设计 Logo，目标受众是年轻的程序员，风格要简约现代'
);

if (result.needsClarification) {
  // 需要澄清需求
  console.log('请回答以下问题：');
  result.questions?.forEach(q => {
    console.log(q.question);
  });
} else {
  // 获取生成的提示词
  console.log('Visual DNA:', result.result?.visualDNA);
  console.log('Prompt:', result.result?.prompt);
  console.log('Negative Prompt:', result.result?.negativePrompt);
}
```

### 分步使用

```typescript
// 步骤 1: 检查输入清晰度
const clarityCheck = await skillsManager.checkInputClarity(userInput);

if (clarityCheck.isVague) {
  // 向用户询问问题
  // ...
}

// 步骤 2: 识别设计类型
const designType = await skillsManager.identifyDesignType(userInput);
console.log('设计类型:', designType.typeName);

// 步骤 3: 生成提示词
const promptResult = await skillsManager.generatePrompt(userInput, designType);

// 步骤 4: 质检
const qualityCheck = await skillsManager.qualityCheck(
  promptResult.prompt,
  promptResult.negativePrompt,
  designType
);
```

## 📊 设计类型

系统支持三种主要设计类型：

### 1. 商业转化型 (Commercial)
- **适用场景**: 电商、广告、促销
- **设计模型**: AIDA模型 (注意->兴趣->欲望->行动)
- **核心指标**: 点击率、信任感
- **关键词**: 电商、广告、促销、转化

### 2. 品牌识别型 (Branding)
- **适用场景**: Logo、包装、标识
- **设计模型**: 符号学原理
- **核心指标**: 3米识别度、负空间构建、货架思维
- **关键词**: Logo、包装、标识、品牌

### 3. 文化叙事型 (Narrative)
- **适用场景**: IP、插画、艺术
- **设计模型**: 世界观构建
- **核心指标**: 情感共鸣、隐喻符号、风格化
- **关键词**: IP、插画、艺术、故事

## 🎯 场景组

系统针对不同场景提供专门优化：

### Group A: 包装与实物
- 展开图 (Flat lay)
- 刀模线
- 材质模拟 (烫金/UV/磨砂)

### Group B: 符号与标识
- 矢量感 (Vector)
- 无阴影
- 极简
- 默认纯白底+纯黑主图

### Group C: 传播与海报
- 视觉动线 (Z型/F型)
- 行动召唤 (CTA)
- 预留文案区

### Group D: IP 与艺术
- 角色一致性 (Visual DNA)
- 赛璐珞/厚涂
- 中等粗细描边

## 🔍 质检系统

系统会自动检查以下问题：

1. **逻辑冲突检测**
   - 检查是否同时出现互斥指令
   - 例如："flat vector" 和 "photorealistic" 不能同时出现

2. **负向约束验证**
   - Logo: 必须排除 shadow, gradient, complex details, photo
   - 人像: 必须排除 deformed hands, bad anatomy, extra fingers
   - 极简: 必须排除 messy background, clutter

3. **文字处理检查**
   - AI 写字效果差，提示词应留白给后期加字

## 📝 提示词结构

生成的提示词遵循以下结构：

```
[Visual DNA / 风格定义]
+ [主体描述 (含材质与修饰)]
+ [环境与背景 (含景深)]
+ [构图与视角 (Camera Angle)]
+ [光影与渲染 (Lighting & Render Engine)]
+ [功能/细节补充]
+ [--no 负向约束]
```

## 🎨 视觉工程规则

### 布局规则
- **低密度**: 大留白、中心构图 → 高端/奢华
- **高密度**: 网格系统、信息分区 → 促销/说明书

### 色彩规则
- **黄金配色**: 60% 主色 + 30% 辅色 + 10% 点缀色
- **可读性**: WCAG 标准 (对比度 ≥4.5:1)

### 字体规则
- **路径造字**: 圆润、流体、连笔 → 亲和/食品/美妆
- **几何造字**: 方正、切角、断连 → 科技/建筑/工业

## 🔧 自定义 Skills

你可以修改 `omni-design-skills.json` 来自定义规则：

```json
{
  "scenario_groups": {
    "your_custom_group": {
      "name": "自定义场景组",
      "code": "Group E",
      "core": ["规则1", "规则2"],
      "constraint": "约束说明"
    }
  }
}
```

## 🐛 故障排除

### 问题: "Skills 加载失败"
- 检查 `omni-design-skills.json` 文件是否存在
- 检查 JSON 格式是否正确

### 问题: "无法识别设计类型"
- 确保用户输入包含足够的信息
- 检查 DeepSeek API 是否正常工作

### 问题: "无法生成提示词"
- 检查 API Key 是否有效
- 查看 DeepSeek API 返回的错误信息

## 📚 相关文档

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [设计系统主文档](../README.md)

## 🎯 下一步

- [ ] 集成到 Web 界面
- [ ] 添加更多设计类型
- [ ] 支持多语言提示词
- [ ] 添加提示词历史记录
- [ ] 实现批量生成功能
