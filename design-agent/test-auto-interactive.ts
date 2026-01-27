import { DesignAgent } from './design-agent';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 自动测试：模拟用户回答问题
 */
async function testAutoInteractive() {
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

  // 定义自动回答函数
  const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
    console.log('\n' + '='.repeat(80));
    console.log('💬 需要收集以下信息（自动回答）：');
    console.log('='.repeat(80));

    const answers: Record<string, string> = {};

    // 模拟用户回答
    const mockAnswers: Record<string, string> = {
      'style': '科技感/赛博朋克',
      'target_audience': '年轻游戏玩家',
      'mood': '沉浸感、未来科技',
      'color_preference': '冷色调（蓝色、紫色）',
      'scene': '游戏场景',
      'brand': '高端电竞品牌',
      'text_content': '主标题：沉浸音质，制霸战场 | 副标题：专业电竞耳机 | 产品名：APEX PRO X',
      'text_style': '大胆醒目，科技感字体',
      'aspect_ratio': '16:9'
    };

    for (const q of questions) {
      console.log(`\n❓ ${q.question}`);
      if (q.options && q.options.length > 0) {
        console.log('   可选项：');
        q.options.forEach((opt, idx) => {
          console.log(`   ${idx + 1}. ${opt}`);
        });
      }

      const answer = mockAnswers[q.key] || (q.options ? q.options[0] : '未指定');
      console.log(`   ✅ 自动回答: ${answer}`);
      answers[q.key] = answer;
    }

    return answers;
  };

  const result = await agent.generateInteractive(userInput, onQuestion);

  console.log('\n' + '='.repeat(80));
  console.log('📋 最终生成结果:');
  console.log('='.repeat(80));

  if (result.success) {
    console.log(`\n✅ 类别: ${result.metadata.category}`);
    console.log(`📊 置信度: ${result.metadata.confidence}`);
    console.log(`💡 理由: ${result.metadata.reasoning}`);
    console.log(`🎨 设计要素: ${result.metadata.designElements.join(', ')}`);

    if (result.metadata.collectedInfo) {
      console.log('\n📝 收集的信息:');
      Object.entries(result.metadata.collectedInfo).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    }

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
}

testAutoInteractive().catch(console.error);
