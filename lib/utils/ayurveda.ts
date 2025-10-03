import type { Dosha, Prakriti } from "@/lib/types"

export function calculateDominantDosha(prakriti: Prakriti): Dosha {
  const { vata, pitta, kapha } = prakriti

  if (vata >= pitta && vata >= kapha) return "Vata"
  if (pitta >= vata && pitta >= kapha) return "Pitta"
  return "Kapha"
}

export function getDoshaColor(dosha: Dosha): string {
  switch (dosha) {
    case "Vata":
      return "text-blue-600"
    case "Pitta":
      return "text-orange-600"
    case "Kapha":
      return "text-green-600"
  }
}

export function getDoshaDescription(dosha: Dosha): string {
  switch (dosha) {
    case "Vata":
      return "Air & Space - Movement, creativity, quick thinking"
    case "Pitta":
      return "Fire & Water - Transformation, metabolism, intelligence"
    case "Kapha":
      return "Earth & Water - Structure, stability, nourishment"
  }
}

export function getRasaTranslation(rasa: string): string {
  const translations: Record<string, string> = {
    Madhura: "Sweet",
    Amla: "Sour",
    Lavana: "Salty",
    Katu: "Pungent",
    Tikta: "Bitter",
    Kashaya: "Astringent",
  }
  return translations[rasa] || rasa
}

export function getGunaTranslation(guna: string): string {
  const translations: Record<string, string> = {
    Guru: "Heavy",
    Laghu: "Light",
    Snigdha: "Oily",
    Ruksha: "Dry",
    Sheeta: "Cold",
    Ushna: "Hot",
  }
  return translations[guna] || guna
}
