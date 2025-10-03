"use client"

import { useState } from "react"
import type { Patient } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, CheckCircle2, XCircle, Lightbulb, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIRecommendationsProps {
  patient: Patient
}

interface Recommendations {
  recommendedFoods: string[]
  foodsToAvoid: string[]
  dietaryGuidelines: string[]
  lifestyleRecommendations: string[]
}

export function AIRecommendations({ patient }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendations")
      }

      const data = await response.json()
      setRecommendations(data)
    } catch (err) {
      setError("Failed to generate AI recommendations. Please try again.")
      console.error("[v0] Error generating recommendations:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-lg dark:from-card dark:to-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                AI-Powered Recommendations
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                  Powered by Gemini
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                Personalized dietary guidance based on Ayurvedic principles using advanced AI
              </CardDescription>
            </div>
            <Button
              onClick={generateRecommendations}
              disabled={loading}
              size="lg"
              className="shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {(recommendations || error) && (
          <CardContent className="space-y-6 pt-6">
            {error && (
              <Alert variant="destructive" className="border-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {recommendations && (
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 shadow-sm dark:border-green-900 dark:from-green-950/30 dark:to-emerald-950/30">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-green-600 p-2">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Recommended Foods</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.recommendedFoods.map((food, index) => (
                      <Badge
                        key={index}
                        className="bg-green-600 px-3 py-1.5 text-sm shadow-sm transition-all hover:scale-105 hover:bg-green-700 hover:shadow-md"
                      >
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-5 shadow-sm dark:border-red-900 dark:from-red-950/30 dark:to-rose-950/30">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-red-600 p-2">
                      <XCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Foods to Avoid</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.foodsToAvoid.map((food, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="px-3 py-1.5 text-sm shadow-sm transition-all hover:scale-105 hover:shadow-md"
                      >
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm dark:border-amber-900 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-amber-600 p-2">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Dietary Guidelines</h3>
                  </div>
                  <ul className="space-y-3">
                    {recommendations.dietaryGuidelines.map((guideline, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm transition-all hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30"
                      >
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-600" />
                        <span className="text-sm leading-relaxed text-amber-950 dark:text-amber-50">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-5 shadow-sm dark:border-pink-900 dark:from-pink-950/30 dark:to-rose-950/30">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-pink-600 p-2">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                      Lifestyle Recommendations
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {recommendations.lifestyleRecommendations.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-lg bg-white/60 p-3 shadow-sm transition-all hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/30"
                      >
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-pink-600" />
                        <span className="text-sm leading-relaxed text-pink-950 dark:text-pink-50">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
