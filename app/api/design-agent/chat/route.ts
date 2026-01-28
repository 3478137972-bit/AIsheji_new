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

    // 如果有答案，说明是第二次请求，直接进入设计流程
    if (answers) {
      console.log('🎨 检测到用户回答，直接进入设计流程...');
      const agent = getDesignAgent();

      try {
        const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
          return answers;
        };

        const result = await agent.generateInteractive(message, onQuestion);

        console.log('✅ DeepSeek 处理完成');
        console.log('📊 结果:', {
          success: result.success,
          category: result.metadata.category,
          confidence: result.metadata.confidence,
          qualityScore: result.metadata.qualityScore
        });

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
        console.error('❌ 设计流程错误:', designError);
        return NextResponse.json({
          type: 'error',
          message: '❌ 生成失败：' + (designError.message || '未知错误')
        }, { status: 500 });
      }
    }

    // 第一步：快速意图识别（判断是否为设计需求）
    console.log('🔍 快速识别用户意图...');

    const { DeepSeekClient } = await import('@/design-agent/deepseek-client');
    const deepseek = new DeepSeekClient(deepseekApiKey);

    // 快速意图识别
    const intentPrompt = `分析用户消息，判断是否为设计需求。

用户消息："${message}"

判断标准：
- 设计需求：包含设计、制作、生成、创作等词汇，或明确提到 Logo、插画、海报、包装、IP 形象等设计类别
- 非设计需求：问候、闲聊、询问产品信息、其他与设计无关的内容

请只回答"设计"或"聊天"，不要有其他内容。`;

    const intentResult = await deepseek.chat([
      {
        role: 'user',
        content: intentPrompt
      }
    ], 0.3);

    const isDesignRequest = intentResult.trim().includes('设计');
    console.log('📊 意图识别结果:', isDesignRequest ? '设计需求' : '普通聊天');

    // 第二步：根据意图分流处理
    if (!isDesignRequest) {
      // 非设计需求，直接进入聊天模式
      console.log('💬 进入聊天模式...');

      const productInfo = getProductInfo();

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

    // 设计需求，进入设计流程
    console.log('🎨 进入设计流程...');
    const agent = getDesignAgent();

    try {
      // 定义问答回调函数
      const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
        // 如果已经有答案（用户第二次请求），直接返回
        if (answers) {
          return answers;
        }

        // 如果没有答案，抛出一个特殊错误，让外层捕获并返回问题
        const error: any = new Error('需要收集更多信息');
        error.type = 'NEED_ANSWERS';
        error.questions = questions;
        throw error;
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

      // 其他错误：尝试用聊天模式兜底
      console.error('❌ 设计流程错误:', designError);
      console.log('💬 尝试用聊天模式处理...');

      try {
        const { DeepSeekClient } = await import('@/design-agent/deepseek-client');
        const deepseek = new DeepSeekClient(deepseekApiKey);
        const productInfo = getProductInfo();

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
1. 友好地回答用户的问题
2. 如果用户的需求不够清晰，引导用户提供更多信息
3. 如果遇到技术问题，诚实地告知用户并建议重试
4. 保持专业和热情

回答要求：
- 简洁友好，2-3句话即可
- 使用 emoji 让回复更生动
- 不要使用 markdown 格式
- 直接用自然语言回答`
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
      } catch (chatError: any) {
        // 如果聊天模式也失败了，返回友好的错误信息
        console.error('❌ 聊天模式也失败:', chatError);
        return NextResponse.json({
          type: 'error',
          message: '抱歉，我遇到了一些技术问题 😅 请稍后重试，或者换个方式描述您的需求。'
        }, { status: 500 });
      }
    }

  } catch (error: any) {
    console.error('❌ 设计智能体 API 错误:', error);

    // 返回友好的错误信息，不暴露技术细节
    return NextResponse.json(
      {
        type: 'error',
        message: '抱歉，服务暂时遇到了一些问题 😅 请稍后重试，或者刷新页面后再试一次。'
      },
      { status: 500 }
    );
  }
}
