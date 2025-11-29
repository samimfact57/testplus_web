
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sliders, Clock, Gauge, Hash, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateStudyContent } from '../services/geminiService';
import { Loading } from '../components/ui/Loading';
import { GenerationSettings } from '../types';

export const Home: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    questionCount: 10,
    difficulty: 'mixed',
    timerMode: 'standard'
  });

  const { setCurrentContent, setIsLoading, isLoading, setError, stats } = useApp();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const content = await generateStudyContent(topic, settings);
      setCurrentContent(content);
      navigate('/practice');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message={`Generating ${settings.questionCount} questions on "${topic}"...`} />;
  }

  const quickTopics = [
      { name: "React Hooks", color: "text-blue-600 bg-blue-50 border-blue-100" },
      { name: "World War II", color: "text-orange-600 bg-orange-50 border-orange-100" },
      { name: "Biology", color: "text-green-600 bg-green-50 border-green-100" },
      { name: "Calculus", color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 md:p-12 relative animate-fade-in overflow-y-auto">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-10 mt-6 md:mt-0">
          <div className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter mb-4 flex items-center gap-1 select-none">
              <span className="text-google-blue">T</span>
              <span className="text-google-red">e</span>
              <span className="text-google-yellow">s</span>
              <span className="text-google-blue">t</span>
              <span className="text-google-green">P</span>
              <span className="text-google-red">l</span>
              <span className="text-google-yellow">u</span>
              <span className="text-google-blue">s</span>
          </div>
          <p className="text-lg text-slate-500 font-medium text-center max-w-md leading-relaxed">
              Your intelligent companion for mastering any subject.
          </p>
      </div>

      {/* Main Search Component */}
      <div className="w-full max-w-2xl relative z-20 mb-12">
            <form onSubmit={handleSearch} className="relative group">
                <div className="relative flex items-center shadow-elevation-2 hover:shadow-elevation-3 transition-shadow duration-300 rounded-full bg-white border border-slate-200">
                    <div className="absolute left-6 text-slate-400">
                        <Search size={24} />
                    </div>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="What do you want to learn today?"
                        className="w-full pl-16 pr-32 h-16 text-lg font-medium bg-transparent border-none focus:ring-0 rounded-full text-slate-800 placeholder:text-slate-400"
                        autoFocus
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                         <button
                            type="button"
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-3 rounded-full transition-colors ${showSettings ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="Study Settings"
                        >
                            <Sliders size={20} />
                        </button>
                        <button
                            type="submit"
                            disabled={!topic.trim()}
                            className="w-12 h-12 bg-google-blue hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </form>

            {/* Settings Dialog */}
            {showSettings && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[1.75rem] p-6 shadow-elevation-2 border border-slate-100 z-30 animate-scale-in origin-top">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Study Preferences</h3>
                        <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={20}/></button>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><Hash size={16}/> Question Count</label>
                            <div className="flex gap-2">
                                {[5, 10, 15, 20].map(num => (
                                    <button 
                                        key={num} 
                                        onClick={() => setSettings({...settings, questionCount: num})} 
                                        className={`flex-1 py-2 rounded-full text-sm font-bold border transition-all ${
                                            settings.questionCount === num 
                                            ? 'bg-primary-50 border-primary-500 text-primary-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><Gauge size={16}/> Difficulty</label>
                            <div className="flex gap-2">
                                {['easy', 'medium', 'hard', 'mixed'].map(level => (
                                    <button 
                                        key={level} 
                                        onClick={() => setSettings({...settings, difficulty: level as any})} 
                                        className={`flex-1 py-2 rounded-full text-sm font-bold border capitalize transition-all ${
                                            settings.difficulty === level 
                                            ? 'bg-primary-50 border-primary-500 text-primary-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-slate-500 flex items-center gap-2"><Clock size={16}/> Timer Pacing</label>
                             <div className="flex gap-2">
                                {['fast', 'standard', 'relaxed'].map(mode => (
                                    <button 
                                        key={mode} 
                                        onClick={() => setSettings({...settings, timerMode: mode as any})} 
                                        className={`flex-1 py-2 rounded-full text-sm font-bold border capitalize transition-all ${
                                            settings.timerMode === mode 
                                            ? 'bg-primary-50 border-primary-500 text-primary-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                </div>
            )}
      </div>

      {/* Recommended / Chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
            {quickTopics.map((t) => (
                <button
                    key={t.name}
                    onClick={() => setTopic(t.name)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-transform hover:scale-105 ${t.color}`}
                >
                    {t.name}
                </button>
            ))}
      </div>

      {/* Daily Quests Dashboard */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center">
                        <Sparkles size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Daily Streak</span>
                </div>
                <div className="mt-auto">
                    <div className="text-3xl font-black text-slate-800">{stats.currentStreak} <span className="text-base text-slate-400 font-bold">days</span></div>
                    <p className="text-xs text-slate-400 mt-1">Keep it up to earn bonus XP!</p>
                </div>
            </div>

             <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-google-green/10 text-google-green flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                    <span className="font-bold text-slate-700">Daily Goal</span>
                </div>
                 <div className="mt-auto">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-2xl font-black text-slate-800">{stats.dailyGoalProgress || 0}%</span>
                     </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-google-green rounded-full" style={{width: `${Math.min(100, stats.dailyGoalProgress || 0)}%`}}></div>
                    </div>
                </div>
            </div>

             <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col bg-gradient-to-br from-google-blue to-blue-600 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center">
                        <Sparkles size={20} />
                    </div>
                    <span className="font-bold text-white/90">XP Boost</span>
                </div>
                <div className="mt-auto">
                     <p className="text-sm font-medium text-white/80 mb-2">Practice now to earn double XP for the next 15 mins.</p>
                     <button onClick={() => setTopic("General Knowledge")} className="w-full py-2 bg-white text-google-blue font-bold rounded-lg text-sm hover:bg-blue-50">Start Now</button>
                </div>
            </div>
      </div>

    </div>
  );
};
