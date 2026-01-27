import * as fs from 'fs';
import * as path from 'path';
import { DeepSeekClient } from './deepseek-client';

/**
 * Omni-Design Skills 管理器
 *
 * 负责：
 * 1. 加载和解析 Skills 配置
 * 2. 根据用户需求匹配合适的设计类型
 * 3. 基于 Skills 规则生成高质量提示词
 * 4. 执行质检和自我修正
 */
export class SkillsManager {
  private skills: any;
  private deepseek: DeepSeekClient;
  private config: {
    generateNegativePrompt: boolean;
    targetModel?: string;
  };

  constructor(
    deepseek: DeepSeekClient,
    skillsPath?: string,
    config?: {
      generateNegativePrompt?: boolean;
      targetModel?: string;
    }
  ) {
    this.deepseek = deepseek;
    this.config = {
      generateNegativePrompt: config?.generateNegativePrompt ?? true,
      targetModel: config?.targetModel
    };

    // 加载 Skills 配置
    const defaultPath = path.join(__dirname, 'omni-design-skills.json');
    const configPath = skillsPath || defaultPath;

    try {
      const skillsData = fs.readFileSync(configPath, 'utf-8');
      this.skills = JSON.parse(skillsData);
      console.log(`✅ Skills 加载成功: ${this.skills.name} v${this.skills.version}`);
    } catch (error: any) {
      throw new Error(`Skills 加载失败: ${error.message}`);
    }
  }

  /**
   * 0. 交互协议：需求澄清
   *
   * 检查用户输入是否足够清晰，如果不清晰则返回需要询问的问题
   */
  async checkInputClarity(userInput: string): Promise<{
    isVague: boolean;
    questions?: Array<{
      key: string;
      question: string;
      options?: string[];
    }>;
  }> {
    const protocol = this.skills.interaction_protocol;

    // 使用 DeepSeek 判断输入是否模糊
    const systemPrompt = `你是一个设计需求分析专家。判断用户的设计需求是否足够清晰。

需求必须包含以下信息才算清晰：
1. 设计类型（Logo、海报、包装等）
2. 目标受众或使用场景
3. 风格偏好或参考

如果缺少关键信息，返回 JSON：
{
  "isVague": true,
  "missingInfo": ["缺少的信息1", "缺少的信息2"]
}

如果信息足够，返回：
{
  "isVague": false
}`;

    const response = await this.deepseek.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `用户需求：${userInput}` }
    ], 0.3);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { isVague: false };
    }

    const result = JSON.parse(jsonMatch[0]);

    if (result.isVague) {
      // 构建需要询问的问题
      const questions = [];
      const goldenTriad = protocol.vague_prompt_intercept.golden_triad;

      if (result.missingInfo.some((info: string) => info.includes('受众') || info.includes('用户'))) {
        questions.push({
          key: 'who',
          question: goldenTriad.who.question,
          options: goldenTriad.who.options
        });
      }

      if (result.missingInfo.some((info: string) => info.includes('场景') || info.includes('使用'))) {
        questions.push({
          key: 'where',
          question: goldenTriad.where.question,
          options: goldenTriad.where.options
        });
      }

      if (result.missingInfo.some((info: string) => info.includes('风格') || info.includes('偏好'))) {
        questions.push({
          key: 'vibe',
          question: goldenTriad.vibe.question,
          options: []
        });
      }

      return {
        isVague: true,
        questions
      };
    }

    return { isVague: false };
  }

  /**
   * 1. 策略中枢：识别设计类型
   *
   * 根据用户需求，匹配到合适的设计类型（商业转化型、品牌识别型、文化叙事型）
   */
  async identifyDesignType(userInput: string): Promise<{
    type: 'commercial' | 'branding' | 'narrative';
    typeName: string;
    model: string;
    coreMetrics: string[];
    scenarioGroup: string;
  }> {
    const typology = this.skills.strategic_core.typology;
    const scenarios = this.skills.scenario_groups;

    const systemPrompt = `你是设计策略专家。根据用户需求，判断属于哪种设计类型：

1. commercial（商业转化型）：电商、广告、促销、转化
2. branding（品牌识别型）：Logo、包装、标识、品牌
3. narrative（文化叙事型）：IP、插画、艺术、故事

同时判断属于哪个场景组：
- packaging（包装与实物）
- identity（符号与标识）
- communication（传播与海报）
- illustration（IP 与艺术）

返回 JSON：
{
  "type": "类型代码",
  "scenarioGroup": "场景组代码"
}`;

    const response = await this.deepseek.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `用户需求：${userInput}` }
    ], 0.3);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法识别设计类型');
    }

    const result = JSON.parse(jsonMatch[0]);
    const typeInfo = typology[result.type];
    const scenarioInfo = scenarios[result.scenarioGroup];

    return {
      type: result.type,
      typeName: typeInfo.name,
      model: typeInfo.model,
      coreMetrics: typeInfo.core_metrics,
      scenarioGroup: scenarioInfo.name
    };
  }

  /**
   * 2-4. 生成提示词
   *
   * 基于 Skills 规则，生成符合 AIGC 标准的提示词
   */
  async generatePrompt(userInput: string, designType: any): Promise<{
    prompt: string;
    negativePrompt?: string;
    visualDNA: string;
    promptExplanation: string;
    negativePromptExplanation?: string;
  }> {
    const promptStructure = this.skills.aigc_command.prompt_structure;
    const visualEngine = this.skills.visual_engine;
    const scenarios = this.skills.scenario_groups;

    // 根据配置决定是否生成负向提示词
    const shouldGenerateNegative = this.config.generateNegativePrompt;
    const targetModelInfo = this.config.targetModel ? `\n目标模型：${this.config.targetModel}` : '';

    // 构建系统提示词
    const systemPrompt = `你是 Omni-Design Agent，一个全能设计提示词生成专家。

# 你的任务
根据用户需求和设计类型，生成符合 AIGC 标准的中文提示词。${targetModelInfo}

# 设计类型
- 类型：${designType.typeName}
- 模型：${designType.model}
- 核心指标：${designType.coreMetrics.join('、')}
- 场景组：${designType.scenarioGroup}

# 提示词结构
${promptStructure.template}

# 视觉工程规则
${JSON.stringify(visualEngine, null, 2)}

# 场景规则
${JSON.stringify(scenarios, null, 2)}

# 输出格式
返回 JSON：
{
  "visualDNA": "风格定义（中文，如：扁平矢量插画，极简设计）",
  "prompt": "完整的正向提示词（中文，逗号分隔）",
  "promptExplanation": "正向提示词的解释说明，解释为什么这样设计"${shouldGenerateNegative ? `,
  "negativePrompt": "负向提示词（中文，逗号分隔）",
  "negativePromptExplanation": "负向提示词的解释说明，解释排除了哪些元素"` : ''}
}

# 重要规则
1. 所有提示词必须是中文（包括 prompt、negativePrompt、visualDNA）
2. 使用逗号或顿号分隔各个元素
3. 遵循视觉工程规则（布局、色彩、字体）
4. 根据场景组添加特定约束
${shouldGenerateNegative ? '5. 负向提示词要针对性地排除不需要的元素\n6. 提示词要详细、具体、可执行\n7. 专业术语可以保留英文原文，但要加中文注释（如：扁平化设计 Flat Design）' : '5. 提示词要详细、具体、可执行\n6. 专业术语可以保留英文原文，但要加中文注释（如：扁平化设计 Flat Design）'}`;

    const response = await this.deepseek.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `用户需求：${userInput}` }
    ], 0.7);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法生成提示词');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * 5. 质检回路：自我检查
   *
   * 检查生成的提示词是否存在逻辑冲突
   */
  async qualityCheck(prompt: string, negativePrompt: string, designType: any): Promise<{
    passed: boolean;
    issues?: string[];
    correctedPrompt?: string;
    correctedNegativePrompt?: string;
  }> {
    const qualityRules = this.skills.quality_check;

    const systemPrompt = `你是提示词质检专家。检查提示词是否存在以下问题：

1. 逻辑冲突：是否同时出现互斥的指令？
   例如："flat vector" 和 "photorealistic" 不能同时出现

2. 负向约束缺失：根据设计类型，是否缺少必要的负向约束？
   - Logo: 必须排除 ${qualityRules.negative_constraints.logo.join(', ')}
   - 人像: 必须排除 ${qualityRules.negative_constraints.portrait.join(', ')}
   - 极简: 必须排除 ${qualityRules.negative_constraints.minimal.join(', ')}

3. 文字处理问题：是否让 AI 直接生成文字？（AI 写字效果差）

返回 JSON：
{
  "passed": true/false,
  "issues": ["问题1", "问题2"],
  "correctedPrompt": "修正后的提示词（如果有问题）",
  "correctedNegativePrompt": "修正后的负向提示词（如果有问题）"
}`;

    const response = await this.deepseek.chat([
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `设计类型：${designType.typeName}\n\n正向提示词：${prompt}\n\n负向提示词：${negativePrompt}`
      }
    ], 0.3);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { passed: true };
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * 完整流程：从用户输入到最终提示词
   */
  async processDesignRequest(userInput: string): Promise<{
    needsClarification: boolean;
    questions?: any[];
    designType?: any;
    result?: {
      visualDNA: string;
      prompt: string;
      promptExplanation: string;
      negativePrompt?: string;
      negativePromptExplanation?: string;
      qualityCheck: any;
    };
  }> {
    // 步骤 0: 检查输入清晰度
    const clarityCheck = await this.checkInputClarity(userInput);

    if (clarityCheck.isVague) {
      return {
        needsClarification: true,
        questions: clarityCheck.questions
      };
    }

    // 步骤 1: 识别设计类型
    const designType = await this.identifyDesignType(userInput);

    // 步骤 2-4: 生成提示词
    const promptResult = await this.generatePrompt(userInput, designType);

    // 步骤 5: 质检（只在有负向提示词时进行）
    let qualityCheckResult;
    if (promptResult.negativePrompt) {
      qualityCheckResult = await this.qualityCheck(
        promptResult.prompt,
        promptResult.negativePrompt,
        designType
      );
    } else {
      qualityCheckResult = { passed: true };
    }

    // 如果质检不通过，使用修正后的提示词
    const finalPrompt = qualityCheckResult.passed
      ? promptResult.prompt
      : qualityCheckResult.correctedPrompt || promptResult.prompt;

    const finalNegativePrompt = promptResult.negativePrompt
      ? (qualityCheckResult.passed
          ? promptResult.negativePrompt
          : qualityCheckResult.correctedNegativePrompt || promptResult.negativePrompt)
      : undefined;

    return {
      needsClarification: false,
      designType,
      result: {
        visualDNA: promptResult.visualDNA,
        prompt: finalPrompt,
        promptExplanation: promptResult.promptExplanation,
        negativePrompt: finalNegativePrompt,
        negativePromptExplanation: promptResult.negativePromptExplanation,
        qualityCheck: qualityCheckResult
      }
    };
  }
}
