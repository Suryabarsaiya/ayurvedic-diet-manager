import { AppSidebar } from "@/components/app-sidebar"
import { CreateDietPlan } from "@/components/diet-plans/create-diet-plan"

export default function CreateDietPlanPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Create Diet Plan</h1>
            <p className="text-muted-foreground">Design a personalized Ayurvedic diet chart</p>
          </div>
          <CreateDietPlan />
        </div>
      </main>
    </div>
  )
}
