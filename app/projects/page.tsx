"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import {
  Search,
  Plus,
  FolderPlus,
  MoreHorizontal,
  Grid3X3,
  List,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

type FilterTab = "all" | "folders" | "records"

interface Project {
  id: string
  name: string
  thumbnail: string
  updatedAt: string
  type: "folder" | "image"
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "电商主图设计",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    updatedAt: "2024-01-15",
    type: "image",
  },
  {
    id: "2",
    name: "品牌Logo设计",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    updatedAt: "2024-01-14",
    type: "image",
  },
  {
    id: "3",
    name: "产品宣传海报",
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    updatedAt: "2024-01-13",
    type: "image",
  },
  {
    id: "4",
    name: "社交媒体素材",
    thumbnail: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop",
    updatedAt: "2024-01-12",
    type: "folder",
  },
  {
    id: "5",
    name: "证件照处理",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    updatedAt: "2024-01-11",
    type: "image",
  },
]

const tabs: { label: string; value: FilterTab }[] = [
  { label: "全部", value: "all" },
  { label: "文件夹", value: "folders" },
  { label: "作图记录", value: "records" },
]

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProjects = mockProjects.filter((project) => {
    if (activeTab === "folders") return project.type === "folder"
    if (activeTab === "records") return project.type === "image"
    return true
  }).filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">我的空间</h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索我的项目"
                className="w-64 pl-10 pr-4 py-2 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {/* View Toggle */}
            <div className="flex items-center bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {/* Add Button */}
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <Suspense fallback={<Loading />}>
          <div className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          }`}>
            {/* New Folder Card */}
            <button className="aspect-square bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <FolderPlus className="w-7 h-7 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">新建文件夹</span>
            </button>

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                  viewMode === "list" ? "flex items-center p-4 gap-4" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                      {/* More Button */}
                      <button className="absolute top-2 right-2 w-8 h-8 bg-card/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{project.updatedAt}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.updatedAt}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </Suspense>

        {/* Empty State */}
        {filteredProjects.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">未找到匹配的项目</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
