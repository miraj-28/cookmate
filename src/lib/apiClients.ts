// Unified Recipe Search Service with Spoonacular API only

import { spoonacularAPI, SpoonacularRecipe, SearchParams } from './spoonacular';

// Unified recipe interface that matches Spoonacular format
export interface UnifiedRecipe {
  id: string | number;
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
  ingredients?: string[];
  instructions?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
  source: 'spoonacular';
}

export interface SearchResult {
  results: UnifiedRecipe[];
  totalResults: number;
  message?: string;
}

class UnifiedRecipeService {
  private minimumResultsThreshold = 3; // Minimum results before triggering additional search

  async searchRecipes(query: string, cuisine: string = 'Indian'): Promise<SearchResult> {
    try {
      console.log('Starting unified recipe search for:', query);
      
      // Step 1: Try Spoonacular API first
      const spoonacularResults = await this.trySpoonacularSearch(query, cuisine);
      
      // Step 2: Check if we need additional search
      if (this.needsAdditionalSearch(spoonacularResults)) {
        console.log('Spoonacular results insufficient, triggering additional search');
        const additionalResults = await this.tryAdditionalSpoonacularSearch(query, cuisine);
        
        // Combine results (prioritize initial search, add additional recipes)
        const combinedResults = [
          ...spoonacularResults.results,
          ...additionalResults.results
        ];
        
        return {
          results: combinedResults,
          totalResults: combinedResults.length,
          message: `Found ${spoonacularResults.results.length} recipes from initial search and ${additionalResults.results.length} additional recipes for better variety.`
        };
      }
      
      return {
        results: spoonacularResults.results,
        totalResults: spoonacularResults.totalResults,
        message: ''
      };
      
    } catch (error) {
      console.error('Unified search failed:', error);
      
      // Step 3: If everything fails, return empty results
      return {
        results: [],
        totalResults: 0,
        message: 'No recipes found. Please try a different search term.'
      };
    }
  }

  private async trySpoonacularSearch(query: string, cuisine: string): Promise<SearchResult> {
    try {
      console.log('Attempting Spoonacular search...');
      
      const searchParams: SearchParams = {
        query: query,
        cuisine: cuisine,
        number: 10,
        addRecipeInformation: true,
        addRecipeNutrition: false
      };

      const response = await spoonacularAPI.searchRecipes(searchParams);
      
      if (!response || !response.results || !Array.isArray(response.results)) {
        console.log('Invalid Spoonacular response structure');
        return { results: [], totalResults: 0, message: '' };
      }

      const transformedResults: UnifiedRecipe[] = response.results.map(recipe => 
        this.transformSpoonacularRecipe(recipe)
      );

      console.log(`Spoonacular returned ${transformedResults.length} recipes`);
      
      return {
        results: transformedResults,
        totalResults: response.totalResults,
        message: ''
      };
      
    } catch (error) {
      console.error('Spoonacular search failed:', error);
      return { results: [], totalResults: 0, message: '' };
    }
  }

  private async tryAdditionalSpoonacularSearch(query: string, cuisine: string): Promise<SearchResult> {
    try {
      console.log('Attempting additional Spoonacular search...');
      
      const searchParams: SearchParams = {
        query: query,
        cuisine: cuisine,
        number: 10,
        offset: 10,
        addRecipeInformation: true,
        addRecipeNutrition: false
      };

      const response = await spoonacularAPI.searchRecipes(searchParams);
      
      if (!response || !response.results || !Array.isArray(response.results)) {
        console.log('Invalid Spoonacular response structure');
        return { results: [], totalResults: 0, message: '' };
      }

      const transformedResults: UnifiedRecipe[] = response.results.map(recipe => 
        this.transformSpoonacularRecipe(recipe)
      );

      console.log(`Additional Spoonacular search returned ${transformedResults.length} recipes`);
      
      return {
        results: transformedResults,
        totalResults: response.totalResults,
        message: ''
      };
      
    } catch (error) {
      console.error('Additional Spoonacular search failed:', error);
      return { results: [], totalResults: 0, message: '' };
    }
  }

  private needsAdditionalSearch(spoonacularResult: SearchResult): boolean {
    // Trigger additional search if:
    // 1. No results at all
    // 2. Very few results (below threshold)
    const resultCount = spoonacularResult.results.length;
    
    if (resultCount === 0) {
      console.log('Additional search needed: No Spoonacular results');
      return true;
    }
    
    if (resultCount < this.minimumResultsThreshold) {
      console.log(`Additional search needed: Only ${resultCount} Spoonacular results (threshold: ${this.minimumResultsThreshold})`);
      return true;
    }
    
    return false;
  }

  private transformSpoonacularRecipe(recipe: SpoonacularRecipe): UnifiedRecipe {
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
      cuisine: recipe.cuisines?.[0] || 'International',
      ingredients: recipe.extendedIngredients?.map(ing => ing.original) || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || [],
      source: 'spoonacular'
    };
  }
}

// Create and export a singleton instance
export const recipeService = new UnifiedRecipeService();