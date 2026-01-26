'use client'

import * as React from 'react'
import type { CreateOperationHistory } from '@/types/operation-history'

/**
 * 操作历史记录 Hook
 * 参考 use-toast.ts 的全局状态管理模式
 */

// 记录操作到服务器
async function recordOperationToServer(operation: CreateOperationHistory) {
  try {
    const response = await fetch('/api/history/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation),
    })

    if (!response.ok) {
      throw new Error('记录操作失败')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('记录操作历史失败:', error)
    // 静默失败，不影响用户操作
    return null
  }
}

// 获取历史记录
async function fetchHistory(options: {
  limit?: number
  offset?: number
  tool_name?: string
} = {}) {
  try {
    const params = new URLSearchParams()
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())
    if (options.tool_name) params.append('tool_name', options.tool_name)

    const response = await fetch(`/api/history/list?${params.toString()}`)

    if (!response.ok) {
      throw new Error('获取历史记录失败')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return []
  }
}

// 清空历史记录
async function clearHistoryOnServer(olderThan?: Date) {
  try {
    const response = await fetch('/api/history/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ olderThan: olderThan?.toISOString() }),
    })

    if (!response.ok) {
      throw new Error('清空历史记录失败')
    }

    return true
  } catch (error) {
    console.error('清空历史记录失败:', error)
    return false
  }
}

export function useOperationHistory() {
  const recordOperation = React.useCallback(async (operation: CreateOperationHistory) => {
    return await recordOperationToServer(operation)
  }, [])

  const getHistory = React.useCallback(async (options?: {
    limit?: number
    offset?: number
    tool_name?: string
  }) => {
    return await fetchHistory(options)
  }, [])

  const clearHistory = React.useCallback(async (olderThan?: Date) => {
    return await clearHistoryOnServer(olderThan)
  }, [])

  return {
    recordOperation,
    getHistory,
    clearHistory,
  }
}
