"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Meal, Patient } from "@/lib/types"
import { getRasaTranslation, getGunaTranslation } from "@/lib/utils/ayurveda"
import { Download, Printer } from "lucide-react"
import { generateDietPlanCSV, generateDietPlanPDF, downloadCSV, printDietPlan } from "@/lib/utils/export"

interface DietPlanPreviewProps {
  meals: Meal[]
  patient: Patient | undefined
}

export function DietPlanPreview({ meals, patient }: DietPlanPreviewProps) {
  const { foods } = useStore()

  const calculateTotalNutrition = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        const food = foods.find((f) => f.id === item.foodId)
        if (food) {
          totalCalories += food.nutritional.calories * item.quantity
          totalProtein += food.nutritional.protein * item.quantity
          totalCarbs += food.nutritional.carbs * item.quantity
          totalFat += food.nutritional.fat * item.quantity
        }
      })
    })

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
    }
  }

  const nutrition = calculateTotalNutrition()

  const handleQuickExport = () => {
    if (!patient) return

    const tempPlan = {
      id: "preview",
      patientId: patient.id,
      createdAt: new Date(),
      duration: 7,
      meals,
      guidelines: [],
      restrictions: [],
    }

    const csv = generateDietPlanCSV(tempPlan, patient, foods)
    downloadCSV(csv, `diet-plan-preview-${patient.name.replace(/\s+/g, "-")}.csv`)
  }

  const handleQuickPrint = () => {
    if (!patient) return

    const tempPlan = {
      id: "preview",
      patientId: patient.id,
      createdAt: new Date(),
      duration: 7,
      meals,
      guidelines: [],
      restrictions: [],
      notes: "",
    }

    const html = generateDietPlanPDF(tempPlan, patient, foods)
    printDietPlan(html)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diet Plan Preview</CardTitle>
        <CardDescription>Daily nutritional summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {patient && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">Patient: {patient.name}</h4>
            <Badge>{patient.prakriti.dominantDosha} Dominant</Badge>
          </div>
        )}

        <div>
          <h4 className="mb-3 text-sm font-medium">Daily Nutrition</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold text-primary">{nutrition.calories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold text-blue-600">{nutrition.protein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold text-orange-600">{nutrition.carbs}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-2xl font-bold text-amber-600">{nutrition.fat}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Meal Schedule</h4>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal.id} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{meal.name}</span>
                  <span className="text-sm text-muted-foreground">{meal.time}</span>
                </div>
                {meal.items.length > 0 ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {meal.items.map((item) => {
                      const food = foods.find((f) => f.id === item.foodId)
                      return (
                        <li key={item.foodId}>
                          • {food?.name} ({item.quantity} {item.unit})
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No items added</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {meals.some((m) => m.items.length > 0) && (
          <div>
            <h4 className="mb-3 text-sm font-medium">Ayurvedic Properties</h4>
            <div className="space-y-2 text-sm">
              {meals.slice(0, 1).map((meal) =>
                meal.items.slice(0, 2).map((item) => {
                  const food = foods.find((f) => f.id === item.foodId)
                  if (!food) return null

                  return (
                    <div key={item.foodId} className="rounded-lg border p-3">
                      <div className="mb-2 font-medium">{food.name}</div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>Rasa: {food.ayurvedic.rasa.map(getRasaTranslation).join(", ")}</div>
                        <div>Guna: {food.ayurvedic.guna.map(getGunaTranslation).join(", ")}</div>
                        <div>Virya: {food.ayurvedic.virya}</div>
                      </div>
                    </div>
                  )
                }),
              )}
            </div>
          </div>
        )}

        {patient && meals.some((m) => m.items.length > 0) && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleQuickPrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleQuickExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
