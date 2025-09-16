'use client';

import { useState, useEffect } from 'react';
import { FiHeart, FiClock, FiUsers, FiStar, FiTrash2, FiX } from 'react-icons/fi';

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('cookmate-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (recipeId: number) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    setFavorites(updatedFavorites);
    localStorage.setItem('cookmate-favorites', JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      localStorage.removeItem('cookmate-favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🔄</div>
          <p className="text-orange-600 font-medium">Loading your favorite recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FiHeart className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">
                My Favorite Recipes
              </h1>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="bg-white text-red-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold flex items-center space-x-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300">
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-2xl font-semibold text-orange-700 mb-4">
              No favorite recipes yet
            </h2>
            <p className="text-orange-600 mb-8 max-w-md mx-auto">
              Start exploring delicious Indian recipes and save your favorites to see them here!
            </p>
            <button
              onClick={() => window.location.href = '/search'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Discover Recipes
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-orange-600 font-medium">
                You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 border border-orange-200">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Recipe Image</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-orange-700">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {recipe.isVegetarian && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Veg
                          </span>
                        )}
                        {recipe.isNonVegetarian && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Non-Veg
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-orange-600 text-sm mb-4 line-clamp-2">
                      {recipe.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-orange-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{recipe.readyInMinutes} mins</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500">{(recipe.spoonacularScore / 20).toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.location.href = `/recipe/${recipe.id}`}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded-lg transition-all font-semibold shadow-md"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => removeFromFavorites(recipe.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-500 py-2 px-4 rounded-lg transition-all"
                        title="Remove from favorites"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
