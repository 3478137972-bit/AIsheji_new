import { NextRequest, NextResponse } from 'next/server'
import { getKIEAITaskStatus } from '@/lib/api/kieai'
import { getBatchTask, updateTaskResult } from '@/lib/api/task-store'

const { getTaskStatus } = require('@/lib/backend/kieai')
const { getIllustrationTaskStatus } = require('@/lib/backend/kieai-illustration')
const { getTask } = require('@/lib/backend/task-store')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params

    // 先尝试从新的 task-store 获取(AIIP插画任务)
    const newBatchData = getBatchTask(batchId)

    if (newBatchData) {
      // 处理 AIIP 插画任务
      console.log(`[任务查询] AIIP插画任务 ${batchId}:`, newBatchData)

      // 查询每个任务的状态
      const results = await Promise.all(
        newBatchData.results.map(async (result) => {
          if (result.status === 'success' || result.status === 'failed') {
            // 已完成的任务直接返回缓存结果
            return result
          }

          try {
            const kieaiStatus = await getKIEAITaskStatus(result.taskId)
            console.log(`[任务查询] KIEAI任务 ${result.taskId} 状态:`, kieaiStatus.state)

            if (kieaiStatus.state === 'success') {
              // 解析结果URL
              const resultJson = JSON.parse(kieaiStatus.resultJson || '{}')
              const imageUrl = resultJson.resultUrls?.[0]

              // 更新任务状态
              updateTaskResult(batchId, result.taskId, {
                status: 'success',
                imageUrl,
              })

              return {
                ...result,
                status: 'success',
                imageUrl,
              }
            } else if (kieaiStatus.state === 'failed') {
              // 更新任务状态
              updateTaskResult(batchId, result.taskId, {
                status: 'failed',
                error: kieaiStatus.failMsg || '生成失败',
              })

              return {
                ...result,
                status: 'failed',
                error: kieaiStatus.failMsg || '生成失败',
              }
            } else {
              // 更新为处理中
              updateTaskResult(batchId, result.taskId, {
                status: 'processing',
              })

              return {
                ...result,
                status: 'processing',
              }
            }
          } catch (error) {
            console.error(`[任务查询] 查询任务 ${result.taskId} 失败:`, error)
            return {
              ...result,
              status: 'failed',
              error: error instanceof Error ? error.message : '查询失败',
            }
          }
        })
      )

      // 获取更新后的批次任务
      const updatedBatchData = getBatchTask(batchId)

      return NextResponse.json({
        success: true,
        batchId,
        status: updatedBatchData?.status || 'processing',
        results,
      })
    }

    // 兼容旧的任务存储系统
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
          // 判断是 Logo 任务还是插画任务（通过 taskId 或 batchId 判断）
          const isIllustration = batchData.imageUrls !== undefined // 插画任务会有 imageUrls 字段

          let status
          if (isIllustration) {
            // 使用插画任务查询接口
            status = await getIllustrationTaskStatus(task.taskId)
          } else {
            // 使用 Logo 任务查询接口
            status = await getTaskStatus(task.taskId)
          }

          return {
            index: task.index,
            taskId: task.taskId,
            status: status.data?.status || 'unknown',
            imageUrl: status.data?.imageUrl || status.data?.output?.image_url || status.data?.output?.url,
            data: status.data
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
