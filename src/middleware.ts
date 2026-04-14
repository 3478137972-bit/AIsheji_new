import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 创建 Supabase 客户端（服务端）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 定义需要保护的路由路径
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// 定义公开的路由路径
const publicRoutes = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 检查是否是公开路由
  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  // 检查是否是受保护的路由
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  // 从 cookie 中获取会话
  const cookies = request.headers.get('cookie') || '';
  const authCookie = cookies.split(';').find(c => c.trim().startsWith('sb-auth-token='))?.split('=')[1];

  // 如果是受保护的路由且没有会话，重定向到登录页
  if (isProtected && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 如果已登录且访问登录/注册页面，重定向到首页
  if (isPublic && authCookie && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/login', '/register', '/'],
};
