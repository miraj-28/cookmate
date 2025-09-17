'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight, FiClock, FiCheck, FiX, FiHome } from 'react-icons/fi';

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
}

export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timers, setTimers] = useState<Timer[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Mock recipe data (same as parent page)
  const mockRecipeData: { [key: string]: Recipe } = {
    '1': {
      id: 1,
      title: "Creamy Chicken Alfredo Pasta",
      image: "/api/placeholder/600/400",
      readyInMinutes: 30,
      servings: 4,
      summary: "Rich and creamy pasta dish with tender chicken and parmesan cheese.",
      ingredients: [
        { id: 1, name: "Fettuccine pasta", amount: 12, unit: "oz" },
        { id: 2, name: "Chicken breast", amount: 1, unit: "lb" },
        { id: 3, name: "Heavy cream", amount: 1, unit: "cup" },
        { id: 4, name: "Parmesan cheese", amount: 1, unit: "cup" },
        { id: 5, name: "Butter", amount: 4, unit: "tbsp" },
        { id: 6, name: "Garlic cloves", amount: 3, unit: "cloves" },
        { id: 7, name: "Salt", amount: 1, unit: "tsp" },
        { id: 8, name: "Black pepper", amount: 0.5, unit: "tsp" }
      ],
      instructions: [
        { number: 1, step: "Cook fettuccine pasta according to package directions. Drain and set aside." },
        { number: 2, step: "Season chicken breast with salt and pepper. Cut into bite-sized pieces." },
        { number: 3, step: "In a large skillet, melt 2 tbsp butter over medium-high heat. Cook chicken until golden and cooked through, about 6-8 minutes." },
        { number: 4, step: "Remove chicken from skillet and set aside. In the same skillet, melt remaining butter." },
        { number: 5, step: "Add minced garlic and cook for 1 minute until fragrant." },
        { number: 6, step: "Pour in heavy cream and bring to a gentle simmer. Cook for 2-3 minutes." },
        { number: 7, step: "Add grated Parmesan cheese and whisk until melted and smooth." },
        { number: 8, step: "Return chicken to the skillet and add cooked pasta. Toss everything together." },
        { number: 9, step: "Season with additional salt and pepper to taste. Serve immediately." }
      ],
      nutrition: { calories: 650, protein: "35g", carbs: "45g", fat: "35g" },
      spoonacularScore: 85
    },
    '2': {
      id: 2,
      title: "Vegetarian Buddha Bowl",
      image: "/api/placeholder/600/400",
      readyInMinutes: 25,
      servings: 2,
      summary: "Healthy bowl packed with quinoa, roasted vegetables, and tahini dressing.",
      ingredients: [
        { id: 1, name: "Quinoa", amount: 1, unit: "cup" },
        { id: 2, name: "Sweet potato", amount: 1, unit: "large" },
        { id: 3, name: "Broccoli", amount: 2, unit: "cups" },
        { id: 4, name: "Chickpeas", amount: 1, unit: "can" },
        { id: 5, name: "Avocado", amount: 1, unit: "medium" },
        { id: 6, name: "Tahini", amount: 3, unit: "tbsp" },
        { id: 7, name: "Lemon juice", amount: 2, unit: "tbsp" },
        { id: 8, name: "Olive oil", amount: 2, unit: "tbsp" }
      ],
      instructions: [
        { number: 1, step: "Preheat oven to 400°F (200°C)." },
        { number: 2, step: "Cook quinoa according to package directions." },
        { number: 3, step: "Cube sweet potato and toss with olive oil, salt, and pepper. Roast for 20 minutes." },
        { number: 4, step: "Steam broccoli until tender, about 5 minutes." },
        { number: 5, step: "Drain and rinse chickpeas." },
        { number: 6, step: "Make tahini dressing by whisking tahini, lemon juice, and 2-3 tbsp water." },
        { number: 7, step: "Slice avocado." },
        { number: 8, step: "Assemble bowls with quinoa, roasted sweet potato, broccoli, chickpeas, and avocado." },
        { number: 9, step: "Drizzle with tahini dressing and serve." }
      ],
      nutrition: { calories: 520, protein: "18g", carbs: "65g", fat: "22g" },
      spoonacularScore: 92
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const recipeData = mockRecipeData[recipeId];
      setRecipe(recipeData || null);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => {
          if (timer.isRunning && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;
            if (newRemaining === 0) {
              // Timer completed
              if ('speechSynthesis' in window && voiceEnabled) {
                const utterance = new SpeechSynthesisUtterance('Timer completed!');
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
              }
              return { ...timer, remaining: 0, isRunning: false, isCompleted: true };
            }
            return { ...timer, remaining: newRemaining };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceEnabled]);

  const startTimer = (duration: number) => {
    const newTimer: Timer = {
      step: currentStep + 1,
      duration,
      remaining: duration * 60, // Convert to seconds
      isRunning: true,
      isCompleted: false
    };
    setTimers(prev => [...prev, newTimer]);
  };

  const toggleTimer = (step: number) => {
    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.step === step
          ? { ...timer, isRunning: !timer.isRunning }
          : timer
      )
    );
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
    if ('speechSynthesis' in window && voiceEnabled) {
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
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-lg ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
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
                <button
                  onClick={() => speakStep(currentInstruction.step)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  title="Read step aloud"
                >
                  🔊
                </button>
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
          {/* Active Timers */}
          {timers.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Active Timers</h3>
              <div className="space-y-2">
                {timers.map(timer => (
                  <div key={timer.step} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Step {timer.step}</span>
                      <button
                        onClick={() => toggleTimer(timer.step)}
                        className={`p-1 rounded ${timer.isRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                      >
                        {timer.isRunning ? <FiPause className="w-3 h-3" /> : <FiPlay className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className={`text-lg font-mono ${timer.isCompleted ? 'text-green-600' : 'text-gray-900'}`}>
                      {formatTime(timer.remaining)}
                    </div>
                    {timer.isCompleted && (
                      <div className="text-xs text-green-600 mt-1">Completed!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
