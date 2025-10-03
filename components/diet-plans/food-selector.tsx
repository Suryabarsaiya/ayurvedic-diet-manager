"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Search } from "lucide-react"
import type { MealItem } from "@/lib/types"
import { getRasaTranslation } from "@/lib/utils/ayurveda"

interface FoodSelectorProps {
  onSelect: (item: MealItem) => void
  selectedItems: MealItem[]
  onRemove: (foodId: string) => void
}

export function FoodSelector({ onSelect, selectedItems, onRemove }: FoodSelectorProps) {
  const { foods } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("serving")
  const [selectedFoodId, setSelectedFoodId] = useState<string>("")

  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddFood = () => {
    if (!selectedFoodId) return

    onSelect({
      foodId: selectedFoodId,
      quantity: Number.parseFloat(quantity),
      unit,
    })

    setSelectedFoodId("")
    setQuantity("1")
    setUnit("serving")
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => {
          const food = foods.find((f) => f.id === item.foodId)
          if (!food) return null

          return (
            <Badge key={item.foodId} variant="secondary" className="gap-2 pr-1">
              {food.name} ({item.quantity} {item.unit})
              <Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => onRemove(item.foodId)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        })}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Food Item
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search Food</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-48 space-y-1 overflow-y-auto">
              {filteredFoods.map((food) => (
                <button
                  type="button"
                  key={food.id}
                  onClick={() => setSelectedFoodId(food.id)}
                  className={`w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-secondary ${
                    selectedFoodId === food.id ? "bg-secondary" : ""
                  }`}
                >
                  <div className="font-medium">{food.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {food.ayurvedic.rasa.map(getRasaTranslation).join(", ")} • {food.category}
                  </div>
                </button>
              ))}
            </div>

            {selectedFoodId && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Unit</Label>
                  <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g., cup, tbsp" />
                </div>
              </div>
            )}

            <Button onClick={handleAddFood} disabled={!selectedFoodId} className="w-full">
              Add to Meal
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
