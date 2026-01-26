'use client'

import { useState } from 'react'
import { User, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { signInWithGoogle, signOut } from '@/lib/utils/supabase-client'

/**
 * 用户菜单组件
 * 显示登录按钮或用户信息
 */
export function UserMenu() {
  const { user, loading, isAuthenticated } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('登录失败:', error)
      alert('登录失败，请重试')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
    } catch (error) {
      console.error('登出失败:', error)
      alert('登出失败，请重试')
    } finally {
      setIsSigningOut(false)
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningIn ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>登录中...</span>
          </>
        ) : (
          <>
            <User className="w-4 h-4" />
            <span>Google 登录</span>
          </>
        )}
      </button>
    )
  }

  // 已登录状态
  return (
    <div className="flex items-center gap-3">
      {/* 用户信息 */}
      <div className="flex items-center gap-2">
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || user.email || '用户'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || '用户'}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </div>

      {/* 登出按钮 */}
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="登出"
      >
        {isSigningOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
