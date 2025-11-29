
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Bookmark, Coins, Sparkles, Zap, Split, Menu, X, Check } from 'lucide-react';
import { SessionResult } from '../types';

export const Practice: React.FC = () => {
  const { currentContent, saveSession, stats, updateCoins, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const explanationRef = useRef<HTMLDivElement>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<{ id: string; correct: boolean }[]>([]);
  const [coinsEarnedInSession, setCoinsEarnedInSession] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!currentContent) {
      navigate('/');
    } else {
      setTimeLeft(currentContent.mcqs[questionIndex].timer_seconds);
      setEliminatedOptions([]);
      setShowHint(false);
    }
  }, [currentContent, navigate, questionIndex]);

  useEffect(() => {
    if (showExplanation) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showExplanation]);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExplanation) {
        if (e.key === 'Enter') handleNext();
        return;
      }
      
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        handleOptionSelect(key - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExplanation, selectedOption]);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null || eliminatedOptions.includes(index)) return; 
    
    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === currentContent!.mcqs[questionIndex].answer_index;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const earned = 10;
      setCoinsEarnedInSession(prev => prev + earned);
    }
    
    setUserAnswers(prev => [...prev, { 
      id: currentContent!.mcqs[questionIndex].id, 
      correct: isCorrect 
    }]);
  };

  const buyHint = () => {
      if (stats.coins < 20) {
          alert("Not enough coins!");
          return;
      }
      updateCoins(-20);
      setShowHint(true);
  };

  const buy5050 = () => {
     if (stats.coins < 50) {
          alert("Not enough coins!");
          return;
      }
      if (eliminatedOptions.length > 0) return;

      updateCoins(-50);
      const correctIndex = currentContent!.mcqs[questionIndex].answer_index;
      const allIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
      const shuffled = allIndices.sort(() => 0.5 - Math.random());
      setEliminatedOptions(shuffled.slice(0, 2));
  };

  const handleNext = () => {
    if (currentContent && questionIndex < currentContent.mcqs.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setShowHint(false);
      setEliminatedOptions([]);
    } else {
      finishSession();
    }
  };

  const finishSession = useCallback(() => {
    if (!currentContent) return;

    const totalQuestions = currentContent.mcqs.length;
    const correctIds = userAnswers.filter(a => a.correct).map(a => a.id);
    const incorrectIds = userAnswers.filter(a => !a.correct).map(a => a.id);
    const weakTags = currentContent.mcqs
        .filter(q => incorrectIds.includes(q.id))
        .flatMap(q => q.tags) as string[];

    const result: SessionResult = {
      id: Date.now().toString(),
      topic: currentContent.topic,
      date: new Date().toISOString(),
      score: score,
      totalQuestions: totalQuestions,
      accuracy: Math.round((score / totalQuestions) * 100),
      timeSpentSeconds: Math.floor((Date.now() - sessionStartTime) / 1000),
      weakTags: [...new Set(weakTags)],
      correctIds,
      incorrectIds,
      coinsEarned: coinsEarnedInSession
    };

    saveSession(result);
    updateCoins(coinsEarnedInSession);
    navigate('/results');
  }, [currentContent, score, userAnswers, sessionStartTime, saveSession, navigate, coinsEarnedInSession, updateCoins]);

  if (!currentContent) return null;

  const question = currentContent.mcqs[questionIndex];
  const isAnswered = selectedOption !== null;
  const isCorrectAnswer = selectedOption === question.answer_index;
  const isBookmarked = stats.bookmarks?.some(b => b.id === question.id);
  
  return (
    <div className="flex h-full relative overflow-hidden bg-white md:rounded-[1.75rem]">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
        <div className="max-w-3xl mx-auto">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-bold text-sm">Question {questionIndex + 1} of {currentContent.mcqs.length}</span>
                    <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-google-blue transition-all duration-500" style={{width: `${((questionIndex + 1) / currentContent.mcqs.length) * 100}%`}}></div>
                    </div>
                 </div>
                 <button onClick={() => setShowSidebar(true)} className="md:hidden p-2 bg-slate-100 rounded-full">
                     <Menu size={20} />
                 </button>
            </div>

            {/* Question Card */}
            <div className="bg-[#F8F9FA] rounded-[1.5rem] p-8 border border-slate-200 mb-8 shadow-sm relative group">
                <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {question.difficulty}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Bookmark Button */}
                        <button 
                            onClick={() => toggleBookmark(question, currentContent.topic)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isBookmarked 
                                ? 'bg-primary-50 text-google-blue' 
                                : 'text-slate-400 hover:bg-slate-100'
                            }`}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                        >
                            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                        {/* Mobile Timer */}
                        <div className="md:hidden font-mono font-bold text-slate-500">
                            {timeLeft}s
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 leading-snug mb-2">
                    {question.question}
                </h3>
            </div>

            {/* Hint Display */}
            {showHint && (
                <div className="mb-6 bg-google-yellow/10 border border-google-yellow/20 p-4 rounded-xl flex items-start gap-3 animate-fade-in-down">
                    <Lightbulb className="text-google-yellow shrink-0 mt-0.5" size={20} />
                    <div>
                        <span className="font-bold text-yellow-800 block text-sm">Hint</span>
                        <p className="text-yellow-900 text-sm">{question.hint}</p>
                    </div>
                </div>
            )}

            {/* Options */}
            <div className="grid gap-4 mb-8">
                {question.options.map((option, idx) => {
                    const isEliminated = eliminatedOptions.includes(idx);
                    let baseStyle = "p-5 rounded-[1rem] text-lg font-medium border-2 transition-all flex items-center gap-4 text-left group relative overflow-hidden";
                    
                    if (isEliminated) {
                        return <div key={idx} className={`${baseStyle} bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed`}>
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                            <span>{option}</span>
                        </div>
                    }

                    if (selectedOption !== null) {
                         // Result State
                        if (idx === question.answer_index) {
                            return <div key={idx} className={`${baseStyle} bg-green-50 border-google-green text-green-900`}>
                                <div className="absolute inset-0 bg-green-200/20"></div>
                                <span className="w-8 h-8 rounded-full bg-google-green text-white flex items-center justify-center shadow-sm z-10"><CheckCircle size={18} /></span>
                                <span className="z-10 font-bold">{option}</span>
                            </div>
                        } else if (idx === selectedOption) {
                             return <div key={idx} className={`${baseStyle} bg-red-50 border-google-red text-red-900`}>
                                <span className="w-8 h-8 rounded-full bg-google-red text-white flex items-center justify-center shadow-sm"><XCircle size={18} /></span>
                                <span className="font-bold">{option}</span>
                            </div>
                        } else {
                             return <div key={idx} className={`${baseStyle} bg-white border-slate-100 text-slate-400 opacity-60`}>
                                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                <span>{option}</span>
                            </div>
                        }
                    }

                    // Default Interactive State
                    return (
                        <button 
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`${baseStyle} bg-white border-slate-200 text-slate-700 hover:border-google-blue hover:bg-blue-50/50 hover:shadow-md active:scale-[0.99]`}
                        >
                            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold group-hover:bg-google-blue group-hover:text-white transition-colors">{idx + 1}</span>
                            <span className="group-hover:text-google-blue transition-colors">{option}</span>
                        </button>
                    )
                })}
            </div>

            {/* Explanation & Next */}
            <div ref={explanationRef} className={`transition-all duration-500 ease-in-out ${showExplanation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none h-0'}`}>
                {showExplanation && (
                    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-lg mb-20">
                         <div className={`flex items-center gap-2 mb-3 font-bold uppercase tracking-wider text-xs ${isCorrectAnswer ? 'text-google-green' : 'text-google-red'}`}>
                            {isCorrectAnswer ? <Sparkles size={16}/> : <Zap size={16}/>}
                            {isCorrectAnswer ? 'Excellent' : 'Correction'}
                         </div>
                         <p className="text-slate-800 text-lg leading-relaxed mb-6 font-medium">
                             {question.explanation}
                         </p>
                         <div className="flex justify-end">
                             <button onClick={handleNext} className="bg-google-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                                 Continue <ArrowRight size={20} />
                             </button>
                         </div>
                    </div>
                )}
            </div>

        </div>
      </div>

      {/* Right Sidebar (Sheet) */}
      <div className={`absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-40 ${showSidebar ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:shadow-none md:border-l`}>
          <div className="p-6 h-full flex flex-col">
              
              <div className="md:hidden flex justify-end mb-4">
                  <button onClick={() => setShowSidebar(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
              </div>

              {/* Timer */}
              <div className="bg-primary-50 rounded-[1.25rem] p-6 mb-6 text-center">
                  <div className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Time Remaining</div>
                  <div className={`text-4xl font-black font-mono ${timeLeft < 10 ? 'text-google-red animate-pulse' : 'text-primary-800'}`}>
                      {timeLeft}
                  </div>
              </div>

              {/* Lifelines */}
              <div className="mb-8 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Lifelines</h4>
                  <button onClick={buyHint} disabled={showHint || stats.coins < 20} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left">
                      <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700"><Lightbulb size={18} /></div>
                          <span className="font-bold text-slate-700">Hint</span>
                      </div>
                      <span className="text-xs font-black bg-slate-100 px-2 py-1 rounded text-slate-500">20</span>
                  </button>
                  <button onClick={buy5050} disabled={eliminatedOptions.length > 0 || stats.coins < 50} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left">
                      <div className="flex items-center gap-3">
                           <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><Split size={18} /></div>
                          <span className="font-bold text-slate-700">50/50</span>
                      </div>
                      <span className="text-xs font-black bg-slate-100 px-2 py-1 rounded text-slate-500">50</span>
                  </button>
              </div>

              {/* Progress Grid */}
              <div className="mb-auto">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Map</h4>
                   <div className="grid grid-cols-5 gap-2">
                       {currentContent.mcqs.map((_, i) => {
                           let style = "bg-slate-100 text-slate-400";
                           const answered = i < questionIndex;
                           if (i === questionIndex) style = "bg-slate-800 text-white ring-2 ring-offset-2 ring-slate-800";
                           if (answered) {
                               const correct = userAnswers.find(a => a.id === currentContent.mcqs[i].id)?.correct;
                               style = correct ? "bg-google-green text-white" : "bg-google-red text-white";
                           }

                           return (
                               <div key={i} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-xs ${style}`}>
                                   {i + 1}
                               </div>
                           )
                       })}
                   </div>
              </div>

              {/* Score */}
              <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">Current Score</span>
                      <span className="font-black text-2xl text-slate-800">{score}</span>
                  </div>
              </div>

          </div>
      </div>

    </div>
  );
};
