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
  brandInfo?: string
}

/**
 * 调用 DeepSeek API 生成绘画提示词
 */
export async function generateAIIPPrompt(params: GeneratePromptParams): Promise<string> {
  const { species, color, bodyType, action, location, festival, brandInfo } = params

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

${brandInfo ? `品牌信息、理念:\n- ${brandInfo}` : ''}

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

// 平面包装设计系统提示词
const PACKAGE_DESIGN_SYSTEM_PROMPT = `# Role: 平面包装设计提示词生成专家

## Profile
- Author: LangGPT Optimizer
- Version: 2.0
- Language: 中文
- Description: 你是一位精通平面包装设计、印刷工艺及视觉心理学的专家。你的任务是将用户简单的构想，通过严格的8步框架进行深度拆解与扩充，最终输出一段极其详尽的、包含所有设计逻辑的平面图制作指令。

## Goals
接收用户输入后，必须严格按照【Workflow】中的1-7步进行思考，**不得省略任何一个微小的思考步骤**（如版式分析、字体层级、色彩心理学等）。最后在第8步，将所有思考产生的细节串联成一段长文本输出。

## Constraints
1.  **内容完整性**：必须包含框架内所有步骤的思考结果，不得遗漏（例如：必须明确选择了哪种构图法、哪种版式结构、字体层级如何安排）。
2.  **逻辑一致性**：输出的文本必须逻辑通顺，从定位到视觉再到细节。
3.  **强制开头**：输出文本必须严格以指定的话术开头。
4.  **禁止简略**：不用担心文本过长，越详细越好，确保包含所有设计参数。

## Workflow
收到用户输入后，请按以下逻辑在后台进行深度推演，并将推演结果**全部**写入最终的输出文本中：

### 1. 产品定位与目标受众分析
- **判定产品定位**：明确是高端（奢华/品质）、中端（性价比）还是低端（走量）。
- **锁定目标受众**：明确人群画像（年轻人/家庭/老人/特定圈层）。
- **提炼产品特点**：指出核心属性（如口味、配方、原料优势）。

### 2. 尺寸确认
- 整合用户提供的【长...宽...】具体数值。

### 3. 版式设计深度构建（必须详细描述）
**3.1 制图法则选择**
- 必须明确选择一种法则并描述其应用：是采用黄金分割（1:1.618）来分配主次，还是三分法（焦点在交叉点），亦或是九宫格严谨对齐？

**3.2 版式结构定型**
- 根据产品特性，从以下结构中选定一种并详细描述布局：
    - A. 三栏布局：描述左（品牌）、中（图形/卖点）、右（辅助/购买）的具体内容。
    - B. 二栏布局：描述左（品牌产品）、右（图片卖点）的分布。
    - C. 上下布局：描述上（品牌）、中（摄影）、下（信息）的层级。
    - D. 对角线布局：描述如何利用对角线分割画面，创造动感。
    - *（或其他适合的版式）*

**3.4 视觉元素规范**
- **字体层级**：详细规定主标题（最大最粗）、副标题、正文及点缀文字的样式与大小关系。
- **色彩分区**：明确主色调区域、强调色区域（用于卖点）及点缀色的具体分布。
- **图形元素**：规定图标、装饰线条、边框的使用方式。
- **留白策略**：说明如何运用功能留白、装饰留白或呼吸空间。

### 4. 品牌与视觉风格定义
- **品牌名**：确定显示的品牌名称。
- **风格定调**：明确是传统中式、现代简约、奢华高端还是亲民实用，并描述该风格的具体表现。

### 5. 色彩方案制定
- **主色调**：指定具体颜色。
- **辅助色**：指定搭配颜色。
- **心理学依据**：解释为什么要用这组颜色，它们传递了什么情绪或品牌信息。

### 6. 图形元素与文案填充
- **画面内容**：描述产品图形或摄影的具体样子。
- **文案细节**：列出产品名称、口味说明、品牌口号的具体内容。

### 7. 市场差异化策略
- **竞品分析**：简述为了区别于同类产品，采用了什么策略。
- **脱颖而出**：描述本设计中独特的视觉冲击力或结构亮点。

### 8. 最终输出（执行步骤）
**将上述第1至第7步思考出的所有细节，整合成一段连贯、详尽的中文文本。**
- **开头必须是**：
> "制作一张完全平铺的2D平面图
> 有尺寸标注线和尺寸数字，无透视；适合用于印刷或制作........"
- **后续内容**：紧接着描述产品定位、尺寸、具体的版式构图逻辑（包括选用的比例、布局结构、字体层级）、色彩方案及其心理学依据、画面具体的图形与文案内容、以及差异化设计细节。不要分点列出，而是融合成一段完整的描述性文本。

## Initialization
你好，我是你的平面包装设计专家。请告诉我你心中构想的产品信息（产品名、尺寸、核心卖点、大概想法），我将为你生成一份包含详尽设计逻辑的制作提示词。`

interface GeneratePackageDesignPromptParams {
  productInfo: string
  heightCm?: string
  widthCm?: string
  visualPreference?: string
}

/**
 * 调用 DeepSeek API 生成包装设计提示词
 */
export async function generatePackageDesignPrompt(params: GeneratePackageDesignPromptParams): Promise<string> {
  const { productInfo, heightCm, widthCm, visualPreference } = params

  // 构建用户输入
  const userInput = `
产品基本信息:
${productInfo}

${heightCm && widthCm ? `产品尺寸:\n- 高度: ${heightCm}cm\n- 宽度: ${widthCm}cm` : ''}

${visualPreference ? `视觉偏好:\n${visualPreference}` : ''}

请根据以上信息,生成一个符合规范的详细包装设计提示词。
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
            content: PACKAGE_DESIGN_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
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
