'use client';

import { useState, useEffect } from 'react';
import { WeeklyCalendar } from '@/components/meal-planner/WeeklyCalendar';
import { RecipeSidebar } from '@/components/meal-planner/RecipeSidebar';
import { MealPlannerHeader } from '@/components/meal-planner/MealPlannerHeader';
import { NutritionSummary } from '@/components/meal-planner/NutritionSummary';
import { MealPlan, PlannedMeal } from '@/types/meal-planner';

export default function MealPlannerPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  // Load meal plan from localStorage on component mount
  useEffect(() => {
    const savedMealPlan = localStorage.getItem('cookmate-meal-plan');
    if (savedMealPlan) {
      try {
        setMealPlan(JSON.parse(savedMealPlan));
      } catch (error) {
        console.error('Error loading meal plan from localStorage:', error);
      }
    }
  }, []);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cookmate-meal-plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addMealToPlan = (day: string, mealType: string, recipe: any) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [mealType]: {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          servings: recipe.servings,
          imageUrl: recipe.image_url,
          addedAt: new Date().toISOString(),
          nutrition: recipe.nutrition
        }
      }
    }));
  };

  const removeMealFromPlan = (day: string, mealType: string) => {
    setMealPlan(prev => {
      const newPlan = { ...prev };
      if (newPlan[day]) {
        const dayMeals = { ...newPlan[day] };
        delete dayMeals[mealType as keyof typeof dayMeals];
        if (Object.keys(dayMeals).length === 0) {
          delete newPlan[day];
        } else {
          newPlan[day] = dayMeals;
        }
      }
      return newPlan;
    });
  };

  const clearWeekPlan = () => {
    if (confirm('Are you sure you want to clear the entire week\'s meal plan?')) {
      setMealPlan({});
    }
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MealPlannerHeader 
        onClearWeek={clearWeekPlan}
        onExportPDF={exportToPDF}
      />
      
      <div className="p-6">
        {/* Recipe Selection Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">📚</span> Recipe Selection
            </h2>
            <RecipeSidebar 
              onRecipeSelect={setSelectedRecipe}
              selectedRecipe={selectedRecipe}
            />
          </div>
        </div>

        {/* Weekly Calendar Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">📅</span> Weekly Meal Calendar
            </h2>
            <WeeklyCalendar 
              mealPlan={mealPlan}
              onAddMeal={addMealToPlan}
              onRemoveMeal={removeMealFromPlan}
              selectedRecipe={selectedRecipe}
            />
          </div>
        </div>

        {/* Nutrition Summary Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-orange-600">🥗</span> Nutrition Summary
            </h2>
            <NutritionSummary mealPlan={mealPlan} />
          </div>
        </div>
      </div>
    </div>
  );
}
