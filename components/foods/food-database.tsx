"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Utensils } from "lucide-react"
import { getRasaTranslation, getGunaTranslation } from "@/lib/utils/ayurveda"

export function FoodDatabase() {
  const { foods } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Food Database</h2>
        <p className="text-sm text-muted-foreground">Browse foods with Ayurvedic and nutritional properties</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredFoods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Utensils className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No foods found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map((food) => (
            <Card key={food.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{food.name}</CardTitle>
                    <CardDescription>{food.category}</CardDescription>
                  </div>
                  <Badge variant="outline">{food.servingSize}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Ayurvedic Properties</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Rasa:</span>{" "}
                      {food.ayurvedic.rasa.map(getRasaTranslation).join(", ")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guna:</span>{" "}
                      {food.ayurvedic.guna.map(getGunaTranslation).join(", ")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Virya:</span> {food.ayurvedic.virya}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vipaka:</span> {food.ayurvedic.vipaka}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Dosha Effects</h4>
                  <div className="flex gap-2">
                    <Badge
                      variant={food.ayurvedic.doshaEffect.vata === "decreases" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      V{" "}
                      {food.ayurvedic.doshaEffect.vata === "decreases"
                        ? "↓"
                        : food.ayurvedic.doshaEffect.vata === "increases"
                          ? "↑"
                          : "−"}
                    </Badge>
                    <Badge
                      variant={food.ayurvedic.doshaEffect.pitta === "decreases" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      P{" "}
                      {food.ayurvedic.doshaEffect.pitta === "decreases"
                        ? "↓"
                        : food.ayurvedic.doshaEffect.pitta === "increases"
                          ? "↑"
                          : "−"}
                    </Badge>
                    <Badge
                      variant={food.ayurvedic.doshaEffect.kapha === "decreases" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      K{" "}
                      {food.ayurvedic.doshaEffect.kapha === "decreases"
                        ? "↓"
                        : food.ayurvedic.doshaEffect.kapha === "increases"
                          ? "↑"
                          : "−"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Nutrition (per {food.servingSize})</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Calories:</span> {food.nutritional.calories}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Protein:</span> {food.nutritional.protein}g
                    </div>
                    <div>
                      <span className="text-muted-foreground">Carbs:</span> {food.nutritional.carbs}g
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fat:</span> {food.nutritional.fat}g
                    </div>
                  </div>
                </div>

                {food.notes && (
                  <div className="rounded-lg bg-muted p-2 text-xs text-muted-foreground">{food.notes}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
