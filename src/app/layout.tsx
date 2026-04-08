import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "秒懂 AI 超级员工",
  description: "AI 驱动的智能创作助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* 顶部导航栏 - 桌面端显示 */}
        <Navbar />
        
        {/* 主内容区 - 桌面端去掉底部边距 */}
        <main className="min-h-screen pb-20 lg:pb-8">
          {children}
        </main>
        
        {/* 底部导航 - 仅移动端显示 */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
