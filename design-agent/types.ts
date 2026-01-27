// 设计智能体类型定义

export interface DesignSkills {
  version: string;
  categories: {
    [key: string]: SkillCategory;
  };
  general_rules: GeneralRules;
}

export interface SkillCategory {
  name: string;
  keywords: string[];
  templates: SkillTemplate[];
  common_rules: string[];
}

export interface SkillTemplate {
  name: string;
  tags: string[];
  base_prompt: string;
  style_modifiers: string[];
  color_schemes: string[];
  requirements: string[];
}

export interface GeneralRules {
  quality_standards: string[];
  design_principles: string[];
  prompt_optimization: {
    positive_keywords: string[];
    negative_keywords: string[];
    structure: string;
  };
}

export interface SimilarityResult {
  category: string;
  score: number;
  matchedKeywords: string[];
  template?: SkillTemplate;
}

export enum Strategy {
  SKILLS_ONLY = 'SKILLS_ONLY',
  SKILLS_WEB = 'SKILLS_WEB',
  WEB_SKILLS = 'WEB_SKILLS'
}

export interface PromptGenerationResult {
  prompt: string;
  negativePrompt: string;
  strategy: Strategy;
  category?: string;
  confidence: number;
}

export interface QualityCheckResult {
  passed: boolean;
  issues: string[];
  optimizedPrompt?: string;
}
