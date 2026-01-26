import { NextRequest, NextResponse } from 'next/server'
const { getHistory } = require('@/lib/backend/history-store')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const tool_name = searchParams.get('tool_name') || undefined
    const user_id = searchParams.get('user_id') || undefined

    // 获取历史记录
    const history = await getHistory({ limit, offset, tool_name, user_id })

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length
    })
  } catch (error: any) {
    console.error('获取历史记录失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
