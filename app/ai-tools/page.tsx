import { MainLayout } from "@/components/main-layout"
import { ToolGrid } from "@/components/dashboard/tool-grid"

export default function AIToolsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <h1 className="text-xl font-semibold mb-6">AI工具</h1>
        <ToolGrid />
      </div>
    </MainLayout>
  )
}
