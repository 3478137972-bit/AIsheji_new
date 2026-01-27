import { DesignAgent } from './design-agent';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 使用示例和测试
 */
async function main() {
  // 配置
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: 未找到DEEPSEEK_API_KEY环境变量');
    console.error('请在.env文件中配置: DEEPSEEK_API_KEY=your-api-key');
    process.exit(1);
  }
  const SKILLS_PATH = path.join(__dirname, '../design-skills.json');

  // 创建智能体实例
  const agent = new DesignAgent(DEEPSEEK_API_KEY, SKILLS_PATH);

  // 测试用例
  const testCases = [
    '帮我设计一个科技公司的Logo',
    '商品白底图',
    '证件照换蓝色背景',
    '设计一个促销海报',
    '扁平风格的插画'
  ];

  console.log('='.repeat(80));
  console.log('🎨 设计智能体测试');
  console.log('='.repeat(80));

  for (const testCase of testCases) {
    console.log('\n' + '='.repeat(80));
    const result = await agent.generate(testCase);

    if (result.success) {
      console.log('\n📋 最终结果:');
      console.log('─'.repeat(80));
      console.log(`✅ 类别: ${result.metadata.category}`);
      console.log(`📊 置信度: ${result.metadata.confidence}`);
      console.log(`💡 理由: ${result.metadata.reasoning}`);
      console.log(`🎨 设计要素: ${result.metadata.designElements.join(', ')}`);
      console.log('\n🎯 正向提示词:');
      console.log(result.prompt);
      console.log('\n🚫 负向提示词:');
      console.log(result.negativePrompt);
      console.log('\n⚙️  生成参数:');
      console.log(JSON.stringify(result.parameters, null, 2));
      console.log(`\n📊 质量评分: ${result.metadata.qualityScore}/100`);
    } else {
      console.log('\n❌ 生成失败');
      console.log(result.metadata.reasoning);
    }

    console.log('='.repeat(80));

    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 单个测试
async function testSingle() {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: 未找到DEEPSEEK_API_KEY环境变量');
    console.error('请在.env文件中配置: DEEPSEEK_API_KEY=your-api-key');
    process.exit(1);
  }
  const SKILLS_PATH = path.join(__dirname, '../design-skills.json');

  const agent = new DesignAgent(DEEPSEEK_API_KEY, SKILLS_PATH);

  const userInput = '帮我设计一个科技公司的Logo，要现代简约风格';

  const result = await agent.generate(userInput);

  console.log('\n📋 生成结果:');
  console.log(JSON.stringify(result, null, 2));
}

// 运行测试
if (require.main === module) {
  // 可以选择运行完整测试或单个测试
  // main().catch(console.error);
  testSingle().catch(console.error);
}

export { DesignAgent };
