'use client'

import * as React from 'react'
import type { CreateOperationHistory } from '@/types/operation-history'
import { getOrCreateSessionId } from '@/lib/utils/session'

/**
 * 操作历史记录 Hook
 * 使用 Session ID 隔离不同用户的历史记录
 */

// 记录操作到服务器
async function recordOperationToServer(operation: CreateOperationHistory) {
  try {
    // 获取或创建 session ID
    const sessionId = getOrCreateSessionId()

    const response = await fetch('/api/history/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...operation,
        user_id: sessionId, // 使用 session ID 作为 user_id
      }),
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
    // 获取当前 session ID
    const sessionId = getOrCreateSessionId()

    const params = new URLSearchParams()
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())
    if (options.tool_name) params.append('tool_name', options.tool_name)
    params.append('user_id', sessionId) // 添加 session ID 参数

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
    // 获取当前 session ID
    const sessionId = getOrCreateSessionId()

    const response = await fetch('/api/history/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        olderThan: olderThan?.toISOString(),
        user_id: sessionId, // 添加 session ID
      }),
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
