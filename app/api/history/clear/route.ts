import { NextRequest, NextResponse } from 'next/server'
const { clearHistory } = require('@/lib/backend/history-store')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { olderThan, user_id } = body

    // 清空历史记录
    const options: any = {}
    if (olderThan) {
      options.olderThan = new Date(olderThan)
    }
    if (user_id) {
      options.user_id = user_id
    }

    await clearHistory(options)

    return NextResponse.json({
      success: true,
      message: '历史记录已清空'
    })
  } catch (error: any) {
    console.error('清空历史记录失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
