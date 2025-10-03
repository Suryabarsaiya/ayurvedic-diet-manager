"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { AddAppointmentDialog } from "./add-appointment-dialog"

export function AppointmentCalendar() {
  const { appointments, patients } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getAppointmentsForDay = (day: number) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return aptDate.getDate() === day && aptDate.getMonth() === month && aptDate.getFullYear() === year
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Appointments</h2>
          <p className="text-sm text-muted-foreground">Manage your appointment schedule</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dayAppointments = getAppointmentsForDay(day)
              const isToday =
                day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

              return (
                <div
                  key={day}
                  className={`min-h-24 rounded-lg border p-2 ${isToday ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className={`mb-1 text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => {
                      const patient = patients.find((p) => p.id === apt.patientId)
                      return (
                        <div
                          key={apt.id}
                          className={`rounded px-1.5 py-0.5 text-xs ${
                            apt.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : apt.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {patient?.name.split(" ")[0] || "Unknown"}
                        </div>
                      )
                    })}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments
            .filter((apt) => {
              const aptDate = new Date(apt.date)
              const today = new Date()
              const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
              return aptDate >= today && aptDate <= nextWeek && apt.status === "scheduled"
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId)
              return (
                <div key={apt.id} className="flex items-center justify-between border-b py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{patient?.name || "Unknown Patient"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(apt.date).toLocaleDateString()} • {apt.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      apt.status === "completed" ? "default" : apt.status === "cancelled" ? "destructive" : "secondary"
                    }
                  >
                    {apt.status}
                  </Badge>
                </div>
              )
            })}
          {appointments.filter((apt) => {
            const aptDate = new Date(apt.date)
            const today = new Date()
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            return aptDate >= today && aptDate <= nextWeek && apt.status === "scheduled"
          }).length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No upcoming appointments</p>}
        </CardContent>
      </Card>

      <AddAppointmentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
