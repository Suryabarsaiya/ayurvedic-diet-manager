"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, Sparkles, Loader2 } from "lucide-react"
import { FoodSelector } from "./food-selector"
import { DietPlanPreview } from "./diet-plan-preview"
import { SmartMealPlanner } from "./smart-meal-planner"
import type { Meal, MealItem } from "@/lib/types"
import { useRouter } from "next/navigation"

export function CreateDietPlan() {
  const router = useRouter()
  const { patients, addDietPlan } = useStore()
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [duration, setDuration] = useState("7")
  const [meals, setMeals] = useState<Meal[]>([
    { id: "m1", name: "Breakfast", time: "08:00", items: [] },
    { id: "m2", name: "Lunch", time: "13:00", items: [] },
    { id: "m3", name: "Dinner", time: "19:00", items: [] },
  ])
  const [guidelines, setGuidelines] = useState("")
  const [restrictions, setRestrictions] = useState("")
  const [notes, setNotes] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [showSmartPlanner, setShowSmartPlanner] = useState(false)
  const [selectedMealForAI, setSelectedMealForAI] = useState<string>("")

  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  const generateAISuggestions = async () => {
    if (!selectedPatient) return

    setLoadingAI(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient: selectedPatient }),
      })

      if (response.ok) {
        const data = await response.json()
        setGuidelines(data.dietaryGuidelines.join("\n"))
        setRestrictions(data.foodsToAvoid.map((food: string) => `Avoid ${food}`).join("\n"))
      }
    } catch (error) {
      console.error("[v0] Error generating AI suggestions:", error)
    } finally {
      setLoadingAI(false)
    }
  }

  const addMeal = () => {
    const newMeal: Meal = {
      id: `m${Date.now()}`,
      name: "Snack",
      time: "16:00",
      items: [],
    }
    setMeals([...meals, newMeal])
  }

  const removeMeal = (mealId: string) => {
    setMeals(meals.filter((m) => m.id !== mealId))
  }

  const updateMeal = (mealId: string, updates: Partial<Meal>) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, ...updates } : m)))
  }

  const addFoodToMeal = (mealId: string, foodItem: MealItem) => {
    setMeals(meals.map((m) => (m.id === mealId ? { ...m, items: [...m.items, foodItem] } : m)))
  }

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(
      meals.map((m) => (m.id === mealId ? { ...m, items: m.items.filter((item) => item.foodId !== foodId) } : m)),
    )
  }

  const handleSave = () => {
    if (!selectedPatientId) {
      alert("Please select a patient")
      return
    }

    const dietPlan = {
      id: `dp${Date.now()}`,
      patientId: selectedPatientId,
      createdAt: new Date(),
      duration: Number.parseInt(duration),
      meals,
      guidelines: guidelines
        .split("\n")
        .map((g) => g.trim())
        .filter(Boolean),
      restrictions: restrictions
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      notes,
    }

    addDietPlan(dietPlan)
    router.push("/diet-plans")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diet Plan Details</CardTitle>
            <CardDescription>Select patient and plan duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.prakriti.dominantDosha}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>

            {selectedPatient && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">Patient Profile</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    Dominant Dosha: <span className="font-medium">{selectedPatient.prakriti.dominantDosha}</span>
                  </p>
                  {selectedPatient.currentConditions.length > 0 && (
                    <p>Conditions: {selectedPatient.currentConditions.join(", ")}</p>
                  )}
                  {selectedPatient.allergies.length > 0 && <p>Allergies: {selectedPatient.allergies.join(", ")}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedPatient && (
          <SmartMealPlanner
            patient={selectedPatient}
            mealType={meals.find((m) => m.id === selectedMealForAI)?.name || "General"}
            timeOfDay={meals.find((m) => m.id === selectedMealForAI)?.time || ""}
            onFoodsSelected={(foods) => console.log("[v0] Selected foods:", foods)}
          />
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Meals</CardTitle>
                <CardDescription>Add meals and food items</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addMeal}>
                <Plus className="mr-2 h-4 w-4" />
                Add Meal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label>Meal Name</Label>
                      <Input
                        value={meal.name}
                        onChange={(e) => updateMeal(meal.id, { name: e.target.value })}
                        placeholder="e.g., Breakfast"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={meal.time}
                        onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                      />
                    </div>
                  </div>
                  {meals.length > 1 && (
                    <Button size="icon" variant="ghost" onClick={() => removeMeal(meal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Food Items</Label>
                  <FoodSelector
                    onSelect={(foodItem) => addFoodToMeal(meal.id, foodItem)}
                    selectedItems={meal.items}
                    onRemove={(foodId) => removeFoodFromMeal(meal.id, foodId)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Additional Information</CardTitle>
              {selectedPatient && (
                <Button size="sm" variant="outline" onClick={generateAISuggestions} disabled={loadingAI}>
                  {loadingAI ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Suggest
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guidelines">Dietary Guidelines (one per line)</Label>
              <Textarea
                id="guidelines"
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                placeholder="e.g., Drink warm water throughout the day&#10;Avoid cold beverages"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restrictions">Restrictions (one per line)</Label>
              <Textarea
                id="restrictions"
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                placeholder="e.g., Avoid dairy products&#10;No spicy foods"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes for the patient"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full" size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Diet Plan
        </Button>
      </div>

      <div className="lg:sticky lg:top-6 lg:h-fit">
        <DietPlanPreview meals={meals} patient={selectedPatient} />
      </div>
    </div>
  )
}
