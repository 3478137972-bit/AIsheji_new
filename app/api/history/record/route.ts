import { NextRequest, NextResponse } from 'next/server'
const { recordHistory } = require('@/lib/backend/history-store')

export async function POST(request: NextRequest) {
  try {
    const operation = await request.json()

    // 验证必需字段
    if (!operation.operation_type || !operation.tool_name || !operation.action || !operation.status) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    // 记录操作
    const result = await recordHistory(operation)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    console.error('记录操作历史失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
