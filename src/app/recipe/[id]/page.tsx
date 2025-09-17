'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlay } from 'react-icons/fi';
import SectionWrapper from '@/components/SectionWrapper';
import { spoonacularAPI } from '@/lib/spoonacular';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  ingredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  instructions: Array<{
    number: number;
    step: string;
  }>;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  spoonacularScore: number;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');

  // Mock recipe data
  const mockRecipeData: { [key: string]: Recipe } = {
    '1': {
      id: 1,
      title: "Creamy Chicken Alfredo Pasta",
      image: "/api/placeholder/600/400",
      readyInMinutes: 30,
      servings: 4,
      summary: "Rich and creamy pasta dish with tender chicken and parmesan cheese. This classic Italian-American dish is perfect for a comforting dinner.",
      ingredients: [
        { id: 1, name: "Fettuccine pasta", amount: 12, unit: "oz" },
        { id: 2, name: "Chicken breast", amount: 1, unit: "lb" },
        { id: 3, name: "Heavy cream", amount: 1, unit: "cup" },
        { id: 4, name: "Parmesan cheese", amount: 1, unit: "cup" },
        { id: 5, name: "Butter", amount: 4, unit: "tbsp" },
        { id: 6, name: "Garlic cloves", amount: 3, unit: "cloves" },
        { id: 7, name: "Salt", amount: 1, unit: "tsp" },
        { id: 8, name: "Black pepper", amount: 0.5, unit: "tsp" }
      ],
      instructions: [
        { number: 1, step: "Cook fettuccine pasta according to package directions. Drain and set aside." },
        { number: 2, step: "Season chicken breast with salt and pepper. Cut into bite-sized pieces." },
        { number: 3, step: "In a large skillet, melt 2 tbsp butter over medium-high heat. Cook chicken until golden and cooked through, about 6-8 minutes." },
        { number: 4, step: "Remove chicken from skillet and set aside. In the same skillet, melt remaining butter." },
        { number: 5, step: "Add minced garlic and cook for 1 minute until fragrant." },
        { number: 6, step: "Pour in heavy cream and bring to a gentle simmer. Cook for 2-3 minutes." },
        { number: 7, step: "Add grated Parmesan cheese and whisk until melted and smooth." },
        { number: 8, step: "Return chicken to the skillet and add cooked pasta. Toss everything together." },
        { number: 9, step: "Season with additional salt and pepper to taste. Serve immediately." }
      ],
      nutrition: {
        calories: 650,
        protein: "35g",
        carbs: "45g",
        fat: "35g"
      },
      spoonacularScore: 85
    },
    '2': {
      id: 2,
      title: "Vegetarian Buddha Bowl",
      image: "/api/placeholder/600/400",
      readyInMinutes: 25,
      servings: 2,
      summary: "Healthy bowl packed with quinoa, roasted vegetables, and tahini dressing. A nutritious and colorful meal that's both satisfying and wholesome.",
      ingredients: [
        { id: 1, name: "Quinoa", amount: 1, unit: "cup" },
        { id: 2, name: "Sweet potato", amount: 1, unit: "large" },
        { id: 3, name: "Broccoli", amount: 2, unit: "cups" },
        { id: 4, name: "Chickpeas", amount: 1, unit: "can" },
        { id: 5, name: "Avocado", amount: 1, unit: "medium" },
        { id: 6, name: "Tahini", amount: 3, unit: "tbsp" },
        { id: 7, name: "Lemon juice", amount: 2, unit: "tbsp" },
        { id: 8, name: "Olive oil", amount: 2, unit: "tbsp" }
      ],
      instructions: [
        { number: 1, step: "Preheat oven to 400°F (200°C)." },
        { number: 2, step: "Cook quinoa according to package directions." },
        { number: 3, step: "Cube sweet potato and toss with olive oil, salt, and pepper. Roast for 20 minutes." },
        { number: 4, step: "Steam broccoli until tender, about 5 minutes." },
        { number: 5, step: "Drain and rinse chickpeas." },
        { number: 6, step: "Make tahini dressing by whisking tahini, lemon juice, and 2-3 tbsp water." },
        { number: 7, step: "Slice avocado." },
        { number: 8, step: "Assemble bowls with quinoa, roasted sweet potato, broccoli, chickpeas, and avocado." },
        { number: 9, step: "Drizzle with tahini dressing and serve." }
      ],
      nutrition: {
        calories: 520,
        protein: "18g",
        carbs: "65g",
        fat: "22g"
      },
      spoonacularScore: 92
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      
      // First check if it's a mock recipe
      const mockRecipe = mockRecipeData[recipeId];
      if (mockRecipe) {
        setRecipe(mockRecipe);
        setLoading(false);
        return;
      }
      
      // If not found in mock data, fetch from Spoonacular API
      try {
        console.log('Fetching recipe from Spoonacular API:', recipeId);
        const apiRecipe = await spoonacularAPI.getRecipeInformation(parseInt(recipeId), true);
        
        // Transform API recipe to match the Recipe interface
        const transformedRecipe: Recipe = {
          id: apiRecipe.id,
          title: apiRecipe.title,
          image: apiRecipe.image,
          readyInMinutes: apiRecipe.readyInMinutes,
          servings: apiRecipe.servings,
          summary: apiRecipe.summary || '',
          ingredients: apiRecipe.extendedIngredients?.map(ing => ({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit
          })) || [],
          instructions: apiRecipe.analyzedInstructions?.[0]?.steps?.map(step => ({
            number: step.number,
            step: step.step
          })) || [],
          nutrition: {
            calories: apiRecipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
            protein: apiRecipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount.toFixed(1) + 'g' || '0g',
            carbs: apiRecipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount.toFixed(1) + 'g' || '0g',
            fat: apiRecipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount.toFixed(1) + 'g' || '0g'
          },
          spoonacularScore: apiRecipe.spoonacularScore
        };
        
        setRecipe(transformedRecipe);
      } catch (error) {
        console.error('Error fetching recipe from API:', error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const addToFavorites = () => {
    if (!recipe) return;
    
    const favorites = JSON.parse(localStorage.getItem('cookmate-favorites') || '[]');
    const isAlreadyFavorite = favorites.some((fav: Recipe) => fav.id === recipe.id);
    
    if (!isAlreadyFavorite) {
      favorites.push(recipe);
      localStorage.setItem('cookmate-favorites', JSON.stringify(favorites));
      alert('Recipe added to favorites!');
    } else {
      alert('Recipe is already in favorites!');
    }
  };

  const addToShoppingList = () => {
    if (!recipe) return;
    
    const shoppingList = JSON.parse(localStorage.getItem('cookmate-shopping-list') || '[]');
    
    recipe.ingredients.forEach(ingredient => {
      const existingItem = shoppingList.find((item: any) => item.name === ingredient.name);
      if (existingItem) {
        existingItem.amount += ingredient.amount;
      } else {
        shoppingList.push({
          id: Date.now() + Math.random(),
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeTitle: recipe.title
        });
      }
    });
    
    localStorage.setItem('cookmate-shopping-list', JSON.stringify(shoppingList));
    alert('Ingredients added to shopping list!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600 dark:text-gray-400">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Recipe not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The recipe you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-[#8F84C8] hover:bg-[#A39BDE] text-white py-2 px-4 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper>
      <div className="min-h-screen py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Recipe Header - 60% Purple */}
          <div className="bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="h-64 bg-gradient-to-br from-[#8F84C8] to-[#5A4A8B] flex items-center justify-center">
              <span className="text-[#FFFFFF] font-bold text-lg">Recipe Image</span>
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-[#FFFFFF] mb-4">
                {recipe.title}
              </h1>
              
              <p className="text-[#E3E0F8] opacity-90 mb-6">
                {recipe.summary}
              </p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6 text-sm text-[#E3E0F8]">
                  <span>⏱️ {recipe.readyInMinutes} minutes</span>
                  <span>👥 {recipe.servings} servings</span>
                  <span className="text-yellow-300">⭐ {(recipe.spoonacularScore / 20).toFixed(1)}</span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={addToFavorites}
                    className="bg-white text-[#8F84C8] hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold"
                  >
                    ❤️ Save
                  </button>
                  <button
                    onClick={addToShoppingList}
                    className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold"
                  >
                    🛒 Add to List
                  </button>
                  <Link
                    href={`/recipe/${recipeId}/cooking`}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors font-semibold flex items-center space-x-2"
                  >
                    <FiPlay className="w-4 h-4" />
                    <span>Start Cooking</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Content Tabs - 30% White */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {['ingredients', 'instructions', 'nutrition'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-[#8F84C8] text-[#8F84C8] bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'ingredients' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="flex items-center">
                        <span className="w-4 h-4 bg-[#8F84C8] rounded-full mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'instructions' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Instructions
                  </h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction) => (
                      <li key={instruction.number} className="flex">
                        <span className="bg-[#8F84C8] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0">
                          {instruction.number}
                        </span>
                        <p className="text-gray-700 pt-1">
                          {instruction.step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Nutrition Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#8F84C8] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {recipe.nutrition.calories}
                      </div>
                      <div className="text-sm text-white opacity-90">Calories</div>
                    </div>
                    <div className="bg-blue-500 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {recipe.nutrition.protein}
                      </div>
                      <div className="text-sm text-white opacity-90">Protein</div>
                    </div>
                    <div className="bg-green-500 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {recipe.nutrition.carbs}
                      </div>
                      <div className="text-sm text-white opacity-90">Carbs</div>
                    </div>
                    <div className="bg-purple-500 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {recipe.nutrition.fat}
                      </div>
                      <div className="text-sm text-white opacity-90">Fat</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
