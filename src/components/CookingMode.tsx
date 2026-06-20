import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { ArrowLeft, Play, Square, Plus, Volume2 } from 'lucide-react';

interface CookingModeProps {
  recipe: Recipe;
  onBack: () => void;
  onAddShoppingItem: (item: string) => void;
  shoppingList: string[];
}

export function CookingMode({ recipe, onBack, onAddShoppingItem, shoppingList }: CookingModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.speechSynthesis.cancel();
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={20} />
        Back to recipes
      </button>

      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-10 leading-tight">
        {recipe.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Ingredients sidebar */}
        <div className="md:col-span-1 space-y-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              Have
            </h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              {recipe.ingredients.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {recipe.missingIngredients.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                Missing
              </h3>
              <ul className="space-y-3">
                {recipe.missingIngredients.map((item, idx) => {
                  const isAdded = shoppingList.includes(item);
                  return (
                    <li key={idx} className="flex items-start gap-2 justify-between group">
                      <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                        <span>{item}</span>
                      </div>
                      <button
                        disabled={isAdded}
                        onClick={() => onAddShoppingItem(item)}
                        className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                          isAdded 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 cursor-not-allowed' 
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                        title="Add to shopping list"
                      >
                        <Plus size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="md:col-span-2 space-y-12">
          {recipe.steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            return (
              <div 
                key={idx} 
                onClick={() => setCurrentStepIndex(idx)}
                className={`transition-opacity cursor-pointer ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                <div className="flex gap-6">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-2xl leading-relaxed font-medium ${isActive ? 'text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-400'}`}>
                      {step}
                    </p>
                    
                    {isActive && (
                      <div className="mt-6 flex items-center gap-4">
                        {isPlaying ? (
                          <button onClick={stopSpeaking} className="px-5 py-2.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl transition-colors font-semibold flex items-center gap-2">
                            <Square size={18} /> Stop
                          </button>
                        ) : (
                          <button onClick={() => speak(step)} className="px-5 py-2.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-xl transition-colors font-semibold flex items-center gap-2">
                            <Volume2 size={18} /> Read Aloud
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
