import { DesignSkills, SkillCategory, SkillTemplate } from './types';

/**
 * Skills指南管理器
 * 负责加载和管理设计指南
 */
export class SkillsGuideManager {
  private skills: DesignSkills;

  constructor(skills: DesignSkills) {
    this.skills = skills;
  }

  /**
   * 获取所有类别名称
   */
  getCategoryNames(): string[] {
    return Object.keys(this.skills.categories).map(
      key => this.skills.categories[key].name
    );
  }

  /**
   * 根据类别key获取完整的设计指南
   */
  getGuideByCategory(categoryKey: string): {
    category: string;
    template: SkillTemplate;
    commonRules: string[];
    generalRules: any;
  } | null {
    const category = this.skills.categories[categoryKey];
    if (!category) return null;

    // 选择第一个模板作为默认（后续可以根据用户需求智能选择）
    const template = category.templates[0];

    return {
      category: category.name,
      template,
      commonRules: category.common_rules,
      generalRules: this.skills.general_rules
    };
  }

  /**
   * 根据类别名称获取类别key
   */
  getCategoryKeyByName(categoryName: string): string | null {
    for (const [key, category] of Object.entries(this.skills.categories)) {
      if (category.name === categoryName) {
        return key;
      }
    }
    return null;
  }

  /**
   * 智能选择最佳模板
   * 根据用户需求中的关键词选择最匹配的模板
   */
  selectBestTemplate(categoryKey: string, userInput: string): SkillTemplate {
    const category = this.skills.categories[categoryKey];
    if (!category || category.templates.length === 0) {
      throw new Error(`类别 ${categoryKey} 不存在或没有模板`);
    }

    const normalizedInput = userInput.toLowerCase();
    let bestTemplate = category.templates[0];
    let maxScore = 0;

    for (const template of category.templates) {
      let score = 0;

      // 检查模板名称匹配
      if (normalizedInput.includes(template.name.toLowerCase())) {
        score += 10;
      }

      // 检查标签匹配
      for (const tag of template.tags) {
        if (normalizedInput.includes(tag.toLowerCase())) {
          score += 5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTemplate = template;
      }
    }

    return bestTemplate;
  }

  /**
   * 获取完整的设计指南（包含智能模板选择）
   */
  getSmartGuide(categoryKey: string, userInput: string): {
    category: string;
    template: SkillTemplate;
    commonRules: string[];
    generalRules: any;
  } | null {
    const category = this.skills.categories[categoryKey];
    if (!category) return null;

    const template = this.selectBestTemplate(categoryKey, userInput);

    return {
      category: category.name,
      template,
      commonRules: category.common_rules,
      generalRules: this.skills.general_rules
    };
  }
}
