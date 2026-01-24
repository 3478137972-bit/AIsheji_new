import { NextRequest, NextResponse } from 'next/server'

const { generateIllustrationPrompts } = require('@/lib/backend/deepseek')
const { uploadImageToKIEAI, createBatchIllustrationTasks } = require('@/lib/backend/kieai-illustration')
const { setTask } = require('@/lib/backend/task-store')

export async function POST(request: NextRequest) {
  try {
    const { description, style, aspectRatio, referenceImages = [] } = await request.json()

    // 参数验证
    if (!description) {
      return NextResponse.json(
        { success: false, error: '画面描述不能为空' },
        { status: 400 }
      )
    }

    console.log('收到插画生成请求:', { description, style, aspectRatio, referenceImageCount: referenceImages.length })

    // 步骤1: 如果有参考图，先上传到 KIEAI
    let imageUrls: string[] = []
    if (referenceImages && referenceImages.length > 0) {
      console.log(`正在上传 ${referenceImages.length} 张参考图...`)
      for (let i = 0; i < referenceImages.length; i++) {
        try {
          const imageUrl = await uploadImageToKIEAI(referenceImages[i], `ref_${Date.now()}_${i}.jpg`)
          imageUrls.push(imageUrl)
          console.log(`参考图 ${i + 1} 上传成功:`, imageUrl)
        } catch (error: any) {
          console.error(`参考图 ${i + 1} 上传失败:`, error.message)
        }
      }
    }

    // 步骤2: 调用 DeepSeek 生成提示词
    console.log('正在调用 DeepSeek 生成插画提示词...')
    const promptResult = await generateIllustrationPrompts({ description, style, aspectRatio })

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

    // 步骤3: 批量创建生图任务
    console.log('正在创建 KIEAI 生图任务...')
    const tasks = await createBatchIllustrationTasks(promptResult.prompts, imageUrls, aspectRatio)

    // 生成一个总任务ID
    const batchId = `batch_${Date.now()}`
    setTask(batchId, {
      status: 'processing',
      tasks: tasks,
      prompts: promptResult.prompts,
      imageUrls: imageUrls,
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
    console.error('生成插画失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
