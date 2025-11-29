import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, ChevronDown, ChevronUp, Target, Coins } from 'lucide-react';

export const History: React.FC = () => {
  const { history } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Session History</h1>
      </div>

      <div className="space-y-4">
        {history.map((session) => (
            <div key={session.id} className="bg-white border border-slate-200 rounded-[1.25rem] overflow-hidden hover:border-google-blue transition-colors">
              <div 
                onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                 <div>
                     <h3 className="font-bold text-lg text-slate-800">{session.topic}</h3>
                     <div className="text-sm text-slate-500 font-medium flex gap-3 mt-1">
                         <span>{new Date(session.date).toLocaleDateString()}</span>
                         <span>•</span>
                         <span>{session.totalQuestions} Questions</span>
                     </div>
                 </div>

                 <div className="flex items-center gap-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${session.accuracy >= 80 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                          {session.accuracy}%
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          {expandedId === session.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                      </div>
                 </div>
              </div>

              {expandedId === session.id && (
                  <div className="px-6 pb-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm">
                              <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Time</span>
                              <span className="font-bold text-slate-800">{Math.floor(session.timeSpentSeconds / 60)}m {session.timeSpentSeconds % 60}s</span>
                          </div>
                           <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm">
                              <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Coins</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1"><Coins size={14} className="text-yellow-500"/> +{session.coinsEarned}</span>
                          </div>
                           <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm">
                              <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Weak Areas</span>
                              <div className="flex flex-wrap gap-1">
                                  {session.weakTags.length > 0 ? session.weakTags.slice(0, 2).map(t => <span key={t} className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{t}</span>) : <span className="text-green-600 font-medium">None</span>}
                              </div>
                          </div>
                      </div>
                  </div>
              )}
            </div>
        ))}
      </div>
    </div>
  );
};