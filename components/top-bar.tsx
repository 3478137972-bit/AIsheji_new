'use client'

import { UserMenu } from './user-menu'

/**
 * 顶部导航栏组件
 * 显示在主内容区域的顶部
 */
export function TopBar() {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 左侧：可以放置面包屑或标题 */}
        <div className="flex items-center gap-4">
          {/* 预留位置 */}
        </div>

        {/* 右侧：用户菜单 */}
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </div>
  )
}
