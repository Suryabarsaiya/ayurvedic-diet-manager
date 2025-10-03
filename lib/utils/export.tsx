import type { DietPlan, Patient, FoodItem } from "@/lib/types"

export function generateDietPlanCSV(dietPlan: DietPlan, patient: Patient, foods: FoodItem[]): string {
  const lines: string[] = []

  // Header
  lines.push("AyurDiet Cloud - Diet Plan Export")
  lines.push("")
  lines.push(`Patient Name,${patient.name}`)
  lines.push(`Age,${patient.age}`)
  lines.push(`Dominant Dosha,${patient.prakriti.dominantDosha}`)
  lines.push(`Plan Duration,${dietPlan.duration} days`)
  lines.push(`Created Date,${new Date(dietPlan.createdAt).toLocaleDateString()}`)
  lines.push("")

  // Meals
  lines.push("MEAL PLAN")
  lines.push("Meal,Time,Food Item,Quantity,Unit,Calories,Protein (g),Carbs (g),Fat (g)")

  dietPlan.meals.forEach((meal) => {
    meal.items.forEach((item, index) => {
      const food = foods.find((f) => f.id === item.foodId)
      if (food) {
        const mealName = index === 0 ? meal.name : ""
        const mealTime = index === 0 ? meal.time : ""
        lines.push(
          `${mealName},${mealTime},${food.name},${item.quantity},${item.unit},${food.nutritional.calories * item.quantity},${food.nutritional.protein * item.quantity},${food.nutritional.carbs * item.quantity},${food.nutritional.fat * item.quantity}`,
        )
      }
    })
  })

  lines.push("")

  // Guidelines
  if (dietPlan.guidelines.length > 0) {
    lines.push("DIETARY GUIDELINES")
    dietPlan.guidelines.forEach((guideline, index) => {
      lines.push(`${index + 1},${guideline}`)
    })
    lines.push("")
  }

  // Restrictions
  if (dietPlan.restrictions.length > 0) {
    lines.push("RESTRICTIONS")
    dietPlan.restrictions.forEach((restriction, index) => {
      lines.push(`${index + 1},${restriction}`)
    })
    lines.push("")
  }

  // Notes
  if (dietPlan.notes) {
    lines.push("NOTES")
    lines.push(dietPlan.notes)
  }

  return lines.join("\n")
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generateDietPlanPDF(dietPlan: DietPlan, patient: Patient, foods: FoodItem[]): string {
  // Generate HTML content for PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Diet Plan - ${patient.name}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #059669;
      margin: 0 0 10px 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .patient-info {
      background: #f5f5f4;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .patient-info h2 {
      margin-top: 0;
      color: #059669;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .info-value {
      font-size: 16px;
      margin-top: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #059669;
      border-bottom: 2px solid #e7e5e4;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .meal {
      background: white;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .meal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .meal-name {
      font-size: 18px;
      font-weight: bold;
      color: #292524;
    }
    .meal-time {
      color: #666;
      font-size: 14px;
    }
    .food-item {
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f4;
    }
    .food-item:last-child {
      border-bottom: none;
    }
    .food-name {
      font-weight: 600;
      color: #292524;
    }
    .food-details {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }
    .nutrition {
      display: flex;
      gap: 15px;
      margin-top: 5px;
      font-size: 12px;
      color: #78716c;
    }
    .guidelines, .restrictions {
      list-style: none;
      padding: 0;
    }
    .guidelines li, .restrictions li {
      padding: 10px 15px;
      margin-bottom: 10px;
      background: #fafaf9;
      border-left: 3px solid #059669;
      border-radius: 4px;
    }
    .restrictions li {
      border-left-color: #dc2626;
      background: #fef2f2;
    }
    .notes {
      background: #fef3c7;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #f59e0b;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e7e5e4;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .meal {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AyurDiet Cloud</h1>
    <p>Personalized Ayurvedic Diet Plan</p>
  </div>

  <div class="patient-info">
    <h2>Patient Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Name</span>
        <span class="info-value">${patient.name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Age</span>
        <span class="info-value">${patient.age} years</span>
      </div>
      <div class="info-item">
        <span class="info-label">Dominant Dosha</span>
        <span class="info-value">${patient.prakriti.dominantDosha}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Plan Duration</span>
        <span class="info-value">${dietPlan.duration} days</span>
      </div>
      <div class="info-item">
        <span class="info-label">Created Date</span>
        <span class="info-value">${new Date(dietPlan.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Dosha Distribution</span>
        <span class="info-value">V: ${patient.prakriti.vata}% | P: ${patient.prakriti.pitta}% | K: ${patient.prakriti.kapha}%</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Daily Meal Plan</h2>
    ${dietPlan.meals
      .map(
        (meal) => `
      <div class="meal">
        <div class="meal-header">
          <span class="meal-name">${meal.name}</span>
          <span class="meal-time">${meal.time}</span>
        </div>
        ${meal.items
          .map((item) => {
            const food = foods.find((f) => f.id === item.foodId)
            if (!food) return ""
            return `
          <div class="food-item">
            <div class="food-name">${food.name}</div>
            <div class="food-details">${item.quantity} ${item.unit} • ${food.servingSize}</div>
            <div class="nutrition">
              <span>Calories: ${Math.round(food.nutritional.calories * item.quantity)}</span>
              <span>Protein: ${Math.round(food.nutritional.protein * item.quantity)}g</span>
              <span>Carbs: ${Math.round(food.nutritional.carbs * item.quantity)}g</span>
              <span>Fat: ${Math.round(food.nutritional.fat * item.quantity)}g</span>
            </div>
          </div>
        `
          })
          .join("")}
      </div>
    `,
      )
      .join("")}
  </div>

  ${
    dietPlan.guidelines.length > 0
      ? `
  <div class="section">
    <h2>Dietary Guidelines</h2>
    <ul class="guidelines">
      ${dietPlan.guidelines.map((guideline) => `<li>${guideline}</li>`).join("")}
    </ul>
  </div>
  `
      : ""
  }

  ${
    dietPlan.restrictions.length > 0
      ? `
  <div class="section">
    <h2>Restrictions</h2>
    <ul class="restrictions">
      ${dietPlan.restrictions.map((restriction) => `<li>${restriction}</li>`).join("")}
    </ul>
  </div>
  `
      : ""
  }

  ${
    dietPlan.notes
      ? `
  <div class="section">
    <h2>Additional Notes</h2>
    <div class="notes">${dietPlan.notes}</div>
  </div>
  `
      : ""
  }

  <div class="footer">
    <p>Generated by AyurDiet Cloud on ${new Date().toLocaleDateString()}</p>
    <p>This diet plan is personalized based on Ayurvedic principles and should be followed under professional guidance.</p>
  </div>
</body>
</html>
  `

  return html
}

export function printDietPlan(html: string) {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}
