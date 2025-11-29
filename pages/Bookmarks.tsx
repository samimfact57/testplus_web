
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Trash2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const { stats, toggleBookmark } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bookmarks = stats.bookmarks || [];

  if (bookmarks.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                  <Bookmark size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No Bookmarks Yet</h2>
              <p className="text-slate-500 max-w-md">Save tricky questions during your practice sessions to review them here later.</p>
          </div>
      )
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Saved Questions</h1>
            <p className="text-slate-500">Review difficult concepts you've bookmarked.</p>
        </div>
        <span className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-bold text-sm">
            {bookmarks.length} Saved
        </span>
      </div>

      <div className="space-y-4">
        {bookmarks.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-md">
                <div 
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="p-6 cursor-pointer flex gap-4 items-start"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.topic}</span>
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">{item.question.difficulty}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 leading-snug">{item.question.question}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(item.question, item.topic); }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={20} />
                         </button>
                         <button className="p-2 text-slate-400">
                             {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                         </button>
                    </div>
                </div>

                {expandedId === item.id && (
                    <div className="px-6 pb-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                        <div className="mt-6 space-y-3">
                             {item.question.options.map((opt, idx) => (
                                 <div 
                                    key={idx} 
                                    className={`p-4 rounded-xl border flex items-center justify-between font-medium ${
                                        idx === item.question.answer_index 
                                        ? 'bg-green-50 border-green-200 text-green-900' 
                                        : 'bg-white border-slate-200 text-slate-500'
                                    }`}
                                 >
                                     <span>{opt}</span>
                                     {idx === item.question.answer_index && <CheckCircle size={20} className="text-green-600"/>}
                                 </div>
                             ))}
                        </div>
                        <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase flex items-center gap-2">Explanation</h4>
                            <p className="text-slate-700 leading-relaxed">{item.question.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};
