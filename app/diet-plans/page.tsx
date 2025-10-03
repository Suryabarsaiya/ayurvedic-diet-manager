import { AppSidebar } from "@/components/app-sidebar"
import { DietPlanList } from "@/components/diet-plans/diet-plan-list"

export default function DietPlansPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <DietPlanList />
        </div>
      </main>
    </div>
  )
}
