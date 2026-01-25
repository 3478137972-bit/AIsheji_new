# AIIP插画开发经验教训总结

## 📋 项目概述

**项目名称**: AIIP插画1号员工功能开发
**开发时间**: 2026年1月25日
**开发内容**: 基于DeepSeek AI和KIEAI的IP角色节日场景插画生成系统
**最终结果**: ✅ 功能实现完成，但过程中出现了架构设计失误

---

## 🔴 主要问题回顾

### 问题现象

在功能开发完成并推送到GitHub后，实际运行时出现以下错误：

```
GET /api/task-status/batch_1769308717955 404 Not Found
[TaskStore] Supabase 中未找到任务: undefined
```

### 问题根源

在开发过程中，我创建了一个新的任务存储系统 (`lib/api/task-store.ts`)，使用内存存储任务信息。但实际上项目中已经存在一个完善的Supabase存储系统 (`lib/backend/task-store.js`)。

这导致了架构冲突：
```
生成API → 使用新的内存存储 (lib/api/task-store.ts)
查询API → 使用旧的Supabase存储 (lib/backend/task-store.js)
结果 → 任务无法找到!
```

---

## 💡 核心经验教训

### 1️⃣ Always Read Before Write (先读后写)

**❌ 错误做法**：
- 看到需要任务存储功能
- 直接创建新的 `lib/api/task-store.ts`
- 实现内存存储逻辑
- 推送代码

**✅ 正确做法**：
```typescript
// 第一步：搜索现有实现
await Glob({ pattern: "**/*task-store*" })
await Grep({ pattern: "task.*store", output_mode: "files_with_matches" })

// 第二步：阅读现有代码
await Read({ file_path: "lib/backend/task-store.js" })

// 第三步：理解现有架构
// - 已经有Supabase存储系统
// - 支持持久化
// - 适合Vercel部署
// - 其他API都在用

// 第四步：决策
// 重用现有系统 > 创建新系统
```

**教训**：
> 在编写新代码之前，务必先探索代码库，了解是否已有类似功能。**重用永远优于重写**。

---

### 2️⃣ Understand the Full Flow (理解完整流程)

**❌ 错误做法**：
- 只关注创建API (`generate-aiip-illustration`)
- 没有检查查询API (`task-status/[batchId]`)
- 假设它会自动适配新的存储系统

**✅ 正确做法**：
```typescript
// 创建新API前，先理解完整的数据流

// 1. 用户操作流程
用户填写表单
    ↓
POST /api/generate-aiip-illustration  // 我要创建这个
    ↓
存储任务到...哪里？ // 关键问题！
    ↓
GET /api/task-status/[batchId]  // 这个已存在，用的什么存储？
    ↓
返回结果

// 2. 阅读查询API的代码
await Read({ file_path: "app/api/task-status/[batchId]/route.ts" })

// 3. 发现它使用的是
const { getTask } = require('@/lib/backend/task-store')

// 4. 结论：我也应该使用同样的存储系统！
const { setTask } = require('@/lib/backend/task-store')
```

**教训**：
> 创建新功能时，要理解整个用户流程，确保所有相关API使用一致的架构和存储系统。

---

### 3️⃣ Test End-to-End (端到端测试)

**❌ 错误做法**：
```bash
# 只做了编译测试
npm run build
# ✓ Compiled successfully

# 看到编译通过就推送了
git push
```

**✅ 正确做法**：
```bash
# 1. 编译测试（必要但不充分）
npm run build

# 2. 启动开发服务器
npm run dev

# 3. 手动测试完整流程
# - 打开浏览器
# - 访问 http://localhost:3000/tools/ai-ip-illustration-1
# - 填写表单（物种：猫，动作：跳舞）
# - ���击"生成插画"
# - 观察网络请求
# - 检查任务是否创建成功
# - 等待查询结果
# - 验证图片是否返回

# 4. 检查控制台日志
# - 查看是否有错误
# - 验证任务存储日志
# - 确认查询成功

# 5. 全部通过后再推送
git push
```

**测试清单**：

| 测试项 | 命令/操作 | 预期结果 | 实际结果 |
|--------|----------|---------|---------|
| 编译测试 | `npm run build` | ✓ 成功 | ✓ |
| 服务启动 | `npm run dev` | ✓ 3000端口 | ? 未测试 |
| 页面访问 | 打开浏览器 | ✓ 显示表单 | ? 未测试 |
| 创建任务 | 点击生成 | ✓ 返回batchId | ? 未测试 |
| 查询任务 | 自动轮询 | ✓ 找到任务 | ✗ 404错误 |
| 返回结果 | 等待完成 | ✓ 显示图片 | ? 未测试 |

**教训**：
> 编译通过 ≠ 功能正常。必须进行端到端测试，模拟真实用户操作，验证完整流程。

---

### 4️⃣ Check Integration Points (检查集成点)

**❌ 错误思维**：
```typescript
// 我创建的代码
import { createBatchTask } from '@/lib/api/task-store'
createBatchTask(batchId, taskIds, variantCount)

// 心理活动：
// "我创建了任务，存储到内存里了"
// "前端会轮询查询，应该能拿到数据"
// ✓ 推送代码
```

**✅ 正确思维**：
```typescript
// 我创建的代码
import { createBatchTask } from '@/lib/api/task-store'

// 应该问的问题：
// Q1: 查询API用的是什么存储系统？
await Read({ file_path: "app/api/task-status/[batchId]/route.ts" })
// A1: const { getTask } = require('@/lib/backend/task-store')

// Q2: 这两个task-store是同一个吗？
// lib/api/task-store.ts  VS  lib/backend/task-store.js
// A2: 不是！一个内存，一个Supabase

// Q3: 这会导致什么问题？
// A3: 写入内存，从数据库读 → 数据不一致！

// Q4: 怎么解决？
// A4: 使用同一个存储系统
const { setTask } = require('@/lib/backend/task-store')
```

**检查清单**：

创建新API时必须检查：

- [ ] 这个API的数据会被谁读取？
- [ ] 读取方使用什么存储系统？
- [ ] 我的写入系统和读取系统一致吗？
- [ ] 数据格式兼容吗？
- [ ] 是否需要迁移现有数据？

**教训**：
> 在分布式系统中，写入和读取必须使用一致的存储后端。创建新API前，必须检查所有集成点。

---

### 5️⃣ Use Existing Agents Proactively (主动使用探索工具)

**❌ 错误流程**：
```
接到任务 → 直接开始写代码 → 遇到问题 → 修复
```

**✅ 正确流程**：
```
接到任务
    ↓
📍 使用Explore Agent探索代码库
    - "查找项目中所有任务存储相关的代码"
    - "查找KIEAI相关的API调用"
    - "查找Supabase的使用方式"
    ↓
理解现有架构
    ↓
设计方案（重用 vs 创建）
    ↓
实现代码
    ↓
测试验证
    ↓
推送代码
```

**实际应该使用的工具**：

```typescript
// 1. 探索任务存储
await Task({
  subagent_type: "Explore",
  prompt: "查找项目中所有与任务存储相关的代码，包括创建、查询、更新任务的实现",
  description: "探索任务存储系统"
})

// 2. 搜索关键文件
await Glob({ pattern: "**/*task*.{ts,js}" })
await Grep({ pattern: "setTask|getTask", output_mode: "files_with_matches" })

// 3. 阅读相关实现
await Read({ file_path: "lib/backend/task-store.js" })
await Read({ file_path: "app/api/task-status/[batchId]/route.ts" })
```

**教训**：
> 在大型项目中，人工搜索容易遗漏。应该主动使用Explore Agent和搜索工具，全面了解代码库。

---

## 🎯 标准开发流程 (SOP)

基于这次经验，制定以下标准操作流程：

### Phase 1: 需求理解 (Understand)
```
1. 阅读需求文档
2. 明确功能目标
3. 识别关键词（如：任务存储、图片生成、状态查询）
```

### Phase 2: 代码探索 (Explore)
```
4. 使用Explore Agent探索相关代码
   Task({
     subagent_type: "Explore",
     prompt: "查找项目中[关键功能]的所有实现"
   })

5. 搜索关键文件和代码
   Glob({ pattern: "**/*{keyword}*" })
   Grep({ pattern: "{keyword}", output_mode: "files_with_matches" })

6. 阅读现有实现
   Read({ file_path: "..." })

7. 理解现有架构
   - 存储系统
   - API设计
   - 数据流
```

### Phase 3: 方案设计 (Design)
```
8. 决策：重用 vs 创建
   IF 已有类似功能 THEN
     重用现有系统
   ELSE
     创建新系统，但要考虑兼容性
   END IF

9. 设计数据流
   用户 → API A → 存储系统 → API B → 用户
   确保所有环节使用一致的系统

10. 验证集成点
    - 哪些API会读我的数据？
    - 它们使用什么存储？
    - 数据格式兼容吗？
```

### Phase 4: 代码实现 (Implement)
```
11. 编写代码
    - 遵循现有架构
    - 使用一致的存储系统
    - 添加详细日志

12. 添加错误处理
    - try-catch
    - 详细的错误信息
    - 回退机制
```

### Phase 5: 测试验证 (Test)
```
13. 编译测试
    npm run build

14. 单元测试（如果有）
    npm test

15. 启动开发服务器
    npm run dev

16. 端到端测试
    - 打开浏览器
    - 执行完整用户流程
    - 检查每个步骤
    - 验证最终结果

17. 日志验证
    - 检查控制台输出
    - 确认无错误
    - 验证数据流正确

18. 边界测试
    - 错误输入
    - 网络失败
    - 超时处理
```

### Phase 6: 文档与推送 (Document & Deploy)
```
19. 更新文档
    - API文档
    - 使用说明
    - 架构图

20. 代码审查（自我审查）
    - 代码风格
    - 错误处理
    - 性能优化

21. 提交代码
    git add
    git commit -m "详细的提交信息"

22. 推送代码
    git push
```

---

## 📊 问题根因分析 (5 Whys)

**问题**: 为什么AIIP插画任务查询失败？

**Why 1**: 为什么查询失败？
- 因为Supabase中找不到任务

**Why 2**: 为什么Supabase中找不到任务？
- 因为任务存储在内存中，不在Supabase

**Why 3**: 为什么任务存储在内存中？
- 因为生成API使用了新的内存存储系统

**Why 4**: 为什么创建了新的内存存储系统？
- 因为没有发现已存在Supabase存储系统

**Why 5**: 为什么没有发现已存在的系统？
- **根本原因**: 在开发前没有充分探索代码库，没有使用Explore/Glob/Grep工具搜索现有实现

---

## ✅ 改进措施 (PDCA)

### Plan (计划)
- [ ] 制定标准开发流程SOP
- [ ] 创建开发前检查清单
- [ ] 建立代码探索最佳实践

### Do (执行)
- [x] 修复AIIP插画任务存储问题
- [x] 统一使用Supabase存储系统
- [x] 编写问题修复文档
- [x] 编写经验教训总结

### Check (检查)
- [ ] 在下一个功能开发中应用新流程
- [ ] 验证是否避免类似问题
- [ ] 收集团队反馈

### Act (行动)
- [ ] 根据实践经验优化SOP
- [ ] 分享给团队成员
- [ ] 形成组织知识库

---

## 🎓 关键要点总结

### 开发原则

1. **先理解，再创建** (Understand Before Create)
   - 探索代码库
   - 理解现有架构
   - 重用优于重写

2. **保持一致性** (Maintain Consistency)
   - 统一的存储系统
   - 统一的API设计
   - 统一的错误处理

3. **完整测试** (Test Thoroughly)
   - 不仅是编译测试
   - 端到端测试
   - 真实用户场景

4. **主动探索** (Explore Proactively)
   - 使用Explore Agent
   - 使用Glob/Grep搜索
   - 阅读相关代码

5. **检查集成点** (Check Integration)
   - 数据写入在哪里？
   - 数据读取从哪里？
   - 是否一致？

### 反面教材

❌ **错误的开发流程**：
```
需求 → 写代码 → 编译通过 → 推送 → 生产环境报错 → 紧急修复
```

✅ **正确的开发流程**：
```
需求 → 探索 → 理解 → 设计 → 实现 → 测试 → 验证 → 推送 → 稳定运行
```

### 名言警句

> "读代码的时间远多于写代码的时间" - Robert C. Martin

> "过早优化是万恶之源" - Donald Knuth
> （推论：过早创建新系统也是万恶之源）

> "Don't Repeat Yourself (DRY)" - Andy Hunt & Dave Thomas
> （包括：不要重复造轮子）

---

## 📚 延伸学习

### 推荐阅读

1. **《代码大全》** - Steve McConnell
   - 第5章：软件构建中的设计
   - 第21章：协同构造

2. **《重构：改善既有代码的设计》** - Martin Fowler
   - 重构前先理解代码
   - 小步前进，频繁测试

3. **《人月神话》** - Frederick Brooks
   - 没有银弹
   - 系统的整体性

### 相关最佳实践

- **SOLID原则**: 单一职责、依赖倒置
- **DRY原则**: Don't Repeat Yourself
- **KISS原则**: Keep It Simple, Stupid
- **YAGNI原则**: You Aren't Gonna Need It

---

## 🎬 结语

这次经验教训提醒我们：

> **快不是跳过步骤，而是正确地完成每个步骤**

真正的效率不是：
- ❌ 快速写代码 → 出问题 → 花时间修复

而是：
- ✅ 充分调研 → 正确实现 → 一次成功

**时间对比**：

| 方式 | 调研 | 开发 | 修复 | 总计 |
|------|------|------|------|------|
| 错误方式 | 0min | 60min | 120min | 180min |
| 正确方式 | 30min | 60min | 0min | 90min |

**慢即是快，少即是多。**

---

**文档版本**: 1.0
**最后更新**: 2026-01-25
**作者**: Claude Sonnet 4.5
**审阅状态**: ✅ 已完成

---

## 附录：开发前检查清单

```markdown
# 新功能开发检查清单

## 开发前 (Pre-Development)

- [ ] 已充分理解需求
- [ ] 已识别关键词和核心功能
- [ ] 已使用Explore Agent探索代码库
- [ ] 已使用Glob搜索相关文件
- [ ] 已使用Grep搜索关键代码
- [ ] 已阅读现有相关实现
- [ ] 已理解现有架构和数据流
- [ ] 已决策：重用 vs 创建

## 开发中 (During Development)

- [ ] 代码遵循现有架构模式
- [ ] 使用一致的存储系统
- [ ] 添加了详细的日志
- [ ] 实现了错误处理
- [ ] 考虑了边界情况

## 开发后 (Post-Development)

- [ ] 编译测试通过 (npm run build)
- [ ] 启动了开发服务器 (npm run dev)
- [ ] 完成端到端测试
- [ ] 验证了完整用户流程
- [ ] 检查了控制台日志
- [ ] 测试了错误场景
- [ ] 更新了文档
- [ ] 编写了提交信息

## 推送前 (Pre-Push)

- [ ] 再次确认所有测试通过
- [ ] 确认没有遗留TODO
- [ ] 确认代码风格一致
- [ ] 准备好回滚方案
```

**使用方法**: 每次开发新功能前，复制这个清单，逐项检查，确保不遗漏关键步骤。
