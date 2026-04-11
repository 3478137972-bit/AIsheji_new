# TIANyu API 集成指南

> 文档版本：v1.0  
> 创建时间：2026-04-11  
> 项目：TIANyu WEB UI

---

## 📖 目录

1. [概述](#1-概述)
2. [基础配置](#2-基础配置)
3. [API 客户端](#3-api-客户端)
4. [接口示例](#4-接口示例)
5. [错误处理](#5-错误处理)
6. [最佳实践](#6-最佳实践)

---

## 1. 概述

### 1.1 文档说明

本文档介绍 TIANyu 前端如何与后端 API 进行集成，包括请求封装、接口调用、错误处理等。

### 1.2 API 基础信息

| 项目 | 值 |
|------|------|
| 基础 URL | `https://api.tianyu.com` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 认证方式 | Bearer Token |

### 1.3 接口规范

```
请求格式
Method: GET | POST | PUT | DELETE
URL: /api/v1/{resource}
Headers:
  Content-Type: application/json
  Authorization: Bearer {token}

响应格式
{
  "code": 0,           // 错误码，0 表示成功
  "message": "success", // 提示信息
  "data": { }          // 业务数据
}
```

---

## 2. 基础配置

### 2.1 环境变量

```bash
# .env.local
VITE_API_BASE_URL=https://api.tianyu.com
VITE_API_TIMEOUT=30000
```

### 2.2 TypeScript 类型定义

```typescript
// src/types/api.ts

// 基础响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, string>;
}
```

---

## 3. API 客户端

### 3.1 请求拦截器

```typescript
// src/utils/api.ts
import { ApiResponse, ApiError } from '@/types/api';

class ApiClient {
  private baseURL: string;
  private token: string = '';

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 设置认证 Token
  setToken(token: string) {
    this.token = token;
  }

  // 清除认证 Token
  clearToken() {
    this.token = '';
  }

  // 请求拦截
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 添加认证 Token
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // HTTP 错误处理
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ApiResponse<T> = await response.json();

      // 业务错误处理
      if (result.code !== 0) {
        throw {
          code: result.code,
          message: result.message,
        } as ApiError;
      }

      return result.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET 请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  // POST 请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 导出单例
export const api = new ApiClient(import.meta.env.VITE_API_BASE_URL);
```

### 3.2 请求示例

```typescript
// src/api/user.ts
import { api } from '@/utils/api';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// 获取用户信息
export async function getUserInfo(): Promise<User> {
  return api.get<User>('/api/v1/user/info');
}

// 更新用户信息
export async function updateUserInfo(data: Partial<User>): Promise<User> {
  return api.put<User>('/api/v1/user/info', data);
}
```

---

## 4. 接口示例

### 4.1 AI 直播脚本

```typescript
// src/api/live-script.ts

// 请求参数
interface LiveScriptParams {
  productName: string;
  productFeatures: string;
  targetAudience: '年轻人' | '中年人' | '老年人' | '商务人士' | '家庭主妇';
  duration: '15min' | '30min' | '60min' | '90min';
  styles?: ('活泼' | '专业' | '亲和' | '幽默')[];
}

// 响应数据
interface LiveScriptResult {
 开场话术: string;
  产品介绍: string;
  促单话术: string;
  互动引导: string;
  结束话术: string;
}

// 调用接口
export async function generateLiveScript(
  params: LiveScriptParams
): Promise<LiveScriptResult> {
  return api.post<LiveScriptResult>('/api/v1/ai/live-script', params);
}
```

### 4.2 页面调用示例

```tsx
// src/app/live-script/page.tsx
'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { generateLiveScript, LiveScriptParams } from '@/api/live-script';

export default function LiveScriptPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<LiveScriptParams>({
    productName: '',
    productFeatures: '',
    targetAudience: '年轻人',
    duration: '30min',
    styles: [],
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await generateLiveScript(formData);
      setResult(data);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1>AI 直播脚本</h1>
      
      <Input
        label="产品名称"
        value={formData.productName}
        onChange={(v) => setFormData({ ...formData, productName: v })}
      />
      
      <TextArea
        label="产品卖点"
        value={formData.productFeatures}
        onChange={(v) => setFormData({ ...formData, productFeatures: v })}
      />
      
      <Button 
        type="primary" 
        onClick={handleSubmit}
        loading={loading}
      >
        生成脚本
      </Button>

      {result && (
        <div className="result">
          <h2>开场话术</h2>
          <p>{result.开场话术}</p>
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

---

## 5. 错误处理

### 5.1 错误码定义

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 0 | 成功 | 无需处理 |
| 400 | 请求参数错误 | 提示用户检查输入 |
| 401 | 未授权 | 跳转登录 |
| 403 | 无权限 | 提示权限不足 |
| 404 | 资源不存在 | 提示内容不存在 |
| 500 | 服务器错误 | 提示稍后重试 |
| 502 | 服务不可用 | 提示稍后重试 |
| 503 | 服务繁忙 | 提示稍后重试 |

### 5.2 全局错误处理

```typescript
// src/utils/error-handler.ts

interface ErrorResponse {
  code: number;
  message: string;
}

export function handleApiError(error: any): string {
  // 网络错误
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return '网络连接失败，请检查网络';
  }

  // 业务错误
  if (error.code) {
    switch (error.code) {
      case 401:
        // 跳转登录
        window.location.href = '/login';
        return '登录已过期，请重新登录';
      case 403:
        return '您没有权限执行此操作';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return error.message || '操作失败';
    }
  }

  return '未知错误，请稍后重试';
}
```

### 5.3 组件中使用

```tsx
import { handleApiError } from '@/utils/error-handler';

async function fetchData() {
  try {
    const data = await api.get('/api/v1/data');
  } catch (error) {
    const message = handleApiError(error);
    toast.error(message); // 使用你的 toast 组件
  }
}
```

---

## 6. 最佳实践

### 6.1 请求封装原则

1. **统一错误处理**：所有 API 调用通过封装好的 client
2. **类型安全**：使用 TypeScript 定义完整的请求/响应类型
3. **Loading 状态**：在页面级管理 loading 状态
4. **防抖处理**：高频请求使用防抖

### 6.2 性能优化

```typescript
// 使用 React Query 进行数据缓存
import { useQuery, useMutation } from '@tanstack/react-query';

// 查询示例
function useUserInfo() {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => api.get('/api/v1/user/info'),
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新请求
    cacheTime: 10 * 60 * 1000,
  });
}

// 突变示例
function useUpdateUser() {
  return useMutation({
    mutationFn: (data) => api.put('/api/v1/user/info', data),
    onSuccess: () => {
      // 清除缓存
      queryClient.invalidateQueries(['user', 'info']);
    },
  });
}
```

### 6.3 安全建议

1. **Token 存储**：使用内存存储，避免 XSS
2. **敏感信息**：不在 localStorage 存储token
3. **CSRF 防护**：后端实现 CSRF token
4. **请求日志**：生产环境关闭 console.log

---

## 📚 相关文档

- [01-快速入门指南](./01-快速入门指南.md) - 快速上手
- [05-组件使用文档](./05-组件使用文档.md) - 组件使用
- [09-测试指南](./09-测试指南.md) - 测试指南

---

**版本**: v1.0  
**最后更新**: 2026-04-11