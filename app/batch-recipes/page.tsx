"use client"

import { MainLayout } from "@/components/main-layout"
import { Layers, Plus, MoreHorizontal } from "lucide-react"

const recipes = [
  {
    id: "1",
    name: "淘宝主图套图",
    description: "800x800, 5张套图",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    count: 12,
  },
  {
    id: "2",
    name: "小红书笔记配图",
    description: "1080x1440, 9宫格",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    count: 8,
  },
  {
    id: "3",
    name: "抖音商品展示",
    description: "1080x1920, 竖版",
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    count: 5,
  },
]

export default function BatchRecipesPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">套图配方</h1>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建配方
          </button>
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={recipe.thumbnail || "/placeholder.svg"}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-card/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{recipe.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">已使用 {recipe.count} 次</span>
                    <button className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20 transition-colors">
                      使用
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Layers className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">暂无套图配方</p>
            <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              创建第一个配方
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
