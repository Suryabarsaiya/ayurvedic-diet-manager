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
import { Slider } from "@/components/ui/slider"
import type { Prakriti } from "@/lib/types"
import { calculateDominantDosha } from "@/lib/utils/ayurveda"

interface AddPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPatientDialog({ open, onOpenChange }: AddPatientDialogProps) {
  const { addPatient } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female" as "male" | "female" | "other",
    contact: "",
    vata: 33,
    pitta: 33,
    kapha: 34,
    currentConditions: "",
    allergies: "",
    dietaryRestrictions: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const prakriti: Prakriti = {
      vata: formData.vata,
      pitta: formData.pitta,
      kapha: formData.kapha,
      dominantDosha: calculateDominantDosha({
        vata: formData.vata,
        pitta: formData.pitta,
        kapha: formData.kapha,
        dominantDosha: "Vata",
      }),
    }

    addPatient({
      id: `p${Date.now()}`,
      name: formData.name,
      age: Number.parseInt(formData.age),
      gender: formData.gender,
      contact: formData.contact,
      prakriti,
      currentConditions: formData.currentConditions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      allergies: formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      dietaryRestrictions: formData.dietaryRestrictions
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      createdAt: new Date(),
    })

    // Reset form
    setFormData({
      name: "",
      age: "",
      gender: "female",
      contact: "",
      vata: 33,
      pitta: 33,
      kapha: 34,
      currentConditions: "",
      allergies: "",
      dietaryRestrictions: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Enter patient details and Prakriti assessment</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Prakriti Assessment</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Vata</Label>
                  <span className="text-sm text-muted-foreground">{formData.vata}%</span>
                </div>
                <Slider
                  value={[formData.vata]}
                  onValueChange={([value]) => setFormData({ ...formData, vata: value })}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Pitta</Label>
                  <span className="text-sm text-muted-foreground">{formData.pitta}%</span>
                </div>
                <Slider
                  value={[formData.pitta]}
                  onValueChange={([value]) => setFormData({ ...formData, pitta: value })}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Kapha</Label>
                  <span className="text-sm text-muted-foreground">{formData.kapha}%</span>
                </div>
                <Slider
                  value={[formData.kapha]}
                  onValueChange={([value]) => setFormData({ ...formData, kapha: value })}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conditions">Current Conditions (comma-separated)</Label>
              <Input
                id="conditions"
                placeholder="e.g., Diabetes, Hypertension"
                value={formData.currentConditions}
                onChange={(e) => setFormData({ ...formData, currentConditions: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies"
                placeholder="e.g., Peanuts, Dairy"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restrictions">Dietary Restrictions (comma-separated)</Label>
              <Input
                id="restrictions"
                placeholder="e.g., Vegetarian, Gluten-free"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
