# 设计智能体 (Design Agent)

基于DeepSeek模型和设计Skills指南的AI设计提示词生成系统。

## 核心特性

### 1. 智能意图识别
- 使用DeepSeek深度理解用户需求
- 自动匹配最合适的设计类别
- 提取关键设计要素

### 2. Skills指南驱动
- 以design-skills.json为核心设计规范
- 包含5大设计类别：
  - Logo设计
  - 商品图设计
  - 证件照
  - 海报设计
  - 插画设计

### 3. 专业提示词生成
- 严格遵循设计指南
- 自动应用质量标准
- 生成正向和负向提示词

### 4. 质量保障
- 自动质量检查
- 智能优化建议
- 评分系统

## 架构设计

```
用户输入
    ↓
DeepSeek意图识别 → 理解需求 + 匹配类别
    ↓
Skills指南加载 → 获取设计规范
    ↓
DeepSeek提示词生成 → 基于指南生成
    ↓
质量检查 → 验证和优化
    ↓
输出结果
```

## 使用方法

### 安装依赖

```bash
cd design-agent
npm install
```

### 配置API Key

```bash
export DEEPSEEK_API_KEY="your-deepseek-api-key"
```

### 运行测试

```typescript
import { DesignAgent } from './design-agent';

const agent = new DesignAgent(
  'your-deepseek-api-key',
  './design-skills.json'
);

const result = await agent.generate('帮我设计一个科技公司的Logo');

console.log(result.prompt);
// 输出: modern minimalist tech company logo, clean geometric shapes...
```

### 示例输出

```json
{
  "success": true,
  "prompt": "modern minimalist tech company logo, clean geometric shapes, blue gradient color scheme, professional, vector style, flat design, high quality, 8k, best quality",
  "negativePrompt": "blurry, low quality, distorted, watermark, text, signature",
  "parameters": {
    "width": 1024,
    "height": 1024,
    "steps": 30,
    "cfg_scale": 7
  },
  "metadata": {
    "category": "Logo设计",
    "confidence": 0.95,
    "reasoning": "用户明确提到设计Logo，且指定了科技公司，匹配度很高",
    "designElements": ["科技", "公司", "Logo", "现代", "简约"],
    "qualityScore": 95,
    "qualityIssues": [],
    "qualitySuggestions": []
  }
}
```

## 核心模块

### 1. DeepSeekClient
- 封装DeepSeek API调用
- 意图识别
- 提示词生成

### 2. SkillsGuideManager
- 管理设计指南
- 智能模板选择
- 规则应用

### 3. QualityChecker
- 质量检查
- 自动优化
- 评分系统

### 4. DesignAgent
- 主控制器
- 流程编排
- 统一接口

## 扩展Skills

在design-skills.json中添加新的设计类别：

```json
{
  "categories": {
    "new_category": {
      "name": "新类别名称",
      "keywords": ["关键词1", "关键词2"],
      "templates": [
        {
          "name": "模板名称",
          "tags": ["标签1", "标签2"],
          "base_prompt": "基础提示词",
          "style_modifiers": ["风格修饰1", "风格修饰2"],
          "color_schemes": ["配色方案1"],
          "requirements": ["要求1", "要求2"]
        }
      ],
      "common_rules": ["规则1", "规则2"]
    }
  }
}
```

## 优势

1. **智能理解**：DeepSeek深度理解用户意图，不依赖简单关键词匹配
2. **专业规范**：严格遵循设计指南，确保输出质量
3. **灵活扩展**：易于添加新的设计类别和模板
4. **质量保障**：自动检查和优化，确保提示词质量

## 技术栈

- TypeScript
- DeepSeek API
- Node.js

## License

MIT
