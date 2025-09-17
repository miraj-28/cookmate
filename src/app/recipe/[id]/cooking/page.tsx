'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight, FiClock, FiCheck, FiX, FiHome } from 'react-icons/fi';
import { spoonacularAPI } from '@/lib/spoonacular';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  ingredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  instructions: Array<{
    number: number;
    step: string;
  }>;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  spoonacularScore: number;
}

interface Timer {
  step: number;
  duration: number;
  remaining: number;
  isRunning: boolean;
  isCompleted: boolean;
  id: string;
}

export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      
      try {
        // First try to fetch from Spoonacular API
        const apiResponse = await spoonacularAPI.getRecipeInformation(parseInt(recipeId));
        
        if (apiResponse) {
          // Transform API response to match our Recipe interface
          const transformedRecipe: Recipe = {
            id: apiResponse.id,
            title: apiResponse.title,
            image: apiResponse.image,
            readyInMinutes: apiResponse.readyInMinutes,
            servings: apiResponse.servings,
            summary: apiResponse.summary || '',
            ingredients: apiResponse.extendedIngredients?.map((ing: any) => ({
              id: ing.id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit
            })) || [],
            instructions: apiResponse.analyzedInstructions?.[0]?.steps?.map((step: any) => ({
              number: step.number,
              step: step.step
            })) || [{ number: 1, step: apiResponse.instructions || 'No detailed instructions available.' }],
            nutrition: {
              calories: apiResponse.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
              protein: apiResponse.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount + 'g' || '0g',
              carbs: apiResponse.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount + 'g' || '0g',
              fat: apiResponse.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount + 'g' || '0g'
            },
            spoonacularScore: apiResponse.spoonacularScore
          };
          
          setRecipe(transformedRecipe);
        } else {
          // If API fails, show error message
          setRecipe(null);
        }
      } catch (error) {
        console.error('API fetch failed:', error);
        setRecipe(null);
      }
      
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  const startTimer = (duration: number) => {
    const newTimer: Timer = {
      step: currentStep + 1,
      duration,
      remaining: duration * 60, // Convert to seconds
      isRunning: true,
      isCompleted: false,
      id: crypto.randomUUID(), // Generate a unique id
    };
    // Add new timer to state
    // ...
  };

  const toggleTimer = (id: string) => {
    // Toggle timer state
    // ...
  };

  const markStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep + 1]));
    
    if (currentStep < (recipe?.instructions.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speakStep = (step: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(step);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-gray-600">Preparing cooking mode...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recipe not found</h2>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] hover:from-[#A39BDE] hover:to-[#5A4A8B] text-white py-2 px-4 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentInstruction = recipe.instructions[currentStep];
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FiX className="w-5 h-5" />
          <span>Exit</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">{recipe.title}</h1>
          <p className="text-sm text-gray-500">Step {currentStep + 1} of {recipe.instructions.length}</p>
        </div>

        <button
          onClick={() => speakStep(currentInstruction.step)}
          className="p-2 text-gray-600 hover:text-gray-900"
          title="Read step aloud"
        >
          🔊
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#8F84C8] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Step Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#8F84C8] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                    {currentStep + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Step {currentStep + 1}</h2>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {currentInstruction.step}
              </p>

              {/* Timer Controls */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Quick Timers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[1, 2, 5, 10].map(minutes => (
                    <button
                      key={minutes}
                      onClick={() => startTimer(minutes)}
                      className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={markStepComplete}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] text-white px-6 py-2 rounded-lg hover:from-[#A39BDE] hover:to-[#5A4A8B] transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  <span>{currentStep === recipe.instructions.length - 1 ? 'Finish' : 'Complete'}</span>
                </button>

                <button
                  onClick={() => goToStep(currentStep + 1)}
                  disabled={currentStep === recipe.instructions.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentStep === recipe.instructions.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <span>Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-l p-6">
          {/* All Steps Overview */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">All Steps</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipe.instructions.map((instruction, index) => (
                <button
                  key={instruction.number}
                  onClick={() => goToStep(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentStep
                      ? 'bg-purple-50 border border-purple-300'
                      : completedSteps.has(index + 1)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      completedSteps.has(index + 1)
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-[#8F84C8] text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {completedSteps.has(index + 1) ? <FiCheck className="w-3 h-3" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {instruction.step}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
