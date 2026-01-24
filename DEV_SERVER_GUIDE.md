# 本地开发服务器运行指南

## 快速参考 ⚡

### 遇到 Turbopack "nul" 文件错误？
```bash
# 最快修复方法（一键解决）
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue" && mv nul nul_tmp 2>/dev/null && rm -f nul_tmp && rm -rf .next && npm run dev
```

### 日常启动
```bash
npm run dev
```

### 完整重启
```bash
# 停止 -> 清理 -> 启动
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue" && rm -rf .next && npm run dev
```

---

## 快速启动

```bash
npm run dev
```

服务器将在以下地址运行：
- 本地访问: http://localhost:3000
- 网络访问: http://192.168.1.33:3000

## 常见问题及解决方案

### 问题 1: Turbopack 崩溃 - "nul" 文件错误

#### 问题现象
```
FATAL: An unexpected Turbopack error occurred
Error: Failed to write app endpoint /page
Caused by: reading file d:\秒懂AI超级员工【设计系统】\nul
函数不正确。 (os error 1)
```

#### 问题原因
在 Windows 系统中，`nul` 是一个保留的设备名称（类似于 Linux 的 `/dev/null`），不能作为普通文件名使用。当项目根目录下意外创建了名为 `nul` 的文件时，Turbopack 尝试读取它会导致系统错误。

**常见产生原因：**
- 错误的命令重定向（如 `command 2>nul` 在某些情况下会创建文件）
- Git Bash 环境下使用小写 `nul` 作为重定向目标
- 其他 Windows 保留设备名: `CON`, `PRN`, `AUX`, `CLOCK$`, `COM1`-`COM9`, `LPT1`-`LPT9`

#### 最快解决方法（推荐）⚡

**一键修复脚本：**
```bash
# 停止服务 -> 删除 nul -> 清缓存 -> 重启
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue" && mv nul nul_tmp 2>/dev/null && rm -f nul_tmp && rm -rf .next && npm run dev
```

如果遇到 `nul` 文件无法直接删除，使用重命名方式：
```bash
# 方法 1: 重命名后删除（最可靠）
mv nul nul_backup && rm nul_backup

# 方法 2: 使用 PowerShell 完整路径
powershell -Command '$pwd = Get-Location; $path = Join-Path $pwd.Path "nul"; [System.IO.File]::Delete("\\?\$path")'
```

#### 详细解决步骤

如果快速修复失败，按以下步骤逐一排查：

1. **检查是否存在 nul 文件**
```bash
ls -la | grep nul
```

2. **停止所有 Node 进程**
```bash
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"
```

3. **删除 nul 文件**（按顺序尝试）
```bash
# 方法 1: 重命名后删除（推荐，最可靠）
mv nul nul_backup && rm nul_backup

# 方法 2: 直接删除
rm -f nul

# 方法 3: 使用 PowerShell
powershell -Command "Remove-Item -Force nul"

# 方法 4: 使用特殊路径前缀（如果以上都失败）
powershell -Command '$pwd = Get-Location; $path = Join-Path $pwd.Path "nul"; [System.IO.File]::Delete("\\?\$path")'
```

4. **清理 Next.js 缓存和相关缓存**
```bash
rm -rf .next node_modules/.cache
```

5. **重新启动服务器**
```bash
npm run dev
```

6. **验证修复**
```bash
# 确认 nul 文件已删除
ls -la | grep nul
# 应该没有任何输出
```

### 问题 2: 端口被占用

#### 问题现象
```
Port 3000 is in use by process 1880, using available port 3001 instead.
```

#### 解决方案

**方案 1: 终止占用端口的进程**
```bash
# 查找占用 3000 端口的进程
netstat -ano | grep 3000

# 终止进程
powershell -Command "Stop-Process -Id <PID> -Force"
```

**方案 2: 使用其他端口**
```bash
PORT=3001 npm run dev
```

### 问题 3: 开发锁文件冲突

#### 问题现象
```
Unable to acquire lock at .next/dev/lock, is another instance of next dev running?
```

#### 解决方案
```bash
rm -rf .next/dev/lock
npm run dev
```

## 预防措施

### 1. 避免创建保留文件名
在 Windows 系统中，**永远不要**创建以下名称的文件或文件夹：
- `nul`, `con`, `prn`, `aux`
- `com1` - `com9`
- `lpt1` - `lpt9`
- `clock$`

### 2. 正确的命令重定向

#### Windows 命令提示符（CMD）
```bash
# ✅ 正确 - 使用大写 NUL
command 2>NUL
command >NUL 2>&1

# ❌ 错误 - 小写可能创建文件
command 2>nul
```

#### Git Bash / MinGW
```bash
# ✅ 正确 - 使用 /dev/null
command 2>/dev/null
command >/dev/null 2>&1

# ❌ 错误 - 使用 nul 会创建文件
command 2>nul
```

#### PowerShell
```bash
# ✅ 正确 - 使用 $null
command 2>$null
command *>$null

# ✅ 也可以 - 使用 Out-Null
command | Out-Null
```

**最佳实践：** 在跨平台项目中，优先使用各环境专用的空设备：
- CMD: `>NUL`（大写）
- Git Bash: `>/dev/null`
- PowerShell: `>$null`

### 3. 项目中的命令规范

检查以下位置的命令，确保不使用小写 `nul`：

#### package.json 脚本
```json
{
  "scripts": {
    "clean": "rm -rf .next",  // ✅ 好
    "clean": "del /q .next 2>NUL"  // ✅ 使用大写 NUL
  }
}
```

#### Shell 脚本文件
- `*.sh` 文件：使用 `/dev/null`
- `*.bat` 文件：使用大写 `NUL`
- `*.ps1` 文件：使用 `$null`

### 4. Git Hooks 检查

添加 pre-commit hook 防止意外创建保留文件：
```bash
# .git/hooks/pre-commit
#!/bin/bash
RESERVED_NAMES="nul con prn aux com1 com2 com3 com4 lpt1 lpt2"
for name in $RESERVED_NAMES; do
  if [ -f "$name" ]; then
    echo "Error: Reserved filename detected: $name"
    echo "Please remove this file before committing."
    exit 1
  fi
done
```

### 5. 定期清理和检查
```bash
# 每日启动前检查保留文件（可添加到 package.json）
ls -la | grep -E "^.*(nul|con|prn|aux)$" && echo "⚠️  Warning: Reserved filename detected!" || echo "✅ No reserved files"

# 清理 Next.js 缓存
rm -rf .next node_modules/.cache

# 完全重装依赖（如需）
rm -rf node_modules package-lock.json
npm install
```

### 6. 环境检测脚本

创建 `scripts/check-env.sh` 用于启动前检测：
```bash
#!/bin/bash
echo "🔍 Checking for Windows reserved filenames..."

RESERVED=("nul" "con" "prn" "aux" "com1" "com2" "com3" "lpt1" "lpt2")
FOUND=0

for name in "${RESERVED[@]}"; do
  if [ -f "$name" ] || [ -d "$name" ]; then
    echo "❌ Found reserved name: $name"
    FOUND=1
  fi
done

if [ $FOUND -eq 0 ]; then
  echo "✅ No reserved filenames detected"
else
  echo ""
  echo "Please run: mv nul nul_backup && rm nul_backup"
  exit 1
fi
```

在 [package.json](package.json) 中添加：
```json
{
  "scripts": {
    "predev": "bash scripts/check-env.sh || true",
    "dev": "next dev"
  }
}
```

## 开发环境检查清单

启动服务器前，确保：
- [ ] 已安装所有依赖 (`npm install`)
- [ ] 端口 3000 未被占用
- [ ] 项目根目录无保留设备名文件
- [ ] `.next` 缓存正常（如有问题可删除重建）
- [ ] Node.js 版本符合要求（建议 18+）

## 推荐的启动流程

### 快速启动（日常使用）
```bash
npm run dev
```

### 完整检查启动（推荐）
```bash
# 1. 检查是否有保留文件名
ls -la | grep -E "^.*(nul|con|prn|aux)" && echo "⚠️  Found reserved files!" || echo "✅ Clean"

# 2. 清理旧的开发进程
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"

# 3. 清理缓存（可选，遇到问题时使用）
# rm -rf .next

# 4. 启动开发服务器
npm run dev
```

### 遇到问题时的完整重启流程
```bash
# 一键修复所有常见问题
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue" && \
  (mv nul nul_tmp 2>/dev/null; rm -f nul_tmp) && \
  rm -rf .next node_modules/.cache && \
  npm run dev
```

## 项目技术栈
- Next.js 16.0.10 (App Router)
- React 19.2.0
- Turbopack (开发构建工具)
- TypeScript
- Tailwind CSS 4.1.9

## 参考资源
- [Next.js 文档](https://nextjs.org/docs)
- [Windows 保留文件名列表](https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file)
- [项目结构说明](./STRUCTURE.md)
- [项目脚本说明](./scripts/README.md)

## 实用脚本

项目提供了自动化脚本来简化常见问题的处理：

### 环境检测
```bash
bash scripts/check-env.sh
```
在启动前检查是否存在保留文件名。

### 快速修复
```bash
bash scripts/fix-nul.sh
```
自动修复 nul 文件错误并清理缓存。

### 集成到工作流
可以在 [package.json](package.json) 中添加：
```json
{
  "scripts": {
    "check": "bash scripts/check-env.sh",
    "fix": "bash scripts/fix-nul.sh && npm run dev",
    "predev": "bash scripts/check-env.sh || true"
  }
}
```

---

**最后更新:** 2026-01-24
**维护者:** 开发团队
**文档版本:** 2.0 (新增快速修复方法和预防措施)
