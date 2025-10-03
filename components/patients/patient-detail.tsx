"use client"

import type { Patient } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, Phone, AlertCircle, ShieldAlert, Utensils, X, FileText, Clock } from "lucide-react"
import { getDoshaColor, getDoshaDescription } from "@/lib/utils/ayurveda"
import { AIRecommendations } from "@/components/ai/ai-recommendations"
import { useStore } from "@/lib/store"

interface PatientDetailProps {
  patient: Patient
  onClose: () => void
}

export function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const { appointments, dietPlans } = useStore()

  const patientAppointments = appointments
    .filter((apt) => apt.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const patientDietPlans = dietPlans
    .filter((plan) => plan.patientId === patient.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">Patient Details</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Age</span>
                <p className="font-medium">{patient.age} years</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gender</span>
                <p className="font-medium capitalize">{patient.gender}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Contact</span>
                <p className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4" />
                  {patient.contact}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Registered</span>
                <p className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prakriti (Constitution)</CardTitle>
            <CardDescription>Dosha distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-600">Vata</span>
                  <span className="text-muted-foreground">{patient.prakriti.vata}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-blue-600" style={{ width: `${patient.prakriti.vata}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-orange-600">Pitta</span>
                  <span className="text-muted-foreground">{patient.prakriti.pitta}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-orange-600" style={{ width: `${patient.prakriti.pitta}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-green-600">Kapha</span>
                  <span className="text-muted-foreground">{patient.prakriti.kapha}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-green-600" style={{ width: `${patient.prakriti.kapha}%` }} />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <div className="mb-1 flex items-center gap-2">
                <Badge className={getDoshaColor(patient.prakriti.dominantDosha)}>
                  {patient.prakriti.dominantDosha} Dominant
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{getDoshaDescription(patient.prakriti.dominantDosha)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(patient.currentConditions.length > 0 ||
        patient.allergies.length > 0 ||
        patient.dietaryRestrictions.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-3">
          {patient.currentConditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-4 w-4" />
                  Current Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.currentConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {patient.allergies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="h-4 w-4" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {patient.dietaryRestrictions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Utensils className="h-4 w-4" />
                  Dietary Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.dietaryRestrictions.map((restriction, index) => (
                    <Badge key={index} variant="outline">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Appointment History
            </CardTitle>
            <CardDescription>Recent appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {patientAppointments.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No appointments yet</p>
            ) : (
              <div className="space-y-3">
                {patientAppointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{apt.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(apt.date).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      variant={
                        apt.status === "completed"
                          ? "default"
                          : apt.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Diet Plans
            </CardTitle>
            <CardDescription>Active and past diet plans</CardDescription>
          </CardHeader>
          <CardContent>
            {patientDietPlans.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No diet plans yet</p>
            ) : (
              <div className="space-y-3">
                {patientDietPlans.slice(0, 5).map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{plan.duration} Day Plan</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(plan.createdAt).toLocaleDateString()} • {plan.meals.length} meals
                      </p>
                    </div>
                    <Badge variant="outline">{plan.guidelines.length} guidelines</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AIRecommendations patient={patient} />
    </div>
  )
}
