import React, { useState } from 'react';
import { ShoppingBag, Check, Trash2 } from 'lucide-react';

interface ShoppingListProps {
  items: string[];
  onRemove: (item: string) => void;
  onClear: () => void;
}

export function ShoppingList({ items, onRemove, onClear }: ShoppingListProps) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            Shopping List
          </h1>
        </div>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
          <ShoppingBag size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400">Your list is empty</h3>
          <p className="text-slate-500 mt-2">Add missing ingredients from recipes to start filling it up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-md border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-all text-transparent hover:text-emerald-500" onClick={() => onRemove(item)}>
                  <Check size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-lg font-medium text-slate-800 dark:text-slate-200">{item}</span>
              </div>
              <button 
                onClick={() => onRemove(item)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
