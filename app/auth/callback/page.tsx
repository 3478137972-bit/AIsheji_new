'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/utils/supabase-client'

/**
 * OAuth 认证回调页面
 * 处理 Google 登录后的重定向
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // 处理 OAuth 回调
    const handleCallback = async () => {
      try {
        // 从 URL 中获取认证信息
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('[Auth] 认证回调失败:', error.message)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session) {
          console.log('[Auth] 登录成功:', data.session.user.email)
          // 登录成功，跳转到首页
          router.push('/')
        } else {
          console.warn('[Auth] 未找到会话')
          router.push('/')
        }
      } catch (error) {
        console.error('[Auth] 处理回调时出错:', error)
        router.push('/?error=callback_error')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">正在完成登录...</p>
      </div>
    </div>
  )
}
