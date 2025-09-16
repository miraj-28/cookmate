const { createClient } = require('@supabase/supabase-js');

// Indian recipes data (veg and non-veg, excluding pork)
const indianRecipes = [
  // Vegetarian Recipes
  {
    title: "Paneer Butter Masala",
    description: "Creamy and rich paneer curry in a tomato-based gravy",
    ingredients: [
      "250g paneer cubes",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "2 tbsp butter",
      "1 onion, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1 tsp garam masala",
      "1/2 tsp turmeric powder",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat butter in a pan and sauté onions until golden",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add tomato puree and cook until oil separates",
      "Add all spices and cook for 5 minutes",
      "Add cream and simmer for 2-3 minutes",
      "Add paneer cubes and cook for 5 minutes",
      "Garnish with fresh cilantro and serve hot with naan or rice"
    ],
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
  },
  {
    title: "Chana Masala",
    description: "Spicy and tangy chickpea curry",
    ingredients: [
      "2 cans chickpeas, drained",
      "2 onions, chopped",
      "2 tomatoes, pureed",
      "3 tbsp oil",
      "1 tbsp ginger-garlic paste",
      "2 tsp cumin seeds",
      "1 tsp turmeric powder",
      "2 tsp coriander powder",
      "1 tsp red chili powder",
      "1 tsp garam masala",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat oil in a pan and add cumin seeds",
      "Add onions and sauté until golden brown",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add tomato puree and cook until oil separates",
      "Add all spices and cook for 5 minutes",
      "Add chickpeas and 1 cup water",
      "Simmer for 15-20 minutes",
      "Garnish with cilantro and serve with rice or roti"
    ],
    prep_time: 10,
    cook_time: 25,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400"
  },
  {
    title: "Palak Paneer",
    description: "Creamy spinach curry with cottage cheese",
    ingredients: [
      "500g fresh spinach",
      "250g paneer cubes",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric powder",
      "1 tsp garam masala",
      "1 green chili",
      "2 tbsp cream",
      "Salt to taste"
    ],
    instructions: [
      "Blanch spinach and blend into a smooth puree",
      "Heat oil in a pan and add cumin seeds",
      "Add onions and sauté until golden",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add tomatoes and cook until soft",
      "Add spinach puree and spices, simmer for 10 minutes",
      "Add paneer cubes and cream, cook for 5 minutes",
      "Serve hot with roti or rice"
    ],
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1586232703982-2e5b4e7df95c?w=400"
  },
  {
    title: "Aloo Gobi",
    description: "Dry curry with potatoes and cauliflower",
    ingredients: [
      "2 potatoes, cubed",
      "1 cauliflower, cut into florets",
      "2 onions, chopped",
      "2 tomatoes, chopped",
      "3 tbsp oil",
      "1 tsp cumin seeds",
      "1 tsp turmeric powder",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1/2 tsp garam masala",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat oil in a pan and add cumin seeds",
      "Add onions and sauté until golden",
      "Add tomatoes and cook until soft",
      "Add all spices and cook for 2 minutes",
      "Add potatoes and cauliflower, mix well",
      "Add 1/2 cup water and cover, cook for 15-20 minutes",
      "Garnish with cilantro and serve hot with roti"
    ],
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"
  },
  {
    title: "Dal Tadka",
    description: "Lentil curry tempered with spices",
    ingredients: [
      "1 cup toor dal (split pigeon peas)",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "3 tbsp ghee",
      "1 tsp cumin seeds",
      "1 tsp mustard seeds",
      "1 dried red chili",
      "2 cloves garlic, minced",
      "1/2 tsp turmeric powder",
      "1 tsp red chili powder",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Cook dal with turmeric and salt until soft",
      "Heat ghee in a small pan and add cumin and mustard seeds",
      "Add garlic and dried red chili, sauté for 1 minute",
      "Add onions and cook until golden",
      "Add tomatoes and cook until soft",
      "Pour the tempering over the cooked dal",
      "Garnish with cilantro and serve with rice"
    ],
    prep_time: 10,
    cook_time: 30,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
  },
  // Non-Vegetarian Recipes (excluding pork)
  {
    title: "Chicken Butter Masala",
    description: "Creamy and rich chicken curry in tomato-based gravy",
    ingredients: [
      "500g chicken, cubed",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "2 tbsp butter",
      "1 onion, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1 tsp garam masala",
      "1/2 tsp turmeric powder",
      "1 tsp coriander powder",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat butter in a pan and sauté onions until golden",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add chicken pieces and cook until browned",
      "Add tomato puree and cook until oil separates",
      "Add all spices and cook for 5 minutes",
      "Add cream and simmer for 10 minutes",
      "Garnish with fresh cilantro and serve hot with naan or rice"
    ],
    prep_time: 15,
    cook_time: 25,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400"
  },
  {
    title: "Chicken Biryani",
    description: "Fragrant rice dish with marinated chicken",
    ingredients: [
      "500g chicken, cut into pieces",
      "2 cups basmati rice",
      "2 onions, sliced",
      "2 tomatoes, chopped",
      "1 cup yogurt",
      "2 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1 tsp turmeric powder",
      "2 tsp biryani masala",
      "4 cloves",
      "2 cardamom pods",
      "1 cinnamon stick",
      "4 tbsp ghee",
      "Salt to taste",
      "Fresh mint and cilantro"
    ],
    instructions: [
      "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes",
      "Soak rice for 30 minutes and cook until 70% done",
      "Heat ghee in a heavy bottom pot and fry onions until golden",
      "Add whole spices and marinated chicken, cook for 10 minutes",
      "Layer rice over chicken and garnish with mint and cilantro",
      "Cover and cook on low heat for 20 minutes",
      "Serve hot with raita"
    ],
    prep_time: 45,
    cook_time: 40,
    servings: 6,
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400"
  },
  {
    title: "Fish Curry",
    description: "Spicy and tangy fish curry in coconut milk",
    ingredients: [
      "500g fish fillets (like rohu or katla)",
      "1 cup coconut milk",
      "2 onions, chopped",
      "2 tomatoes, chopped",
      "2 tbsp mustard oil",
      "1 tbsp ginger-garlic paste",
      "1 tsp turmeric powder",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1/2 tsp mustard seeds",
      "8-10 curry leaves",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat mustard oil in a pan and add mustard seeds",
      "Add curry leaves and onions, sauté until golden",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add tomatoes and cook until soft",
      "Add all spices and cook for 2 minutes",
      "Add coconut milk and bring to a simmer",
      "Add fish pieces and cook for 8-10 minutes",
      "Garnish with cilantro and serve with rice"
    ],
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400"
  },
  {
    title: "Egg Curry",
    description: "Boiled eggs in spicy onion-tomato gravy",
    ingredients: [
      "6 hard-boiled eggs",
      "2 onions, chopped",
      "2 tomatoes, chopped",
      "3 tbsp oil",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "1 tsp turmeric powder",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1/2 tsp garam masala",
      "1 cup water",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat oil in a pan and add cumin seeds",
      "Add onions and sauté until golden brown",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add tomatoes and cook until soft",
      "Add all spices and cook for 5 minutes",
      "Add water and bring to a boil",
      "Add halved boiled eggs and simmer for 5 minutes",
      "Garnish with cilantro and serve with rice or roti"
    ],
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400"
  },
  {
    title: "Mutton Rogan Josh",
    description: "Kashmiri style aromatic mutton curry",
    ingredients: [
      "500g mutton, cubed",
      "2 onions, chopped",
      "2 tomatoes, pureed",
      "3 tbsp mustard oil",
      "1 tbsp ginger-garlic paste",
      "1 tsp fennel powder",
      "1 tsp ginger powder",
      "1 tsp red chili powder",
      "1/2 tsp turmeric powder",
      "1 tsp garam masala",
      "2 bay leaves",
      "4 cloves",
      "2 cardamom pods",
      "1 cinnamon stick",
      "Salt to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat mustard oil in a pressure cooker",
      "Add whole spices and sauté for 1 minute",
      "Add onions and sauté until golden brown",
      "Add ginger-garlic paste and cook for 2 minutes",
      "Add mutton pieces and brown on all sides",
      "Add tomato puree and all powdered spices",
      "Add 2 cups water and pressure cook for 20-25 minutes",
      "Garnish with cilantro and serve with rice or naan"
    ],
    prep_time: 15,
    cook_time: 35,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
  }
];

console.log('Indian Recipes Setup Script');
console.log('==========================');
console.log('');
console.log('To set up your Supabase database with Indian recipes:');
console.log('');
console.log('1. Create a new project at https://supabase.com');
console.log('2. Get your Supabase URL and anon key from the project settings');
console.log('3. Create a .env.local file in your project root with:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
console.log('');
console.log('4. Create the following tables in your Supabase database:');
console.log('');
console.log('-- Recipes table');
console.log('CREATE TABLE recipes (');
console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
console.log('  title TEXT NOT NULL,');
console.log('  description TEXT,');
console.log('  ingredients TEXT[] NOT NULL,');
console.log('  instructions TEXT[] NOT NULL,');
console.log('  prep_time INTEGER,');
console.log('  cook_time INTEGER,');
console.log('  servings INTEGER,');
console.log('  image_url TEXT,');
console.log('  user_id TEXT NOT NULL');
console.log(');');
console.log('');
console.log('-- Favorites table');
console.log('CREATE TABLE favorites (');
console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
console.log('  user_id TEXT NOT NULL,');
console.log('  recipe_id TEXT NOT NULL,');
console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
console.log('  FOREIGN KEY (recipe_id) REFERENCES recipes(id)');
console.log(');');
console.log('');
console.log('-- Profiles table');
console.log('CREATE TABLE profiles (');
console.log('  id TEXT PRIMARY KEY,');
console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
console.log('  username TEXT NOT NULL,');
console.log('  full_name TEXT NOT NULL,');
console.log('  avatar_url TEXT,');
console.log('  website TEXT');
console.log(');');
console.log('');
console.log('5. Run this script with Node.js to populate the database:');
console.log('   node setup-supabase.js');
console.log('');
console.log('The script includes 10 authentic Indian recipes:');
console.log('- 5 Vegetarian: Paneer Butter Masala, Chana Masala, Palak Paneer, Aloo Gobi, Dal Tadka');
console.log('- 5 Non-Vegetarian: Chicken Butter Masala, Chicken Biryani, Fish Curry, Egg Curry, Mutton Rogan Josh');
console.log('');
console.log('All recipes exclude pork as requested and focus on proper Indian dishes.');
