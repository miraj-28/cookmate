export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbohydrates: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar: number; // in grams
  sodium: number; // in milligrams
  cholesterol?: number; // in milligrams
}

export interface PlannedMeal {
  id: string;
  title: string;
  description: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  addedAt: string;
  nutrition: NutritionInfo;
}

export interface DayMeals {
  breakfast?: PlannedMeal;
  lunch?: PlannedMeal;
  dinner?: PlannedMeal;
  snack?: PlannedMeal;
}

export interface MealPlan {
  [day: string]: DayMeals;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  image_url?: string;
  ingredients: string[];
  instructions: string[];
  category?: string;
  user_id: string;
  nutrition: NutritionInfo;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
