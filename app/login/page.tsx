'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/utils/supabase-client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    try {
      setIsSendingCode(true)
      setError('')
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error
      
      setSuccess('验证码已发送到您的邮箱，请查收')
    } catch (err: any) {
      setError(err.message || '发送验证码失败，请重试')
    } finally {
      setIsSendingCode(false)
    }
  }

  // 邮箱密码登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码')
    } finally {
      setIsLoading(false)
    }
  }

  // 邮箱验证码注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !verificationCode || !password) {
      setError('请填写所有必填项')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // 使用验证码验证邮箱
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup',
      })

      if (verifyError) throw verifyError

      // 设置密码
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) throw updateError

      setSuccess('注册成功！正在跳转...')
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || '注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">Ti</span>
            </div>
            <h1 className="text-2xl font-bold">
              {mode === 'login' ? '登录' : '注册'}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === 'login' ? '欢迎回来，请登录您的账号' : '创建新账号，开始您的创作之旅'}
            </p>
          </div>

          {/* 错误/成功提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 注册模式：验证码 */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">验证码</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    className="flex-1 h-12 px-4 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSendingCode}
                    className="px-4 h-12 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSendingCode ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      '发送验证码'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? '请设置密码（至少6位）' : '请输入密码'}
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : mode === 'login' ? (
                '登录'
              ) : (
                '注册'
              )}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground text-sm">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
                setSuccess('')
              }}
              className="text-primary text-sm font-medium ml-1 hover:underline"
            >
              {mode === 'login' ? '立即注册' : '立即登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
