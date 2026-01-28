import axios from 'axios';

/**
 * DeepSeek API 客户端
 * 负责所有与DeepSeek模型的交互
 */
export class DeepSeekClient {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 调用DeepSeek Chat API
   */
  async chat(messages: Array<{ role: string; content: string }>, temperature: number = 0.7): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages,
          temperature,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`DeepSeek API调用失败: ${error.message}`);
    }
  }

  /**
   * 分析需求完整性：识别缺少哪些关键信息
   */
  async analyzeRequirements(userInput: string, category: string): Promise<{
    isComplete: boolean;
    missingInfo: Array<{
      key: string;
      question: string;
      options?: string[];
    }>;
    reasoning: string;
  }> {
    const systemPrompt = `你是一个专业的设计需求分析专家。
你的任务是分析用户的设计需求是否完整，识别缺少哪些关键信息。

设计类别：${category}

请分析用户输入，判断是否缺少关键信息。返回JSON格式：
{
  "isComplete": true/false,
  "missingInfo": [
    {
      "key": "信息类型（如：style, scene, target_audience等）",
      "question": "向用户提问的问题",
      "options": ["选项1", "选项2", "选项3"] // 可选，提供选项帮助用户选择
    }
  ],
  "reasoning": "分析理由"
}

关键信息类型参考：
- style: 设计风格（现代、复古、简约、奢华等）
- scene: 使用场景（工作、游戏、运动、音乐等）
- target_audience: 目标受众（年轻人、商务人士、游戏玩家等）
- color_preference: 色调偏好（冷色调、暖色调、高对比等）
- brand: 品牌信息
- mood: 情绪氛围（活力、沉稳、科技感等）
- text_content: 文案内容（主标题、标语、产品名称、促销信息等）
- text_style: 文字排版风格（大胆醒目、优雅细腻、简洁有力等）
- aspect_ratio: 图片比例（1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, auto）

**智能判断原则**：
1. **优先使用用户已提供的信息**，不要重复询问
2. **询问对设计至关重要的信息**，但控制问题数量（2-4个问题）
3. 对于 Logo 设计：
   - 如果用户只提供了品牌名称，需要询问：设计风格、色调偏好、目标受众等
   - 如果用户已经描述了风格（如"现代简约的科技公司LOGO"），则信息较完整
4. 对于海报、广告等需要文字的设计：
   - 如果缺少具体文案内容（text_content），需要询问
   - 如果缺少设计风格，需要询问
5. 图片比例（aspect_ratio）：
   - 可以询问，但不是强制的
   - 如果用户没有明确要求，可以使用 "auto"
   - 建议作为最后一个问题，让用户选择
6. **控制问题数量**：
   - 优先询问最关键的信息（风格、色调、受众）
   - 不要一次问太多问题（最多 4 个）
   - 次要信息可以通过 AI 推断

**什么时候 isComplete 应该为 true**：
- Logo 设计：用户提供了品牌名称 + 设计风格描述（如"现代简约的XX品牌LOGO"）
- 插画设计：用户提供了详细的主题和风格描述
- 海报设计：用户提供了主题 + 文案内容 + 风格要求
- 包装设计：用户提供了产品信息 + 设计风格
- IP 形象：用户提供了详细的角色描述和特征

**什么时候需要询问**：
- Logo 设计：用户只提供了品牌名称，没有描述风格、色调等 → 需要询问
- 用户的需求过于模糊（如只说"我想做设计"）→ 需要询问
- 缺少核心信息且无法推断 → 需要询问

**询问策略**：
- 优先询问：设计风格（style）、色调偏好（color_preference）
- 次要询问：目标受众（target_audience）、使用场景（scene）
- 可选询问：图片比例（aspect_ratio，可以默认 auto）
- 最多询问 4 个问题，避免用户体验不佳`;

    const userPrompt = `用户需求：${userInput}

请分析这个需求是否完整，缺少哪些关键信息。`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.3);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`解析需求分析结果失败: ${error}`);
    }
  }

  /**
   * 意图识别（带上下文）：理解用户需求并匹配Skills类别
   */
  async analyzeIntentWithContext(userInput: string, skillsCategories: string[]): Promise<{
    intent: {
      category: string;
      confidence: number;
      reasoning: string;
      designElements: string[];
    };
    messages: Array<{ role: string; content: string }>;
  }> {
    const systemPrompt = `你是一个专业的设计需求分析专家。
你的任务是分析用户的设计需求，并匹配到最合适的设计类别。

可用的设计类别：
${skillsCategories.map((cat, idx) => `${idx + 1}. ${cat}`).join('\n')}

请分析用户需求，返回JSON格式：
{
  "category": "最匹配的类别名称",
  "confidence": 0.0-1.0的置信度,
  "reasoning": "匹配理由",
  "designElements": ["提取的设计要素1", "设计要素2"]
}`;

    const userPrompt = `用户需求：${userInput}

请分析这个需求属于哪个设计类别，并提取关键设计要素。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.chat(messages, 0.3);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }

      const intent = JSON.parse(jsonMatch[0]);

      // 添加助手回复到消息历史
      messages.push({ role: 'assistant', content: response });

      return { intent, messages };
    } catch (error) {
      throw new Error(`解析意图识别结果失败: ${error}`);
    }
  }

  /**
   * 分析需求完整性（带上下文）：基于之前的对话识别缺少哪些关键信息
   */
  async analyzeRequirementsWithContext(
    conversationHistory: Array<{ role: string; content: string }>,
    category: string
  ): Promise<{
    requirements: {
      isComplete: boolean;
      missingInfo: Array<{
        key: string;
        question: string;
        options?: string[];
      }>;
      reasoning: string;
    };
    messages: Array<{ role: string; content: string }>;
  }> {
    const systemPrompt = `你是一个专业的设计需求分析专家。
你的任务是分析用户的设计需求是否完整，识别缺少哪些关键信息。

设计类别：${category}

请分析用户输入，判断是否缺少关键信息。返回JSON格式：
{
  "isComplete": true/false,
  "missingInfo": [
    {
      "key": "信息类型（如：style, scene, target_audience等）",
      "question": "向用户提问的问题",
      "options": ["选项1", "选项2", "选项3"] // 可选，提供选项帮助用户选择
    }
  ],
  "reasoning": "分析理由"
}

关键信息类型参考：
- style: 设计风格（现代、复古、简约、奢华等）
- scene: 使用场景（工作、游戏、运动、音乐等）
- target_audience: 目标受众（年轻人、商务人士、游戏玩家等）
- color_preference: 色调偏好（冷色调、暖色调、高对比等）
- brand: 品牌信息
- mood: 情绪氛围（活力、沉稳、科技感等）
- text_content: 文案内容（主标题、标语、产品名称、促销信息等）
- text_style: 文字排版风格（大胆醒目、优雅细腻、简洁有力等）
- aspect_ratio: 图片比例（1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, auto）

**智能判断原则**：
1. **优先使用用户已提供的信息**，不要重复询问
2. **询问对设计至关重要的信息**，但控制问题数量（2-4个问题）
3. 对于 Logo 设计：
   - 如果用户只提供了品牌名称，需要询问：设计风格、色调偏好、目标受众等
   - 如果用户已经描述了风格（如"现代简约的科技公司LOGO"），则信息较完整
4. 对于海报、广告等需要文字的设计：
   - 如果缺少具体文案内容（text_content），需要询问
   - 如果缺少设计风格，需要询问
5. 图片比例（aspect_ratio）：
   - 可以询问，但不是强制的
   - 如果用户没有明确要求，可以使用 "auto"
   - 建议作为最后一个问题，让用户选择
6. **控制问题数量**：
   - 优先询问最关键的信息（风格、色调、受众）
   - 不要一次问太多问题（最多 4 个）
   - 次要信息可以通过 AI 推断

**什么时候 isComplete 应该为 true**：
- Logo 设计：用户提供了品牌名称 + 设计风格描述（如"现代简约的XX品牌LOGO"）
- 插画设计：用户提供了详细的主题和风格描述
- 海报设计：用户提供了主题 + 文案内容 + 风格要求
- 包装设计：用户提供了产品信息 + 设计风格
- IP 形象：用户提供了详细的角色描述和特征

**什么时候需要询问**：
- Logo 设计：用户只提供了品牌名称，没有描述风格、色调等 → 需要询问
- 用户的需求过于模糊（如只说"我想做设计"）→ 需要询问
- 缺少核心信息且无法推断 → 需要询问

**询问策略**：
- 优先询问：设计风格（style）、色调偏好（color_preference）
- 次要询问：目标受众（target_audience）、使用场景（scene）
- 可选询问：图片比例（aspect_ratio，可以默认 auto）
- 最多询问 4 个问题，避免用户体验不佳`;

    const userPrompt = `基于我们之前的对话，请分析这个需求是否完整，缺少哪些关键信息。`;

    const messages = [
      ...conversationHistory,
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.chat(messages, 0.3);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }

      const requirements = JSON.parse(jsonMatch[0]);

      // 返回新增的消息
      const newMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: response }
      ];

      return { requirements, messages: newMessages };
    } catch (error) {
      throw new Error(`解析需求分析结果失败: ${error}`);
    }
  }

  /**
   * 生成设计提示词（带上下文）：基于完整对话历史生成
   */
  async generatePromptWithContext(
    conversationHistory: Array<{ role: string; content: string }>,
    skillsGuide: {
      category: string;
      template: any;
      commonRules: string[];
      generalRules: any;
    }
  ): Promise<{
    prompt: string;
    negativePrompt: string;
    parameters: any;
  }> {
    const systemPrompt = `你是一个专业的AI绘图提示词生成专家。
你必须严格遵循提供的设计指南（Skills Guide）来生成高质量的提示词。

# 设计指南

## 类别：${skillsGuide.category}

## 基础模板
${JSON.stringify(skillsGuide.template, null, 2)}

## 类别规则
${skillsGuide.commonRules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

## 通用质量标准
${skillsGuide.generalRules.quality_standards.map((std: string, idx: number) => `${idx + 1}. ${std}`).join('\n')}

## 设计原则
${skillsGuide.generalRules.design_principles.map((prin: string, idx: number) => `${idx + 1}. ${prin}`).join('\n')}

## 提示词结构
${skillsGuide.generalRules.prompt_optimization.structure}

# 你的任务

1. 基于我们之前的完整对话和设计指南，生成专业的AI绘图提示词
2. **重要**：提示词必须是自然的、有逻辑的描述性语句，而不是关键词堆砌
3. 提示词应该像一段流畅的场景描述，包含：
   - 主体描述（清晰具体，用完整的短语描述）
   - 场景设定（如果适用，描述环境和氛围）
   - 视觉风格（参考template的style_modifiers，用自然语言描述）
   - 技术细节（光线、构图、材质等，融入描述中）
   - 质量要求（使用positive_keywords，但要自然融入）
3. 生成negative prompt（使用negative_keywords）
4. 提供建议的生成参数

**提示词风格示例**：
❌ 错误（关键词堆砌）：头戴式耳机，海报，现代，科技感，霓虹灯，高质量
✅ 正确（自然描述）：一张展示高端头戴式耳机的商业海报，耳机置于画面中心作为视觉焦点，周围环绕着柔和的霓虹蓝光效果，营造出现代科技感的氛围。背景采用简约的深色渐变，突出产品的金属质感和皮革细节。整体构图遵循黄金分割，留白适当，信息层级清晰，呈现出专业的商业摄影风格

返回JSON格式：
{
  "prompt": "正向提示词（中文，自然描述性语句，不是关键词堆砌）",
  "negativePrompt": "负向提示词（中文，逗号分隔）",
  "parameters": {
    "aspect_ratio": "图片比例（必须从以下选项中选择：1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, auto）"
  }
}

注意：aspect_ratio 必须严格从支持的比例中选择，不要使用具体像素值。`;

    const userPrompt = `基于我们之前的完整对话和我提供的所有信息，请生成专业的提示词。`;

    const messages = [
      ...conversationHistory,
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.chat(messages, 0.7);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`解析提示词生成结果失败: ${error}`);
    }
  }

  /**
   * 意图识别：理解用户需求并匹配Skills类别
   */
  async analyzeIntent(userInput: string, skillsCategories: string[]): Promise<{
    category: string;
    confidence: number;
    reasoning: string;
    designElements: string[];
  }> {
    const systemPrompt = `你是一个专业的设计需求分析专家。
你的任务是分析用户的设计需求，并匹配到最合适的设计类别。

可用的设计类别：
${skillsCategories.map((cat, idx) => `${idx + 1}. ${cat}`).join('\n')}

请分析用户需求，返回JSON格式：
{
  "category": "最匹配的类别名称",
  "confidence": 0.0-1.0的置信度,
  "reasoning": "匹配理由",
  "designElements": ["提取的设计要素1", "设计要素2"]
}`;

    const userPrompt = `用户需求：${userInput}

请分析这个需求属于哪个设计类别，并提取关键设计要素。`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.3); // 低温度确保稳定输出

    try {
      // 提取JSON（处理可能的markdown代码块）
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`解析意图识别结果失败: ${error}`);
    }
  }

  /**
   * 生成设计提示词
   */
  async generatePrompt(
    userInput: string,
    skillsGuide: {
      category: string;
      template: any;
      commonRules: string[];
      generalRules: any;
    }
  ): Promise<{
    prompt: string;
    negativePrompt: string;
    parameters: any;
  }> {
    const systemPrompt = `你是一个专业的AI绘图提示词生成专家。
你必须严格遵循提供的设计指南（Skills Guide）来生成高质量的提示词。

# 设计指南

## 类别：${skillsGuide.category}

## 基础模板
${JSON.stringify(skillsGuide.template, null, 2)}

## 类别规则
${skillsGuide.commonRules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

## 通用质量标准
${skillsGuide.generalRules.quality_standards.map((std: string, idx: number) => `${idx + 1}. ${std}`).join('\n')}

## 设计原则
${skillsGuide.generalRules.design_principles.map((prin: string, idx: number) => `${idx + 1}. ${prin}`).join('\n')}

## 提示词结构
${skillsGuide.generalRules.prompt_optimization.structure}

# 你的任务

1. 基于用户需求和设计指南，生成专业的AI绘图提示词
2. **重要**：提示词必须是自然的、有逻辑的描述性语句，而不是关键词堆砌
3. 提示词应该像一段流畅的场景描述，包含：
   - 主体描述（清晰具体，用完整的短语描述）
   - 场景设定（如果适用，描述环境和氛围）
   - 视觉风格（参考template的style_modifiers，用自然语言描述）
   - 技术细节（光线、构图、材质等，融入描述中）
   - 质量要求（使用positive_keywords，但要自然融入）
3. 生成negative prompt（使用negative_keywords）
4. 提供建议的生成参数

**提示词风格示例**：
❌ 错误（关键词堆砌）：头戴式耳机，海报，现代，科技感，霓虹灯，高质量
✅ 正确（自然描述）：一张展示高端头戴式耳机的商业海报，耳机置于画面中心作为视觉焦点，周围环绕着柔和的霓虹蓝光效果，营造出现代科技感的氛围。背景采用简约的深色渐变，突出产品的金属质感和皮革细节。整体构图遵循黄金分割，留白适当，信息层级清晰，呈现出专业的商业摄影风格

返回JSON格式：
{
  "prompt": "正向提示词（中文，自然描述性语句，不是关键词堆砌）",
  "negativePrompt": "负向提示词（中文，逗号分隔）",
  "parameters": {
    "aspect_ratio": "图片比例（必须从以下选项中选择：1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, auto）"
  }
}

注意：aspect_ratio 必须严格从支持的比例中选择，不要使用具体像素值。`;

    const userPrompt = `用户需求：${userInput}

请基于设计指南生成专业的提示词。`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.7);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析DeepSeek返回的JSON');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`解析提示词生成结果失败: ${error}`);
    }
  }
}
