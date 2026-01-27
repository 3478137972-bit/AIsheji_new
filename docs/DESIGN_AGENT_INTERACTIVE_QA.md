# 设计智能体交互式问答功能开发文档

## 📋 文档概述

本文档记录设计智能体交互式问答功能的开发进展、技术实现和待完成任务。

**创建时间**: 2026-01-27
**最后更新**: 2026-01-27
**状态**: 🚧 开发中（后端已完成，前端 UI 待完善）

---

## 🎯 功能目标

### 核心需求
1. **意图识别后判断信息完整性**：识别用户设计意图后，分析需求是否完整
2. **交互式问答**：当信息不完整时，向用户提问收集必要信息
3. **优化输出信息**：不暴露内部处理细节（置信度、质量评分等）

### 用户体验流程
```
用户输入设计需求
    ↓
意图识别（Logo/插画/海报等）
    ↓
需求完整性分析
    ↓
├─ 信息完整 → 直接生成提示词
└─ 信息不完整 → 向用户提问
        ↓
    用户回答问题
        ↓
    生成专业提示词
```

---

## ✅ 已完成功能

### 1. 后端 - 交互式问答核心逻辑

**文件**: `app/api/design-agent/chat/route.ts`

#### 关键实现

**1.1 使用 `generateInteractive` 方法**
```typescript
const result = await agent.generateInteractive(message, onQuestion);
```

**1.2 问答回调函数**
```typescript
const onQuestion = async (questions: Array<{ key: string; question: string; options?: string[] }>) => {
  // 如果已经有答案（用户第二次请求），直接返回
  if (answers) {
    return answers;
  }

  // 如果没有答案，抛出特殊错误，让外层捕获并返回问题
  throw {
    type: 'NEED_ANSWERS',
    questions: questions
  };
};
```

**1.3 新增响应类型**
- `type: 'questions'` - 返回需要用户回答的问题
- `type: 'result'` - 返回生成结果
- `type: 'chat'` - 聊天模式回复
- `type: 'error'` - 错误信息

**1.4 请求参数扩展**
```typescript
{
  message: string,      // 用户消息
  answers?: Record<string, string>  // 用户回答（可选）
}
```

**1.5 问题响应格式**
```json
{
  "type": "questions",
  "message": "为了生成更专业的设计，我需要了解一些细节：",
  "questions": [
    {
      "key": "style",
      "question": "您希望什么风格？",
      "options": ["现代简约", "科技感", "传统"]
    }
  ]
}
```

### 2. 后端 - 优化输出信息

**修改前**（暴露内部细节）:
```
✅ 已识别为【Logo设计】设计，为您生成专业提示词！

📊 置信度: 100%
🎨 设计要素: 品牌标识、图形符号、文字组合
⭐ 质量评分: 80/100
```

**修改后**（简洁专业）:
```
✅ 已为您生成专业的Logo设计提示词！
```

**metadata 简化**:
```typescript
// 修改前
metadata: {
  category: result.metadata.category,
  confidence: result.metadata.confidence,
  designElements: result.metadata.designElements,
  qualityScore: result.metadata.qualityScore,
  // ...更多内部信息
}

// 修改后
metadata: {
  category: result.metadata.category  // 只保留类别
}
```

### 3. 前端 - 问答状态管理

**文件**: `app/design-agent/page.tsx`

#### 新增状态
```typescript
// 问答状态
const [pendingQuestions, setPendingQuestions] = useState<Array<{ key: string; question: string; options?: string[] }> | null>(null)
const [answers, setAnswers] = useState<Record<string, string>>({})
const [originalMessage, setOriginalMessage] = useState<string>("")
```

#### Message 接口扩展
```typescript
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  questions?: Array<{ key: string; question: string; options?: string[] }>  // 新增
}
```

#### 请求逻辑更新
```typescript
const requestBody: any = {
  message: userInput,
}

// 如果有待回答的问题，添加答案
if (pendingQuestions && Object.keys(answers).length > 0) {
  requestBody.answers = answers
  requestBody.message = originalMessage // 使用原始消息
}
```

#### 响应处理
```typescript
if (data.type === 'questions') {
  // 保存问题和原始消息
  setPendingQuestions(data.questions)
  setOriginalMessage(userInput)

  // 初始化答案对象
  const initialAnswers: Record<string, string> = {}
  data.questions.forEach((q: any) => {
    initialAnswers[q.key] = ''
  })
  setAnswers(initialAnswers)
}
```

---

## 🚧 待完成任务

### 1. 前端 - 问答 UI 界面 ⭐ 优先级最高

#### 需要实现的组件

**1.1 问题卡片组件**
在消息列表中显示问题，需要：
- 显示问题文本
- 根据问题类型显示不同的输入控件：
  - 有 `options` → 单选按钮或下拉选择
  - 无 `options` → 文本输入框
- 实时更新 `answers` 状态

**示例代码结构**:
```tsx
{message.questions && (
  <div className="mt-4 space-y-3">
    {message.questions.map((q) => (
      <div key={q.key} className="bg-muted/50 p-4 rounded-lg">
        <p className="font-medium mb-2">{q.question}</p>
        {q.options ? (
          // 单选按钮组
          <div className="space-y-2">
            {q.options.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={q.key}
                  value={option}
                  checked={answers[q.key] === option}
                  onChange={(e) => setAnswers({...answers, [q.key]: e.target.value})}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          // 文本输入框
          <input
            type="text"
            value={answers[q.key] || ''}
            onChange={(e) => setAnswers({...answers, [q.key]: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="请输入..."
          />
        )}
      </div>
    ))}
  </div>
)}
```

**1.2 提交答案按钮**
- 显示在问题卡片下方
- 验证所有问题都已回答
- 点击后调用 `handleSend()` 发送答案

```tsx
{pendingQuestions && (
  <Button
    onClick={() => {
      // 验证所有问题都已回答
      const allAnswered = pendingQuestions.every(q => answers[q.key]?.trim())
      if (!allAnswered) {
        alert('请回答所有问题')
        return
      }
      // 发送答案
      handleSend()
    }}
    disabled={isLoading}
  >
    提交答案
  </Button>
)}
```

**1.3 UI 优化建议**
- 使用 shadcn/ui 的 RadioGroup 组件
- 添加加载状态指示
- 添加答案验证提示
- 优化移动端显示

### 2. 测试和优化

#### 2.1 功能测试
- [ ] 测试简单需求（信息完整）→ 直接生成
- [ ] 测试复杂需求（信息不完整）→ 触发问答
- [ ] 测试问答流程：提问 → 回答 → 生成
- [ ] 测试错误处理：未回答所有问题、网络错误等

#### 2.2 用户体验优化
- [ ] 添加问答进度提示
- [ ] 优化问题文案
- [ ] 添加示例答案提示
- [ ] 支持修改已回答的问题

#### 2.3 性能优化
- [ ] 缓存问答状态（避免刷新丢失）
- [ ] 优化 API 调用（减少重复请求）

---

## 🏗️ 技术架构

### 数据流图

```
┌─────────────┐
│  用户输入   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│  API: /api/design-agent/chat        │
│  - 接收 message 和 answers（可选）  │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  DesignAgent.generateInteractive()  │
│  - 意图识别                         │
│  - 需求完整性分析                   │
└──────┬──────────────────────────────┘
       │
       ├─ 信息完整 ──────────────────┐
       │                              │
       └─ 信息不完整                  │
              │                       │
              ↓                       ↓
       ┌──────────────┐      ┌──────────────┐
       │ 返回问题列表  │      │  生成提示词  │
       │ type: questions│     │ type: result │
       └──────┬───────┘      └──────┬───────┘
              │                      │
              ↓                      │
       ┌──────────────┐             │
       │  前端显示问题 │             │
       │  用户填写答案 │             │
       └──────┬───────┘             │
              │                      │
              ↓                      │
       ┌──────────────┐             │
       │ 重新发送请求  │             │
       │ 带上 answers │             │
       └──────┬───────┘             │
              │                      │
              └──────────────────────┘
                       │
                       ↓
                ┌──────────────┐
                │  显示结果    │
                └──────────────┘
```

### 关键文件

| 文件 | 作用 | 状态 |
|------|------|------|
| `app/api/design-agent/chat/route.ts` | API 路由，处理请求和问答逻辑 | ✅ 完成 |
| `design-agent/design-agent.ts` | 核心控制器，`generateInteractive` 方法 | ✅ 完成 |
| `design-agent/deepseek-client.ts` | DeepSeek API 客户端，需求分析 | ✅ 完成 |
| `app/design-agent/page.tsx` | 前端页面，状态管理 | 🚧 部分完成 |
| `app/design-agent/page.tsx` (UI) | 问答 UI 组件 | ❌ 待开发 |

---

## 📝 开发指南

### 如何继续开发

#### 1. 理解当前状态
```bash
# 查看最近的提交
git log --oneline -5

# 查看当前分支
git branch

# 查看修改的文件
git status
```

#### 2. 运行项目
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问设计智能体页面
# http://localhost:3000/design-agent
```

#### 3. 测试问答功能
```bash
# 在浏览器中输入测试消息
"我想制作一个 Logo"

# 预期行为：
# - 如果信息不完整，应该返回问题
# - 目前前端会收到问题，但没有 UI 显示
# - 需要添加问答 UI 组件
```

#### 4. 开发问答 UI

**步骤**:
1. 在 `app/design-agent/page.tsx` 中找到消息渲染部分
2. 添加问题卡片组件（参考上面的示例代码）
3. 添加提交答案按钮
4. 测试完整流程

**关键代码位置**:
```typescript
// 文件: app/design-agent/page.tsx
// 行号: 约 250-275（消息列表渲染部分）

{messages.map((message) => (
  <div key={message.id}>
    {/* 现有的消息显示 */}
    <p>{message.content}</p>

    {/* 👇 在这里添加问题卡片 */}
    {message.questions && (
      // 问答 UI 组件
    )}
  </div>
))}
```

---

## 🐛 已知问题

### 1. 前端问答 UI 缺失
**问题**: 后端返回问题后，前端没有 UI 显示问题和收集答案
**影响**: 用户无法回答问题，交互式问答功能无法使用
**优先级**: ⭐⭐⭐ 高
**解决方案**: 参考上面的"待完成任务"章节

### 2. 问答状态持久化
**问题**: 刷新页面后问答状态丢失
**影响**: 用户体验不佳
**优先级**: ⭐⭐ 中
**解决方案**: 使用 localStorage 或 sessionStorage 缓存状态

---

## 📚 相关文档

- [项目结构文档](./PROJECT_STRUCTURE.md)
- [开发指南](../DEVELOPMENT_GUIDE.md)
- [CHANGELOG](../CHANGELOG.md)

---

## 🔄 更新日志

### 2026-01-27
- ✅ 完成后端交互式问答逻辑
- ✅ 完成前端状态管理
- ✅ 优化输出信息，移除内部细节
- 🚧 前端问答 UI 待开发
- 📝 创建本开发文档

---

## 💡 提示

### 给后续开发者的建议

1. **先理解数据流**: 从用户输入到最终显示，数据如何流转
2. **参考现有组件**: 项目中已有很多 shadcn/ui 组件，可以复用
3. **测试驱动开发**: 先写测试用例，再实现功能
4. **保持简洁**: UI 不要过于复杂，优先保证功能可用
5. **注意错误处理**: 网络错误、验证错误等都要考虑

### 快速定位代码

```bash
# 搜索问答相关代码
grep -r "pendingQuestions" app/design-agent/

# 搜索 API 路由
grep -r "generateInteractive" app/api/

# 查看类型定义
grep -r "interface Message" app/design-agent/
```

---

**文档维护者**: Claude Sonnet 4.5
**最后更新**: 2026-01-27 14:13 UTC
