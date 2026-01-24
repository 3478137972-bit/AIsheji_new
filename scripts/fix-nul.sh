#!/bin/bash
# 快速修复脚本 - 修复 Turbopack nul 文件错误
# 自动执行所有修复步骤

set -e  # 遇到错误时退出

echo "🔧 开始修复 Turbopack nul 文件错误..."
echo ""

# 步骤 1: 停止 Node 进程
echo "1️⃣  停止所有 Node 进程..."
powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
echo "   ✅ 已停止"

# 步骤 2: 删除 nul 文件
echo ""
echo "2️⃣  检查并删除 nul 文件..."
if [ -f "nul" ]; then
  echo "   发现 nul 文件，正在删除..."
  mv nul nul_tmp 2>/dev/null && rm -f nul_tmp
  echo "   ✅ nul 文件已删除"
else
  echo "   ℹ️  未发现 nul 文件"
fi

# 步骤 3: 清理缓存
echo ""
echo "3️⃣  清理 Next.js 缓存..."
rm -rf .next node_modules/.cache 2>/dev/null || true
echo "   ✅ 缓存已清理"

# 步骤 4: 验证清理
echo ""
echo "4️⃣  验证修复结果..."
if [ -f "nul" ]; then
  echo "   ❌ nul 文件仍然存在，请手动删除"
  exit 1
else
  echo "   ✅ 验证通过"
fi

echo ""
echo "🎉 修复完成！现在可以启动开发服务器："
echo ""
echo "   npm run dev"
echo ""
