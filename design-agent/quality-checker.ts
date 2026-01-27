/**
 * 质量检查器
 * 验证生成的提示词是否符合设计规范
 */
export class QualityChecker {
  /**
   * 检查提示词质量
   */
  check(prompt: string, negativePrompt: string): {
    passed: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // 1. 长度检查
    const wordCount = prompt.split(',').length;
    if (wordCount < 5) {
      issues.push('提示词过短，可能缺少必要的描述');
      score -= 20;
    } else if (wordCount > 50) {
      issues.push('提示词过长，可能影响生成效果');
      score -= 10;
    }

    // 2. 质量关键词检查（支持中英文）
    const qualityKeywords = ['high quality', 'professional', 'detailed', '8k', 'masterpiece', 'best quality', '高质量', '专业', '精细', '细节', '杰作'];
    const hasQualityKeyword = qualityKeywords.some(keyword =>
      prompt.toLowerCase().includes(keyword)
    );
    if (!hasQualityKeyword) {
      suggestions.push('建议添加质量关键词，如: 高质量, 专业, 精细细节');
      score -= 10;
    }

    // 3. 负向提示词检查
    if (!negativePrompt || negativePrompt.trim().length === 0) {
      suggestions.push('建议添加负向提示词以提高生成质量');
      score -= 5;
    }

    // 4. 基本结构检查
    const lowerPrompt = prompt.toLowerCase();
    const hasSubject = lowerPrompt.length > 10; // 简单检查是否有主体描述
    if (!hasSubject) {
      issues.push('缺少明确的主体描述');
      score -= 15;
    }

    // 5. 检查格式
    const isWellFormatted = prompt.includes(',') || prompt.includes('，') || prompt.includes(' ');
    if (!isWellFormatted) {
      suggestions.push('建议使用逗号分隔不同的描述元素');
      score -= 5;
    }

    const passed = score >= 70 && issues.length === 0;

    return {
      passed,
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  /**
   * 优化提示词
   */
  optimize(prompt: string, negativePrompt: string): {
    optimizedPrompt: string;
    optimizedNegativePrompt: string;
  } {
    let optimizedPrompt = prompt.trim();
    let optimizedNegativePrompt = negativePrompt.trim();

    // 1. 确保有质量关键词（支持中英文）
    const hasEnglishQuality = optimizedPrompt.toLowerCase().includes('high quality');
    const hasChineseQuality = optimizedPrompt.includes('高质量') || optimizedPrompt.includes('专业');

    if (!hasEnglishQuality && !hasChineseQuality) {
      optimizedPrompt += ', high quality, professional';
    }

    // 2. 确保有负向提示词
    if (!optimizedNegativePrompt) {
      optimizedNegativePrompt = 'blurry, low quality, distorted, watermark, text, signature';
    }

    // 3. 移除多余的空格和逗号
    optimizedPrompt = optimizedPrompt.replace(/\s+/g, ' ').replace(/,+/g, ',').trim();
    optimizedNegativePrompt = optimizedNegativePrompt.replace(/\s+/g, ' ').replace(/,+/g, ',').trim();

    // 4. 确保逗号后有空格
    optimizedPrompt = optimizedPrompt.replace(/,(?!\s)/g, ', ');
    optimizedNegativePrompt = optimizedNegativePrompt.replace(/,(?!\s)/g, ', ');

    return {
      optimizedPrompt,
      optimizedNegativePrompt
    };
  }
}
