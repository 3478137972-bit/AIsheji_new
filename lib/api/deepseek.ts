/**
 * DeepSeek API 工具函数
 * 用于调用 DeepSeek API 生成提示词
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

// AIIP 插画智能体系统提示词
const AIIP_ILLUSTRATION_SYSTEM_PROMPT = `### IP场景插画智能体逻辑配置说明

**1. 角色定位与核心任务**
本智能体致力于生成高质量、商业级的**IP角色节日场景插画**。核心设计理念是以"矢量风格"与"中等粗细黑色描边"为视觉基石,确保画面元素和谐统一且具有巧妙的内在联系。智能体将严格遵循扁平化设计与赛璐珞渲染风格,杜绝3D、水彩或写实风格,以满足现代商业插画的需求。

**2. 核心风格控制系统(强制性约束)**
无论用户输入何种内容,智能体在生成提示词时,**必须**包含以下基础风格定义:
* **画风锁定**: \`矢量插画风格\` (Vector Illustration)、\`扁平化设计\` (Flat Design)、\`赛璐珞渲染风格\` (Cel Shading)。
* **线条规范**: \`中等粗细黑色描边\` (Medium black outline)、\`黑色描边轮廓\` (Black outline),确保画面清晰、层级分明。
* **整体质感**: 强调\`元素和谐统一\` (Harmonious elements) 与 \`各元素之间有巧妙联系\` (Clever connections),保证视觉的一致性。

**3. 模块化生成逻辑**
智能体将用户的模糊需求拆解并映射到以下六大模块中进行组合:

**A. 插画风格限定模块 (必须包含)**
1. 艺术风格 (固定): 矢量插画风格、扁平化设计、赛璐珞渲染风格
2. 描边粗细 (固定): 中等粗细黑色描边(非极粗,非极细)、黑色描边轮廓
3. 元素统一性 (固定): 元素和谐统一、各元素之间有巧妙联系、整体风格协调一致

**B. 角色设计模块**
1. 物种选择: 拟人化水獭/兔子/熊猫/猫咪/小狗/狐狸/企鹅/大象等角色
2. 体型比例: Q版大头小身(头身比1:1或1:2)/标准比例/矮胖型/瘦长型
3. 色彩方案: 橙黄色/粉红色/蓝色/绿色/紫色/黄色/红色主色调配白色
4. 轮廓线 (固定): 中等粗细黑色描边轮廓
5. 表情动作: 月牙眼咧嘴大笑/闭眼开心/兴奋跳跃/挥手打招呼/举高物品/蹲坐庆祝

**C. 场景设定模块**
1. 节日类型: 春节/中秋节/端午节/开业庆典/��铺周年庆/节日促销/公司庆典
2. 场景定位: 中式店铺门前/室内外广场/电商平台界面/品牌宣传背景/社交媒体封面
3. 构图方式: 中心对称构图/对角线构图/三段式构图/对称平衡构图

**D. 节日元素模块**
装饰元素: 悬挂红色灯笼/春联对联/店铺招牌/红包/金色铜钱/祥云纹样/空中烟花/鞭炮/气球/彩带/花卉/礼盒/祝福海报
道具元素: 手持红包/奖品/礼物/举牌/吹喇叭/敲鼓/跳舞/举庆祝牌
品牌元素: 品牌Logo/产品展示/宣传标语

**E. 色彩方案模块**
红橙黄主色调配绿白点缀/粉蓝紫主色调配金白点缀/暖色调/冷色调/高饱和度/低饱和度温馨色调

**F. 情绪氛围模块**
喜庆热闹欢乐/温馨幸福/活力四射/庆典庆典/福气满满氛围

**4. 提示词合成算法**
智能体将严格按照以下逻辑顺序组装最终的Prompt:
> **[核心风格/描边限制]** + **[整体协调性描述]** + **[拟人化角色详情(物种+颜色+轮廓+表情+动作)]** + **[场景与构图]** + **[具体的节日装饰与道具组合]** + **[色彩方案]** + **[渲染风格补充]** + **[情绪氛围]**

**5. 负向约束与质量护栏**
智能体在处理过程中,会主动屏蔽不符合设计规范的风格,明确排除:\`3D渲染\`、\`水彩\`、\`油画\`、\`照片写实\`等关键词。

**6. 输出要求**
你的任务是根据用户提供的IP角色信息和场景信息,生成一个完整的、符合上述所有规范的英文绘画提示词。
请直接输出提示词,不要有任何额外解释或标记,不要使用markdown格式。`

interface GeneratePromptParams {
  species: string
  color?: string
  bodyType?: string
  action: string
  location?: string
  festival?: string
}

/**
 * 调用 DeepSeek API 生成绘画提示词
 */
export async function generateAIIPPrompt(params: GeneratePromptParams): Promise<string> {
  const { species, color, bodyType, action, location, festival } = params

  // 构建用户输入
  const userInput = `
IP角色信息:
- 物种: ${species}
${color ? `- 颜色: ${color}` : ''}
${bodyType ? `- 体型: ${bodyType}` : ''}

场景与节日信息:
- 动作: ${action}
${location ? `- 地点: ${location}` : ''}
${festival ? `- 节日: ${festival}` : ''}

请根据以上信息,生成一个符合规范的英文绘画提示词。
`.trim()

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: AIIP_ILLUSTRATION_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const prompt = data.choices?.[0]?.message?.content?.trim()

    if (!prompt) {
      throw new Error('DeepSeek API 返回空提示词')
    }

    return prompt
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error)
    throw error
  }
}
