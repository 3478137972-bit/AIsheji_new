import { DesignSkills, SkillCategory } from './types';
import { ImageAnalysisResult, DesignAnalysisResult } from './image-types';

/**
 * 设计决策器 - Skills指南作为"大脑"
 *
 * 职责：
 * - 基于ImageAnalyzer提供的客观信息做设计决策
 * - 匹配合适的设计类别
 * - 应用设计规则和原则
 * - 生成设计建议
 */
export class DesignDecisionMaker {
  constructor(private skills: DesignSkills) {}

  /**
   * 基于客观视觉信息做设计决策
   *
   * 这里是"大脑"的工作：分析、判断、决策
   */
  analyzeDesign(imageAnalysis: ImageAnalysisResult): DesignAnalysisResult {
    console.log('🧠 Skills指南分析中...');

    // 1. 基于内容匹配设计类别
    const matchedCategory = this.matchCategory(imageAnalysis);

    // 2. 基于视觉特征判断设计风格
    const designStyle = this.determineStyle(imageAnalysis);

    // 3. 获取适用的设计规则
    const applicableRules = this.getApplicableRules(matchedCategory);

    // 4. 基于Skills指南生成建议
    const recommendations = this.generateRecommendations(
      imageAnalysis,
      matchedCategory
    );

    console.log(`✅ 匹配类别: ${matchedCategory}`);
    console.log(`🎨 设计风格: ${designStyle}`);

    return {
      matched_category: matchedCategory,
      design_style: designStyle,
      applicable_rules: applicableRules,
      recommendations
    };
  }

  /**
   * 匹配设计类别（基于Skills指南）
   */
  private matchCategory(analysis: ImageAnalysisResult): string {
    const content = analysis.content.toLowerCase();

    // 遍历Skills中的所有类别
    for (const [key, category] of Object.entries(this.skills.categories)) {
      // 检查关键词匹配
      for (const keyword of category.keywords) {
        if (content.includes(keyword.toLowerCase())) {
          return category.name;
        }
      }

      // 检查物体匹配
      for (const obj of analysis.objects) {
        for (const keyword of category.keywords) {
          if (obj.toLowerCase().includes(keyword.toLowerCase())) {
            return category.name;
          }
        }
      }
    }

    // 默认返回最通用的类别
    return '插画设计';
  }

  /**
   * 判断设计风格（基于Skills指南的风格定义）
   */
  private determineStyle(analysis: ImageAnalysisResult): string {
    const features = analysis.visual_features;

    // 基于视觉特征判断风格
    if (features.shapes.some(s => s.includes('几何') || s.includes('方形'))) {
      if (features.texture.includes('平滑') || features.texture.includes('纯色')) {
        return '现代简约';
      }
    }

    if (features.shapes.some(s => s.includes('有机') || s.includes('曲线'))) {
      return '自然流畅';
    }

    if (features.lines.some(l => l.includes('粗') || l.includes('bold'))) {
      return '大胆醒目';
    }

    return '平衡稳重';
  }

  /**
   * 获取适用的设计规则
   */
  private getApplicableRules(categoryName: string): string[] {
    // 查找对应类别
    for (const category of Object.values(this.skills.categories)) {
      if (category.name === categoryName) {
        return [
          ...category.common_rules,
          ...this.skills.general_rules.design_principles
        ];
      }
    }

    return this.skills.general_rules.design_principles;
  }

  /**
   * 生成设计建议（基于Skills指南）
   */
  private generateRecommendations(
    analysis: ImageAnalysisResult,
    categoryName: string
  ): {
    color_scheme: string;
    style_direction: string;
    improvements: string[];
  } {
    const improvements: string[] = [];

    // 基于Skills规则生成改进建议
    if (analysis.colors.primary.length > 3) {
      improvements.push('建议简化配色方案，主色不超过3种');
    }

    if (analysis.composition.balance === '不对称' && categoryName === 'Logo设计') {
      improvements.push('Logo设计建议使用对称或平衡的构图');
    }

    if (analysis.technical.image_quality.includes('模糊')) {
      improvements.push('提高图像清晰度和分辨率');
    }

    return {
      color_scheme: analysis.colors.primary.slice(0, 3).join(', '),
      style_direction: this.determineStyle(analysis),
      improvements
    };
  }
}
