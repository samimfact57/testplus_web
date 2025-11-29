
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, RotateCcw, Home, Layers, Zap, TrendingUp, CheckCircle, Bookmark } from 'lucide-react';
import { getLevelInfo } from '../constants';

export const Results: React.FC = () => {
  const { history, currentContent, stats } = useApp();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const result = history.length > 0 ? history[0] : null;

  useEffect(() => {
    if (result && result.accuracy >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [result]);

  if (!result || !currentContent) {
    return (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No recent results found.</h2>
            <button onClick={() => navigate('/')} className="mt-4 px-8 py-3 bg-google-blue text-white rounded-full font-bold hover:bg-blue-700 transition-colors">Start Learning</button>
        </div>
    );
  }

  const xpGained = (result.score * 10) + (result.accuracy === 100 ? 50 : 20);
  const currentLevelInfo = getLevelInfo(stats.xp);

  let grade = 'C';
  let gradeColor = 'text-slate-400';
  if (result.accuracy === 100) { grade = 'S'; gradeColor = 'text-google-yellow'; }
  else if (result.accuracy >= 80) { grade = 'A'; gradeColor = 'text-google-green'; }
  else if (result.accuracy >= 60) { grade = 'B'; gradeColor = 'text-google-blue'; }

  // Canvas Confetti
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
            <div 
                key={i} 
                className="absolute w-2 h-2 bg-google-blue rounded-full animate-confetti-fall"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-5%`,
                    backgroundColor: ['#0B57D0', '#0F9D58', '#F4B400', '#DB4437'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                }}
            />
        ))}
        <style>{`
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti-fall {
                animation-name: confetti-fall;
                animation-timing-function: linear;
                animation-fill-mode: forwards;
            }
        `}</style>
    </div>
  );

  return (
    <div className="min-h-full p-6 md:p-12 max-w-5xl mx-auto animate-fade-in relative">
        {showConfetti && <Confetti />}

        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Session Report</h1>
            <p className="text-slate-500 font-medium">{result.topic} • {new Date(result.date).toLocaleDateString()}</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Grade Card */}
            <div className="md:col-span-2 row-span-2 bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center mb-6 relative">
                         <div className="absolute inset-0 rounded-full border-8 border-google-blue border-r-transparent rotate-45" style={{opacity: result.accuracy / 100}}></div>
                         <span className={`text-6xl font-black ${gradeColor}`}>{grade}</span>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-slate-800 mb-1">{result.accuracy}%</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accuracy</div>
                    </div>
                </div>
            </div>

            {/* XP Card */}
            <div className="bg-google-blue rounded-[1.75rem] shadow-md p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-2 py-1 rounded-lg">
                        <Zap size={16} className="text-yellow-300" fill="currentColor" />
                        <span className="font-bold text-xs">+ {xpGained} XP</span>
                    </div>
                    <h3 className="text-3xl font-black">Level {currentLevelInfo.level}</h3>
                    <p className="opacity-80 text-sm">Keep up the streak!</p>
                </div>
                <div className="mt-4">
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: `${currentLevelInfo.progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Time Card */}
            <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3">
                    <Clock size={20} />
                </div>
                <span className="text-2xl font-black text-slate-800">{result.timeSpentSeconds}s</span>
                <span className="text-xs text-slate-400 font-bold uppercase">Time</span>
            </div>

            {/* Speed Card */}
            <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 flex flex-col justify-center items-center text-center">
                 <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp size={20} />
                </div>
                <span className="text-2xl font-black text-slate-800">{(result.timeSpentSeconds / result.totalQuestions).toFixed(1)}s</span>
                <span className="text-xs text-slate-400 font-bold uppercase">Avg / Q</span>
            </div>

            {/* Feedback */}
             <div className="md:col-span-2 bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
                 <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                     <Target size={18} className="text-google-red"/> Focus Areas
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {result.weakTags.length > 0 ? (
                        result.weakTags.map(tag => (
                            <span key={tag} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-xl font-bold text-sm">
                            <CheckCircle size={16} /> Perfect! No weak areas detected.
                        </div>
                    )}
                 </div>
            </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
            <div className="bg-slate-900 text-white p-2 rounded-full shadow-xl flex items-center gap-1 pointer-events-auto scale-90 md:scale-100">
                <button onClick={() => navigate('/practice')} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors">
                    <RotateCcw size={18} /> Again
                </button>
                <button onClick={() => navigate('/flashcards')} className="flex items-center gap-2 px-6 py-3 hover:bg-white/10 rounded-full font-bold transition-colors">
                    <Layers size={18} /> Review Cards
                </button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button onClick={() => navigate('/')} className="p-3 hover:bg-white/10 rounded-full transition-colors"><Home size={20} /></button>
            </div>
        </div>
        
        <div className="h-20"></div>
    </div>
  );
};
