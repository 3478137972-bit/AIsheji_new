// 智能工具数据
export interface Tool {
  id: number;
  name: string;
  category: string;
  desc: string;
  usage: string;
  icon: string;
  link?: string;
}

export const toolCategories = [
  { id: 'all', name: '全部' },
  { id: 'image', name: '图像生成' },
  { id: 'video', name: '视频创作' },
  { id: 'writing', name: '文案写作' },
  { id: 'voice', name: '语音处理' },
  { id: 'data', name: '数据分析' },
  { id: 'coding', name: '编程辅助' },
  { id: 'learning', name: '学习教育' },
  { id: 'productivity', name: '效率办公' },
  { id: 'other', name: '其他工具' },
];

export const tools: Tool[] = [
  { id: 1, name: 'Midjourney', category: 'image', desc: '文生图、图生图，高质量艺术创作', usage: '100w+' },
  { id: 2, name: 'Stable Diffusion', category: 'image', desc: '开源文生图模型', usage: '80w+' },
  { id: 3, name: 'DALL-E 3', category: 'image', desc: 'OpenAI文生图工具', usage: '70w+' },
  { id: 4, name: 'Leonardo AI', category: 'image', desc: '专业级AI绘画平台', usage: '50w+' },
  { id: 5, name: 'Adobe Firefly', category: 'image', desc: 'Adobe集成AI图像生成', usage: '45w+' },
  { id: 6, name: 'Canva AI', category: 'image', desc: '设计+AI作图', usage: '90w+' },
  { id: 7, name: 'Runway ML', category: 'image', desc: 'AI图像和视频编辑', usage: '40w+' },
  { id: 8, name: 'Edit Photos Online', category: 'image', desc: 'AI照片编辑工具', usage: '30w+' },
  { id: 9, name: 'ChatGPT Video', category: 'video', desc: 'Text to Video生成', usage: '60w+' },
  { id: 10, name: 'Synthesia', category: 'video', desc: 'AI数字人视频生成', usage: '25w+' },
  { id: 11, name: 'Pictory', category: 'video', desc: '文案转视频', usage: '20w+' },
  { id: 12, name: 'InVideo AI', category: 'video', desc: 'AI视频编辑器', usage: '35w+' },
  { id: 13, name: 'Runway Gen-2', category: 'video', desc: 'AI视频生成和编辑', usage: '40w+' },
  { id: 14, name: 'HeyGen', category: 'video', desc: 'AI视频-avatar生成', usage: '30w+' },
  { id: 15, name: 'Lumen5', category: 'video', desc: 'AI视频制作平台', usage: '15w+' },
  { id: 16, name: 'VEED.io', category: 'video', desc: '在线视频编辑AI工具', usage: '50w+' },
  { id: 17, name: 'ChatGPT', category: 'writing', desc: '通用AI对话助手', usage: '500w+' },
  { id: 18, name: 'Claude', category: 'writing', desc: 'Anthropic AI助手', usage: '200w+' },
  { id: 19, name: 'Copilot', category: 'writing', desc: '微软AI写作助手', usage: '300w+' },
  { id: 20, name: 'Jasper', category: 'writing', desc: 'AI营销内容生成', usage: '50w+' },
  { id: 21, name: 'Copy.ai', category: 'writing', desc: '商业文案生成', usage: '40w+' },
  { id: 22, name: 'Writesonic', category: 'writing', desc: 'AI写作助手', usage: '35w+' },
  { id: 23, name: 'Grammarly', category: 'writing', desc: 'AI语法检查和优化', usage: '150w+' },
  { id: 24, name: 'QuillBot', category: 'writing', desc: 'AI写作和改写工具', usage: '80w+' },
  { id: 25, name: 'ElevenLabs', category: 'voice', desc: 'AI语音合成', usage: '60w+' },
  { id: 26, name: 'Play.ht', category: 'voice', desc: 'AI语音生成器', usage: '25w+' },
  { id: 27, name: 'Resemble.ai', category: 'voice', desc: 'AI语音克隆', usage: '15w+' },
  { id: 28, name: 'Uberduck', category: 'voice', desc: 'AI语音合成平台', usage: '20w+' },
  { id: 29, name: 'Lovo.ai', category: 'voice', desc: 'AI语音生成', usage: '30w+' },
  { id: 30, name: 'Descript', category: 'voice', desc: '音频编辑和转写', usage: '40w+' },
  { id: 31, name: 'Sonantic', category: 'voice', desc: 'AI语音合成', usage: '10w+' },
  { id: 32, name: 'Speechify', category: 'voice', desc: 'AI文本转语音', usage: '50w+' },
  { id: 33, name: 'Tableau', category: 'data', desc: 'AI驱动数据可视化', usage: '100w+' },
  { id: 34, name: 'Power BI', category: 'data', desc: 'Microsoft数据分析', usage: '200w+' },
  { id: 35, name: 'Google Data Studio', category: 'data', desc: 'Google数据报告', usage: '150w+' },
  { id: 36, name: 'DataRobot', category: 'data', desc: 'AI自动化机器学习', usage: '25w+' },
  { id: 37, name: 'Datawrapper', category: 'data', desc: '简单数据可视化', usage: '30w+' },
  { id: 38, name: 'Flourish', category: 'data', desc: '动态数据可视化', usage: '20w+' },
  { id: 39, name: 'RAWGraphs', category: 'data', desc: '开源数据可视化', usage: '15w+' },
  { id: 40, name: 'veniqa', category: 'data', desc: 'AI数据分析助手', usage: '10w+' },
  { id: 41, name: 'GitHub Copilot', category: 'coding', desc: 'AI代码补全', usage: '100w+' },
  { id: 42, name: 'ChatGPT', category: 'coding', desc: '代码生成和调试', usage: '200w+' },
  { id: 43, name: 'Tabnine', category: 'coding', desc: 'AI代码助手', usage: '50w+' },
  { id: 44, name: 'Codeium', category: 'coding', desc: 'AI编程工具', usage: '40w+' },
  { id: 45, name: 'Replit', category: 'coding', desc: 'AI编程平台', usage: '60w+' },
  { id: 46, name: 'Sourcegraph', category: 'coding', desc: 'AI代码搜索', usage: '25w+' },
  { id: 47, name: 'DeepCode', category: 'coding', desc: 'AI代码审查', usage: '20w+' },
  { id: 48, name: 'Duolingo', category: 'learning', desc: 'AI语言学习', usage: '500w+' },
  { id: 49, name: 'Khan Academy', category: 'learning', desc: '免费在线教育', usage: '400w+' },
  { id: 50, name: 'Coursera', category: 'learning', desc: 'AI课程平台', usage: '300w+' },
  { id: 51, name: 'Udacity', category: 'learning', desc: '纳米学位', usage: '150w+' },
  { id: 52, name: 'Quizlet', category: 'learning', desc: 'AI学习卡', usage: '200w+' },
  { id: 53, name: 'Socratic', category: 'learning', desc: 'AI学习助手', usage: '100w+' },
  { id: 54, name: 'Brilliant', category: 'learning', desc: '互动学习', usage: '50w+' },
  { id: 55, name: 'Anki', category: 'learning', desc: 'AI记忆卡片', usage: '80w+' },
  { id: 56, name: 'Notion AI', category: 'productivity', desc: 'AI工作空间', usage: '200w+' },
  { id: 57, name: 'Slack GPT', category: 'productivity', desc: 'AI聊天助手', usage: '300w+' },
  { id: 58, name: 'ClickUp AI', category: 'productivity', desc: 'AI项目管理', usage: '50w+' },
  { id: 59, name: 'Asana AI', category: 'productivity', desc: 'AI任务管理', usage: '40w+' },
  { id: 60, name: 'Trello AI', category: 'productivity', desc: 'AI看板工具', usage: '30w+' },
  { id: 61, name: 'Zoho CRM', category: 'productivity', desc: 'AI客户管理', usage: '100w+' },
  { id: 62, name: 'Zendesk', category: 'productivity', desc: 'AI客服支持', usage: '80w+' },
  { id: 63, name: 'DocuSign', category: 'productivity', desc: 'AI文档处理', usage: '150w+' },
  { id: 64, name: 'Character.ai', category: 'other', desc: 'AI角色对话', usage: '100w+' },
  { id: 65, name: 'Poe', category: 'other', desc: 'AI机器人平台', usage: '50w+' },
  { id: 66, name: 'Perplexity', category: 'other', desc: 'AI回答引擎', usage: '60w+' },
  { id: 67, name: 'You.com', category: 'other', desc: 'AI搜索助手', usage: '40w+' },
  { id: 68, name: 'Meta.ai', category: 'other', desc: 'Meta AI助手', usage: '80w+' },
  { id: 69, name: 'Gemini', category: 'other', desc: 'Google AI助手', usage: '90w+' },
  { id: 70, name: 'LLaMA', category: 'other', desc: '开源AI模型', usage: '70w+' },
  { id: 71, name: 'Bloom', category: 'other', desc: '多语言AI模型', usage: '30w+' },
];

export const generateMoreTools = (): Tool[] => {
  const moreTools: Tool[] = [];
  const categories = ['image', 'video', 'writing', 'voice', 'data', 'coding', 'learning', 'productivity'];
  
  for (let i = 72; i <= 120; i++) {
    moreTools.push({
      id: i,
      name: `AI 工具 ${i - 71}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      desc: `这是一个强大的AI工具 ${i - 71}，提供各种功能`,
      usage: `${Math.floor(Math.random() * 100)}w+`,
      icon: 'tool',
    });
  }
  
  return moreTools;
};

export const allTools = [...tools, ...generateMoreTools()];
