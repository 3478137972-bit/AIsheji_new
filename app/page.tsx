import { MainLayout } from "@/components/main-layout"
import { HeroSection } from "@/components/dashboard/hero-section"
import { ToolGrid } from "@/components/dashboard/tool-grid"

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroSection />
        <ToolGrid />
      </div>
    </MainLayout>
  )
}
