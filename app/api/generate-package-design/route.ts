import { NextRequest, NextResponse } from 'next/server'
import { generatePackageDesignPrompt } from '@/lib/api/deepseek'
import { uploadImageToKIEAI, createKIEAITask } from '@/lib/api/kieai'

const { setTask } = require('@/lib/backend/task-store')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface RequestBody {
  productInfo: string
  heightCm?: string
  widthCm?: string
  visualPreference?: string
  referenceImages?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()

    // 验证必填字段
    if (!body.productInfo) {
      return NextResponse.json(
        {
          success: false,
          error: '产品基本信息是必填项',
        },
        { status: 400 }
      )
    }

    console.log('[包装设计] 开始处理请求:', {
      productInfo: body.productInfo,
      heightCm: body.heightCm,
      widthCm: body.widthCm,
      visualPreference: body.visualPreference,
      referenceImagesCount: body.referenceImages?.length || 0,
    })

    // 步骤1: 使用 DeepSeek 生成提示词
    console.log('[包装设计] 步骤1: 调用 DeepSeek 生成提示词...')
    const prompt = await generatePackageDesignPrompt({
      productInfo: body.productInfo,
      heightCm: body.heightCm,
      widthCm: body.widthCm,
      visualPreference: body.visualPreference,
    })

    console.log('[包装设计] DeepSeek 生成的提示词:', prompt)

    // 步骤2: 上传参考图片(如果有)
    let imageInputUrls: string[] = []
    if (body.referenceImages && body.referenceImages.length > 0) {
      console.log(`[包装设计] 步骤2: 上传 ${body.referenceImages.length} 张参考图片...`)

      const uploadPromises = body.referenceImages.map((imageBase64, index) =>
        uploadImageToKIEAI(imageBase64, `package-design-ref-${Date.now()}-${index}.jpg`)
      )

      const uploadResults = await Promise.all(uploadPromises)
      imageInputUrls = uploadResults.map((result) => result.downloadUrl)

      console.log('[包装设计] 参考图片上传成功:', imageInputUrls)
    } else {
      console.log('[包装设计] 步骤2: 无参考图片,跳过上传')
    }

    // 步骤3: 创建生成任务(生成1张图)
    const variantCount = 1
    console.log(`[包装设计] 步骤3: 创建 ${variantCount} 个生成任务...`)

    const createTaskPromises = Array.from({ length: variantCount }, () =>
      createKIEAITask({
        prompt,
        aspectRatio: '1:1',
        resolution: '2K',
        outputFormat: 'png',
        imageInputUrls,
      })
    )

    const taskResults = await Promise.all(createTaskPromises)
    const taskIds = taskResults.map((result) => result.taskId)

    console.log('[包装设计] KIEAI 任务创建成功:', taskIds)

    // 步骤4: 创建批次任务记录(使用Supabase存储)
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substring(7)}`

    const batchData = {
      tasks: taskIds.map((taskId, index) => ({
        index,
        taskId,
        success: true,
      })),
      promptCount: variantCount,
      prompt,
      createdAt: Date.now(),
    }

    await setTask(batchId, batchData)

    console.log('[包装设计] 批次任务创建成功:', batchId)

    return NextResponse.json({
      success: true,
      batchId,
      promptCount: variantCount,
      prompt,
      message: `已创建 ${variantCount} 个设计任务`,
    })
  } catch (error) {
    console.error('[包装设计] 处理失败:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '生成失败',
      },
      { status: 500 }
    )
  }
}
