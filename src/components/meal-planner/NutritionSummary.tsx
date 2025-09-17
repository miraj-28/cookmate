'use client';

import { useState, useEffect } from 'react';
import { MealPlan, NutritionInfo } from '@/types/meal-planner';

interface NutritionSummaryProps {
  mealPlan: MealPlan;
}

interface DailyNutrition {
  day: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  mealCount: number;
}

interface NutritionGoals {
  dailyCalories: { min: number; max: number };
  dailyProtein: { min: number; max: number };
  dailyCarbs: { min: number; max: number };
  dailyFat: { min: number; max: number };
  dailyFiber: { min: number; max: number };
  dailySugar: { min: number; max: number };
  dailySodium: { min: number; max: number };
}

const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

function calculateDailyNutrition(mealPlan: MealPlan, day: string): DailyNutrition {
  const dayMeals = mealPlan[day] || {};
  const meals = Object.values(dayMeals);
  
  const totals = meals.reduce((acc, meal) => {
    if (meal && meal.nutrition) {
      acc.calories += meal.nutrition.calories;
      acc.protein += meal.nutrition.protein;
      acc.carbs += meal.nutrition.carbohydrates;
      acc.fat += meal.nutrition.fat;
      acc.fiber += meal.nutrition.fiber;
      acc.sugar += meal.nutrition.sugar;
      acc.sodium += meal.nutrition.sodium;
    }
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  return {
    day,
    totalCalories: totals.calories,
    totalProtein: totals.protein,
    totalCarbs: totals.carbs,
    totalFat: totals.fat,
    totalFiber: totals.fiber,
    totalSugar: totals.sugar,
    totalSodium: totals.sodium,
    mealCount: meals.length
  };
}

function calculateWeeklyTotals(dailyNutrition: DailyNutrition[]): NutritionInfo {
  return dailyNutrition.reduce((acc, day) => ({
    calories: acc.calories + day.totalCalories,
    protein: acc.protein + day.totalProtein,
    carbohydrates: acc.carbohydrates + day.totalCarbs,
    fat: acc.fat + day.totalFat,
    fiber: acc.fiber + day.totalFiber,
    sugar: acc.sugar + day.totalSugar,
    sodium: acc.sodium + day.totalSodium,
    cholesterol: 0
  }), {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0
  });
}

function getNutritionStatus(value: number, min: number, max: number): string {
  if (value < min) return 'text-red-600';
  if (value > max) return 'text-[#5A4A8B]';
  return 'text-green-600';
}

export function NutritionSummary({ mealPlan }: NutritionSummaryProps) {
  const [nutritionGoals, setNutritionGoals] = useState({
    dailyCalories: { min: 1800, max: 2500 },
    dailyProtein: { min: 50, max: 100 },
    dailyCarbs: { min: 225, max: 325 },
    dailyFat: { min: 50, max: 80 },
    dailyFiber: { min: 25, max: 40 },
    dailySugar: { min: 0, max: 50 },
    dailySodium: { min: 0, max: 2300 }
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('cookmate-nutrition-goals');
    if (savedGoals) {
      try {
        setNutritionGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading nutrition goals:', error);
      }
    }
  }, []);

  // Save goals to localStorage
  const updateGoals = (newGoals: typeof nutritionGoals) => {
    setNutritionGoals(newGoals);
    localStorage.setItem('cookmate-nutrition-goals', JSON.stringify(newGoals));
  };

  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dailyNutrition = days.map(day => calculateDailyNutrition(mealPlan, day));
  const weeklyTotals = calculateWeeklyTotals(dailyNutrition);
  const totalMeals = dailyNutrition.reduce((sum, day) => sum + day.mealCount, 0);

  // Daily recommended values (will be user-configurable)
  const dailyCalories = nutritionGoals.dailyCalories;
  const dailyProtein = nutritionGoals.dailyProtein;
  const dailyCarbs = nutritionGoals.dailyCarbs;
  const dailyFat = nutritionGoals.dailyFat;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">📊 Nutrition Summary</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track your daily and weekly nutritional intake
        </p>
      </div>

      {/* Weekly Overview */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <h3 className="font-medium text-gray-900 mb-3">Weekly Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weeklyTotals.calories.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{weeklyTotals.protein}g</div>
            <div className="text-xs text-gray-600">Total Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#5A4A8B]">{weeklyTotals.carbohydrates}g</div>
            <div className="text-xs text-gray-600">Total Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{weeklyTotals.fat}g</div>
            <div className="text-xs text-gray-600">Total Fat</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-600">
            {totalMeals} meals planned • {Math.round(weeklyTotals.calories / 7)} avg calories/day
          </span>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-3">Daily Breakdown</h3>
        <div className="space-y-3">
          {dailyNutrition.map((day) => (
            <div key={day.day} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{dayLabels[day.day as keyof typeof dayLabels]}</h4>
                <span className="text-sm text-gray-500">{day.mealCount} meals</span>
              </div>
              
              {day.mealCount > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Calories:</span>
                    <span className={`ml-1 font-medium ${getNutritionStatus(day.totalCalories, dailyCalories.min, dailyCalories.max)}`}>
                      {day.totalCalories}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein:</span>
                    <span className={`ml-1 font-medium ${getNutritionStatus(day.totalProtein, dailyProtein.min, dailyProtein.max)}`}>
                      {day.totalProtein}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>
                    <span className={`ml-1 font-medium ${getNutritionStatus(day.totalCarbs, dailyCarbs.min, dailyCarbs.max)}`}>
                      {day.totalCarbs}g
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fat:</span>
                    <span className={`ml-1 font-medium ${getNutritionStatus(day.totalFat, dailyFat.min, dailyFat.max)}`}>
                      {day.totalFat}g
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No meals planned</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Tips */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900">💡 Nutrition Tips</h3>
          <button
            onClick={() => setShowGoalSettings(!showGoalSettings)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showGoalSettings ? 'Hide Goals' : 'Set Goals'}
          </button>
        </div>
        
        {showGoalSettings ? (
          <div className="mb-4 p-3 bg-white border rounded-lg">
            <h4 className="font-medium text-black mb-3">Set Your Daily Nutrition Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-black mb-1">Calories (min-max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nutritionGoals.dailyCalories.min}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyCalories: { ...nutritionGoals.dailyCalories, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                  <input
                    type="number"
                    value={nutritionGoals.dailyCalories.max}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyCalories: { ...nutritionGoals.dailyCalories, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-black mb-1">Protein (g, min-max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nutritionGoals.dailyProtein.min}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyProtein: { ...nutritionGoals.dailyProtein, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                  <input
                    type="number"
                    value={nutritionGoals.dailyProtein.max}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyProtein: { ...nutritionGoals.dailyProtein, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-black mb-1">Carbs (g, min-max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nutritionGoals.dailyCarbs.min}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyCarbs: { ...nutritionGoals.dailyCarbs, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                  <input
                    type="number"
                    value={nutritionGoals.dailyCarbs.max}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyCarbs: { ...nutritionGoals.dailyCarbs, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-black mb-1">Fat (g, min-max)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nutritionGoals.dailyFat.min}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyFat: { ...nutritionGoals.dailyFat, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                  <input
                    type="number"
                    value={nutritionGoals.dailyFat.max}
                    onChange={(e) => updateGoals({
                      ...nutritionGoals,
                      dailyFat: { ...nutritionGoals.dailyFat, max: parseInt(e.target.value) || 0 }
                    })}
                    className="w-20 px-2 py-1 border rounded text-sm text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Current goals: {nutritionGoals.dailyCalories.min}-{nutritionGoals.dailyCalories.max} calories/day</div>
          <div>• Protein: {nutritionGoals.dailyProtein.min}-{nutritionGoals.dailyProtein.max}g/day</div>
          <div>• Carbs: {nutritionGoals.dailyCarbs.min}-{nutritionGoals.dailyCarbs.max}g/day</div>
          <div>• Fat: {nutritionGoals.dailyFat.min}-{nutritionGoals.dailyFat.max}g/day</div>
          <div>• Stay hydrated and include fiber-rich foods</div>
        </div>
      </div>
    </div>
  );
}
