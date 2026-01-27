/**
 * 图像分析结果接口
 * DeepSeek-VL作为"眼睛"，只输出客观信息
 */
export interface ImageAnalysisResult {
  // 客观描述
  content: string;           // 图片主要内容（客观描述）
  objects: string[];         // 识别到的物体

  // 视觉特征
  colors: {
    primary: string[];       // 主要颜色（hex格式）
    secondary: string[];     // 次要颜色
  };

  // 构图信息
  composition: {
    layout: string;          // 布局方式（居中、左对齐等）
    balance: string;         // 平衡性（对称、不对称）
    focal_point: string;     // 视觉焦点位置
  };

  // 风格特征（客观描述，不做判断）
  visual_features: {
    shapes: string[];        // 形状特征（几何、有机等）
    lines: string[];         // 线条特征（直线、曲线等）
    texture: string;         // 质感（平滑、粗糙等）
  };

  // 技术信息
  technical: {
    estimated_resolution: string;  // 估计分辨率
    image_quality: string;         // 图像质量（清晰、模糊等）
  };
}

/**
 * 设计分析结果接口
 * Skills指南作为"大脑"，基于客观信息做出设计决策
 */
export interface DesignAnalysisResult {
  // 设计决策（由Skills指南决定）
  matched_category: string;        // 匹配的设计类别
  design_style: string;            // 设计风格判断
  applicable_rules: string[];      // 适用的设计规则

  // 基于客观信息的建议
  recommendations: {
    color_scheme: string;          // 建议的配色方案
    style_direction: string;       // 风格方向
    improvements: string[];        // 改进建议
  };
}
