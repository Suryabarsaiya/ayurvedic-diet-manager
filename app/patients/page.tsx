import { AppSidebar } from "@/components/app-sidebar"
import { PatientList } from "@/components/patients/patient-list"

export default function PatientsPage() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <PatientList />
        </div>
      </main>
    </div>
  )
}
