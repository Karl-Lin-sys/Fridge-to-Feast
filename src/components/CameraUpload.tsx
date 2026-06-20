import React, { useRef, useState } from 'react';
import { UploadCloud, Camera as CameraIcon, Loader2 } from 'lucide-react';
import { fileToBase64 } from '../utils';

interface CameraUploadProps {
  onAnalyze: (base64Data: string, mimeType: string) => Promise<void>;
  isLoading: boolean;
}

export function CameraUpload({ onAnalyze, isLoading }: CameraUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    // Generate preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Convert to base64 for API
    const base64 = await fileToBase64(file);
    await onAnalyze(base64, file.type);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden aspect-video flex flex-col items-center justify-center transition-colors group hover:border-indigo-500 dark:hover:border-indigo-400"
      >
        {preview && (
          <img src={preview} alt="Fridge preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        
        <div className="relative z-10 flex flex-col items-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center text-indigo-500 mb-2 group-hover:scale-105 transition-transform">
            {isLoading ? <Loader2 className="animate-spin" size={32} /> : <CameraIcon size={32} />}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {isLoading ? 'Analyzing fridge...' : 'Snap what you have'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              Upload a photo of your open fridge, pantry, or counter. We'll identify the ingredients and suggest recipes.
            </p>
          </div>

          {!isLoading && (
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors font-medium flex items-center gap-2"
              >
                <UploadCloud size={20} />
                <span>Upload Photo</span>
              </button>
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          // capture="environment" // Optional: prioritize rear camera on mobile
          onChange={onChange}
        />
      </div>
    </div>
  );
}
