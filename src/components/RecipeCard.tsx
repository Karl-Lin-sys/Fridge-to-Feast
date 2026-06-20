import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, ChefHat, ChevronRight } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
  };

  return (
    <div 
      onClick={() => onSelect(recipe)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all cursor-pointer flex flex-col group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 line-clamp-2">
          {recipe.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${difficultyColors[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <div className="flex items-center gap-1.5">
          <Clock size={16} />
          <span>{recipe.prepTimeMinutes}m</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame size={16} />
          <span>{recipe.calories} kcal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChefHat size={16} />
          <span>{recipe.ingredients.length + recipe.missingIngredients.length} ingredients</span>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        {recipe.missingIngredients.length > 0 ? (
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-rose-500 mb-1">Missing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {recipe.missingIngredients.join(', ')}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-500 mb-1">You have everything!</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              Ready to cook.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
        <span>Start Cooking</span>
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
