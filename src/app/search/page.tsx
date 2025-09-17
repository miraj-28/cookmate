'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiClock, FiUsers, FiStar, FiHeart, FiFilter } from 'react-icons/fi';
import { spoonacularAPI, SpoonacularRecipe } from '@/lib/spoonacular';
import SectionWrapper from '@/components/SectionWrapper';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  spoonacularScore: number;
  isVegetarian?: boolean;
  isNonVegetarian?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  dietary?: string[];
  cuisine?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filter states
  const [cookingTime, setCookingTime] = useState<string>('any');
  const [difficulty, setDifficulty] = useState<string>('any');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string>('any');
  const [sortBy, setSortBy] = useState<string>('relevance');


  const searchRecipes = async (query: string) => {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    console.log('API Key available:', !!process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY);
    console.log('API Key length:', process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY?.length);
    
    setLoading(true);
    setError(null);
    
    try {
      let searchResults: Recipe[];
      
      try {
        // Search recipes from Spoonacular API
        console.log('Calling Spoonacular API...');
        const response = await spoonacularAPI.searchRecipes({
          query: query,
          number: 10,
          addRecipeInformation: true,
          addRecipeNutrition: false
        });
        
        console.log('Spoonacular API Response:', response);
        console.log('Response results:', response.results);
        console.log('Number of results:', response.results?.length);
        
        // Check if response is valid and has results
        if (!response || !response.results || !Array.isArray(response.results)) {
          console.log('Invalid API response structure, falling back to mock data');
          throw new Error('Invalid API response structure');
        }
        
        // Transform API recipes to match the Recipe interface
        searchResults = response.results.map(recipe => {
          const totalCookingTime = recipe.readyInMinutes;
          const difficultyLevel: 'easy' | 'medium' | 'hard' = 
            totalCookingTime < 30 ? 'easy' : 
            totalCookingTime < 60 ? 'medium' : 'hard';

          return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            summary: recipe.summary || '',
            spoonacularScore: recipe.spoonacularScore,
            isVegetarian: recipe.vegetarian,
            isNonVegetarian: !recipe.vegetarian,
            difficulty: difficultyLevel,
            dietary: recipe.diets || [],
            cuisine: recipe.cuisines?.[0] || 'International'
          } as Recipe;
        });
        
        console.log('Transformed search results:', searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Failed to search recipes');
        
        // Don't use fallback mock data - only use API
        searchResults = [];
      }
      
      setRecipes(searchResults);
      setFilteredRecipes(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (recipesToFilter: Recipe[]) => {
    let filtered = [...recipesToFilter];
    
    // Apply cooking time filter
    if (cookingTime !== 'any') {
      const maxTime = parseInt(cookingTime);
      filtered = filtered.filter(recipe => recipe.readyInMinutes <= maxTime);
    }
    
    // Apply difficulty filter
    if (difficulty !== 'any') {
      filtered = filtered.filter(recipe => recipe.difficulty === difficulty);
    }
    
    // Apply dietary restrictions filter
    if (dietaryRestrictions.length > 0) {
      filtered = filtered.filter(recipe => 
        dietaryRestrictions.some(restriction => 
          recipe.dietary?.includes(restriction) ||
          (restriction === 'vegetarian' && recipe.isVegetarian) ||
          (restriction === 'non-vegetarian' && recipe.isNonVegetarian)
        )
      );
    }
    
    // Apply cuisine filter
    if (cuisine !== 'any') {
      filtered = filtered.filter(recipe => recipe.cuisine === cuisine);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'time':
        filtered.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.spoonacularScore - a.spoonacularScore);
        break;
      case 'difficulty':
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty || 'medium'] - difficultyOrder[b.difficulty || 'medium']);
        break;
      default:
        // Keep original order for relevance
        break;
    }
    
    setFilteredRecipes(filtered);
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const clearFilters = () => {
    setCookingTime('any');
    setDifficulty('any');
    setDietaryRestrictions([]);
    setCuisine('any');
    setSortBy('relevance');
  };

  useEffect(() => {
    applyFilters(recipes);
  }, [cookingTime, difficulty, dietaryRestrictions, cuisine, sortBy, recipes]);

  useEffect(() => {
    if (searchQuery) {
      searchRecipes(searchQuery);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRecipes(searchQuery);
  };

  const addToFavorites = (recipe: Recipe) => {
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

  return (
    <SectionWrapper>
      <div className="min-h-screen py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header - 30% Purple */}
          <div className="mb-8 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-6">
              Search Recipes
            </h1>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
              <div className="flex rounded-lg bg-white shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search recipes by ingredient, cuisine, or dish name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-[#8F84C8] placeholder:text-[black] placeholder:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#8F84C8] focus:border-[#8F84C8]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] disabled:opacity-60 px-6 py-3 text-white font-semibold transition-colors"
                >
                  {loading ? '🔄' : '🔍'} Search
                </button>
              </div>
            </form>
            
            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center space-x-2 bg-white text-[#8F84C8] px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>
            
            {/* Active Filters Display */}
            {(cookingTime !== 'any' || difficulty !== 'any' || dietaryRestrictions.length > 0 || cuisine !== 'any' || sortBy !== 'relevance') && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {cookingTime !== 'any' && (
                  <span className="bg-purple-100 text-[#5A4A8B] px-3 py-1 rounded-full text-sm">
                    ⏱️ ≤ {cookingTime} min
                  </span>
                )}
                {difficulty !== 'any' && (
                  <span className="bg-purple-100 text-[#5A4A8B] px-3 py-1 rounded-full text-sm">
                    📊 {difficulty}
                  </span>
                )}
                {dietaryRestrictions.map(restriction => (
                  <span key={restriction} className="bg-purple-100 text-[#5A4A8B] px-3 py-1 rounded-full text-sm">
                    🥗 {restriction}
                  </span>
                ))}
                {cuisine !== 'any' && (
                  <span className="bg-purple-100 text-[#5A4A8B] px-3 py-1 rounded-full text-sm">
                    🌍 {cuisine}
                  </span>
                )}
                {sortBy !== 'relevance' && (
                  <span className="bg-purple-100 text-[#5A4A8B] px-3 py-1 rounded-full text-sm">
                    📈 Sort by {sortBy}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-200"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-purple-200">
              <h3 className="text-lg font-semibold text-[#5A4A8B] mb-4">Advanced Filters</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cooking Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏱️ Cooking Time
                  </label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-[#8F84C8] focus:border-[#8F84C8]"
                  >
                    <option value="any">Any time</option>
                    <option value="15">≤ 15 minutes</option>
                    <option value="30">≤ 30 minutes</option>
                    <option value="60">≤ 1 hour</option>
                    <option value="120">≤ 2 hours</option>
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📊 Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-[#8F84C8] focus:border-[#8F84C8]"
                  >
                    <option value="any">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                {/* Cuisine Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌍 Cuisine
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-[#8F84C8] focus:border-[#8F84C8]"
                  >
                    <option value="any">Any cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Asian">Asian</option>
                    <option value="American">American</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </select>
                </div>
                
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📈 Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-[#8F84C8] focus:border-[#8F84C8]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="time">Cooking Time</option>
                    <option value="rating">Rating</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </div>
              </div>
              
              {/* Dietary Restrictions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🥗 Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-3">
                  {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'non-vegetarian'].map(restriction => (
                    <button
                      key={restriction}
                      onClick={() => toggleDietaryRestriction(restriction)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        dietaryRestrictions.includes(restriction)
                          ? 'bg-[#8F84C8] text-white border-[#8F84C8]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
                      }`}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔄</div>
              <p className="text-[#8F84C8]">Searching for delicious recipes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-purple-50 border border-purple-300 text-[#5A4A8B] px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && recipes.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-[#5A4A8B] mb-6">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 border border-purple-200">
                    <div className="h-48 bg-gradient-to-br from-[#A39BDE] to-[#5A4A8B] flex items-center justify-center">
                      <span className="text-white font-semibold">Recipe Image</span>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#5A4A8B] mb-2">
                        {recipe.title}
                      </h3>
                      
                      <p className="text-[#8F84C8] text-sm mb-4 line-clamp-2">
                        {recipe.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-[#8F84C8] mb-4">
                        <span>⏱️ {recipe.readyInMinutes} mins</span>
                        <span>👥 {recipe.servings} servings</span>
                        <span className="text-yellow-500">⭐ {(recipe.spoonacularScore / 20).toFixed(1)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.location.href = `/recipe/${recipe.id}`}
                          className="flex-1 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                        >
                          View Recipe
                        </button>
                        <button
                          onClick={() => addToFavorites(recipe)}
                          className="bg-purple-100 hover:bg-purple-200 text-[#5A4A8B] py-2 px-4 rounded-lg transition-colors"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && searchQuery && recipes.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#5A4A8B] mb-2">
                No recipes found
              </h3>
              <p className="text-[#8F84C8]">
                Try searching with different keywords or ingredients
              </p>
            </div>
          )}

          {/* Search Tips */}
          {!searchQuery && (
            <div className="bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Search Tips
            </h3>
            <ul className="text-white space-y-2">
                <li>• Try searching by main ingredient (e.g., "chicken", "pasta")</li>
                <li>• Search by cuisine type (e.g., "Italian", "Mexican")</li>
                <li>• Look for specific dishes (e.g., "tacos", "soup")</li>
                <li>• Use dietary terms (e.g., "vegetarian", "gluten-free")</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
