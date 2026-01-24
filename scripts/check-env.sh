#!/bin/bash
# 环境检测脚本 - 检查 Windows 保留文件名
# 用于在启动开发服务器前检测潜在问题

echo "🔍 检查 Windows 保留文件名..."

RESERVED=("nul" "con" "prn" "aux" "com1" "com2" "com3" "com4" "lpt1" "lpt2" "clock$")
FOUND=0
FOUND_FILES=()

for name in "${RESERVED[@]}"; do
  if [ -f "$name" ] || [ -d "$name" ]; then
    echo "❌ 发现保留文件名: $name"
    FOUND_FILES+=("$name")
    FOUND=1
  fi
done

if [ $FOUND -eq 0 ]; then
  echo "✅ 未检测到保留文件名"
  exit 0
else
  echo ""
  echo "⚠️  发现 ${#FOUND_FILES[@]} 个保留文件/目录"
  echo ""
  echo "快速修复命令："
  for file in "${FOUND_FILES[@]}"; do
    echo "  mv $file ${file}_backup && rm ${file}_backup"
  done
  echo ""
  echo "或使用一键修复："
  echo "  powershell -Command \"Stop-Process -Name node -Force -ErrorAction SilentlyContinue\" && mv nul nul_tmp 2>/dev/null && rm -f nul_tmp && rm -rf .next && npm run dev"
  exit 1
fi
