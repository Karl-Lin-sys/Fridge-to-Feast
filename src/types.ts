export interface Recipe {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTimeMinutes: number;
  calories: number;
  ingredients: string[];
  missingIngredients: string[];
  steps: string[];
}

export interface AnalyzeResponse {
  identifiedIngredients: string[];
  suggestedRecipes: Recipe[];
}

export type DietaryRestriction = "Vegetarian" | "Vegan" | "Keto" | "Paleo" | "Gluten-Free" | "Dairy-Free" | "Nut-Free";
