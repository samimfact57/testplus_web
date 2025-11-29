import React from 'react';
import { Sparkles } from 'lucide-react';

export const Loading: React.FC<{ message?: string }> = ({ message = "Generating your tailored content..." }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Animated Text */}
      <div className="flex items-center gap-3 mb-8 text-primary-600 animate-pulse">
        <Sparkles className="w-6 h-6 animate-spin-slow" />
        <span className="font-bold text-lg">{message}</span>
      </div>

      {/* Skeleton Card UI */}
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"></div>

        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>

        {/* Question Text Skeleton */}
        <div className="space-y-3 mb-10">
            <div className="h-6 w-full bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-3/4 bg-slate-200 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg"></div>
        </div>

        {/* Options Skeleton */}
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-full bg-slate-100 rounded-xl border border-slate-200"></div>
            ))}
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">
        Constructing optimal learning path...
      </p>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};