import { NextRequest, NextResponse } from 'next/server'
import { getKIEAITaskStatus } from '@/lib/api/kieai'

const { getTaskStatus } = require('@/lib/backend/kieai')
const { getIllustrationTaskStatus } = require('@/lib/backend/kieai-illustration')
const { getTask } = require('@/lib/backend/task-store')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params
    const batchData = await getTask(batchId)

    if (!batchData) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    // 查询每个任务的状态
    const results = await Promise.all(
      batchData.tasks.map(async (task: any) => {
        if (!task.success || !task.taskId) {
          return { ...task, status: 'failed' }
        }

        try {
          // 判断是否是AIIP插画任务(通过prompt字段判断)
          const isAIIPIllustration = batchData.prompt !== undefined

          let status
          if (isAIIPIllustration) {
            // 使用新的KIEAI查询接口
            status = await getKIEAITaskStatus(task.taskId)

            // 转换KIEAI状态格式
            if (status.state === 'success') {
              const resultJson = JSON.parse(status.resultJson || '{}')
              return {
                index: task.index,
                taskId: task.taskId,
                status: 'success',
                imageUrl: resultJson.resultUrls?.[0],
              }
            } else if (status.state === 'failed') {
              return {
                index: task.index,
                taskId: task.taskId,
                status: 'failed',
                error: status.failMsg || '生成失败',
              }
            } else {
              return {
                index: task.index,
                taskId: task.taskId,
                status: 'processing',
              }
            }
          } else {
            // 判断是 Logo 任务还是插画任务
            const isIllustration = batchData.imageUrls !== undefined

            if (isIllustration) {
              status = await getIllustrationTaskStatus(task.taskId)
            } else {
              status = await getTaskStatus(task.taskId)
            }

            return {
              index: task.index,
              taskId: task.taskId,
              status: status.data?.status || 'unknown',
              imageUrl: status.data?.imageUrl || status.data?.output?.image_url || status.data?.output?.url,
              data: status.data
            }
          }
        } catch (error: any) {
          return {
            index: task.index,
            taskId: task.taskId,
            status: 'error',
            error: error.message
          }
        }
      })
    )

    // 判断是否全部完成
    const allCompleted = results.every((r: any) =>
      r.status === 'completed' || r.status === 'success' || r.status === 'failed' || r.status === 'error'
    )

    return NextResponse.json({
      success: true,
      batchId: batchId,
      status: allCompleted ? 'completed' : 'processing',
      results: results
    })
  } catch (error: any) {
    console.error('查询任务状态失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
