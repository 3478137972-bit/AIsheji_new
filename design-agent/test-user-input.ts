import { DesignAgent } from './design-agent';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function testUserInput() {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: 未找到DEEPSEEK_API_KEY环境变量');
    process.exit(1);
  }
  const SKILLS_PATH = path.join(__dirname, '../design-skills.json');

  const agent = new DesignAgent(DEEPSEEK_API_KEY, SKILLS_PATH);

  const userInput = '帮我设计一个头戴式耳机的场景海报';

  console.log('🎨 用户需求:', userInput);
  console.log('⏳ 正在调用 DeepSeek 生成设计提示词...\n');

  const result = await agent.generate(userInput);

  console.log('\n📋 生成结果:');
  console.log(JSON.stringify(result, null, 2));
}

testUserInput().catch(console.error);
