'use client';

import { useState } from 'react';
import { MealPlan, PlannedMeal, Recipe, MealType, DayOfWeek } from '@/types/meal-planner';

interface WeeklyCalendarProps {
  mealPlan: MealPlan;
  onAddMeal: (day: string, mealType: string, recipe: Recipe) => void;
  onRemoveMeal: (day: string, mealType: string) => void;
  selectedRecipe: Recipe | null;
}

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

const mealTypeLabels = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍎 Snack'
};

const mealTypeColors = {
  breakfast: 'bg-yellow-50 border-yellow-200',
  lunch: 'bg-blue-50 border-blue-200',
  dinner: 'bg-purple-50 border-purple-200',
  snack: 'bg-green-50 border-green-200'
};

export function WeeklyCalendar({ mealPlan, onAddMeal, onRemoveMeal, selectedRecipe }: WeeklyCalendarProps) {
  const [draggedMeal, setDraggedMeal] = useState<{ day: string; mealType: string } | null>(null);

  const handleDragStart = (day: string, mealType: string) => {
    setDraggedMeal({ day, mealType });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDay: string, targetMealType: string) => {
    if (draggedMeal && selectedRecipe) {
      onAddMeal(targetDay, targetMealType, selectedRecipe);
      setDraggedMeal(null);
    }
  };

  const handleCellClick = (day: string, mealType: string) => {
    if (selectedRecipe) {
      onAddMeal(day, mealType, selectedRecipe);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Calendar</h2>
        <p className="text-sm text-gray-600 mt-1">
          {selectedRecipe ? `Selected: ${selectedRecipe.title}` : 'Select a recipe from the sidebar and click on a time slot'}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-medium text-gray-700 border-b">Meal</th>
              {daysOfWeek.map(day => (
                <th key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-b min-w-[120px]">
                  {dayLabels[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map(mealType => (
              <tr key={mealType} className="border-b">
                <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50">
                  {mealTypeLabels[mealType]}
                </td>
                {daysOfWeek.map(day => {
                  const meal = mealPlan[day]?.[mealType];
                  return (
                    <td 
                      key={`${day}-${mealType}`}
                      className="p-2 border-r last:border-r-0"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day, mealType)}
                      onClick={() => handleCellClick(day, mealType)}
                    >
                      <div 
                        className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                          meal 
                            ? `${mealTypeColors[mealType]} border-solid` 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        draggable={!!meal}
                        onDragStart={() => meal && handleDragStart(day, mealType)}
                      >
                        {meal ? (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveMeal(day, mealType);
                              }}
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                            <div className="pr-4">
                              <h4 className="font-medium text-sm text-gray-900 mb-1">
                                {meal.title}
                              </h4>
                              {meal.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {meal.description}
                                </p>
                              )}
                              {(meal.prepTime || meal.cookTime) && (
                                <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                  {meal.prepTime && <span>⏱️ {meal.prepTime}m prep</span>}
                                  {meal.cookTime && <span>🔥 {meal.cookTime}m cook</span>}
                                </div>
                              )}
                              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                <span>🔥 {meal.nutrition.calories} cal</span>
                                <span>🥩 {meal.nutrition.protein}g protein</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            {selectedRecipe ? 'Click to add' : 'Empty'}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Total meals planned:</span> {Object.values(mealPlan).reduce((total, day) => total + Object.keys(day).length, 0)}
          </div>
          <div className="text-xs">
            💡 Tip: Select a recipe and click on any time slot to add it, or drag meals to rearrange
          </div>
        </div>
      </div>
    </div>
  );
}
