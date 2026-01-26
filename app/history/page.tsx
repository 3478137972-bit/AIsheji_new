'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { useOperationHistory } from '@/hooks/use-operation-history'
import { OperationHistory } from '@/types/operation-history'
import { Sparkles, Download, Upload, Trash2, History as HistoryIcon } from 'lucide-react'
import { format, isToday, isYesterday, isThisWeek } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 工具名称映射
const toolDisplayNames: Record<string, string> = {
  'ai-logo': 'AI Logo',
  'ai-event-poster': 'AI活动海报',
  'ai-illustration': 'AI插画',
  'ai-package-design': 'AI平面包装',
  'id-photo': '证件照',
  'product-set': 'AI商品套图',
  'remove': 'AI消除',
  'ai-font': 'AI字体',
  'ai-ip-illustration-1': 'AI IP插画 1',
  'ai-ip-illustration-2': 'AI IP插画 2',
  'ai-scene-poster': 'AI场景海报',
}

// 操作类型图标映射
const actionIcons: Record<string, any> = {
  generate_success: Sparkles,
  download_image: Download,
  upload_reference: Upload,
  delete_reference: Trash2,
}

// 操作类型描述映射
const actionDescriptions: Record<string, string> = {
  generate_start: '开始生成',
  generate_success: '生成成功',
  generate_failed: '生成失败',
  download_image: '下载图片',
  upload_reference: '上传参考图',
  delete_reference: '删除参考图',
  select_result: '选择结果',
}

// 日期分组函数
function groupByDate(history: OperationHistory[]) {
  const groups: Record<string, OperationHistory[]> = {
    今天: [],
    昨天: [],
    本周: [],
    更早: [],
  }

  history.forEach((item) => {
    const date = new Date(item.created_at)
    if (isToday(date)) {
      groups['今天'].push(item)
    } else if (isYesterday(date)) {
      groups['昨天'].push(item)
    } else if (isThisWeek(date, { locale: zhCN })) {
      groups['本周'].push(item)
    } else {
      groups['更早'].push(item)
    }
  })

  return groups
}

export default function HistoryPage() {
  const [history, setHistory] = useState<OperationHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const { getHistory, clearHistory } = useOperationHistory()

  // 加载历史记录
  useEffect(() => {
    loadHistory()
  }, [filter])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const options: any = { limit: 50 }
      if (filter !== 'all') {
        options.tool_name = filter
      }
      const data = await getHistory(options)
      setHistory(data)
    } catch (error) {
      console.error('加载历史记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 清空历史记录
  const handleClearHistory = async () => {
    if (!confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      return
    }
    try {
      await clearHistory()
      setHistory([])
    } catch (error) {
      console.error('清空历史记录失败:', error)
    }
  }

  // 按日期分组
  const groupedHistory = groupByDate(history)

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-8">
        {/* 页面标题 */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">历史记录</h1>
              <p className="text-muted-foreground">查看您的所有操作历史</p>
            </div>
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              清空历史
            </button>
          </div>

          {/* 筛选器 */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              全部
            </button>
            {Object.entries(toolDisplayNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* 空状态 */}
          {!loading && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <HistoryIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">暂无历史记录</h3>
              <p className="text-muted-foreground">开始使用 AI 工具，您的操作历史将显示在这里</p>
            </div>
          )}

          {/* 历史记录列表 */}
          {!loading && history.length > 0 && (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([group, items]) => {
                if (items.length === 0) return null
                return (
                  <div key={group}>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-4">{group}</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <HistoryItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

// 历史记录项组件
function HistoryItem({ item }: { item: OperationHistory }) {
  const Icon = actionIcons[item.action] || Sparkles
  const description = actionDescriptions[item.action] || item.action
  const time = format(new Date(item.created_at), 'HH:mm', { locale: zhCN })

  return (
    <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
      {/* 缩略图 */}
      {item.thumbnail_url ? (
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <img
            src={item.thumbnail_url}
            alt="缩略图"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-muted flex-shrink-0">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-foreground">{item.tool_display_name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>

        {/* 元数据 */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="text-sm text-muted-foreground mb-2">
            {item.metadata.inputParams?.eventName && (
              <span>{item.metadata.inputParams.eventName}</span>
            )}
            {item.metadata.inputParams?.logoName && (
              <span>{item.metadata.inputParams.logoName}</span>
            )}
            {item.metadata.promptCount && (
              <span>生成 {item.metadata.promptCount} 个方案</span>
            )}
            {item.metadata.fileCount && (
              <span>上传 {item.metadata.fileCount} 张图片</span>
            )}
          </div>
        )}

        {/* 时间和状态 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{time}</span>
          {item.status === 'success' && (
            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">成功</span>
          )}
          {item.status === 'failed' && (
            <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full">失败</span>
          )}
          {item.status === 'processing' && (
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full">处理中</span>
          )}
        </div>
      </div>
    </div>
  )
}


