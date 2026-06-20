import React from 'react';
import { DietaryRestriction } from '../types';
import { Leaf, Bone, WheatOff, MilkOff, NutOff, Camera, List } from 'lucide-react';

const options: { label: DietaryRestriction; icon: React.FC<any> }[] = [
  { label: 'Vegetarian', icon: Leaf },
  { label: 'Vegan', icon: Leaf },
  { label: 'Keto', icon: Bone },
  { label: 'Paleo', icon: Bone },
  { label: 'Gluten-Free', icon: WheatOff },
  { label: 'Dairy-Free', icon: MilkOff },
  { label: 'Nut-Free', icon: NutOff },
];

export function Sidebar({ 
  selected, 
  onChange,
  onNavigate,
  currentView
}: { 
  selected: DietaryRestriction[]; 
  onChange: (d: DietaryRestriction[]) => void;
  onNavigate: (view: 'fridge' | 'shopping') => void;
  currentView: 'fridge' | 'cooking' | 'shopping';
}) {
  const toggle = (opt: DietaryRestriction) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800 shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8 uppercase tracking-widest text-slate-50">Fridge to Feast</h1>
        
        <nav className="space-y-2 mb-10">
          <button 
            onClick={() => onNavigate('fridge')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'fridge' || currentView === 'cooking' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Camera size={20} />
            <span className="font-medium">Kitchen</span>
          </button>
          <button 
            onClick={() => onNavigate('shopping')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'shopping' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <List size={20} />
            <span className="font-medium">Shopping List</span>
          </button>
        </nav>

        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Dietary Filters</h2>
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected.includes(opt.label);
            return (
              <label key={opt.label} className="flex items-center space-x-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </div>
                <div className="flex items-center space-x-2 text-slate-300 group-hover:text-slate-100 transition-colors">
                  <Icon size={16} />
                  <span>{opt.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
