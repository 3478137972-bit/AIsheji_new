# 项目脚本说明

这个目录包含用于项目维护和问题修复的实用脚本。

## 可用脚本

### check-env.sh
环境检测脚本，检查是否存在 Windows 保留文件名。

**用法：**
```bash
bash scripts/check-env.sh
```

**功能：**
- 检测项目根目录中的保留文件名（nul, con, prn, aux 等）
- 提供快速修复建议
- 可集成到 npm scripts 中作为 predev 钩子

### fix-nul.sh
自动修复 Turbopack nul 文件错误的脚本。

**用法：**
```bash
bash scripts/fix-nul.sh
```

**功能：**
- 停止所有 Node 进程
- 删除 nul 文件（如果存在）
- 清理 Next.js 缓存
- 验证修复结果

**推荐使用场景：**
- 遇到 "Failed to write app endpoint /page" 错误时
- Turbopack 崩溃并提示 nul 文件问题时
- 开发服务器无法正常启动时

## 集成到项目

可以在 package.json 中添加这些脚本：

```json
{
  "scripts": {
    "check": "bash scripts/check-env.sh",
    "fix": "bash scripts/fix-nul.sh && npm run dev",
    "predev": "bash scripts/check-env.sh || true"
  }
}
```

然后使用：
```bash
npm run check  # 检查环境
npm run fix    # 修复并启动
```
