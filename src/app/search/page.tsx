'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiClock, FiUsers, FiStar, FiHeart, FiFilter } from 'react-icons/fi';

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
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock Indian recipe data
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      title: "Paneer Butter Masala",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      readyInMinutes: 35,
      servings: 4,
      summary: "Creamy and rich paneer curry in a tomato-based gravy, perfect with naan or rice",
      spoonacularScore: 95,
      isVegetarian: true
    },
    {
      id: 2,
      title: "Chicken Biryani",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
      readyInMinutes: 90,
      servings: 6,
      summary: "Fragrant basmati rice layered with marinated chicken and aromatic spices",
      spoonacularScore: 98,
      isNonVegetarian: true
    },
    {
      id: 3,
      title: "Chana Masala",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
      readyInMinutes: 30,
      servings: 4,
      summary: "Spicy and tangy chickpea curry with authentic Indian spices",
      spoonacularScore: 92,
      isVegetarian: true
    },
    {
      id: 4,
      title: "Fish Curry",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
      readyInMinutes: 35,
      servings: 4,
      summary: "Spicy fish curry in coconut milk base with traditional South Indian flavors",
      spoonacularScore: 89,
      isNonVegetarian: true
    },
    {
      id: 5,
      title: "Palak Paneer",
      image: "https://images.unsplash.com/photo-1586232703982-2e5b4e7df95c?w=400",
      readyInMinutes: 30,
      servings: 4,
      summary: "Creamy spinach curry with soft paneer cubes, a North Indian delicacy",
      spoonacularScore: 94,
      isVegetarian: true
    },
    {
      id: 6,
      title: "Mutton Rogan Josh",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      readyInMinutes: 60,
      servings: 4,
      summary: "Kashmiri style aromatic mutton curry with tender meat in rich gravy",
      spoonacularScore: 96,
      isNonVegetarian: true
    }
  ];

  const searchRecipes = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock recipes based on search query
      const filteredRecipes = mockRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.summary.toLowerCase().includes(query.toLowerCase())
      );
      
      setRecipes(filteredRecipes);
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header - 30% White */}
        <div className="mb-8 bg-orange-500 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Search Recipes
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex rounded-lg bg-white shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search recipes by ingredient, cuisine, or dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 px-6 py-3 text-white font-semibold transition-colors"
              >
                {loading ? '🔄' : '🔍'} Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔄</div>
            <p className="text-orange-600">Searching for delicious recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-orange-50 border border-orange-300 text-orange-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && recipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-orange-600 mb-6">
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} for "{searchQuery}"
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 border border-orange-200">
                  <div className="h-48 bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold">Recipe Image</span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-orange-700 mb-2">
                      {recipe.title}
                    </h3>
                    
                    <p className="text-orange-600 text-sm mb-4 line-clamp-2">
                      {recipe.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-orange-600 mb-4">
                      <span>⏱️ {recipe.readyInMinutes} mins</span>
                      <span>👥 {recipe.servings} servings</span>
                      <span className="text-orange-500">⭐ {(recipe.spoonacularScore / 20).toFixed(1)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.location.href = `/recipe/${recipe.id}`}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => addToFavorites(recipe)}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-500 py-2 px-4 rounded-lg transition-colors"
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
            <h3 className="text-xl font-semibold text-orange-600 mb-2">
              No recipes found
            </h3>
            <p className="text-orange-500">
              Try searching with different keywords or ingredients
            </p>
          </div>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <div className="bg-orange-500 rounded-lg p-6">
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
  );
}
