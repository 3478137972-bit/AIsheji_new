/**
 * 任务存储工具函数
 * 使用内存存储任务状态(生产环境建议使用数据库)
 */

interface TaskInfo {
  batchId: string
  taskIds: string[]
  promptCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  results: Array<{
    index: number
    taskId: string
    status: 'pending' | 'processing' | 'success' | 'failed'
    imageUrl?: string
    error?: string
  }>
  createdAt: number
  updatedAt: number
}

// 内存存储(生产环境应使用数据库)
const taskStore = new Map<string, TaskInfo>()

/**
 * 创建批次任务
 */
export function createBatchTask(batchId: string, taskIds: string[], promptCount: number): TaskInfo {
  const taskInfo: TaskInfo = {
    batchId,
    taskIds,
    promptCount,
    status: 'pending',
    results: taskIds.map((taskId, index) => ({
      index,
      taskId,
      status: 'pending',
    })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  taskStore.set(batchId, taskInfo)
  return taskInfo
}

/**
 * 获取批次任务信息
 */
export function getBatchTask(batchId: string): TaskInfo | null {
  return taskStore.get(batchId) || null
}

/**
 * 更新任务结果
 */
export function updateTaskResult(
  batchId: string,
  taskId: string,
  updates: {
    status: 'pending' | 'processing' | 'success' | 'failed'
    imageUrl?: string
    error?: string
  }
): void {
  const taskInfo = taskStore.get(batchId)
  if (!taskInfo) return

  const result = taskInfo.results.find((r) => r.taskId === taskId)
  if (result) {
    Object.assign(result, updates)
  }

  // 更新整体状态
  const allCompleted = taskInfo.results.every(
    (r) => r.status === 'success' || r.status === 'failed'
  )
  const anyFailed = taskInfo.results.some((r) => r.status === 'failed')

  if (allCompleted) {
    taskInfo.status = anyFailed ? 'failed' : 'completed'
  } else {
    taskInfo.status = 'processing'
  }

  taskInfo.updatedAt = Date.now()
  taskStore.set(batchId, taskInfo)
}

/**
 * 清理过期任务(超过24小时)
 */
export function cleanupExpiredTasks(): void {
  const now = Date.now()
  const expireTime = 24 * 60 * 60 * 1000 // 24小时

  for (const [batchId, taskInfo] of taskStore.entries()) {
    if (now - taskInfo.createdAt > expireTime) {
      taskStore.delete(batchId)
    }
  }
}

// 定期清理过期任务(每小时执行一次)
setInterval(cleanupExpiredTasks, 60 * 60 * 1000)
