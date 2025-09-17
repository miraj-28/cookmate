// Spoonacular API Client
const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '';

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  summary?: string;
  readyInMinutes: number;
  servings: number;
  spoonacularScore: number;
  healthScore: number;
  cheap: boolean;
  dairyFree: boolean;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  weightWatcherSmartPoints: number;
  dishTypes: string[];
  cuisines: string[];
  diets: string[];
  occasions: string[];
  instructions?: string;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients?: Array<{
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }>;
      equipment?: Array<{
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }>;
    }>;
  }>;
  extendedIngredients?: Array<{
    id: number;
    aisle: string;
    image: string;
    name: string;
    original: string;
    originalName: string;
    amount: number;
    unit: string;
    unitShort: string;
    unitLong: string;
    meta: string[];
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }>;
  };
}

export interface SearchParams {
  query: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  equipment?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  instructionsRequired?: boolean;
  addRecipeInformation?: boolean;
  addRecipeNutrition?: boolean;
  fillIngredients?: boolean;
  maxReadyTime?: number;
  minServings?: number;
  maxServings?: number;
  number?: number;
  offset?: number;
}

export interface SearchResult {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

class SpoonacularAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key is not configured. Please add NEXT_PUBLIC_SPOONACULAR_API_KEY to your .env.local file.');
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('apiKey', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spoonacular API Error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  async searchRecipes(params: SearchParams): Promise<SearchResult> {
    const searchParams = {
      query: params.query,
      cuisine: params.cuisine,
      diet: params.diet,
      intolerances: params.intolerances,
      equipment: params.equipment,
      includeIngredients: params.includeIngredients,
      excludeIngredients: params.excludeIngredients,
      type: params.type,
      instructionsRequired: params.instructionsRequired,
      addRecipeInformation: true,
      addRecipeNutrition: params.addRecipeNutrition,
      fillIngredients: params.fillIngredients,
      maxReadyTime: params.maxReadyTime,
      minServings: params.minServings,
      maxServings: params.maxServings,
      number: params.number || 10,
      offset: params.offset || 0
    };

    return this.request<SearchResult>('/complexSearch', searchParams);
  }

  async getRecipeInformation(id: number, includeNutrition: boolean = false): Promise<SpoonacularRecipe> {
    return this.request<SpoonacularRecipe>(`/${id}/information`, {
      includeNutrition
    });
  }

  async getRandomRecipes(number: number = 10, tags?: string[]): Promise<SearchResult> {
    return this.request<SearchResult>('/random', {
      number,
      tags: tags?.join(',')
    });
  }

  async autocompleteRecipes(query: string, number: number = 10): Promise<Array<{
    id: number;
    title: string;
    image: string;
    imageType: string;
  }>> {
    return this.request<Array<{
      id: number;
      title: string;
      image: string;
      imageType: string;
    }>>('/autocomplete', {
      query,
      number
    });
  }

  async getSimilarRecipes(id: number, number: number = 10): Promise<Array<{
    id: number;
    title: string;
    image: string;
    imageType: string;
    readyInMinutes: number;
    servings: number;
  }>> {
    return this.request<Array<{
      id: number;
      title: string;
      image: string;
      imageType: string;
      readyInMinutes: number;
      servings: number;
    }>>(`/${id}/similar`, {
      number
    });
  }
}

// Create and export a singleton instance
export const spoonacularAPI = new SpoonacularAPI(API_KEY);