// Core data types for AyurDiet Cloud

export type Dosha = "Vata" | "Pitta" | "Kapha"
export type Rasa = "Madhura" | "Amla" | "Lavana" | "Katu" | "Tikta" | "Kashaya"
export type Guna = "Guru" | "Laghu" | "Snigdha" | "Ruksha" | "Sheeta" | "Ushna"
export type Virya = "Sheeta" | "Ushna"
export type Vipaka = "Madhura" | "Amla" | "Katu"

export interface AyurvedicProperties {
  rasa: Rasa[]
  guna: Guna[]
  virya: Virya
  vipaka: Vipaka
  doshaEffect: {
    vata: "increases" | "decreases" | "neutral"
    pitta: "increases" | "decreases" | "neutral"
    kapha: "increases" | "decreases" | "neutral"
  }
}

export interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  vitamins?: string[]
  minerals?: string[]
}

export interface FoodItem {
  id: string
  name: string
  category: "grain" | "vegetable" | "fruit" | "legume" | "dairy" | "spice" | "oil" | "meat" | "other"
  ayurvedic: AyurvedicProperties
  nutritional: NutritionalInfo
  servingSize: string
  notes?: string
}

export interface Prakriti {
  vata: number // 0-100
  pitta: number // 0-100
  kapha: number // 0-100
  dominantDosha: Dosha
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  contact: string
  prakriti: Prakriti
  currentConditions: string[]
  allergies: string[]
  dietaryRestrictions: string[]
  createdAt: Date
  lastVisit?: Date
}

export interface MealItem {
  foodId: string
  quantity: number
  unit: string
  notes?: string
}

export interface Meal {
  id: string
  name: string
  time: string
  items: MealItem[]
}

export interface DietPlan {
  id: string
  patientId: string
  createdAt: Date
  duration: number // days
  meals: Meal[]
  guidelines: string[]
  restrictions: string[]
  notes?: string
}

export interface Appointment {
  id: string
  patientId: string
  date: Date
  type: "consultation" | "follow-up" | "diet-review"
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}
