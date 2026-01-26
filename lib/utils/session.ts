/**
 * Session ID 管理工具
 * 用于在没有登录系统的情况下识别不同用户
 */

const SESSION_ID_KEY = 'user_session_id'
const SESSION_ID_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1年

/**
 * 生成唯一的 Session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * 获取或创建 Session ID
 * 优先从 cookie 读取，如果不存在则创建新的
 */
export function getOrCreateSessionId(): string {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined') {
    return 'server_session'
  }

  // 尝试从 cookie 读取
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === SESSION_ID_KEY) {
      return value
    }
  }

  // 如果不存在，创建新的 session ID
  const newSessionId = generateSessionId()

  // 存储到 cookie（1年有效期）
  document.cookie = `${SESSION_ID_KEY}=${newSessionId}; path=/; max-age=${SESSION_ID_COOKIE_MAX_AGE}; SameSite=Lax`

  console.log('[SessionManager] 创建新的 Session ID:', newSessionId)

  return newSessionId
}

/**
 * 清除 Session ID（用于测试或登出）
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return

  document.cookie = `${SESSION_ID_KEY}=; path=/; max-age=0`
  console.log('[SessionManager] Session ID 已清除')
}

/**
 * 获取当前 Session ID（不创建新的）
 */
export function getCurrentSessionId(): string | null {
  if (typeof window === 'undefined') return null

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === SESSION_ID_KEY) {
      return value
    }
  }

  return null
}
