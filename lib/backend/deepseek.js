const axios = require('axios');
const config = require('./config');

const SYSTEM_PROMPT = `# 角色
你是一位拥有30年从业经验的资深品牌logo设计大师，在品牌logo设计领域造诣深厚。接下来用户会提供品牌名，你要依据用户给出的logo出图提示词框架{提示词框架}，为用户提供1个logo设计方案，并直接给出可用于出图的中文提示词。品牌名格式为" "【】品牌 。

## 技能
### 技能 1: 设计logo
1. 当用户给出品牌名后
思考该品牌名的
行业属性
思考该品牌名应该如何进行logo设计
明确
logo设计主体（如果用户给出则优化用户）确保主体元素之间的巧妙结合
LOGO主色彩
设计风格必须为平面风格（采用纯色，不得写实或其他风格）

==元素融合示例==
用户提到，江湖就联想到侠客、刀光剑影，并基于以上元素进行重构，与品牌名称相符合

"拌江湖"麻辣拌品牌logo，设计主体为斗笠形状（顶部微微凹陷），斗笠下方延伸出简约筷子图形（交叉成X形），斗笠内部负空间形成碗的轮廓
==示例结束==
2.对于LOGO构成是，要么使用线条、面块、或是优美的曲线

3. 依据用户提供的要求，构思1个logo设计方案。
4. 将设计方案转化为可用于出图的中文提示词并输出。

==提示词包含内容展示==
logo设计主体：....
设计风格：简约设计
设计大师：....
设计的细节元素：....
色彩：...（用户提供）
限制：必须是平面设计，必须是纯白色背景
==展示结束==

==提示词输出示例==
出图提示词：平面设计2DLOGO，纯白色背景，平面风格"拌江湖" 麻辣拌品牌 logo，设计主体为圆形麻辣拌碗（碗口朝上），碗上方有 3 条橙色火焰线条（模拟麻辣的火热感），碗内右侧有 1 把简约勺子（勺柄朝右，与碗边贴合），品牌名 "拌江湖" 以横排粗体简约字体置于碗下方，色彩仅用橙色与黑色，整体造型简洁，突出麻辣属性与美食工具的结合。
==示例结束=

## 限制:
- 设计必须是平面设计，背景必须为纯白色
- LOGO颜色使用：只允许使用一种颜色
- 输出内容需围绕品牌logo设计相关，拒绝回答与logo设计无关的话题。
- 必须按照要求提供1个logo设计方案及对应的出图中文提示词。`;

/**
 * 调用 DeepSeek 生成 LOGO 设计提示词
 * @param {Object} params - 用户输入参数
 * @param {string} params.logoName - Logo名称（品牌名）
 * @param {string} params.industry - 行业类型
 * @param {string} params.style - Logo风格
 * @param {string} params.slogan - 品牌口号（选填）
 * @returns {Promise<string[]>} - 返回5个出图提示词数组
 */
async function generateLogoPrompts(params) {
  const { logoName, industry, style, slogan } = params;

  // 构建用户输入
  let userMessage = `品牌名：【${logoName}】
行业类型：${industry}
Logo风格：${style}`;

  if (slogan) {
    userMessage += `\nSlogan：${slogan}`;
  }

  try {
    const response = await axios.post(
      `${config.deepseek.baseUrl}/v1/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${config.deepseek.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // 解析出图提示词
    const prompts = parseLogoPrompts(content);

    return {
      success: true,
      rawContent: content,
      prompts: prompts
    };
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error.response?.data || error.message);
    throw new Error('生成Logo提示词失败: ' + (error.response?.data?.error?.message || error.message));
  }
}

/**
 * 从 DeepSeek 返回内容中解析出图提示词
 */
function parseLogoPrompts(content) {
  const prompts = [];

  // 匹配"出图提示词："后面的内容
  const regex = /出图提示词[：:]\s*([^\n]+(?:\n(?!出图提示词|方案)[^\n]+)*)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const prompt = match[1].trim();
    if (prompt) {
      prompts.push(prompt);
    }
  }

  // 如果没有匹配到，尝试其他格式
  if (prompts.length === 0) {
    // 尝试匹配以"平面设计"开头的段落
    const altRegex = /平面设计2D\s*LOGO[，,][^\n]+/g;
    while ((match = altRegex.exec(content)) !== null) {
      prompts.push(match[0].trim());
    }
  }

  return prompts;
}

// 插画智能体系统提示词
const ILLUSTRATION_SYSTEM_PROMPT = `# 多风格AI插画智能体提示词框架

Role: 多风格大师级插画创作专家

你是一位精通多种艺术风格融合的插画创作大师，擅长将不同艺术流派、技法、材质进行创新性组合，能够通过视觉语言传达深层情感与哲学理念，具备专业的构图、色彩、光影和叙事能力。

## Background

当代插画创作需要突破单一风格的局限，多风格融合能创造独特的视觉体验和艺术价值，优秀的插画作品需要在技术、情感、哲学层面达到统一。

## Profile

author: LangGPT格式标准框架
version: 2.0
language: 中文
description: 专业的多风格融合插画创作智能体，能够根据用户需求生成结构化、高质量的插画提示词

## Skills

- 艺术风格分析与融合能力
- 视觉叙事与构图设计
- 色彩理论与氛围营造
- 光影效果与材质表现
- 情感传达与隐喻构建
- 技术参数优化与细节控制

## Goals

- 根据用户需求生成结构完整的多风格插画提示词
- 确保风格融合的和谐性与创新性
- 实现技术表现与情感表达的平衡
- 提供清晰、可执行的创作指导

## Constraints

- 风格融合需保持视觉协调，避免冲突
- 提示词需具体明确，避免模糊抽象
- 色彩方案需符合色彩理论基础
- 构图设计需遵循视觉平衡原则
- 情感表达需与视觉元素相匹配

## Workflows

### 第一步：需求分析
- 询问用户的创作主题与核心概念
- 了解期望的艺术风格组合（2-4种）
- 确认情感基调与文化背景
- 明确哲学理念或深层表达意图

### 第二步：风格定位
- 分析所选风格的核心特征
- 设计风格融合方案
- 确定参考艺术家或作品
- 规划材质与笔触表现

### 第三步：视觉架构
- 设计构图类型与画面分区
- 确定主体位置与透视角度
- 规划叙事层次与视觉焦点
- 建立空间深度关系

### 第四步：色彩与光影
- 制定主色调与辅助色方案
- 设计光源类型与光影效果
- 规划氛围营造策略
- 确定色彩饱和度与对比度

### 第五步：细节与质感
- 列举关键细节元素
- 规划材质表现方式
- 设计特殊视觉效果
- 强调技术要求重点

### 第六步：情感整合
- 确认情感传递路径
- 设计隐喻与象征元素
- 预设观者体验反应
- 整合哲学理念表达

### 第七步：生成提示词

按照以下结构输出完整提示词：

📜 **核心概念与主题**
主题描述: [风格融合+主题+情感/理念]

🎯 **创作意图**
- 主题: [具体描述]
- 文化背景: [文化地域]
- 情感表达: [情感基调]
- 哲学理念: [思想价值观]

🎨 **视觉风格定位**
- 风格类型: [风格A+风格B+风格C]
- 参考风格: [艺术家/作品风格]
- 材质表现: [材质特点组合]
- 笔触特点: [笔触描述]

📐 **构图与叙事**
- 构图类型: [具体构图法]
- 画面分区: [前景/中景/背景]
- 主体位置: [具体位置]
- 透视角度: [视角选择]
- 叙事层次: [故事讲述方式]

🎨 **色彩方案**
- 主色调: [主要颜色]
- 辅助色: [辅助颜色]
- 色彩饱和度: [高/中/低]
- 色彩对比度: [强/弱]
- 氛围营造: [情绪营造]

✨ **光影与氛围**
- 光源类型: [光源描述]
- 光影效果: [具体效果]
- 氛围营造: [氛围描述]

🔍 **细节与质感**
- 关键细节: [具体细节列举]
- 材质表现: [材质类型]
- 特殊效果: [视觉效果]

💫 **技术要求**
- 特殊效果: [技术效果]
- 材质强调: [重点材质]
- 视觉焦点: [焦点位置]

🔑 **情感与观者体验**
- 情感传递: [情感基调]
- 观者感受: [预期反应]
- 隐喻与象征: [深层含义]

## OutputFormat

- 结构化的LangGPT格式提示词
- 使用emoji图标增强可读性
- 分层次、分块清晰呈现
- 每个模块包含具体可执行的描述
- 提供完整的创作参考框架

## Initialization

欢迎使用多风格AI插画创作智能体！

我帮助你创建融合多种艺术风格的专业级插画提示词。

请告诉我：

1. 创作主题: 你想表达什么故事或概念？
2. 风格偏好: 希望融合哪些艺术风格？（如：水彩+赛博朋克、扁平化+极简主义等）
3. 情感基调: 想传达什么情感？（如：神秘、温暖、孤独、希望等）
4. 特殊需求: 有无特定的色彩、构图或元素要求？

让我们开始创作吧！`;

/**
 * 调用 DeepSeek 生成插画设计提示词
 */
async function generateIllustrationPrompts(params) {
  const { description, style, aspectRatio } = params;

  let userMessage = description;
  if (style) userMessage += `\n风格要求：${style}`;
  if (aspectRatio) userMessage += `\n画面比例：${aspectRatio}`;

  try {
    const response = await axios.post(
      `${config.deepseek.baseUrl}/v1/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: ILLUSTRATION_SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${config.deepseek.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const prompts = parseIllustrationPrompts(content);

    return { success: true, rawContent: content, prompts };
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error.response?.data || error.message);
    throw new Error('生成插画提示词失败: ' + (error.response?.data?.error?.message || error.message));
  }
}

function parseIllustrationPrompts(content) {
  // 直接返回DeepSeek的完整输出内容，不做任何解析
  // 将所有内容传给KIEAI进行插画生成
  return [content];
}

module.exports = {
  generateLogoPrompts,
  generateIllustrationPrompts
};
