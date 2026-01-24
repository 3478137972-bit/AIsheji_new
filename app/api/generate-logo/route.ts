import { NextRequest, NextResponse } from 'next/server'

const { generateLogoPrompts } = require('@/lib/backend/deepseek')
const { createBatchTasks } = require('@/lib/backend/kieai')

// 存储任务状态（生产环境应使用 Redis 等）
const taskStore = new Map()

export async function POST(request: NextRequest) {
  try {
    const { logoName, industry, style, slogan } = await request.json()

    // 参数验证
    if (!logoName) {
      return NextResponse.json(
        { success: false, error: 'Logo名称不能为空' },
        { status: 400 }
      )
    }

    console.log('收到生成请求:', { logoName, industry, style, slogan })

    // 步骤1: 调用 DeepSeek 生成提示词
    console.log('正在调用 DeepSeek 生成提示词...')
    const promptResult = await generateLogoPrompts({ logoName, industry, style, slogan })

    if (!promptResult.prompts || promptResult.prompts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '未能解析出有效的提示词',
          rawContent: promptResult.rawContent
        },
        { status: 500 }
      )
    }

    console.log(`成功生成 ${promptResult.prompts.length} 个提示词`)

    // 步骤2: 批量创建生图任务
    console.log('正在创建生图任务...')
    const tasks = await createBatchTasks(promptResult.prompts)

    // 生成一个总任务ID
    const batchId = `batch_${Date.now()}`
    taskStore.set(batchId, {
      status: 'processing',
      tasks: tasks,
      prompts: promptResult.prompts,
      rawContent: promptResult.rawContent,
      createdAt: new Date().toISOString()
    })

    // 返回任务ID，前端可以用这个ID轮询状态
    return NextResponse.json({
      success: true,
      batchId: batchId,
      message: '任务已创建，请使用 batchId 查询进度',
      promptCount: promptResult.prompts.length,
      tasks: tasks.map((t: any) => ({
        index: t.index,
        taskId: t.taskId,
        success: t.success,
        error: t.error
      }))
    })

  } catch (error: any) {
    console.error('生成Logo失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

// 导出 taskStore 供其他路由使用
export { taskStore }
