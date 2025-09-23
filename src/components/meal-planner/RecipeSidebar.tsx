'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/types/meal-planner';
import { supabase } from '@/lib/supabase';

interface RecipeSidebarProps {
  onRecipeSelect: (recipe: Recipe | null) => void;
  selectedRecipe: Recipe | null;
}

export function RecipeSidebar({ onRecipeSelect, selectedRecipe }: RecipeSidebarProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('title');

      if (error) {
        console.warn('Supabase error:', error);
        // Fallback to sample recipes if there's any error
        setRecipes(getSampleRecipes());
        return;
      }
      
      // If no data returned or empty array, use sample recipes
      if (!data || data.length === 0) {
        console.log('No recipes found in database, using sample recipes');
        setRecipes(getSampleRecipes());
      } else {
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Fallback sample recipes if Supabase is not configured or fails
      setRecipes(getSampleRecipes());
    } finally {
      setLoading(false);
    }
  };

  const getSampleRecipes = (): Recipe[] => {
    return [
      {
        id: '1',
        title: 'Paneer Butter Masala',
        description: 'Creamy and rich paneer curry in a tomato-based gravy',
        prep_time: 15,
        cook_time: 25,
        servings: 4,
        image_url: '',
        ingredients: ['250g paneer', '2 cups tomato puree', '1 cup cream', '2 tbsp butter'],
        instructions: ['Heat butter', 'Add paneer', 'Cook for 10 minutes'],
        category: 'vegetarian',
        user_id: 'sample',
        nutrition: {
          calories: 320,
          protein: 18,
          carbohydrates: 12,
          fat: 22,
          fiber: 2,
          sugar: 8,
          sodium: 450,
          cholesterol: 35
        }
      },
      {
        id: '2',
        title: 'Chicken Biryani',
        description: 'Fragrant rice dish with tender chicken pieces',
        prep_time: 30,
        cook_time: 45,
        servings: 6,
        image_url: '',
        ingredients: ['500g chicken', '2 cups basmati rice', '1 cup yogurt', 'Biryani spices'],
        instructions: ['Marinate chicken', 'Cook rice', 'Layer and dum cook'],
        category: 'non-vegetarian',
        user_id: 'sample',
        nutrition: {
          calories: 450,
          protein: 28,
          carbohydrates: 45,
          fat: 18,
          fiber: 3,
          sugar: 2,
          sodium: 680,
          cholesterol: 85
        }
      },
      {
        id: '3',
        title: 'Masala Dosa',
        description: 'Crispy rice and lentil crepes with potato filling',
        prep_time: 240,
        cook_time: 30,
        servings: 4,
        image_url: '',
        ingredients: ['2 cups rice', '1 cup urad dal', '4 potatoes', 'Spices'],
        instructions: ['Soak and grind batter', 'Prepare potato filling', 'Make dosas'],
        category: 'vegetarian',
        user_id: 'sample',
        nutrition: {
          calories: 280,
          protein: 8,
          carbohydrates: 52,
          fat: 6,
          fiber: 7,
          sugar: 3,
          sodium: 520,
          cholesterol: 0
        }
      },
      {
        id: '4',
        title: 'Mixed Vegetable Salad',
        description: 'Fresh and healthy mixed vegetable salad with lemon dressing',
        prep_time: 15,
        cook_time: 0,
        servings: 2,
        image_url: '',
        ingredients: ['Mixed greens', 'Tomatoes', 'Cucumber', 'Bell peppers', 'Lemon'],
        instructions: ['Chop vegetables', 'Mix together', 'Add lemon dressing'],
        category: 'vegetarian',
        user_id: 'sample',
        nutrition: {
          calories: 85,
          protein: 3,
          carbohydrates: 12,
          fat: 4,
          fiber: 5,
          sugar: 8,
          sodium: 120,
          cholesterol: 0
        }
      },
      {
        id: '5',
        title: 'Grilled Fish',
        description: 'Healthy grilled fish with herbs and spices',
        prep_time: 10,
        cook_time: 20,
        servings: 2,
        image_url: '',
        ingredients: ['Fish fillets', 'Lemon', 'Herbs', 'Olive oil', 'Spices'],
        instructions: ['Marinate fish', 'Grill for 10 minutes', 'Serve with lemon'],
        category: 'non-vegetarian',
        user_id: 'sample',
        nutrition: {
          calories: 220,
          protein: 32,
          carbohydrates: 2,
          fat: 10,
          fiber: 1,
          sugar: 1,
          sodium: 280,
          cholesterol: 65
        }
      }
    ];
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(recipes.map(r => r.category).filter((cat): cat is string => Boolean(cat))))];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">📚 Recipes</h2>
        
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="all">All Categories</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category} className="text-black">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Recipe */}
        {selectedRecipe && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-blue-900">Selected Recipe</h3>
              <button
                onClick={() => onRecipeSelect(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear
              </button>
            </div>
            <h4 className="font-semibold text-blue-900">{selectedRecipe.title}</h4>
            <p className="text-sm text-blue-700 mt-1">{selectedRecipe.description}</p>
          </div>
        )}
      </div>

      {/* Recipe List */}
      <div className="max-h-[600px] overflow-y-auto">
        {filteredRecipes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recipes found. Try adjusting your search or category filter.
          </div>
        ) : (
          <div className="divide-y">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => onRecipeSelect(recipe)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedRecipe?.id === recipe.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-black">{recipe.title}</h3>
                  {recipe.category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-black rounded-full">
                      {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-black mb-2 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex gap-3 text-xs text-black">
                  {recipe.prep_time && (
                    <span>⏱️ {recipe.prep_time}m prep</span>
                  )}
                  {recipe.cook_time && (
                    <span>🔥 {recipe.cook_time}m cook</span>
                  )}
                  {recipe.servings && (
                    <span>👥 {recipe.servings} servings</span>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-black mt-1">
                  <span>🔥 {recipe.nutrition.calories} cal</span>
                  <span>🥩 {recipe.nutrition.protein}g protein</span>
                  <span>🍞 {recipe.nutrition.carbohydrates}g carbs</span>
                  <span>🥑 {recipe.nutrition.fat}g fat</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{filteredRecipes.length}</span> recipes available
        </div>
      </div>
    </div>
  );
}
