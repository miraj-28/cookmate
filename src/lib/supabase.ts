import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  // Create real Supabase client if environment variables are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock Supabase client for development without real configuration
  console.warn('Supabase environment variables not found. Using mock client for development.');
  supabase = {
    auth: {
      resetPasswordForEmail: async () => ({ error: null }),
      signIn: async () => ({ error: 'Mock auth - not configured' }),
      signUp: async () => ({ error: 'Mock auth - not configured' }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          data: [],
          error: null
        })
      }),
      insert: () => ({
        data: null,
        error: 'Mock database - not configured'
      }),
      update: () => ({
        data: null,
        error: 'Mock database - not configured'
      }),
      delete: () => ({
        data: null,
        error: 'Mock database - not configured'
      })
    })
  };
}

export { supabase };

// Mock recipes data for search functionality
export const mockRecipes = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    description: "Creamy and rich paneer curry in a tomato-based gravy, perfect with naan or rice",
    ingredients: ["250g paneer", "2 cups tomato puree", "1 cup cream", "2 tbsp butter"],
    instructions: ["Heat butter", "Add paneer", "Simmer for 10 minutes"],
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    user_id: "demo-user",
    category: "vegetarian"
  },
  {
    id: 2,
    title: "Chicken Biryani",
    description: "Fragrant basmati rice layered with marinated chicken and aromatic spices",
    ingredients: ["500g chicken", "2 cups rice", "1 cup yogurt", "Biryani spices"],
    instructions: ["Marinate chicken", "Cook rice", "Layer and dum cook"],
    prep_time: 30,
    cook_time: 60,
    servings: 6,
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
    user_id: "demo-user",
    category: "non-vegetarian"
  },
  {
    id: 3,
    title: "Chana Masala",
    description: "Spicy and tangy chickpea curry with authentic Indian spices",
    ingredients: ["2 cans chickpeas", "2 onions", "tomatoes", "spices"],
    instructions: ["Sauté onions", "Add tomatoes", "Add chickpeas and simmer"],
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    user_id: "demo-user",
    category: "vegetarian"
  }
];
