import * as fs from 'fs';
import * as path from 'path';
import { DesignSkills, SimilarityResult, SkillCategory } from './types';

/**
 * 相似度计算器
 * 负责计算用户输入与Skills文档的匹配度
 */
export class SimilarityCalculator {
  private skills: DesignSkills;

  constructor(skillsPath: string) {
    const skillsData = fs.readFileSync(skillsPath, 'utf-8');
    this.skills = JSON.parse(skillsData);
  }

  /**
   * 计算用户输入与Skills的相似度
   */
  public calculate(userInput: string): SimilarityResult {
    const normalizedInput = this.normalizeText(userInput);
    const inputKeywords = this.extractKeywords(normalizedInput);

    let bestMatch: SimilarityResult = {
      category: '',
      score: 0,
      matchedKeywords: []
    };

    // 遍历所有类别，计算相似度
    for (const [categoryKey, category] of Object.entries(this.skills.categories)) {
      const result = this.calculateCategoryScore(
        inputKeywords,
        normalizedInput,
        categoryKey,
        category
      );

      if (result.score > bestMatch.score) {
        bestMatch = result;
      }
    }

    return bestMatch;
  }

  /**
   * 计算与特定类别的相似度分数
   */
  private calculateCategoryScore(
    inputKeywords: string[],
    normalizedInput: string,
    categoryKey: string,
    category: SkillCategory
  ): SimilarityResult {
    let score = 0;
    const matchedKeywords: string[] = [];

    // 1. 关键词精确匹配 (权重: 0.6)
    for (const keyword of category.keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        score += 0.6 / category.keywords.length;
        matchedKeywords.push(keyword);
      }
    }

    // 2. 标签匹配 (权重: 0.3)
    for (const template of category.templates) {
      for (const tag of template.tags) {
        if (normalizedInput.includes(tag.toLowerCase())) {
          score += 0.3 / (category.templates.length * template.tags.length);
        }
      }
    }

    // 3. 语义相关性 (权重: 0.1) - 简单的词汇重叠
    const overlap = this.calculateWordOverlap(inputKeywords, category.keywords);
    score += overlap * 0.1;

    // 选择最佳模板
    let bestTemplate = category.templates[0];
    let maxTemplateScore = 0;

    for (const template of category.templates) {
      let templateScore = 0;
      for (const tag of template.tags) {
        if (normalizedInput.includes(tag.toLowerCase())) {
          templateScore++;
        }
      }
      if (templateScore > maxTemplateScore) {
        maxTemplateScore = templateScore;
        bestTemplate = template;
      }
    }

    return {
      category: categoryKey,
      score: Math.min(score, 1), // 确保分数不超过1
      matchedKeywords,
      template: bestTemplate
    };
  }

  /**
   * 文本标准化
   */
  private normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    // 简单的分词，移除停用词
    const stopWords = ['的', '了', '是', '我', '你', '他', '她', '它', '们', '这', '那', '一个', '帮我', '请', '给'];
    const words = text.split(/[\s,，。！？、]+/);
    return words.filter(word => word.length > 1 && !stopWords.includes(word));
  }

  /**
   * 计算词汇重叠度
   */
  private calculateWordOverlap(words1: string[], words2: string[]): number {
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1.map(w => w.toLowerCase()));
    const set2 = new Set(words2.map(w => w.toLowerCase()));

    let overlap = 0;
    for (const word of set1) {
      if (set2.has(word)) overlap++;
    }

    return overlap / Math.max(set1.size, set2.size);
  }

  /**
   * 获取Skills数据
   */
  public getSkills(): DesignSkills {
    return this.skills;
  }
}

