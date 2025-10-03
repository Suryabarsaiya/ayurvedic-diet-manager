"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, User, Download, Printer } from "lucide-react"
import Link from "next/link"
import { generateDietPlanCSV, generateDietPlanPDF, downloadCSV, printDietPlan } from "@/lib/utils/export"

export function DietPlanList() {
  const { dietPlans, patients, foods } = useStore()

  const handleExportCSV = (planId: string) => {
    const plan = dietPlans.find((p) => p.id === planId)
    const patient = patients.find((p) => p.id === plan?.patientId)

    if (plan && patient) {
      const csv = generateDietPlanCSV(plan, patient, foods)
      downloadCSV(csv, `diet-plan-${patient.name.replace(/\s+/g, "-")}-${Date.now()}.csv`)
    }
  }

  const handlePrintPDF = (planId: string) => {
    const plan = dietPlans.find((p) => p.id === planId)
    const patient = patients.find((p) => p.id === plan?.patientId)

    if (plan && patient) {
      const html = generateDietPlanPDF(plan, patient, foods)
      printDietPlan(html)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Diet Plans</h2>
          <p className="text-sm text-muted-foreground">Manage personalized diet charts</p>
        </div>
        <Link href="/diet-plans/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Diet Plan
          </Button>
        </Link>
      </div>

      {dietPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No diet plans yet. Create your first diet plan to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dietPlans.map((plan) => {
            const patient = patients.find((p) => p.id === plan.patientId)
            return (
              <Card key={plan.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {patient?.name || "Unknown Patient"}
                        </div>
                      </CardTitle>
                      <CardDescription>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {plan.duration} days
                        </div>
                      </CardDescription>
                    </div>
                    {patient && <Badge variant="secondary">{patient.prakriti.dominantDosha}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Meals:</span> {plan.meals.length}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                    {plan.guidelines.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Guidelines:</span> {plan.guidelines.length}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handlePrintPDF(plan.id)}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleExportCSV(plan.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
