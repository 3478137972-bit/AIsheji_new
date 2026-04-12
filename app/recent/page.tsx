"use client"

import { MainLayout } from "@/components/main-layout"
import { Clock, MoreHorizontal } from "lucide-react"

const recentItems = [
  {
    id: "1",
    name: "电商主图设计",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    updatedAt: "10分钟前",
    tool: "商品套图",
  },
  {
    id: "2",
    name: "品牌Logo设计",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    updatedAt: "1小时前",
    tool: "Logo",
  },
  {
    id: "3",
    name: "证件照处理",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    updatedAt: "昨天",
    tool: "证件照",
  },
]

export default function RecentPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <h1 className="text-xl font-semibold mb-6">最近打开</h1>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-card/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.tool}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{item.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">暂无最近打开的项目</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
