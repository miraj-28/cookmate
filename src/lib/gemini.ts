// Google Gemini API Client for Recipe Generation

export interface GeminiRecipe {
  id: string;
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
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
}

class GeminiAPI {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async generateContent(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  async generateRecipe(query: string, cuisine: string = 'Indian'): Promise<GeminiRecipe> {
    // Special handling for specific Indian dishes
    const isPavBhaji = query.toLowerCase().includes('pav bhaji');
    const isIndianDish = cuisine.toLowerCase() === 'indian' || 
                         query.toLowerCase().match(/curry|masala|biryani|tikka|samosa|naan|dal|paneer|pav|bhaji|chole|butter|chicken/);
    
    let prompt = '';
    
    if (isPavBhaji) {
      prompt = `
Generate an authentic Pav Bhaji recipe with traditional Indian ingredients and cooking methods.

Pav Bhaji is a popular Mumbai street food dish consisting of a spiced vegetable mash (bhaji) served with buttered bread rolls (pav).

Please provide the recipe in the following JSON format only:
{
  "title": "Authentic Mumbai Pav Bhaji",
  "summary": "A spicy and flavorful vegetable mash served with buttered pav, a popular Mumbai street food",
  "servings": 4,
  "readyInMinutes": 45,
  "difficulty": "medium",
  "cuisine": "Indian",
  "isVegetarian": true,
  "ingredients": [
    "2 cups boiled and mashed potatoes",
    "1 cup cauliflower florets, boiled and mashed",
    "1/2 cup green peas, boiled",
    "1 large onion, finely chopped",
    "2 tomatoes, pureed",
    "2 tbsp pav bhaji masala",
    "1 tsp red chili powder",
    "1/2 tsp turmeric powder",
    "2 tbsp butter",
    "2 tbsp oil",
    "Salt to taste",
    "4 pav bread rolls",
    "Fresh coriander leaves for garnish",
    "Lemon wedges",
    "Butter for serving"
  ],
  "instructions": [
    "Heat oil and butter in a large pan or kadhai",
    "Add chopped onions and sauté until golden brown",
    "Add tomato puree and cook until oil separates",
    "Add pav bhaji masala, red chili powder, and turmeric powder, cook for 2 minutes",
    "Add mashed potatoes, cauliflower, and green peas, mix well",
    "Add 1 cup water and cook for 10-15 minutes, mashing the vegetables",
    "Season with salt and adjust spices as needed",
    "Mash the bhaji until smooth but with some texture",
    "Toast pav with butter on a griddle until golden",
    "Serve hot bhaji garnished with coriander, lemon wedges, and extra butter"
  ],
  "nutrition": {
    "calories": 380,
    "protein": 12,
    "carbohydrates": 45,
    "fat": 18
  }
}

Make sure the recipe is authentic and includes traditional pav bhaji ingredients like pav bhaji masala, potatoes, cauliflower, and peas.
Return only valid JSON, no additional text or explanations.
`;
    } else if (isIndianDish) {
      prompt = `
Generate an authentic Indian recipe for "${query}" with traditional ingredients and cooking methods.

Please provide the recipe in the following JSON format only:
{
  "title": "Authentic Indian ${query}",
  "summary": "Traditional Indian dish with authentic spices and cooking techniques",
  "servings": 4,
  "readyInMinutes": ${Math.floor(Math.random() * 30) + 30},
  "difficulty": "${['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]}",
  "cuisine": "Indian",
  "isVegetarian": ${Math.random() > 0.5},
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", "ingredient 3 with quantity"],
  "instructions": ["step 1 with details", "step 2 with details", "step 3 with details"],
  "nutrition": {
    "calories": ${Math.floor(Math.random() * 200) + 250},
    "protein": ${Math.floor(Math.random() * 20) + 10},
    "carbohydrates": ${Math.floor(Math.random() * 30) + 20},
    "fat": ${Math.floor(Math.random() * 15) + 5}
  }
}

Important: Use authentic Indian spices like cumin, coriander, turmeric, garam masala, and traditional cooking methods.
Include specific quantities for ingredients and detailed cooking steps.
Make sure the recipe is genuinely Indian and not a generic international dish.
Return only valid JSON, no additional text or explanations.
`;
    } else {
      prompt = `
Generate a complete recipe for "${query}" with ${cuisine} cuisine. 

Please provide the recipe in the following JSON format only:
{
  "title": "Recipe Title",
  "summary": "Brief description of the dish",
  "servings": 4,
  "readyInMinutes": 30,
  "difficulty": "easy|medium|hard",
  "cuisine": "${cuisine}",
  "isVegetarian": true/false,
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
  "instructions": ["step 1", "step 2", "step 3"],
  "nutrition": {
    "calories": 300,
    "protein": 15,
    "carbohydrates": 25,
    "fat": 12
  }
}

Make sure the recipe is authentic to ${cuisine} cuisine and includes common ingredients and cooking methods. 
The instructions should be clear and step-by-step.
Return only valid JSON, no additional text or explanations.
`;
    }
    
    try {
      const response = await this.generateContent(prompt);
      
      // Clean the response to ensure it's valid JSON
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let recipeData;
      try {
        recipeData = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', cleanResponse);
        throw new Error('Failed to parse recipe data from Gemini');
      }

      // Transform to match our interface
      const recipe: GeminiRecipe = {
        id: `gemini-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: recipeData.title || query,
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=300&fit=crop`,
        readyInMinutes: recipeData.readyInMinutes || 30,
        servings: recipeData.servings || 4,
        summary: recipeData.summary || `Delicious ${query} recipe`,
        spoonacularScore: 85, // Default score for AI-generated recipes
        isVegetarian: recipeData.isVegetarian || false,
        isNonVegetarian: !recipeData.isVegetarian,
        difficulty: recipeData.difficulty || 'medium',
        dietary: recipeData.isVegetarian ? ['vegetarian'] : [],
        cuisine: recipeData.cuisine || cuisine,
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
        nutrition: recipeData.nutrition
      };

      return recipe;
    } catch (error) {
      console.error('Error generating recipe with Gemini:', error);
      throw error;
    }
  }

  async generateMultipleRecipes(query: string, count: number = 3, cuisine: string = 'Indian'): Promise<GeminiRecipe[]> {
    const recipes: GeminiRecipe[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const recipe = await this.generateRecipe(query, cuisine);
        recipes.push(recipe);
      } catch (error) {
        console.error(`Failed to generate recipe ${i + 1}:`, error);
        // Continue with other recipes even if one fails
      }
    }
    
    return recipes;
  }
}

// Create and export a singleton instance
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
export const geminiAPI = new GeminiAPI(GEMINI_API_KEY);