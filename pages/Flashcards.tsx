import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCw, BookOpen, X } from 'lucide-react';

export const Flashcards: React.FC = () => {
  const { currentContent } = useApp();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!currentContent) {
    navigate('/');
    return null;
  }

  const cards = currentContent.punchcards;
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 animate-fade-in">
      
      <div className="w-full max-w-md mb-8 flex justify-between items-center">
         <button onClick={() => navigate('/results')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"><X size={20}/></button>
         <div className="font-bold text-slate-800 bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm">{currentIndex + 1} / {cards.length}</div>
      </div>

      <div 
        className="relative w-full max-w-md h-80 cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d shadow-elevation-2 rounded-[2rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-slate-100">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-4">Term</span>
            <h2 className="text-3xl font-black text-slate-800">{currentCard.front}</h2>
            <div className="absolute bottom-6 text-slate-400 text-sm flex items-center gap-2">
                <RotateCw size={16} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-google-blue rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-white">
             <span className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">Definition</span>
            <p className="text-xl font-medium leading-relaxed">{currentCard.back}</p>
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-8 w-full max-w-md">
        <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="flex-1 py-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-slate-600 font-bold transition-all flex justify-center shadow-sm"
        >
            <ArrowLeft />
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="flex-1 py-4 bg-slate-900 hover:bg-black rounded-full text-white font-bold transition-all flex justify-center shadow-lg"
        >
            <ArrowRight />
        </button>
      </div>
    </div>
  );
};