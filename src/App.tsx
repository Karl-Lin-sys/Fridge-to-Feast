import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CameraUpload } from './components/CameraUpload';
import { RecipeCard } from './components/RecipeCard';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { AnalyzeResponse, DietaryRestriction, Recipe } from './types';
import { ChefHat } from 'lucide-react';

function App() {
  const [view, setView] = useState<'fridge' | 'cooking' | 'shopping'>('fridge');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [shoppingItems, setShoppingItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (base64Data: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          mimeType,
          dietaryRestrictions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze fridge image');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addShoppingItem = (item: string) => {
    if (!shoppingItems.includes(item)) {
      setShoppingItems((prev) => [...prev, item]);
    }
  };

  const removeShoppingItem = (item: string) => {
    setShoppingItems((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Sidebar 
        selected={dietaryRestrictions} 
        onChange={setDietaryRestrictions} 
        onNavigate={setView}
        currentView={view}
      />
      
      <main className="flex-1 overflow-y-auto w-full relative">
        {view === 'shopping' && (
          <ShoppingList 
            items={shoppingItems} 
            onRemove={removeShoppingItem} 
            onClear={() => setShoppingItems([])} 
          />
        )}

        {view === 'cooking' && activeRecipe && (
          <CookingMode 
            recipe={activeRecipe} 
            onBack={() => setView('fridge')}
            onAddShoppingItem={addShoppingItem}
            shoppingList={shoppingItems}
          />
        )}

        {view === 'fridge' && (
          <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12">
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full mb-6">
                <ChefHat size={40} />
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-4">
                What's in your fridge?
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Snap a photo of your ingredients, and our AI will generate custom recipes tailored to what you have and what you eat.
              </p>
            </header>

            <CameraUpload onAnalyze={handleAnalyze} isLoading={isLoading} />

            {error && (
              <div className="mt-8 p-4 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 rounded-2xl text-center border border-rose-200 dark:border-rose-500/20">
                {error}
              </div>
            )}

            {analysisResult && !isLoading && (
              <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                    Found {analysisResult.identifiedIngredients.length} ingredients
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.identifiedIngredients.map((ing, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                  Recipe Suggestions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {analysisResult.suggestedRecipes.map((recipe, idx) => (
                    <RecipeCard 
                      key={recipe.id || idx} 
                      recipe={recipe} 
                      onSelect={(rec) => {
                        setActiveRecipe(rec);
                        setView('cooking');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
