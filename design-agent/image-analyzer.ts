import { DeepSeekClient } from './deepseek-client';
import { ImageAnalysisResult } from './image-types';

/**
 * 图像分析器 - DeepSeek-VL作为"眼睛"
 *
 * 职责：
 * - 只负责识别和提取图片的客观信息
 * - 不做设计决策
 * - 不生成设计建议
 * - 输出结构化的视觉信息供Skills指南使用
 */
export class ImageAnalyzer {
  constructor(private deepseek: DeepSeekClient) {}

  /**
   * 分析图片 - 提取客观视觉信息
   *
   * 注意：这里只提取客观信息，不做任何设计判断
   */
  async analyzeImage(imageBase64: string): Promise<ImageAnalysisResult> {
    const prompt = `
你是一个图像识别系统，只负责客观地描述图片内容，不做任何主观判断或设计建议。

请分析这张图片，提取以下客观信息，返回JSON格式：

{
  "content": "图片主要内容的客观描述",
  "objects": ["识别到的物体1", "物体2"],
  "colors": {
    "primary": ["#颜色1", "#颜色2", "#颜色3"],
    "secondary": ["#颜色4", "#颜色5"]
  },
  "composition": {
    "layout": "布局方式（如：居中、左对齐、网格等）",
    "balance": "平衡性（如：对称、不对称、放射状等）",
    "focal_point": "视觉焦点位置（如：中心、左上、右下等）"
  },
  "visual_features": {
    "shapes": ["形状特征（如：圆形、方形、三角形、几何、有机等）"],
    "lines": ["线条特征（如：直线、曲线、粗线、细线等）"],
    "texture": "质感描述（如：平滑、粗糙、渐变、纯色等）"
  },
  "technical": {
    "estimated_resolution": "估计的分辨率或清晰度",
    "image_quality": "图像质量（如：高清、模糊、有噪点等）"
  }
}

重要：
1. 只描述你看到的内容，不要做设计评价
2. 颜色用hex格式（#RRGGBB）
3. 所有描述都要客观、具体
4. 不要说"好看"、"专业"、"现代"等主观词汇
`;

    try {
      const result = await this.deepseek.chat([
        { role: 'system', content: '你是一个客观的图像识别系统。' },
        { role: 'user', content: prompt }
      ], 0.3); // 低温度确保客观性

      // 提取JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法解析图像分析结果');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      throw new Error(`图像分析失败: ${error.message}`);
    }
  }

  /**
   * 提取风格特征（客观）
   *
   * 只提取可观察的视觉特征，不做风格判断
   */
  async extractVisualFeatures(imageBase64: string): Promise<{
    dominant_colors: string[];
    shape_patterns: string[];
    line_styles: string[];
    spatial_arrangement: string;
  }> {
    const prompt = `
客观地提取这张图片的视觉特征，返回JSON：

{
  "dominant_colors": ["主导颜色的hex值"],
  "shape_patterns": ["观察到的形状模式"],
  "line_styles": ["线条风格描述"],
  "spatial_arrangement": "元素的空间排列方式"
}

只描述你看到的，不要推测设计意图。
`;

    const result = await this.deepseek.chat([
      { role: 'user', content: prompt }
    ], 0.3);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析视觉特征');
    }

    return JSON.parse(jsonMatch[0]);
  }
}
