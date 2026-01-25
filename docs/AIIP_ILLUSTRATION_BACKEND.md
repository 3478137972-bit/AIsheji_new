# AIIP插画1号员工 - 后端实现说明

## 功能概述

AIIP插画1号员工是一个基于AI的IP角色节日场景插画生成系统,整合了DeepSeek AI和KIEAI图像生成服务。

## 技术架构

### 核心组件

1. **DeepSeek AI** - 智能提示词生成
   - 使用专业的IP场景插画智能体提示词
   - 将用户输入转换为高质量的英文绘画提示词
   - 严格控制矢量风格、扁平化设计和赛璐珞渲染风格

2. **KIEAI** - 图像生成服务
   - 使用 nano-banana-pro 模型生成高质量插画
   - 支持多种比例和分辨率
   - 支持参考图上传

3. **任务管理系统** - 异步任务处理
   - 内存存储任务状态(生产环境建议使用数据库)
   - 支持批量生成(每次生成3个变体)
   - 轮询查询机制

## 工作流程

```
用户输入表单
    ↓
[1] 收集表单数据
    - IP角色: 物种、颜色、体型
    - 场景与节日: 动作、地点、节日
    - 参考图片(可选)
    - 图片比例
    ↓
[2] DeepSeek生成提示词
    - 调用 /lib/api/deepseek.ts
    - 使用IP场景插画智能体系统提示词
    - 输出英文绘画提示词
    ↓
[3] 上传参考图(如果有)
    - 调用 /lib/api/kieai.ts - uploadImageToKIEAI()
    - Base64 → Blob → FormData → KIEAI服务器
    - 获取图片URL
    ↓
[4] 创建KIEAI生成任务
    - 调用 /lib/api/kieai.ts - createKIEAITask()
    - 创建3个变体任务
    - 获取taskId数组
    ↓
[5] 创建批次任务记录
    - 调用 /lib/api/task-store.ts - createBatchTask()
    - 生成batchId
    - 存储任务元数据
    ↓
[6] 返回batchId给前端
    ↓
[7] 前端轮询查询任务状态
    - 调用 GET /api/task-status/[batchId]
    - 每3秒查询一次
    - 最多查询60次(3分钟)
    ↓
[8] 后端查询KIEAI任务状态
    - 调用 /lib/api/kieai.ts - getKIEAITaskStatus()
    - 解析结果URL
    - 更新任务存储
    ↓
[9] 返回生成结果给用户
    - 成功: 返回图片URL
    - 失败: 返回错误信息
```

## 文件结构

```
.
├── .env.local                    # 环境变量配置
│   ├── DEEPSEEK_API_KEY         # DeepSeek API密钥
│   ├── DEEPSEEK_BASE_URL        # DeepSeek API地址
│   ├── KIEAI_API_KEY            # KIEAI API密钥
│   └── KIEAI_BASE_URL           # KIEAI API地址
│
├── lib/api/                      # API工具函数库
│   ├── deepseek.ts              # DeepSeek AI集成
│   │   └── generateAIIPPrompt() # 生成IP插画提示词
│   │
│   ├── kieai.ts                 # KIEAI服务集成
│   │   ├── uploadImageToKIEAI() # 上传参考图
│   │   ├── createKIEAITask()    # 创建生成任务
│   │   └── getKIEAITaskStatus() # 查询任务状态
│   │
│   └── task-store.ts            # 任务存储管理
│       ├── createBatchTask()     # 创建批次任务
│       ├── getBatchTask()        # 获取批次任务
│       └── updateTaskResult()    # 更新任务结果
│
├── app/api/                      # Next.js API路由
│   ├── generate-aiip-illustration/
│   │   └── route.ts             # POST - 创建AIIP插画生成任务
│   │
│   └── task-status/[batchId]/
│       └── route.ts             # GET - 查询任务状态
│
└── app/tools/ai-ip-illustration-1/
    └── page.tsx                  # 前端页面
```

## API接口说明

### 1. 创建AIIP插画生成任务

**接口**: `POST /api/generate-aiip-illustration`

**请求体**:
```json
{
  "species": "猫",          // 必填: 物种
  "color": "橙色",          // 可选: 颜色
  "bodyType": "圆润",       // 可选: 体型
  "action": "跳舞",         // 必填: 动作
  "location": "公园",       // 可选: 地点
  "festival": "春节",       // 可选: 节日
  "aspectRatio": "1:1",    // 可选: 比例
  "referenceImages": [     // 可选: 参考图(Base64数组)
    "data:image/jpeg;base64,..."
  ]
}
```

**响应**:
```json
{
  "success": true,
  "batchId": "batch-1234567890-abc123",
  "promptCount": 3,
  "prompt": "Vector illustration style, medium black outline...",
  "message": "已创建 3 个设计任务"
}
```

### 2. 查询任务状态

**接口**: `GET /api/task-status/{batchId}`

**响应**:
```json
{
  "success": true,
  "batchId": "batch-1234567890-abc123",
  "status": "processing",  // pending | processing | completed | failed
  "results": [
    {
      "index": 0,
      "taskId": "task_12345678",
      "status": "success",   // pending | processing | success | failed
      "imageUrl": "https://example.com/generated-image.png"
    },
    {
      "index": 1,
      "taskId": "task_87654321",
      "status": "processing"
    },
    {
      "index": 2,
      "taskId": "task_11223344",
      "status": "pending"
    }
  ]
}
```

## DeepSeek智能体提示词

系统使用了专业的IP场景插画智能体提示词,包含以下核心模块:

### 1. 核心风格控制(强制性)
- 矢量插画风格
- 中等粗细黑色描边
- 元素和谐统一
- 扁平化设计
- 赛璐珞渲染风格

### 2. 角色设计模块
- 物种选择: 拟人化动物角色
- 体型比例: Q版/标准/矮胖/瘦长
- 色彩方案: 主色调+白色搭配
- 表情动作: 多种预设表情和姿态

### 3. 场景设定模块
- 节日类型: 春节/中秋/开业等
- 场景定位: 店铺门前/广场/电商平台等
- 构图方式: 中心对称/对角线/三段式等

### 4. 节日元素模块
- 装饰元素: 灯笼/春联/红包/祥云等
- 道具元素: 手持物品/举牌/吹喇叭等
- 品牌元素: Logo/产品/标语

### 5. 负向约束
自动排除: 3D渲染、水彩、油画、照片写实等风格

## KIEAI配置

### 模型参数
- **模型**: nano-banana-pro
- **分辨率**: 1K (可选: 1K, 2K, 4K)
- **输出格式**: PNG (可选: PNG, JPG, WebP)
- **比例**: 可选11种比例 (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, auto)

### 文件上传
- **上传路径**: images/user-uploads
- **文件命名**: 自动生成唯一文件名(避免覆盖)
- **支持格式**: JPEG, PNG, WebP等
- **大小限制**: 由KIEAI服务器控制

## 任务存储

当前使用内存存储(Map),适合开发和小规模使用。

**生产环境建议**:
- 使用 Supabase/PostgreSQL 持久化存储
- 添加 Redis 缓存层加速查询
- 实现任务状态变更的 Webhook 回调

## 性能优化

1. **批量生成**: 每次生成3个变体,提供更多选择
2. **并发上传**: 参考图使用 Promise.all 并发上传
3. **状态缓存**: 已完成任务结果缓存在内存中
4. **自动清理**: 24小时后自动清理过期任务

## 错误处理

所有API调用都包含完整的错误处理:
- DeepSeek API错误
- KIEAI文件上传错误
- KIEAI任务创建错误
- 任务状态查询错误

错误会返回详细的错误信息,方便调试。

## 环境变量

确保在 `.env.local` 中配置以下环境变量:

```env
DEEPSEEK_API_KEY=sk-1ee9dfb1d0bc4080992a1aaa7798e23a
DEEPSEEK_BASE_URL=https://api.deepseek.com
KIEAI_API_KEY=606900131123347553ac876bf42a1566
KIEAI_BASE_URL=https://api.kie.ai
```

## 测试流程

1. 启动开发服务器: `npm run dev`
2. 访问: http://localhost:3000/tools/ai-ip-illustration-1
3. 填写表单:
   - 物种: 猫
   - 动作: 跳舞
   - 节日: 春节
4. 点击"生成插画"
5. 等待3-5秒查看结果

## 日志说明

系统在控制台输出详细日志:

```
[AIIP插画] 开始处理请求: {...}
[AIIP插画] 步骤1: 调用 DeepSeek 生成提示词...
[AIIP插画] DeepSeek 生成的提示词: ...
[AIIP插画] 步骤2: 上传 2 张参考图片...
[AIIP插画] 参考图片上传成功: [...]
[AIIP插画] 步骤3: 创建 3 个生成任务...
[AIIP插画] KIEAI 任务创建成功: [...]
[AIIP插画] 批次任务创建成功: batch-...
[任务查询] AIIP插画任务 batch-...: {...}
[任务查询] KIEAI任务 task_... 状态: success
```

## 已知限制

1. **任务存储**: 当前使用内存存储,服务重启后任务记录丢失
2. **图片压缩**: 前端压缩可能导致质量损失,建议后端实现更专业的压缩
3. **并发限制**: 未实现请求频率限制,可能触发API限流
4. **文件大小**: 参考图大小未严格限制

## 后续改进建议

1. 使用Supabase/PostgreSQL持久化任务存储
2. 添加请求频率限制和用户配额管理
3. 实现Webhook回调机制,避免轮询
4. 添加图片优化和CDN集成
5. 实现任务队列系统(Bull/BullMQ)
6. 添加监控和告警系统
7. 实现AB测试不同提示词效果

## 技术支持

如有问题,请查看:
- DeepSeek文档: https://platform.deepseek.com/docs
- KIEAI文档: https://docs.kie.ai
- Next.js文档: https://nextjs.org/docs
