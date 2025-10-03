"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Patient, DietPlan, Appointment, FoodItem } from "./types"
import { foodsDatabase } from "./data/foods-data"

interface AppState {
  patients: Patient[]
  dietPlans: DietPlan[]
  appointments: Appointment[]
  foods: FoodItem[]
  selectedPatient: Patient | null

  // Patient actions
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  setSelectedPatient: (patient: Patient | null) => void

  // Diet plan actions
  addDietPlan: (plan: DietPlan) => void
  updateDietPlan: (id: string, plan: Partial<DietPlan>) => void
  deleteDietPlan: (id: string) => void

  // Appointment actions
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void

  // Food actions
  addFood: (food: FoodItem) => void
  updateFood: (id: string, food: Partial<FoodItem>) => void
  deleteFood: (id: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      patients: [],
      dietPlans: [],
      appointments: [],
      foods: foodsDatabase,
      selectedPatient: null,

      // Patient actions
      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient],
        })),
      updatePatient: (id, updatedPatient) =>
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...updatedPatient } : p)),
        })),
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
          dietPlans: state.dietPlans.filter((dp) => dp.patientId !== id),
          appointments: state.appointments.filter((a) => a.patientId !== id),
        })),
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      // Diet plan actions
      addDietPlan: (plan) =>
        set((state) => ({
          dietPlans: [...state.dietPlans, plan],
        })),
      updateDietPlan: (id, updatedPlan) =>
        set((state) => ({
          dietPlans: state.dietPlans.map((p) => (p.id === id ? { ...p, ...updatedPlan } : p)),
        })),
      deleteDietPlan: (id) =>
        set((state) => ({
          dietPlans: state.dietPlans.filter((p) => p.id !== id),
        })),

      // Appointment actions
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),
      updateAppointment: (id, updatedAppointment) =>
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updatedAppointment } : a)),
        })),
      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // Food actions
      addFood: (food) =>
        set((state) => ({
          foods: [...state.foods, food],
        })),
      updateFood: (id, updatedFood) =>
        set((state) => ({
          foods: state.foods.map((f) => (f.id === id ? { ...f, ...updatedFood } : f)),
        })),
      deleteFood: (id) =>
        set((state) => ({
          foods: state.foods.filter((f) => f.id !== id),
        })),
    }),
    {
      name: "ayurdiet-storage",
    },
  ),
)
