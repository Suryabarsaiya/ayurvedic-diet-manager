import { generateText } from "ai"
import type { Patient } from "@/lib/types"
import { foodsDatabase } from "@/lib/data/foods-data"

export async function POST(request: Request) {
  try {
    const { patient } = (await request.json()) as { patient: Patient }

    const foodList = foodsDatabase
      .map(
        (food) =>
          `${food.name} (${food.category}): Rasa: ${food.ayurvedic.rasa.join(", ")}, Dosha effects: V${food.ayurvedic.doshaEffect.vata[0]?.toUpperCase()} P${food.ayurvedic.doshaEffect.pitta[0]?.toUpperCase()} K${food.ayurvedic.doshaEffect.kapha[0]?.toUpperCase()}`,
      )
      .join("\n")

    const prompt = `You are an expert Ayurvedic dietitian. Analyze the patient profile and provide personalized dietary recommendations.

Patient Profile:
- Name: ${patient.name}
- Age: ${patient.age}
- Gender: ${patient.gender}
- Dominant Dosha: ${patient.prakriti.dominantDosha}
- Dosha Distribution: Vata ${patient.prakriti.vata}%, Pitta ${patient.prakriti.pitta}%, Kapha ${patient.prakriti.kapha}%
- Current Conditions: ${patient.currentConditions.join(", ") || "None"}
- Allergies: ${patient.allergies.join(", ") || "None"}
- Dietary Restrictions: ${patient.dietaryRestrictions.join(", ") || "None"}

Available Foods in Database:
${foodList}

Based on this patient's Prakriti and conditions, provide:

1. RECOMMENDED FOODS (5-7 foods from the database above that would balance their dosha)
2. FOODS TO AVOID (3-5 foods from the database that might aggravate their dosha)
3. DIETARY GUIDELINES (5-7 specific actionable guidelines for this patient)
4. LIFESTYLE RECOMMENDATIONS (3-4 Ayurvedic lifestyle tips)

Format your response as JSON with this structure:
{
  "recommendedFoods": ["food1", "food2", ...],
  "foodsToAvoid": ["food1", "food2", ...],
  "dietaryGuidelines": ["guideline1", "guideline2", ...],
  "lifestyleRecommendations": ["tip1", "tip2", ...]
}

Only include foods that exist in the database above. Be specific and practical.`

    const { text } = await generateText({
      model: "google/gemini-1.5-flash",
      prompt,
      apiKey: "AIzaSyAIFwZwQyyZjZS4lgF0ZnEgD8o9PCQm_HU",
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const recommendations = JSON.parse(jsonMatch[0])

    return Response.json(recommendations)
  } catch (error) {
    console.error("[v0] AI recommendation error:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
