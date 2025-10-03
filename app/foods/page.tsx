import { AppSidebar } from "@/components/app-sidebar"
import { FoodDatabase } from "@/components/foods/food-database"

export default function FoodsPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <FoodDatabase />
        </div>
      </main>
    </div>
  )
}
