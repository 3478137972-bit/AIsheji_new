import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { DesignAgent } from '@/design-agent/design-agent';

// 初始化设计智能体
const deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
const skillsPath = path.join(process.cwd(), 'design-agent', 'design-skills.json');
const productInfoPath = path.join(process.cwd(), 'design-agent', 'product-info.json');

let designAgent: DesignAgent | null = null;
let productInfo: any = null;

function getDesignAgent() {
  if (!designAgent) {
    designAgent = new DesignAgent(deepseekApiKey, skillsPath);
  }
  return designAgent;
}

function getProductInfo() {
  if (!productInfo) {
    const data = fs.readFileSync(productInfoPath, 'utf-8');
    productInfo = JSON.parse(data);
  }
  return productInfo;
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
    const { message, answers } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    console.log('📨 收到用户消息:', message);
    if (answers) {
      console.log('📝 收到用户回答:', answers);
    }

    // 获取设计智能体实例
    const agent = getDesignAgent();

    // 先进行意图识别，判断是否为设计需求
    console.log('🔍 分析用户意图...');

    try {
      // 使用交互式生成方法
      console.log('🤖 开始调用 DeepSeek 处理...');

      // 定义问答回调函数
      const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
        // 如果已经有答案（用户第二次请求），直接返回
        if (answers) {
          return answers;
        }

        // 如果没有答案，抛出一个特殊错误，让外层捕获并返回问题
        throw {
          type: 'NEED_ANSWERS',
          questions: questions
        };
      };

      const result = await agent.generateInteractive(message, onQuestion);

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
          message: `✅ 已为您生成专业的${result.metadata.category}提示词！`,
          result: {
            prompt: result.prompt,
            negativePrompt: result.negativePrompt,
            parameters: result.parameters,
            metadata: {
              category: result.metadata.category
            }
          }
        });
      } else {
        return NextResponse.json({
          type: 'error',
          message: '❌ 生成失败：' + result.metadata.reasoning
        }, { status: 500 });
      }
    } catch (designError: any) {
      // 如果需要收集更多信息
      if (designError.type === 'NEED_ANSWERS') {
        console.log('❓ 需要收集更多信息');
        return NextResponse.json({
          type: 'questions',
          message: '为了生成更专业的设计，我需要了解一些细节：',
          questions: designError.questions
        });
      }

      // 如果是"无法识别为设计需求"的错误，切换到聊天模式
      if (designError.message === 'NOT_DESIGN_REQUEST' ||
          designError.message === 'CATEGORY_NOT_SUPPORTED') {

        console.log('💬 切换到聊天模式...');

        // 加载产品信息
        const productInfo = getProductInfo();

        // 使用 DeepSeek 进行普通对话
        const { DeepSeekClient } = await import('@/design-agent/deepseek-client');
        const deepseek = new DeepSeekClient(deepseekApiKey);

        const chatResponse = await deepseek.chat([
          {
            role: 'system',
            content: `你是秒懂AI超级员工的设计智能体助手。

产品信息：
- 产品名称：${productInfo.product_name}
- 产品定位：${productInfo.product_slogan}
- 核心功能：${productInfo.core_features.design_agent.description}
- 支持的设计类型：${productInfo.supported_design_categories.map((cat: any) => cat.name).join('、')}

你的职责：
1. 当用户询问与设计无关的问题时，友好地回答
2. 介绍产品功能和优势
3. 引导用户使用设计功能
4. 回答关于产品的问题

回答要求：
- 简洁友好，2-3句话即可，不要过于冗长
- 使用 emoji 让回复更生动（如 👋 🎨 ✨ 等）
- 适时引导用户尝试设计功能
- 体现专业和热情
- 不要使用 markdown 格式（如 ** ## - 等）
- 直接用自然语言回答，像朋友聊天一样`
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
