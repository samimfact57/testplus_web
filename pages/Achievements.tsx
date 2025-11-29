import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../constants';
import { Lock, Flag, BookOpen, BrainCircuit, Coins, Flame, Zap, Target, Trophy } from 'lucide-react';

const IconMap: Record<string, any> = { Flag, BookOpen, BrainCircuit, Coins, Flame, Zap, Target };

export const Achievements: React.FC = () => {
  const { stats } = useApp();

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Achievements</h1>
            <p className="text-slate-500">Collect badges as you learn.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
             <Trophy size={18} className="text-google-yellow" fill="currentColor" />
             <span className="font-bold text-slate-800">
                 {stats.unlockedAchievements?.length || 0} / {ACHIEVEMENTS.length}
             </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = stats.unlockedAchievements?.includes(ach.id);
          const Icon = IconMap[ach.icon] || Trophy;

          return (
            <div 
                key={ach.id} 
                className={`p-6 rounded-[1.5rem] border transition-all ${
                    isUnlocked 
                    ? 'bg-white border-slate-200 shadow-elevation-1' 
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                        isUnlocked 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                        {isUnlocked ? <Icon size={28} /> : <Lock size={24} />}
                    </div>
                </div>

                <h3 className="font-bold text-lg text-slate-800 mb-1">{ach.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{ach.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};