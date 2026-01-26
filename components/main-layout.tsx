"use client"

import React from "react"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <TopBar />
        {children}
      </main>
    </div>
  )
}
