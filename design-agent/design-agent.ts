import * as fs from 'fs';
import { DeepSeekClient } from './deepseek-client';
import { SkillsGuideManager } from './skills-guide-manager';
import { QualityChecker } from './quality-checker';
import { ImageAnalyzer } from './image-analyzer';
import { DesignDecisionMaker } from './design-decision-maker';
import { DesignSkills } from './types';

/**
 * 设计智能体主控制器
 * 整合所有模块，提供统一的接口
 */
export class DesignAgent {
  private deepseek: DeepSeekClient;
  private skillsManager: SkillsGuideManager;
  private qualityChecker: QualityChecker;
  private imageAnalyzer: ImageAnalyzer;        // 👁️ 眼睛
  private decisionMaker: DesignDecisionMaker;  // 🧠 大脑
  private skills: DesignSkills;

  constructor(deepseekApiKey: string, skillsPath: string) {
    // 初始化DeepSeek客户端
    this.deepseek = new DeepSeekClient(deepseekApiKey);

    // 加载Skills文档
    const skillsData = fs.readFileSync(skillsPath, 'utf-8');
    this.skills = JSON.parse(skillsData);

    // 初始化Skills管理器
    this.skillsManager = new SkillsGuideManager(this.skills);

    // 初始化质量检查器
    this.qualityChecker = new QualityChecker();

    // 初始化图像分析器（眼睛）
    this.imageAnalyzer = new ImageAnalyzer(this.deepseek);

    // 初始化设计决策器（大脑）
    this.decisionMaker = new DesignDecisionMaker(this.skills);
  }

  /**
   * 主流程：生成设计提示词（带信息收集，使用上下文对话）
   */
  async generateInteractive(
    userInput: string,
    onQuestion?: (questions: Array<{ key: string; question: string; options?: string[] }>) => Promise<Record<string, string>>
  ): Promise<{
    success: boolean;
    prompt: string;
    negativePrompt: string;
    parameters: any;
    metadata: {
      category: string;
      confidence: number;
      reasoning: string;
      designElements: string[];
      qualityScore: number;
      qualityIssues: string[];
      qualitySuggestions: string[];
      collectedInfo?: Record<string, string>;
    };
  }> {
    try {
      console.log('🚀 开始处理用户需求（使用上下文对话）...');
      console.log(`📝 用户输入: ${userInput}`);

      // 初始化对话历史
      const conversationHistory: Array<{ role: string; content: string }> = [];

      // Step 1: 意图识别
      console.log('\n🔍 Step 1: 分析用户意图...');
      const categoryNames = this.skillsManager.getCategoryNames();
      const { intent, messages: intentMessages } = await this.deepseek.analyzeIntentWithContext(userInput, categoryNames);

      // 保存对话历史
      conversationHistory.push(...intentMessages);

      console.log(`✅ 识别类别: ${intent.category}`);
      console.log(`📊 置信度: ${intent.confidence}`);
      console.log(`💡 理由: ${intent.reasoning}`);
      console.log(`🎨 设计要素: ${intent.designElements.join(', ')}`);

      // Step 2: 分析需求完整性（基于上下文）
      console.log('\n🔍 Step 2: 分析需求完整性（基于上下文）...');
      const { requirements, messages: reqMessages } = await this.deepseek.analyzeRequirementsWithContext(
        conversationHistory,
        intent.category
      );

      // 更新对话历史
      conversationHistory.push(...reqMessages);

      console.log(`📋 需求完整性: ${requirements.isComplete ? '✅ 完整' : '⚠️  需要补充信息'}`);
      console.log(`💭 分析: ${requirements.reasoning}`);

      let collectedInfo: Record<string, string> = {};

      // Step 3: 如果需要，收集额外信息
      if (!requirements.isComplete && requirements.missingInfo.length > 0 && onQuestion) {
        console.log('\n💬 Step 3: 收集额外信息...');
        console.log(`需要收集 ${requirements.missingInfo.length} 项信息`);

        collectedInfo = await onQuestion(requirements.missingInfo);

        // 将用户回答添加到对话历史
        const userAnswers = Object.entries(collectedInfo)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        conversationHistory.push({
          role: 'user',
          content: `我补充以下信息：\n${userAnswers}`
        });

        console.log(`✅ 已收集信息并添加到对话上下文`);
      }

      // Step 4: 获取设计指南
      console.log('\n📚 Step 4: 加载设计指南...');
      const categoryKey = this.skillsManager.getCategoryKeyByName(intent.category);

      if (!categoryKey) {
        throw new Error(`未找到类别: ${intent.category}`);
      }

      const guide = this.skillsManager.getSmartGuide(categoryKey, userInput);

      if (!guide) {
        throw new Error(`无法加载类别 ${categoryKey} 的设计指南`);
      }

      console.log(`✅ 已加载 ${guide.category} 的设计指南`);
      console.log(`📋 使用模板: ${guide.template.name}`);

      // Step 5: 基于完整对话历史生成提示词
      console.log('\n✨ Step 5: 基于完整对话历史生成提示词...');
      const result = await this.deepseek.generatePromptWithContext(conversationHistory, guide);

      console.log(`✅ 提示词生成完成`);

      // Step 6: 质量检查
      console.log('\n🔍 Step 6: 质量检查...');
      const qualityCheck = this.qualityChecker.check(result.prompt, result.negativePrompt);

      console.log(`📊 质量评分: ${qualityCheck.score}/100`);
      if (qualityCheck.issues.length > 0) {
        console.log(`⚠️  问题: ${qualityCheck.issues.join(', ')}`);
      }
      if (qualityCheck.suggestions.length > 0) {
        console.log(`💡 建议: ${qualityCheck.suggestions.join(', ')}`);
      }

      // Step 7: 优化提示词
      let finalPrompt = result.prompt;
      let finalNegativePrompt = result.negativePrompt;

      if (!qualityCheck.passed) {
        console.log('\n🔧 Step 7: 优化提示词...');
        const optimized = this.qualityChecker.optimize(result.prompt, result.negativePrompt);
        finalPrompt = optimized.optimizedPrompt;
        finalNegativePrompt = optimized.optimizedNegativePrompt;
        console.log('✅ 提示词已优化');
      }

      console.log('\n✅ 处理完成！\n');
      console.log(`💬 对话轮次: ${conversationHistory.length / 2} 轮`);

      return {
        success: true,
        prompt: finalPrompt,
        negativePrompt: finalNegativePrompt,
        parameters: result.parameters,
        metadata: {
          category: intent.category,
          confidence: intent.confidence,
          reasoning: intent.reasoning,
          designElements: intent.designElements,
          qualityScore: qualityCheck.score,
          qualityIssues: qualityCheck.issues,
          qualitySuggestions: qualityCheck.suggestions,
          collectedInfo
        }
      };
    } catch (error: any) {
      console.error('❌ 处理失败:', error.message);
      return {
        success: false,
        prompt: '',
        negativePrompt: '',
        parameters: {},
        metadata: {
          category: '',
          confidence: 0,
          reasoning: error.message,
          designElements: [],
          qualityScore: 0,
          qualityIssues: [error.message],
          qualitySuggestions: []
        }
      };
    }
  }

  /**
   * 主流程：生成设计提示词
   */
  async generate(userInput: string): Promise<{
    success: boolean;
    prompt: string;
    negativePrompt: string;
    parameters: any;
    metadata: {
      category: string;
      confidence: number;
      reasoning: string;
      designElements: string[];
      qualityScore: number;
      qualityIssues: string[];
      qualitySuggestions: string[];
    };
  }> {
    try {
      console.log('🚀 开始处理用户需求...');
      console.log(`📝 用户输入: ${userInput}`);

      // Step 1: 意图识别
      console.log('\n🔍 Step 1: 分析用户意图...');
      const categoryNames = this.skillsManager.getCategoryNames();
      const intent = await this.deepseek.analyzeIntent(userInput, categoryNames);

      console.log(`✅ 识别类别: ${intent.category}`);
      console.log(`📊 置信度: ${intent.confidence}`);
      console.log(`💡 理由: ${intent.reasoning}`);
      console.log(`🎨 设计要素: ${intent.designElements.join(', ')}`);

      // 检查置信度 - 提高阈值到 0.6
      if (intent.confidence < 0.6) {
        throw new Error('NOT_DESIGN_REQUEST');
      }

      // Step 2: 获取设计指南
      console.log('\n📚 Step 2: 加载设计指南...');
      const categoryKey = this.skillsManager.getCategoryKeyByName(intent.category);

      if (!categoryKey) {
        throw new Error('CATEGORY_NOT_SUPPORTED');
      }

      const guide = this.skillsManager.getSmartGuide(categoryKey, userInput);

      if (!guide) {
        throw new Error(`无法加载类别 ${categoryKey} 的设计指南`);
      }

      console.log(`✅ 已加载 ${guide.category} 的设计指南`);
      console.log(`📋 使用模板: ${guide.template.name}`);

      // Step 3: 生成提示词
      console.log('\n✨ Step 3: 生成提示词...');
      const result = await this.deepseek.generatePrompt(userInput, guide);

      console.log(`✅ 提示词生成完成`);

      // Step 4: 质量检查
      console.log('\n🔍 Step 4: 质量检查...');
      const qualityCheck = this.qualityChecker.check(result.prompt, result.negativePrompt);

      console.log(`📊 质量评分: ${qualityCheck.score}/100`);
      if (qualityCheck.issues.length > 0) {
        console.log(`⚠️  问题: ${qualityCheck.issues.join(', ')}`);
      }
      if (qualityCheck.suggestions.length > 0) {
        console.log(`💡 建议: ${qualityCheck.suggestions.join(', ')}`);
      }

      // Step 5: 优化提示词
      let finalPrompt = result.prompt;
      let finalNegativePrompt = result.negativePrompt;

      if (!qualityCheck.passed) {
        console.log('\n🔧 Step 5: 优化提示词...');
        const optimized = this.qualityChecker.optimize(result.prompt, result.negativePrompt);
        finalPrompt = optimized.optimizedPrompt;
        finalNegativePrompt = optimized.optimizedNegativePrompt;
        console.log('✅ 提示词已优化');
      }

      console.log('\n✅ 处理完成！\n');

      return {
        success: true,
        prompt: finalPrompt,
        negativePrompt: finalNegativePrompt,
        parameters: result.parameters,
        metadata: {
          category: intent.category,
          confidence: intent.confidence,
          reasoning: intent.reasoning,
          designElements: intent.designElements,
          qualityScore: qualityCheck.score,
          qualityIssues: qualityCheck.issues,
          qualitySuggestions: qualityCheck.suggestions
        }
      };
    } catch (error: any) {
      // 如果是非设计需求或不支持的类别，直接向上抛出，让调用方处理
      if (error.message === 'NOT_DESIGN_REQUEST' ||
          error.message === 'CATEGORY_NOT_SUPPORTED') {
        throw error;
      }

      // 其他错误返回失败结果
      console.error('❌ 处理失败:', error.message);
      return {
        success: false,
        prompt: '',
        negativePrompt: '',
        parameters: {},
        metadata: {
          category: '',
          confidence: 0,
          reasoning: error.message,
          designElements: [],
          qualityScore: 0,
          qualityIssues: [error.message],
          qualitySuggestions: []
        }
      };
    }
  }

  /**
   * 批量生成（用于测试）
   */
  async batchGenerate(inputs: string[]): Promise<any[]> {
    const results = [];
    for (const input of inputs) {
      const result = await this.generate(input);
      results.push(result);
    }
    return results;
  }

  /**
   * 基于图片生成设计提示词
   *
   * 流程：
   * 1. 👁️ DeepSeek-VL（眼睛）：识别图片，提取客观信息
   * 2. 🧠 Skills指南（大脑）：基于客观信息做设计决策
   * 3. ✨ 生成专业提示词
   */
  async generateFromImage(
    imageBase64: string,
    userRequirement?: string
  ): Promise<{
    success: boolean;
    prompt: string;
    negativePrompt: string;
    parameters: any;
    metadata: any;
    imageAnalysis?: any;
    designDecision?: any;
  }> {
    try {
      console.log('🚀 开始处理图片...');

      // Step 1: 👁️ 眼睛 - 识别图片（客观信息）
      console.log('\n👁️  Step 1: DeepSeek-VL识别图片...');
      const imageAnalysis = await this.imageAnalyzer.analyzeImage(imageBase64);

      console.log(`✅ 识别内容: ${imageAnalysis.content}`);
      console.log(`🎨 主要色彩: ${imageAnalysis.colors.primary.join(', ')}`);
      console.log(`📐 构图方式: ${imageAnalysis.composition.layout}`);

      // Step 2: 🧠 大脑 - Skills指南做决策
      console.log('\n🧠 Step 2: Skills指南分析决策...');
      const designDecision = this.decisionMaker.analyzeDesign(imageAnalysis);

      console.log(`✅ 匹配类别: ${designDecision.matched_category}`);
      console.log(`🎨 设计风格: ${designDecision.design_style}`);

      // Step 3: 构建增强的用户输入
      const enhancedInput = `
参考图片分析（客观信息）：
- 内容：${imageAnalysis.content}
- 主要色彩：${imageAnalysis.colors.primary.join(', ')}
- 构图：${imageAnalysis.composition.layout}，${imageAnalysis.composition.balance}
- 视觉特征：${imageAnalysis.visual_features.shapes.join(', ')}

设计决策（基于Skills指南）：
- 匹配类别：${designDecision.matched_category}
- 设计风格：${designDecision.design_style}
- 建议配色：${designDecision.recommendations.color_scheme}

用户需求：${userRequirement || '生成类似风格的设计'}

请基于以上信息生成专业的设计提示词。
`;

      // Step 4: 生成提示词
      console.log('\n✨ Step 3: 生成提示词...');
      const result = await this.generate(enhancedInput);

      return {
        ...result,
        imageAnalysis,
        designDecision
      };

    } catch (error: any) {
      console.error('❌ 处理失败:', error.message);
      return {
        success: false,
        prompt: '',
        negativePrompt: '',
        parameters: {},
        metadata: {
          category: '',
          confidence: 0,
          reasoning: error.message,
          designElements: [],
          qualityScore: 0,
          qualityIssues: [error.message],
          qualitySuggestions: []
        }
      };
    }
  }
}
