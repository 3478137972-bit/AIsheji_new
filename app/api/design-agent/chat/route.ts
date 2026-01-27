import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { DesignAgent } from '@/design-agent/design-agent';

// 初始化设计智能体
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
const skillsPath = path.join(process.cwd(), 'design-agent', 'omni-design-skills.json');

let designAgent: DesignAgent | null = null;

function getDesignAgent() {
  if (!designAgent) {
    designAgent = new DesignAgent(deepseekApiKey, skillsPath);
  }
  return designAgent;
}

/**
 * 设计智能体对话 API
 *
 * 完整流程：
 * 1. 接收用户消息
 * 2. DeepSeek 意图识别（调用 Skills）
 * 3. DeepSeek 需求分析
 * 4. 加载对应的 Skills 设计指南
 * 5. DeepSeek 生成提示词
 * 6. 质量检查和优化
 * 7. 返回最终结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    console.log('📨 收到用户消息:', message);

    // 获取设计智能体实例
    const agent = getDesignAgent();

    // 调用设计智能体生成
    // 使用 generate 方法（不需要交互式问答）
    console.log('🤖 开始调用 DeepSeek 处理...');
    const result = await agent.generate(message);

    console.log('✅ DeepSeek 处理完成');
    console.log('📊 结果:', {
      success: result.success,
      category: result.metadata.category,
      confidence: result.metadata.confidence,
      qualityScore: result.metadata.qualityScore
    });

    // 如果生成成功
    if (result.success) {
      return NextResponse.json({
        type: 'result',
        message: `✅ 已识别为【${result.metadata.category}】设计，为您生成专业提示词！\n\n📊 置信度: ${(result.metadata.confidence * 100).toFixed(0)}%\n🎨 设计要素: ${result.metadata.designElements.join('、')}\n⭐ 质量评分: ${result.metadata.qualityScore}/100`,
        result: {
          prompt: result.prompt,
          negativePrompt: result.negativePrompt,
          parameters: result.parameters,
          metadata: result.metadata
        }
      });
    } else {
      return NextResponse.json({
        type: 'error',
        message: '❌ 生成失败：' + result.metadata.reasoning
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ 设计智能体 API 错误:', error);
    return NextResponse.json(
      {
        type: 'error',
        message: '❌ 服务器错误：' + error.message
      },
      { status: 500 }
    );
  }
}
