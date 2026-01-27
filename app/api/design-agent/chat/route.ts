import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { DesignAgent } from '@/design-agent/design-agent';

// 初始化设计智能体
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
const skillsPath = path.join(process.cwd(), 'design-agent', 'design-skills.json');

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

    // 先进行意图识别，判断是否为设计需求
    console.log('🔍 分析用户意图...');

    try {
      // 调用设计智能体生成
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
    } catch (designError: any) {
      // 如果是"无法识别为设计需求"的错误，切换到聊天模式
      if (designError.message.includes('无法识别为设计需求') ||
          designError.message.includes('不支持') ||
          designError.message.includes('未找到类别')) {

        console.log('💬 切换到聊天模式...');

        // 使用 DeepSeek 进行普通对话
        const { DeepSeekClient } = await import('@/design-agent/deepseek-client');
        const deepseek = new DeepSeekClient(deepseekApiKey);

        const chatResponse = await deepseek.chat([
          {
            role: 'system',
            content: `你是秒懂AI超级员工的设计智能体助手。

你的职责：
1. 当用户询问与设计无关的问题时，友好地回答
2. 引导用户使用设计功能
3. 介绍你支持的设计类型：Logo设计、插画设计、海报设计、包装设计、IP形象设计

回答要求：
- 简洁友好
- 适时引导用户尝试设计功能
- 体现专业和热情`
          },
          {
            role: 'user',
            content: message
          }
        ], 0.7);

        return NextResponse.json({
          type: 'chat',
          message: chatResponse
        });
      }

      // 其他错误正常抛出
      throw designError;
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
