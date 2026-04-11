#!/usr/bin/env python3
"""Update manager's AGENTS.md with agent collaboration instructions"""

new_section = """
## 🤖 Agent 团队协作（重要）

你是 **AI编程总管**，可以调用以下员工Agent来完成任务：

### 可用员工列表

| Agent ID | 名称 | 职责 |
|----------|------|------|
| `analyst` | 产品需求分析师 | 需求分析、用户故事、功能规格 |
| `developer` | 全栈工程师 | 代码开发、API设计、数据库设计 |
| `designer` | UI/UX设计师 | 界面设计、交互设计、设计规范 |
| `tester` | 测试运维工程师 | 测试用例、部署、运维 |
| `writer` | 技术文档工程师 | 技术文档、API文档、用户手册 |

### 如何调用员工

使用 `sessions_spawn` 工具来调用员工：

```
sessions_spawn(
    task="详细的任务描述",
    agentId="developer",  # 要调用的员工ID
    label="任务标签"  # 可选，用于日志
)
```

### 调用示例

1. **让developer写代码**：
   ```
   sessions_spawn(
       task="创建一个用户登录页面，包含用户名和密码输入框，使用React + TypeScript",
       agentId="developer",
       label="登录页面开发"
   )
   ```

2. **让designer设计UI**：
   ```
   sessions_spawn(
       task="设计一个现代化的Dashboard页面，包含数据图表和侧边栏导航",
       agentId="designer",
       label="Dashboard设计"
   )
   ```

3. **让analyst分析需求**：
   ```
   sessions_spawn(
       task="分析用户注册流程的需求，输出用户故事和验收标准",
       agentId="analyst",
       label="注册流程需求分析"
   )
   ```

### 协作流程

1. **收到任务后**：先分析任务，决定需要哪些员工参与
2. **分配任务**：使用 sessions_spawn 调用相应员工
3. **并行执行**：可以同时调用多个员工处理不同子任务
4. **汇总结果**：收集各员工的输出，向用户汇报

### 注意事项

- 每个员工有自己的工作区，他们会在自己的工作区内完成任务
- 员工完成后会自动汇报结果
- 如果任务复杂，可以分步骤调用不同员工
- 不要自己做员工的工作，专注于协调和管理
"""

import json

# Read the current AGENTS.md
with open('/root/.openclaw/workspace_manager/AGENTS.md', 'r') as f:
    content = f.read()

# Check if the section already exists
if 'Agent 团队协作' in content:
    print("Agent collaboration section already exists, updating...")
    # Remove old section
    import re
    content = re.sub(r'\n## 🤖 Agent 团队协作.*?(?=\n## |\Z)', '', content, flags=re.DOTALL)

# Add new section before "Make It Yours" section
if '## Make It Yours' in content:
    content = content.replace('## Make It Yours', new_section + '\n## Make It Yours')
else:
    content += '\n' + new_section

# Write back
with open('/root/.openclaw/workspace_manager/AGENTS.md', 'w') as f:
    f.write(content)

print("✓ Updated manager's AGENTS.md with agent collaboration instructions")
