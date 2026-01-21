"use client"

import { MainLayout } from "@/components/main-layout"
import { Users, Crown, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const teamMembers = [
  { id: "1", name: "设计师", role: "管理员", avatar: "" },
  { id: "2", name: "张三", role: "成员", avatar: "" },
  { id: "3", name: "李四", role: "成员", avatar: "" },
]

export default function TeamPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">团队协作</h1>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            邀请成员
          </button>
        </div>

        {/* Team Info Card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">我的团队</h2>
              <p className="text-sm text-muted-foreground">{teamMembers.length} 位成员</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">团队成员</h3>
          </div>
          <div className="divide-y divide-border">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    {member.role === "管理员" && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
