import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, Zap, Target, Activity, TrendingUp } from 'lucide-react';

export const Stats: React.FC = () => {
  const { stats, history } = useApp();

  const performanceData = useMemo(() => {
    return history.slice(0, 10).reverse().map(h => ({
        date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        accuracy: h.accuracy,
      }));
  }, [history]);

  const skillData = [
    { subject: 'Recall', A: 80, fullMark: 100 },
    { subject: 'Speed', A: Math.min(100, (stats.totalQuestionsAnswered * 2)), fullMark: 100 },
    { subject: 'Logic', A: stats.averageAccuracy, fullMark: 100 },
    { subject: 'Streak', A: Math.min(100, stats.currentStreak * 10), fullMark: 100 },
    { subject: 'Focus', A: 65, fullMark: 100 },
  ];

  const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white p-6 rounded-[1.75rem] shadow-elevation-1 border border-slate-100 flex items-center gap-4 hover:shadow-elevation-2 transition-shadow">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} text-white`}>
            {icon}
        </div>
        <div>
             <div className="text-2xl font-black text-slate-800">{value}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
        </div>
    </div>
  );

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Your Statistics</h1>
        <p className="text-slate-500">Track your progress over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Zap size={24} />} value={stats.currentStreak} label="Day Streak" color="bg-google-yellow" />
        <StatCard icon={<Award size={24} />} value={stats.xp} label="Total XP" color="bg-google-blue" />
        <StatCard icon={<Target size={24} />} value={stats.totalQuestionsAnswered} label="Questions" color="bg-google-red" />
        <StatCard icon={<Activity size={24} />} value={`${stats.averageAccuracy}%`} label="Avg Accuracy" color="bg-google-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[1.75rem] shadow-elevation-1 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-slate-400" /> Accuracy Trend
            </h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} domain={[0, 100]} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="accuracy" stroke="#0B57D0" strokeWidth={3} dot={{ fill: '#fff', strokeWidth: 2, r: 4, stroke: '#0B57D0' }} activeDot={{ r: 6, fill: '#0B57D0' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[1.75rem] shadow-elevation-1 border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6">Skill Profile</h3>
             <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Mike" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.2} />
                    </RadarChart>
                 </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};