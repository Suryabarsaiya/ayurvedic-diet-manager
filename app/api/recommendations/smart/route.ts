import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

const hf = new HfInference()

export async function POST(request: Request) {
  try {
    const { patient, mealType, timeOfDay } = await request.json()

    const prompt = `As an expert Ayurvedic dietitian, provide personalized meal recommendations for a patient with the following profile:

Patient Profile:
- Dominant Dosha: ${patient.prakriti.dominantDosha}
- Dosha Balance: Vata ${patient.prakriti.vata}%, Pitta ${patient.prakriti.pitta}%, Kapha ${patient.prakriti.kapha}%
- Current Conditions: ${patient.currentConditions.join(", ") || "None"}
- Allergies: ${patient.allergies.join(", ") || "None"}
- Dietary Restrictions: ${patient.dietaryRestrictions.join(", ") || "None"}

Meal Context:
- Meal Type: ${mealType || "General"}
- Time of Day: ${timeOfDay || "Any"}

Please provide:
1. 5-7 specific food recommendations suitable for this meal
2. Foods to avoid for this meal
3. Cooking methods and preparation tips
4. Timing and portion guidance
5. Ayurvedic principles to follow

Format as JSON with keys: recommendedFoods (array), avoidFoods (array), cookingTips (array), timingGuidance (string), ayurvedicPrinciples (array)`

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        return_full_text: false,
      },
    })

    const text = response.generated_text

    // Parse the AI response
    let recommendations
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      recommendations = null
    }

    if (!recommendations) {
      const mealDefaults: Record<string, any> = {
        Breakfast: {
          recommendedFoods: ["Oatmeal with ghee", "Fresh fruits", "Herbal tea", "Nuts and seeds", "Warm milk"],
          avoidFoods: ["Heavy fried foods", "Cold cereals", "Leftover food"],
          cookingTips: ["Cook fresh", "Add warming spices", "Use ghee for cooking"],
          timingGuidance: "Eat between 7-9 AM when digestive fire is building",
          ayurvedicPrinciples: ["Start with warm foods", "Include all six tastes", "Eat mindfully"],
        },
        Lunch: {
          recommendedFoods: ["Basmati rice", "Dal", "Vegetables", "Chapati", "Yogurt", "Salad"],
          avoidFoods: ["Heavy desserts", "Excessive raw foods"],
          cookingTips: ["Use balanced spices", "Include variety", "Cook with love"],
          timingGuidance: "Eat between 12-2 PM when digestive fire is strongest",
          ayurvedicPrinciples: ["Make lunch the largest meal", "Include protein and grains", "Sit while eating"],
        },
        Dinner: {
          recommendedFoods: ["Light soup", "Steamed vegetables", "Small portion of grains", "Herbal tea"],
          avoidFoods: ["Heavy meats", "Yogurt", "Cheese", "Fried foods"],
          cookingTips: ["Keep it light", "Avoid heavy spices", "Cook thoroughly"],
          timingGuidance: "Eat before 7 PM, at least 3 hours before sleep",
          ayurvedicPrinciples: ["Light and easy to digest", "Avoid curd at night", "Early dinner"],
        },
      }

      recommendations = mealDefaults[mealType] || mealDefaults.Lunch
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("[v0] Error generating smart recommendations:", error)
    return NextResponse.json({
      recommendedFoods: ["Seasonal vegetables", "Whole grains", "Legumes", "Healthy fats"],
      avoidFoods: ["Processed foods", "Excessive sugar", "Deep fried items"],
      cookingTips: ["Use fresh ingredients", "Cook with appropriate spices", "Maintain food hygiene"],
      timingGuidance: "Eat at regular times and avoid late meals",
      ayurvedicPrinciples: ["Eat according to your dosha", "Include all six tastes", "Practice mindful eating"],
    })
  }
}
