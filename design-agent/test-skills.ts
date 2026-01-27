import { DeepSeekClient } from './deepseek-client';
import { SkillsManager } from './skills-manager';

/**
 * 测试 Omni-Design Skills 系统
 */

async function testSkillsSystem() {
  // 检查环境变量
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('❌ 请设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
  }

  console.log('🚀 开始测试 Omni-Design Skills 系统\n');
  console.log('='.repeat(60));

  // 初始化（配置为 Nano banana 模型，不生成负向提示词）
  const deepseek = new DeepSeekClient(apiKey);
  const skillsManager = new SkillsManager(deepseek, undefined, {
    generateNegativePrompt: false,  // 不生成负向提示词
    targetModel: 'Nano banana pro'   // 目标模型
  });

  console.log('⚙️  配置信息:');
  console.log('   目标模型: Nano banana pro');
  console.log('   生成负向提示词: 否\n');

  // 测试用例
  const testCases = [
    {
      name: '测试 1: 清晰的 Logo 需求',
      input: '为一家科技公司设计 Logo，目标受众是年轻的程序员，风格要简约现代，适合在 GitHub 上展示'
    },
    {
      name: '测试 2: 模糊的海报需求',
      input: '设计一张海报'
    },
    {
      name: '测试 3: IP 插画需求',
      input: '设计一个可爱的熊猫 IP 形象，用于春节促销活动，要有节日氛围，目标是吸引家庭用户'
    },
    {
      name: '测试 4: 包装设计需求',
      input: '设计茶叶包装盒，高端定位，目标受众是商务人士，风格要融合中国传统文化和现代简约'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 ${testCase.name}`);
    console.log('-'.repeat(60));
    console.log(`输入: ${testCase.input}\n`);

    try {
      const result = await skillsManager.processDesignRequest(testCase.input);

      if (result.needsClarification) {
        console.log('⚠️  需要澄清需求\n');
        console.log('需要回答的问题：');
        result.questions?.forEach((q, i) => {
          console.log(`\n${i + 1}. ${q.question}`);
          if (q.options && q.options.length > 0) {
            q.options.forEach((opt: string, j: number) => {
              console.log(`   ${String.fromCharCode(65 + j)}. ${opt}`);
            });
          }
        });
      } else {
        console.log('✅ 需求清晰，已生成提示词\n');

        console.log(`📊 设计类型: ${result.designType?.typeName}`);
        console.log(`📐 设计模型: ${result.designType?.model}`);
        console.log(`🎯 核心指标: ${result.designType?.coreMetrics.join('、')}`);
        console.log(`🏷️  场景组: ${result.designType?.scenarioGroup}\n`);

        console.log(`🎨 Visual DNA:`);
        console.log(`   ${result.result?.visualDNA}\n`);

        console.log(`✨ 正向提示词:`);
        console.log(`   ${result.result?.prompt}\n`);

        if (result.result?.promptExplanation) {
          console.log(`💡 提示词说明:`);
          console.log(`   ${result.result?.promptExplanation}\n`);
        }

        if (result.result?.negativePrompt) {
          console.log(`🚫 负向提示词:`);
          console.log(`   ${result.result?.negativePrompt}\n`);

          if (result.result?.negativePromptExplanation) {
            console.log(`💡 负向提示词说明:`);
            console.log(`   ${result.result?.negativePromptExplanation}\n`);
          }
        }

        console.log(`🔍 质检结果:`);
        if (result.result?.qualityCheck.passed) {
          console.log(`   ✅ 通过质检`);
        } else {
          console.log(`   ⚠️  发现问题:`);
          result.result?.qualityCheck.issues?.forEach((issue: string) => {
            console.log(`      - ${issue}`);
          });
          console.log(`   ✅ 已自动修正`);
        }
      }

      console.log('\n' + '='.repeat(60));

      // 等待一下，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.error(`❌ 测试失败: ${error.message}`);
    }
  }

  console.log('\n🎉 测试完成！');
}

// 运行测试
testSkillsSystem().catch(error => {
  console.error('测试过程出错:', error);
});
