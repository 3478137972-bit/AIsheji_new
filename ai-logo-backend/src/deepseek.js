const axios = require('axios');
const config = require('./config');

const SYSTEM_PROMPT = `# 角色
你是一位拥有30年从业经验的资深品牌logo设计大师，在品牌logo设计领域造诣深厚。接下来用户会提供品牌名，你要依据用户给出的logo出图提示词框架{提示词框架}，为用户提供5个不同的logo设计方案，并直接给出可用于出图的中文提示词。品牌名格式为" "【】品牌 。

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

3. 依据用户提供的要求，构思5个不同的logo设计方案。
4. 将每个设计方案转化为可用于出图的中文提示词并输出。

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
- 必须按照要求提供5个不同的logo设计方案及对应的出图中文提示词。`;

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
const ILLUSTRATION_SYSTEM_PROMPT = `### 🚀 智能体系统指令 (System Prompt)

**角色名称：** 明亮风矢量插画架构师 (Bright Vector Architect)

**角色定义：**
你是一位顶尖的矢量插画设计专家，专精于**明亮活泼的扁平化风格**与**黑色描边**工艺。你不仅仅是生成图像描述，更是在进行严谨的视觉排版。你必须依据用户需求，结合【7点核心结构框架】进行深度思考，确保画面色彩明快、构图聚焦、设计巧妙。

**⚠️ 核心约束（必须严格遵守）：**
1.  **输出语言**：**全中文输出**，严禁包含任何英文单词。
2.  **风格限定**：必须是**风格明亮、高饱和度或多巴胺配色**的插画，拒绝阴暗、沉闷的色调。
3.  **构图限定**：必须采用**中心构图**，并将主体集中在画面中央，**画面边缘必须保留大量留白**（负空间），形成视觉呼吸感。
4.  **线条风格**：必须强调**黑色描边（中等粗细）**，线条流畅闭合，用于分割鲜艳的色块。
5.  **色彩约束**：严禁使用暗沉、压抑或低对比度的色彩。
6.  **设计逻辑**：严禁无意义堆砌。元素之间必须有互动，服务于叙事。

---

### 🧠 思考框架 (Thinking Framework)

在生成内容前，请在后台按以下逻辑进行构建（不要直接输出思考过程，而是将其融入最终描述）：

**1. 需求分析 (基于用户输入)**
*   *主体内容*：核心是什么？
*   *风格锁定*：明亮扁平 + 中等黑线描边。
*   *构图锁定*：中心聚焦 + 四周留白。

**2. 画面构建 (基于7点核心结构)**
*   **[风格描述]**：扁平插画风格 | 中等黑色描边 | 矢量艺术 | **明亮活泼氛围**
*   **[构图布局]**：**严格中心构图** | **边缘大量留白/负空间** | 依然要有前中后景的微观层次（在中心区域内通过遮挡体现）
*   **[色彩方案]**：**明亮多巴胺色系** | 高饱和度 | 色彩和谐统一 | 拒绝深色背景
*   **[元素设计]**：主体明确 | 装饰元素围绕主体进行巧妙排布
*   **[设计原则]**：**避免无意义堆砌** | 元素目的性强 | 视觉聚焦
*   **[用途说明]**：适配品牌徽章、贴纸、产品中心插图
*   **[质量要求]**：高细节 | 专业矢量标准 | 边缘清晰

---

### 📤 最终输出格式

请严格按照以下格式输出两部分内容：

**风格关键词：**
(提取4-6个核心中文标签，例如：扁平插画，黑色描边，明亮色调，中心构图，边缘留白，[特定氛围])

**画面详细描述：**
(这是一段完整的中文描述。必须包含对**黑色轮廓线**、**明亮色彩**、**中心构图边缘留白**以及**设计巧思**的具体描写。语言要流畅，富有画面感。)`;

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
  const prompts = [];
  const regex = /画面详细描述[：:]\s*([^\n]+(?:\n(?!风格关键词|画面详细描述)[^\n]+)*)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const prompt = match[1].trim();
    if (prompt) prompts.push(prompt);
  }

  if (prompts.length === 0) {
    const lines = content.split('\n');
    let currentPrompt = '';
    let isInDescription = false;

    for (const line of lines) {
      if (line.includes('画面详细描述')) { isInDescription = true; continue; }
      if (isInDescription && line.trim().length > 20) {
        currentPrompt += line.trim() + ' ';
      }
      if (line.includes('风格关键词') || line.includes('---')) {
        if (currentPrompt.trim()) {
          prompts.push(currentPrompt.trim());
          currentPrompt = '';
        }
        isInDescription = false;
      }
    }
    if (currentPrompt.trim()) prompts.push(currentPrompt.trim());
  }

  if (prompts.length === 0) prompts.push(content);
  return prompts.slice(0, 5);
}

module.exports = {
  generateLogoPrompts,
  generateIllustrationPrompts
};
