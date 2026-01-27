import { DesignAgent } from './design-agent';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// 加载环境变量
dotenv.config();

/**
 * 交互式测试：带信息收集的提示词生成
 */
async function testInteractive() {
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

  // 定义问题回调函数
  const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
    console.log('\n' + '='.repeat(80));
    console.log('💬 需要收集以下信息：');
    console.log('='.repeat(80));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answers: Record<string, string> = {};

    for (const q of questions) {
      console.log(`\n❓ ${q.question}`);
      if (q.options && q.options.length > 0) {
        console.log('   可选项：');
        q.options.forEach((opt, idx) => {
          console.log(`   ${idx + 1}. ${opt}`);
        });
      }

      const answer = await new Promise<string>((resolve) => {
        rl.question('   您的回答: ', (ans) => {
          resolve(ans.trim());
        });
      });

      answers[q.key] = answer;
    }

    rl.close();

    return answers;
  };

  const result = await agent.generateInteractive(userInput, onQuestion);

  console.log('\n' + '='.repeat(80));
  console.log('📋 生成结果:');
  console.log('='.repeat(80));
  console.log(JSON.stringify(result, null, 2));
}

testInteractive().catch(console.error);
