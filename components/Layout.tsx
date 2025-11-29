
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Layers, BarChart2, History as HistoryIcon, User, ChevronLeft, ChevronRight, Coins, Zap, Trophy, Menu, Bookmark as BookmarkIcon } from 'lucide-react';
import { APP_NAME, getLevelInfo } from '../constants';
import { useApp } from '../context/AppContext';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; collapsed: boolean }> = ({ to, icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3.5 my-1 mx-2 rounded-full transition-all duration-200 font-bold whitespace-nowrap overflow-hidden group ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        } ${collapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}`
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <span className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-primary-700' : 'text-slate-600'}`}>{icon}</span>
          <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { stats } = useApp();
  const { level, progress } = getLevelInfo(stats.xp);

  return (
    <div className="flex h-screen bg-[#F0F4F9] overflow-hidden font-nunito selection:bg-primary-100 selection:text-primary-900">
      
      {/* Material Navigation Drawer */}
      <aside 
        className={`hidden md:flex flex-col bg-white h-[96%] my-auto ml-4 rounded-[1.75rem] transition-all duration-300 ease-in-out relative z-50 ${
            collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'hidden' : ''}`}>
               <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white shadow-sm">
                  <Layers size={20} strokeWidth={3} />
               </div>
               <span className="text-xl font-bold text-slate-800 tracking-tight">{APP_NAME}</span>
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"
            >
               {collapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
            </button>
        </div>
        
        {/* Coin Balance */}
        {!collapsed && (
           <div className="px-4 mb-4">
              <div className="bg-primary-50 rounded-2xl p-4 flex items-center justify-between border border-primary-100">
                  <div>
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Balance</span>
                      <div className="flex items-center gap-1.5 text-primary-800 font-black text-xl">
                          <Coins size={20} className="text-google-yellow" fill="currentColor" />
                          {stats.coins}
                      </div>
                  </div>
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm hover:shadow-md transition-shadow">
                      <Zap size={18} fill="currentColor" />
                  </button>
              </div>
           </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          <SidebarItem to="/" icon={<Home size={22} />} label="Home" collapsed={collapsed} />
          <SidebarItem to="/practice" icon={<Layers size={22} />} label="Practice" collapsed={collapsed} />
          <SidebarItem to="/bookmarks" icon={<BookmarkIcon size={22} />} label="Bookmarks" collapsed={collapsed} />
          <SidebarItem to="/stats" icon={<BarChart2 size={22} />} label="Statistics" collapsed={collapsed} />
          <SidebarItem to="/history" icon={<HistoryIcon size={22} />} label="History" collapsed={collapsed} />
          <SidebarItem to="/achievements" icon={<Trophy size={22} />} label="Achievements" collapsed={collapsed} />
        </nav>
        
        {/* Daily Goal Widget */}
        {!collapsed && (
            <div className="px-6 py-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase">Daily Goal</span>
                     <span className="text-xs font-bold text-slate-800">{stats.dailyGoalProgress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${stats.dailyGoalProgress >= 100 ? 'bg-google-green' : 'bg-google-blue'}`} style={{width: `${Math.min(100, stats.dailyGoalProgress || 0)}%`}}></div>
                </div>
            </div>
        )}

        {/* User Profile */}
        <div className="p-4 mt-auto">
             <div className={`bg-slate-50 border border-slate-100 rounded-full p-2 flex items-center transition-all hover:bg-slate-100 cursor-pointer ${collapsed ? 'justify-center aspect-square' : 'gap-3'}`}>
                <div className="w-10 h-10 rounded-full bg-google-blue text-white flex items-center justify-center font-bold text-lg relative flex-shrink-0 shadow-sm">
                    S
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-google-green border-2 border-white rounded-full"></div>
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0 pr-2">
                        <div className="flex justify-between items-center mb-1">
                             <p className="text-sm font-bold text-slate-800 truncate">Scholar</p>
                             <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded border border-primary-100">LVL {level}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-google-blue rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative scroll-smooth px-0 md:px-4 md:py-4">
        <div className="h-full w-full md:bg-white md:rounded-[1.75rem] overflow-hidden relative shadow-sm">
            
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center p-4 bg-[#F0F4F9] sticky top-0 z-30">
                <div className="flex items-center gap-2 font-black text-slate-800 text-lg">
                    {APP_NAME}
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full text-slate-800 font-bold shadow-sm text-sm border border-slate-200">
                    <Coins size={14} className="text-google-yellow" fill="currentColor" />
                    <span>{stats.coins}</span>
                </div>
            </div>

            <Outlet />
            
            <div className="h-24 md:hidden"></div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Material 3) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F0F4F9] border-t border-slate-200 flex justify-around p-2 z-50 pb-safe">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-2xl w-16 transition-all ${isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-500'}`}>
            {({ isActive }) => (
                <>
                    <Home size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Home</span>
                </>
            )}
        </NavLink>
        <NavLink to="/practice" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-2xl w-16 transition-all ${isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-500'}`}>
            {({ isActive }) => (
                <>
                    <Layers size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Quiz</span>
                </>
            )}
        </NavLink>
         <NavLink to="/bookmarks" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-2xl w-16 transition-all ${isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-500'}`}>
            {({ isActive }) => (
                <>
                    <BookmarkIcon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Saved</span>
                </>
            )}
        </NavLink>
        <NavLink to="/stats" className={({isActive}) => `flex flex-col items-center gap-1 p-2 rounded-2xl w-16 transition-all ${isActive ? 'bg-primary-100 text-primary-700' : 'text-slate-500'}`}>
            {({ isActive }) => (
                <>
                    <BarChart2 size={24} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Stats</span>
                </>
            )}
        </NavLink>
      </nav>
    </div>
  );
};
