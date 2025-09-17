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
          <p className="text-[#8F84C8] font-medium">Loading your favorite recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-lg p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FiHeart className="w-8 h-8 text-[#FFFFFF]" />
              <h1 className="text-3xl font-bold text-[#FFFFFF]">
                My Favorite Recipes
              </h1>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="bg-white text-[#8F84C8] hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors font-semibold flex items-center space-x-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300">
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-2xl font-semibold text-[#8F84C8] mb-4">
              No favorite recipes yet
            </h2>
            <p className="text-[#8F84C8] mb-8 max-w-md mx-auto">
              Start exploring delicious Indian recipes and save your favorites to see them here!
            </p>
            <button
              onClick={() => window.location.href = '/search'}
              className="bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] text-[#FFFFFF] py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Discover Recipes
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#8F84C8] font-medium">
                You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 border border-purple-200">
                  <div className="h-48 bg-gradient-to-br from-[#A39BDE] to-[#5A4A8B] flex items-center justify-center">
                    <span className="text-[#FFFFFF] font-semibold text-lg">Recipe Image</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[#8F84C8]">
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
                    
                    <p className="text-[#8F84C8] text-sm mb-4 line-clamp-2">
                      {recipe.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-[#8F84C8] mb-4">
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
                        className="flex-1 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] text-[#FFFFFF] py-2 px-4 rounded-lg transition-all font-semibold shadow-md"
                      >
                        View Recipe
                      </button>
                      <button
                        onClick={() => removeFromFavorites(recipe.id)}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-500 py-2 px-4 rounded-lg transition-all"
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
