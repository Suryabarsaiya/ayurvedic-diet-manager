"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, Clock, ChefHat } from "lucide-react"
import type { Patient } from "@/lib/types"

interface SmartMealPlannerProps {
  patient: Patient
  mealType: string
  timeOfDay: string
  onFoodsSelected: (foods: string[]) => void
}

export function SmartMealPlanner({ patient, mealType, timeOfDay, onFoodsSelected }: SmartMealPlannerProps) {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/recommendations/smart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient, mealType, timeOfDay }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Meal Planner
            </CardTitle>
            <CardDescription>Get personalized meal suggestions powered by Gemini AI</CardDescription>
          </div>
          <Button onClick={generateRecommendations} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {recommendations && (
        <CardContent className="space-y-4">
          {recommendations.recommendedFoods && recommendations.recommendedFoods.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <ChefHat className="h-4 w-4" />
                Recommended Foods
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.recommendedFoods.map((food: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recommendations.avoidFoods && recommendations.avoidFoods.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-red-700">Foods to Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.avoidFoods.map((food: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recommendations.cookingTips && recommendations.cookingTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Cooking Tips</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {recommendations.cookingTips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.timingGuidance && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4" />
                Timing Guidance
              </h4>
              <p className="text-sm text-muted-foreground">{recommendations.timingGuidance}</p>
            </div>
          )}

          {recommendations.ayurvedicPrinciples && recommendations.ayurvedicPrinciples.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Ayurvedic Principles</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {recommendations.ayurvedicPrinciples.map((principle: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
