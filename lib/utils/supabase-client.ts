'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase 客户端工具
 * 用于浏览器端的认证和数据操作
 */

let _supabase: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    console.warn('[Supabase] 警告: 未配置有效的 Supabase 环境变量')
    // 返回一个mock客户端，避免SSR预渲染时报错
    _supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
    return _supabase
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  return _supabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    return (client as any)[prop]
  },
})

/**
 * Google 登录
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('[Supabase] Google 登录失败:', error.message)
    throw error
  }

  return data
}

/**
 * 登出
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[Supabase] 登出失败:', error.message)
    throw error
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('[Supabase] 获取用户失败:', error.message)
    return null
  }

  return user
}

/**
 * 获取当前会话
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('[Supabase] 获取会话失败:', error.message)
    return null
  }

  return session
}
