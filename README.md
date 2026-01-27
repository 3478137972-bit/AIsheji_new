# 秒懂AI超级员工 - 设计系统

一个基于 Next.js 的 AI 设计工具平台，集成了 Logo 生成、插画创作、字体设计等多种 AI 功能。

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/3478137972-bit/miaodongAIchaojiyaungong_design.git
cd miaodongAIchaojiyaungong_design
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的 API 密钥
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
```
http://localhost:3000
```

---

## 📚 文档导航

| 文档 | 说明 | 适用场景 |
|------|------|---------|
| [📖 开发指南](./DEVELOPMENT_GUIDE.md) | **最重要！** 完整的开发文档 | 修改代码前必读 |
| [🏗️ 项目结构文档](./docs/PROJECT_STRUCTURE.md) | **新增！** 设计智能体架构详解 | 了解 DeepSeek 集成 |
| [🐛 故障排除](./TROUBLESHOOTING.md) | 常见问题及解决方案 | 遇到错误时查看 |
| [🚀 Vercel 部署](./VERCEL_DEPLOYMENT_GUIDE.md) | Vercel 部署完整指南 | 准备部署时阅读 |
| [📋 迁移报告](./MIGRATION_REPORT.md) | 后端迁移到 API Routes | 了解架构变化 |
| [🏗️ 项目结构](./STRUCTURE.md) | 网站结构说明 | 了解整体架构 |
| [💻 服务器指南](./DEV_SERVER_GUIDE.md) | 本地服务器启动和故障排除 | 启动问题参考 |

---

## 🎨 功能特性

### 🤖 设计智能体 (新增！)

- **智能对话** - 基于 DeepSeek 的 AI 对话系统
- **意图识别** - 自动识别设计类别（Logo/插画/海报等）
- **Skills 系统** - 专业设计指南知识库
- **提示词生成** - 自动生成专业的出图提示词
- **质量优化** - 智能检查和优化提示词质量

访问: http://localhost:3000/design-agent

### AI 设计工具

- **AI Logo** - 智能生成 Logo 设计
- **AI 插画** - 多风格插画生成
- **AI IP 插画 1 号员工** - 品牌 IP 插画创作
- **AI 字体设计** - 商标、Logo 字体设计

### 图像处理

- 智能抠图
- AI 消除
- 变清晰
- 证件照制作

### AI 商拍

- AI 商品套图
- AI 模特
- AI 试衣/试鞋
- 服装换色、去皱

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 16.0.10 |
| 前端 | React | 19.2.0 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.1.9 |
| 后端 | Next.js API Routes | - |
| AI 服务 | DeepSeek + KIEAI | - |
| 部署 | Vercel | - |

---

## 📝 环境变量配置

### 本地开发

创建 `.env.local` 文件：

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-你的密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com

# KIEAI API
KIEAI_API_KEY=你的密钥
KIEAI_BASE_URL=https://api.kie.ai
```

### Vercel 部署

在 Vercel Dashboard → Settings → Environment Variables 中配置：

- `DEEPSEEK_API_KEY` - DeepSeek API 密钥（必填）
- `KIEAI_API_KEY` - KIEAI API 密钥（必填）

详见: [Vercel 部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🏗️ 项目架构

```
前后端一体化架构 (Next.js)
├── 前端页面 (app/tools/)
├── API 路由 (app/api/)
└── 工具函数 (lib/backend/)
    ├── DeepSeek API 调用
    └── KIEAI API 调用
```

### 核心目录

```
app/
├── api/                    # API Routes (后端)
│   ├── design-agent/      # 🆕 设计智能体 API
│   │   └── chat/          # 对话接口
│   ├── generate-logo/     # Logo 生成 API
│   ├── generate-illustration/ # 插画生成 API
│   └── task-status/       # 任务状态查询 API
├── design-agent/          # 🆕 设计智能体页面
│   └── page.tsx           # 对话界面
├── tools/                 # 工具页面 (前端)
│   ├── ai-logo/
│   ├── ai-illustration/
│   └── ai-ip-illustration-1/
└── page.tsx               # 首页

design-agent/              # 🆕 设计智能体核心模块
├── design-agent.ts        # 主控制器
├── deepseek-client.ts     # DeepSeek API 客户端
├── skills-guide-manager.ts # Skills 管理器
├── quality-checker.ts     # 质量检查器
├── omni-design-skills.json # 设计知识库
└── types.ts               # 类型定义

lib/backend/               # 后端工具函数
├── config.js              # 环境变量配置
├── deepseek.js            # DeepSeek API
├── kieai.js               # KIEAI Logo API
└── kieai-illustration.js  # KIEAI 插画 API

components/                # React 组件
└── dashboard/             # 仪表盘组件
```

---

## 🚀 部署

### 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/3478137972-bit/miaodongAIchaojiyaungong_design)

### 手动部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量（见上文）
4. 部署

详细步骤: [Vercel 部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 📖 开发指南

### 添加新的 AI 工具

1. **创建前端页面**
```
app/tools/新工具/page.tsx
```

2. **创建 API 路由**
```
app/api/新接口/route.ts
```

3. **添加到工具网格**
```
components/dashboard/tool-grid.tsx
```

详细教程: [开发指南](./DEVELOPMENT_GUIDE.md)

---

## 🐛 常见问题

### 构建失败

**问题**: Module not found: Can't resolve 'xxx'

**解决**:
```bash
npm install xxx
git add package.json package-lock.json
git commit -m "Add dependency: xxx"
git push origin main
```

### API 调用失败

**问题**: 返回 500 错误

**排查**:
1. 检查环境变量是否配置
2. 查看服务器日志
3. 验证 API 密钥是否有效

更多问题: [故障排除文档](./TROUBLESHOOTING.md)

---

## 📊 项目状态

- ✅ 前后端一体化架构
- ✅ Next.js API Routes
- ✅ Vercel 部署就绪
- ✅ 完整的开发文档
- ✅ 故障排除指南

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m 'Add 新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 📞 联系方式

- GitHub: [@3478137972-bit](https://github.com/3478137972-bit)
- 项目地址: [miaodongAIchaojiyaungong_design](https://github.com/3478137972-bit/miaodongAIchaojiyaungong_design)

---

**🎉 快速上手，查看 [开发指南](./DEVELOPMENT_GUIDE.md)！**
