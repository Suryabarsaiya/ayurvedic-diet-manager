import { AppSidebar } from "@/components/app-sidebar"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"

export default function AppointmentsPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <AppointmentCalendar />
        </div>
      </main>
    </div>
  )
}
