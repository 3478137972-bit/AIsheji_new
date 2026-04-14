'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/auth';
import { Key, Mail, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-beige-50 to-tech-blue/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">邮件已发送</h1>
            <p className="text-neutral-600 mb-6">
              我们已向 <strong className="text-neutral-900">{email}</strong> 发送了密码重置链接<br/>
              请检查你的邮箱（包括垃圾邮件箱）
            </p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              返回登录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-beige-50 to-tech-blue/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Key size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">忘记密码</h1>
          <p className="text-neutral-600">输入邮箱，我们将发送重置链接</p>
        </div>

        {/* 重置卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* 邮箱输入 */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* 发送按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  发送中...
                </>
              ) : (
                '发送重置链接'
              )}
            </button>
          </form>

          {/* 返回登录 */}
          <p className="text-center text-neutral-600 mt-6">
            想起密码了？{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              返回登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
