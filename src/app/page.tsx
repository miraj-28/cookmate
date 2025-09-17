'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  const featuredRecipes = [
    {
      id: 1,
      title: "Creamy Chicken Alfredo",
      image: "https://picsum.photos/seed/chicken-alfredo/400/300.jpg",
      cookTime: "30 mins",
      difficulty: "Easy",
      rating: 4.8,
      category: "non-veg",
      isVegetarian: false,
      isNonVegetarian: true
    },
    {
      id: 2,
      title: "Vegetarian Buddha Bowl",
      image: "https://picsum.photos/seed/buddha-bowl/400/300.jpg",
      cookTime: "25 mins",
      difficulty: "Medium",
      rating: 4.6,
      category: "veg",
      isVegetarian: true,
      isNonVegetarian: false
    },
    {
      id: 3,
      title: "Classic Beef Tacos",
      image: "https://picsum.photos/seed/beef-tacos/400/300.jpg",
      cookTime: "20 mins",
      difficulty: "Easy",
      rating: 4.9,
      category: "non-veg",
      isVegetarian: false,
      isNonVegetarian: true
    },
    {
      id: 4,
      title: "Paneer Butter Masala",
      image: "https://picsum.photos/seed/paneer-masala/400/300.jpg",
      cookTime: "35 mins",
      difficulty: "Medium",
      rating: 4.7,
      category: "veg",
      isVegetarian: true,
      isNonVegetarian: false
    },
    {
      id: 5,
      title: "Keto Avocado Salad",
      image: "https://picsum.photos/seed/avocado-salad/400/300.jpg",
      cookTime: "15 mins",
      difficulty: "Easy",
      rating: 4.5,
      category: "diet",
      isVegetarian: true,
      isNonVegetarian: false,
      dietType: "Keto"
    },
    {
      id: 6,
      title: "Grilled Salmon",
      image: "https://picsum.photos/seed/grilled-salmon/400/300.jpg",
      cookTime: "25 mins",
      difficulty: "Medium",
      rating: 4.8,
      category: "diet",
      isVegetarian: false,
      isNonVegetarian: true,
      dietType: "Low-Carb"
    },
    {
      id: 7,
      title: "Mushroom Risotto",
      image: "https://picsum.photos/seed/mushroom-risotto/400/300.jpg",
      cookTime: "40 mins",
      difficulty: "Medium",
      rating: 4.4,
      category: "veg",
      isVegetarian: true,
      isNonVegetarian: false
    },
    {
      id: 8,
      title: "BBQ Chicken Wings",
      image: "https://picsum.photos/seed/bbq-wings/400/300.jpg",
      cookTime: "45 mins",
      difficulty: "Medium",
      rating: 4.7,
      category: "non-veg",
      isVegetarian: false,
      isNonVegetarian: true
    },
    {
      id: 9,
      title: "Mediterranean Quinoa Bowl",
      image: "https://picsum.photos/seed/quinoa-bowl/400/300.jpg",
      cookTime: "20 mins",
      difficulty: "Easy",
      rating: 4.6,
      category: "diet",
      isVegetarian: true,
      isNonVegetarian: false,
      dietType: "Mediterranean"
    }
  ];

  // Filter recipes by category
  const vegRecipes = featuredRecipes.filter(recipe => recipe.category === "veg");
  const nonVegRecipes = featuredRecipes.filter(recipe => recipe.category === "non-veg");
  const dietRecipes = featuredRecipes.filter(recipe => recipe.category === "diet");

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Video */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          preload="auto"
        >
          <source src="/cmv.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Grey transparent blurry overlay */}
        <div className="absolute inset-0 bg-gray-900/20 backdrop-sm"></div>
        
        {/* Decorative curved elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#A39BDE]/20 to-transparent rounded-b-full"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#5A4A8B]/20 to-transparent rounded-t-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8F84C8]/20 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center py-6 sm:py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 text-white drop-shadow-lg transform transition-all duration-500 hover:scale-105">
            Welcome to <span className="text-[#E3E0F8]">CookMate</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white opacity-90 drop-shadow-md font-normal leading-relaxed max-w-2xl sm:max-w-3xl mx-auto px-4">
            Discover amazing recipes, create shopping lists, and plan your meals effortlessly
          </p>
        </div>
      </section>

      {/* Search Tips Section */}
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 dark:text-orange-400 text-xl">💡</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Search Tips</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">🔍</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Be Specific</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Search for specific ingredients like "chicken breast" or "basil"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">🌍</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Try Cuisines</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Search by cuisine type like "Italian" or "Thai"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">⏱️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Meals</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Add "quick" or "30 minutes" for fast recipes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">🥗</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Dietary Needs</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Include "vegetarian", "keto", or "gluten-free"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">🍳</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cooking Method</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Try "grilled", "baked", or "stir-fry"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8F84C8] text-lg mt-1">🎯</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Combine Terms</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Mix ingredients and cuisines for better results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              Featured Recipes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our hand-picked selection of delicious recipes from around the world
            </p>
          </div>
          
          {/* Vegetarian Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🥬</span>
              </div>
              <h3 className="text-3xl font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-300">Vegetarian Delights</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-green-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {vegRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 relative">
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={recipe.image} 
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                        <span className="text-green-600 text-lg">❤️</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute -top-4 left-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Popular
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-normal">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-normal">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                        <span className="text-lg">⭐</span>
                        <span>{recipe.rating}</span>
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm px-3 py-1 rounded-full font-medium border border-green-300 shadow-sm">
                        🥬 Vegetarian
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Non-Vegetarian Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🍖</span>
              </div>
              <h3 className="text-3xl font-semibold text-red-600 group-hover:text-red-700 transition-colors duration-300">Non-Vegetarian Specials</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-red-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonVegRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500 relative">
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={recipe.image} 
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                        <span className="text-red-600 text-lg">❤️</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute -top-4 left-6 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Popular
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-normal">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-normal">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-orange-500 font-semibold">
                        <span className="text-lg">⭐</span>
                        <span>{recipe.rating}</span>
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm px-3 py-1 rounded-full font-medium border border-red-300 shadow-sm">
                        🍖 Non-Vegetarian
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Diet Section */}
          <div>
            <div className="flex items-center mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🥗</span>
              </div>
              <h3 className="text-3xl font-semibold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">Diet Special</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-purple-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dietRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 relative">
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={recipe.image} 
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                        <span className="text-purple-600 text-lg">❤️</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute -top-4 left-6 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Popular
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-normal">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-normal">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-orange-500 font-semibold">
                        <span className="text-lg">⭐</span>
                        <span>{recipe.rating}</span>
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm px-3 py-1 rounded-full font-medium border border-purple-300 shadow-sm">
                        🥗 {recipe.dietType}
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>  
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-white mb-4">
              Why Choose CookMate?
            </h2>
            <p className="text-lg text-[#E3E0F8] max-w-2xl mx-auto">
              Everything you need to make cooking easier and more enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#5A4A8B] mb-3">Smart Search</h3>
              <p className="text-gray-600 font-normal">Find recipes by ingredients, cuisine, or dietary preferences</p>
            </div>
            
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-[#5A4A8B] mb-3">Save Favorites</h3>
              <p className="text-gray-600 font-normal">Bookmark your favorite recipes for quick access</p>
            </div>
            
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-[#5A4A8B] mb-3">Shopping Lists</h3>
              <p className="text-gray-600 font-normal">Auto-generate grocery lists from your selected recipes</p>
            </div>
            
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-[#5A4A8B] mb-3">Mobile Friendly</h3>
              <p className="text-gray-600 font-normal">Cook with ease on any device, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">CookMate</h3>
              <p className="text-gray-300 font-normal mb-4">Your ultimate cooking companion for discovering recipes, planning meals, and creating shopping lists.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <span className="text-xl">📱</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <span className="text-xl">🐦</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Search Recipes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Favorites</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Shopping List</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Vegetarian</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Non-Vegetarian</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Diet Special</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Quick Meals</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  support@cookmate.com
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  123 Kitchen Street, Food City
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 CookMate. All rights reserved. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
