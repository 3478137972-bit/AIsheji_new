/**
 * KIEAI API 工具函数
 * 用于上传图片和生成图片
 */

const KIEAI_API_KEY = process.env.KIEAI_API_KEY
const KIEAI_BASE_URL = process.env.KIEAI_BASE_URL || 'https://api.kie.ai'
const KIEAI_FILE_UPLOAD_URL = 'https://kieai.redpandaai.co/api/file-stream-upload'

interface UploadImageResult {
  fileName: string
  filePath: string
  downloadUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

interface CreateTaskResult {
  taskId: string
}

interface TaskStatus {
  taskId: string
  model: string
  state: 'pending' | 'processing' | 'success' | 'failed'
  param: string
  resultJson: string
  failCode?: string
  failMsg?: string
  costTime: number
  completeTime?: number
  createTime: number
}

/**
 * 上传图片到 KIEAI
 * @param imageBase64 Base64 编码的图片数据 (格式: data:image/jpeg;base64,...)
 * @param fileName 文件名(可选,不提供将自动生成)
 */
export async function uploadImageToKIEAI(
  imageBase64: string,
  fileName?: string
): Promise<UploadImageResult> {
  try {
    // 从 base64 提取数据
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/)
    if (!matches) {
      throw new Error('无效的 base64 图片数据')
    }

    const mimeType = matches[1]
    const base64Data = matches[2]

    // 将 base64 转换为 Blob
    const byteCharacters = Buffer.from(base64Data, 'base64')
    const blob = new Blob([byteCharacters], { type: mimeType })

    // 构建 FormData
    const formData = new FormData()

    // 生成唯一文件名(如果未提供)
    const finalFileName = fileName || `aiip-${Date.now()}-${Math.random().toString(36).substring(7)}.${mimeType.split('/')[1]}`

    formData.append('file', blob, finalFileName)
    formData.append('uploadPath', 'images/user-uploads')
    formData.append('fileName', finalFileName)

    const response = await fetch(KIEAI_FILE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIEAI_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`KIEAI 文件上传失败: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.msg || 'KIEAI 文件上传失败')
    }

    return data.data
  } catch (error) {
    console.error('KIEAI 图片上传失败:', error)
    throw error
  }
}

interface CreateImageTaskParams {
  prompt: string
  aspectRatio?: string
  resolution?: '1K' | '2K' | '4K'
  outputFormat?: 'png' | 'jpg' | 'webp'
  imageInputUrls?: string[]
}

/**
 * 创建 KIEAI 图片生成任务
 */
export async function createKIEAITask(params: CreateImageTaskParams): Promise<CreateTaskResult> {
  const {
    prompt,
    aspectRatio = '1:1',
    resolution = '1K',
    outputFormat = 'png',
    imageInputUrls = [],
  } = params

  try {
    const response = await fetch(`${KIEAI_BASE_URL}/api/v1/jobs/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIEAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        input: {
          prompt,
          aspect_ratio: aspectRatio,
          resolution,
          output_format: outputFormat,
          ...(imageInputUrls.length > 0 && { image_input: imageInputUrls }),
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`KIEAI 创建任务失败: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.message || 'KIEAI 创建任务失败')
    }

    return data.data
  } catch (error) {
    console.error('KIEAI 创建任务失败:', error)
    throw error
  }
}

/**
 * 查询 KIEAI 任务状态
 */
export async function getKIEAITaskStatus(taskId: string): Promise<TaskStatus> {
  try {
    const response = await fetch(
      `${KIEAI_BASE_URL}/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KIEAI_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`KIEAI 查询任务失败: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (data.code !== 200) {
      throw new Error(data.message || 'KIEAI 查询任务失败')
    }

    return data.data
  } catch (error) {
    console.error('KIEAI 查询任务失败:', error)
    throw error
  }
}
