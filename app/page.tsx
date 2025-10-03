"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Utensils, FileText, Calendar, TrendingUp, Activity, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"

export default function HomePage() {
  const { patients, dietPlans, appointments, foods } = useStore()

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return aptDate >= today && aptDate <= nextWeek && apt.status === "scheduled"
  }).length

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="mt-1 text-base text-muted-foreground">Welcome to AyurDiet Cloud</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg dark:from-primary/10 dark:via-card dark:to-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Patients</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2.5 shadow-sm">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{patients.length}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Active patient records
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-white to-accent/5 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg dark:from-accent/10 dark:via-card dark:to-accent/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Food Items</CardTitle>
                <div className="rounded-lg bg-accent/10 p-2.5 shadow-sm">
                  <Utensils className="h-5 w-5 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{foods.length}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3" />
                  In food database
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg dark:border-emerald-900 dark:from-emerald-950/30 dark:via-card dark:to-emerald-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Diet Plans</CardTitle>
                <div className="rounded-lg bg-emerald-100 p-2.5 shadow-sm dark:bg-emerald-950">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{dietPlans.length}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Active diet plans
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-cyan-50 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg dark:border-cyan-900 dark:from-cyan-950/30 dark:via-card dark:to-cyan-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Appointments</CardTitle>
                <div className="rounded-lg bg-cyan-100 p-2.5 shadow-sm dark:bg-cyan-950">
                  <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{upcomingAppointments}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3" />
                  Scheduled this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-2 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <CardTitle className="text-xl font-semibold text-foreground">Quick Start Guide</CardTitle>
                <CardDescription className="text-muted-foreground">Get started with AyurDiet Cloud</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Add Patients</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Start by adding patient records with their Prakriti assessment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Explore Food Database</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Browse foods with Ayurvedic properties and nutritional data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Create Diet Plans</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Generate personalized diet charts based on dosha balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-md">
              <CardHeader className="bg-gradient-to-r from-amber-100/50 via-amber-50/30 to-transparent dark:from-amber-950/30 dark:via-amber-950/10">
                <CardTitle className="text-xl font-semibold text-foreground">About Ayurvedic Diet</CardTitle>
                <CardDescription className="text-muted-foreground">Understanding the three doshas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-sm dark:border-cyan-900 dark:from-cyan-950/30 dark:to-blue-950/30">
                  <h4 className="mb-2 font-semibold text-cyan-700 dark:text-cyan-300">Vata (Air & Space)</h4>
                  <p className="text-sm leading-relaxed text-cyan-900/80 dark:text-cyan-100/80">
                    Governs movement, creativity, and communication. Balanced by warm, grounding foods.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm dark:border-orange-900 dark:from-orange-950/30 dark:to-amber-950/30">
                  <h4 className="mb-2 font-semibold text-orange-700 dark:text-orange-300">Pitta (Fire & Water)</h4>
                  <p className="text-sm leading-relaxed text-orange-900/80 dark:text-orange-100/80">
                    Controls metabolism, digestion, and transformation. Balanced by cooling, calming foods.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/30">
                  <h4 className="mb-2 font-semibold text-green-700 dark:text-green-300">Kapha (Earth & Water)</h4>
                  <p className="text-sm leading-relaxed text-green-900/80 dark:text-green-100/80">
                    Provides structure, stability, and lubrication. Balanced by light, stimulating foods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
