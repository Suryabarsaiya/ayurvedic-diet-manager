"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { FoodItem, Rasa, Guna, Virya, Vipaka } from "@/lib/types"

interface AddFoodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFoodDialog({ open, onOpenChange }: AddFoodDialogProps) {
  const { addFood } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    category: "other" as FoodItem["category"],
    servingSize: "100g",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    virya: "Sheeta" as Virya,
    vipaka: "Madhura" as Vipaka,
    vataEffect: "neutral" as "increases" | "decreases" | "neutral",
    pittaEffect: "neutral" as "increases" | "decreases" | "neutral",
    kaphaEffect: "neutral" as "increases" | "decreases" | "neutral",
    notes: "",
  })

  const [selectedRasas, setSelectedRasas] = useState<Rasa[]>([])
  const [selectedGunas, setSelectedGunas] = useState<Guna[]>([])

  const rasaOptions: Rasa[] = ["Madhura", "Amla", "Lavana", "Katu", "Tikta", "Kashaya"]
  const gunaOptions: Guna[] = ["Guru", "Laghu", "Snigdha", "Ruksha", "Sheeta", "Ushna"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || selectedRasas.length === 0 || selectedGunas.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    const newFood: FoodItem = {
      id: `food-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      servingSize: formData.servingSize,
      ayurvedic: {
        rasa: selectedRasas,
        guna: selectedGunas,
        virya: formData.virya,
        vipaka: formData.vipaka,
        doshaEffect: {
          vata: formData.vataEffect,
          pitta: formData.pittaEffect,
          kapha: formData.kaphaEffect,
        },
      },
      nutritional: {
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        fiber: formData.fiber,
      },
      notes: formData.notes || undefined,
    }

    addFood(newFood)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "other",
      servingSize: "100g",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      virya: "Sheeta",
      vipaka: "Madhura",
      vataEffect: "neutral",
      pittaEffect: "neutral",
      kaphaEffect: "neutral",
      notes: "",
    })
    setSelectedRasas([])
    setSelectedGunas([])
  }

  const toggleRasa = (rasa: Rasa) => {
    setSelectedRasas((prev) => (prev.includes(rasa) ? prev.filter((r) => r !== rasa) : [...prev, rasa]))
  }

  const toggleGuna = (guna: Guna) => {
    setSelectedGunas((prev) => (prev.includes(guna) ? prev.filter((g) => g !== guna) : [...prev, guna]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Food</DialogTitle>
          <DialogDescription>Add a new food item with Ayurvedic and nutritional properties</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Brown Rice"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grain">Grain</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="legume">Legume</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="spice">Spice</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servingSize">Serving Size</Label>
            <Input
              id="servingSize"
              value={formData.servingSize}
              onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
              placeholder="e.g., 100g, 1 cup"
            />
          </div>

          <div className="space-y-2">
            <Label>Rasa (Taste) *</Label>
            <div className="grid grid-cols-3 gap-2">
              {rasaOptions.map((rasa) => (
                <div key={rasa} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rasa-${rasa}`}
                    checked={selectedRasas.includes(rasa)}
                    onCheckedChange={() => toggleRasa(rasa)}
                  />
                  <Label htmlFor={`rasa-${rasa}`} className="text-sm font-normal">
                    {rasa}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Guna (Quality) *</Label>
            <div className="grid grid-cols-3 gap-2">
              {gunaOptions.map((guna) => (
                <div key={guna} className="flex items-center space-x-2">
                  <Checkbox
                    id={`guna-${guna}`}
                    checked={selectedGunas.includes(guna)}
                    onCheckedChange={() => toggleGuna(guna)}
                  />
                  <Label htmlFor={`guna-${guna}`} className="text-sm font-normal">
                    {guna}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="virya">Virya (Potency)</Label>
              <Select
                value={formData.virya}
                onValueChange={(value: Virya) => setFormData({ ...formData, virya: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sheeta">Sheeta (Cold)</SelectItem>
                  <SelectItem value="Ushna">Ushna (Hot)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vipaka">Vipaka (Post-digestive)</Label>
              <Select
                value={formData.vipaka}
                onValueChange={(value: Vipaka) => setFormData({ ...formData, vipaka: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Madhura">Madhura (Sweet)</SelectItem>
                  <SelectItem value="Amla">Amla (Sour)</SelectItem>
                  <SelectItem value="Katu">Katu (Pungent)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dosha Effects</Label>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vataEffect" className="text-sm">
                  Vata
                </Label>
                <Select
                  value={formData.vataEffect}
                  onValueChange={(value: any) => setFormData({ ...formData, vataEffect: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increases">Increases</SelectItem>
                    <SelectItem value="decreases">Decreases</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pittaEffect" className="text-sm">
                  Pitta
                </Label>
                <Select
                  value={formData.pittaEffect}
                  onValueChange={(value: any) => setFormData({ ...formData, pittaEffect: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increases">Increases</SelectItem>
                    <SelectItem value="decreases">Decreases</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kaphaEffect" className="text-sm">
                  Kapha
                </Label>
                <Select
                  value={formData.kaphaEffect}
                  onValueChange={(value: any) => setFormData({ ...formData, kaphaEffect: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increases">Increases</SelectItem>
                    <SelectItem value="decreases">Decreases</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nutritional Information (per serving)</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calories" className="text-sm">
                  Calories
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein" className="text-sm">
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs" className="text-sm">
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat" className="text-sm">
                  Fat (g)
                </Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiber" className="text-sm">
                  Fiber (g)
                </Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  value={formData.fiber}
                  onChange={(e) => setFormData({ ...formData, fiber: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Food</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
