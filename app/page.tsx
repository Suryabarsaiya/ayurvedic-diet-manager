"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Utensils, FileText, Calendar, TrendingUp, Activity } from "lucide-react"
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
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">Welcome to AyurDiet Cloud</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-50/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:from-primary/10 dark:to-emerald-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
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

            <Card className="overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-orange-900 dark:from-orange-950/30 dark:to-amber-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Food Items</CardTitle>
                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-950">
                  <Utensils className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{foods.length}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3" />
                  In food database
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-blue-900 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diet Plans</CardTitle>
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dietPlans.length}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Active diet plans
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:border-purple-900 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-950">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{upcomingAppointments}</div>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3" />
                  Scheduled this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="text-xl">Quick Start Guide</CardTitle>
                <CardDescription>Get started with AyurDiet Cloud</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-start gap-4 rounded-lg bg-primary/5 p-4 transition-all hover:bg-primary/10">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Add Patients</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Start by adding patient records with their Prakriti assessment
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg bg-primary/5 p-4 transition-all hover:bg-primary/10">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Explore Food Database</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Browse foods with Ayurvedic properties and nutritional data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg bg-primary/5 p-4 transition-all hover:bg-primary/10">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Diet Plans</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Generate personalized diet charts based on dosha balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-100/50 to-transparent dark:from-amber-950/30">
                <CardTitle className="text-xl">About Ayurvedic Diet</CardTitle>
                <CardDescription>Understanding the three doshas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-blue-900 dark:from-blue-950/30 dark:to-cyan-950/30">
                  <h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">Vata (Air & Space)</h4>
                  <p className="text-sm leading-relaxed text-blue-900/80 dark:text-blue-100/80">
                    Governs movement, creativity, and communication. Balanced by warm, grounding foods.
                  </p>
                </div>
                <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 dark:border-orange-900 dark:from-orange-950/30 dark:to-amber-950/30">
                  <h4 className="mb-2 font-semibold text-orange-700 dark:text-orange-300">Pitta (Fire & Water)</h4>
                  <p className="text-sm leading-relaxed text-orange-900/80 dark:text-orange-100/80">
                    Controls metabolism, digestion, and transformation. Balanced by cooling, calming foods.
                  </p>
                </div>
                <div className="rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/30">
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
