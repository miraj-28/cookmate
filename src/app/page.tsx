'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-500/10 to-transparent rounded-b-full"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/10 to-transparent rounded-t-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-cream drop-shadow-2xl transform transition-all duration-500 hover:scale-105">
            Welcome to <span className="text-orange-300">CookMate</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-cream opacity-95 drop-shadow-lg font-light leading-relaxed">
            Discover amazing recipes, create shopping lists, and plan your meals effortlessly
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex rounded-full bg-white shadow-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Search recipes by ingredient, cuisine, or dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-orange-800 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-8 py-4 text-white font-semibold transition-colors"
              >
                🔍 Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Recipes - 30% White Background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-12 text-center">
            Featured Recipes
          </h2>
          
          {/* Vegetarian Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🥬</span>
              </div>
              <h3 className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">Vegetarian Delights</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-green-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vegRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-green-200 hover:border-green-400 relative">
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
                    <h3 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-green-600 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-medium">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-medium">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-green-500 font-semibold">
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
              <h3 className="text-3xl font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300">Non-Vegetarian Specials</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-red-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nonVegRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-red-200 hover:border-red-400 relative">
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
                    <h3 className="text-xl font-bold text-red-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-red-600 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-medium">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-medium">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-red-500 font-semibold">
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
              <h3 className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">Diet Special</h3>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-purple-500 text-xl">✨</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dietRecipes.map((recipe) => (
                <div key={recipe.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 border-purple-200 hover:border-purple-400 relative">
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
                    <h3 className="text-xl font-bold text-purple-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-purple-600 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-lg">⏱️</span>
                        <span className="font-medium">{recipe.cookTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-lg">📊</span>
                        <span className="font-medium">{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center gap-1 text-purple-500 font-semibold">
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

      {/* Features Section - 60% Orange Background */}
      <section className="bg-orange-500 dark:bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            FAQ
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-orange-600 mb-2">Smart Search</h3>
              <p className="text-orange-500">Find recipes by ingredients, cuisine, or dietary preferences</p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-orange-600 mb-2">Save Favorites</h3>
              <p className="text-orange-500">Bookmark your favorite recipes for quick access</p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-orange-600 mb-2">Shopping Lists</h3>
              <p className="text-orange-500">Auto-generate grocery lists from your selected recipes</p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-orange-600 mb-2">Mobile Friendly</h3>
              <p className="text-orange-500">Cook with ease on any device, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">CookMate</h3>
              <p className="text-gray-300 mb-4">Your ultimate cooking companion for discovering recipes, planning meals, and creating shopping lists.</p>
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
              <h3 className="text-xl font-bold mb-4 text-orange-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Search Recipes</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Favorites</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Shopping List</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Vegetarian</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Non-Vegetarian</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Diet Special</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Quick Meals</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-400">Contact Us</h3>
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


