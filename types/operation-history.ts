// 操作历史记录类型定义

export enum OperationType {
  GENERATE = 'generate',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  SELECT = 'select',
  DELETE = 'delete',
  PAGE_VISIT = 'page_visit',
}

export enum ActionType {
  // 高优先级操作
  GENERATE_START = 'generate_start',
  GENERATE_SUCCESS = 'generate_success',
  GENERATE_FAILED = 'generate_failed',
  DOWNLOAD_IMAGE = 'download_image',
  UPLOAD_REFERENCE = 'upload_reference',

  // 中优先级操作
  SELECT_RESULT = 'select_result',
  DELETE_REFERENCE = 'delete_reference',

  // 低优先级操作
  PAGE_ENTER = 'page_enter',
  PAGE_LEAVE = 'page_leave',
}

export enum OperationStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROCESSING = 'processing',
}

export interface OperationMetadata {
  // 生成操作相关
  batchId?: string
  promptCount?: number
  inputParams?: Record<string, any>

  // 下载操作相关
  imageUrl?: string
  imageIndex?: number

  // 上传操作相关
  fileCount?: number
  fileSize?: number

  // 选择操作相关
  selectedIndex?: number

  // 错误信息
  error?: string

  // 其他元数据
  [key: string]: any
}

export interface OperationHistory {
  id: string
  user_id?: string
  operation_type: OperationType
  tool_name: string
  tool_display_name: string
  action: ActionType
  status: OperationStatus
  metadata: OperationMetadata
  thumbnail_url?: string
  created_at: string
  expires_at: string
}

// 用于创建新记录的类型（不包含自动生成的字段）
export type CreateOperationHistory = Omit<OperationHistory, 'id' | 'created_at' | 'expires_at'>
