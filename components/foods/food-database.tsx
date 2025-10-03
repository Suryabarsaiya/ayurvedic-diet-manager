"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Utensils, Plus, Trash2 } from "lucide-react"
import { getRasaTranslation, getGunaTranslation } from "@/lib/utils/ayurveda"
import { AddFoodDialog } from "./add-food-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function FoodDatabase() {
  const { foods, deleteFood } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null)

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteClick = (foodId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFoodToDelete(foodId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (foodToDelete) {
      deleteFood(foodToDelete)
      setDeleteDialogOpen(false)
      setFoodToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Food Database</h2>
          <p className="text-sm text-muted-foreground">
            Browse and manage foods with Ayurvedic and nutritional properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Food
        </Button>
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
            <Card key={food.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{food.name}</CardTitle>
                    <CardDescription>{food.category}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{food.servingSize}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDeleteClick(food.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      <AddFoodDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this food item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
