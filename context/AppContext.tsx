
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GeneratedContent, SessionResult, UserStats, MCQ, Bookmark } from '../types';
import { INITIAL_STATS, ACHIEVEMENTS } from '../constants';

interface AppContextType {
  // Content Generation
  currentContent: GeneratedContent | null;
  setCurrentContent: (content: GeneratedContent | null) => void;
  
  // History & Stats
  history: SessionResult[];
  saveSession: (result: SessionResult) => void;
  stats: UserStats;
  updateCoins: (amount: number) => void;
  toggleBookmark: (question: MCQ, topic: string) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [history, setHistory] = useState<SessionResult[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('testplus_history');
      const storedStats = localStorage.getItem('testplus_stats');
      
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      if (storedStats) setStats(JSON.parse(storedStats));
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  const updateCoins = (amount: number) => {
      setStats(prev => {
          const newStats = { ...prev, coins: Math.max(0, prev.coins + amount) };
          localStorage.setItem('testplus_stats', JSON.stringify(newStats));
          return newStats;
      });
  };

  const toggleBookmark = (question: MCQ, topic: string) => {
    setStats(prev => {
        const bookmarks = prev.bookmarks || [];
        const exists = bookmarks.some(b => b.id === question.id);
        let newBookmarks: Bookmark[];
        
        if (exists) {
            newBookmarks = bookmarks.filter(b => b.id !== question.id);
        } else {
            const newBookmark: Bookmark = {
                id: question.id,
                question,
                topic,
                savedAt: new Date().toISOString()
            };
            newBookmarks = [newBookmark, ...bookmarks];
        }

        const newStats = { ...prev, bookmarks: newBookmarks };
        localStorage.setItem('testplus_stats', JSON.stringify(newStats));
        return newStats;
    });
  };

  const checkAchievements = (newStats: UserStats, currentResult: SessionResult): string[] => {
      const unlocked = [...(newStats.unlockedAchievements || [])];
      
      // Threshold checks
      ACHIEVEMENTS.forEach(ach => {
          if (unlocked.includes(ach.id)) return;

          let earned = false;
          if (ach.id === 'first_steps' && newStats.totalSessions >= 1) earned = true;
          if (ach.id === 'dedicated' && newStats.totalQuestionsAnswered >= 50) earned = true;
          if (ach.id === 'expert' && newStats.totalQuestionsAnswered >= 200) earned = true;
          if (ach.id === 'rich' && newStats.coins >= 500) earned = true;
          if (ach.id === 'streak_3' && newStats.currentStreak >= 3) earned = true;
          if (ach.id === 'streak_7' && newStats.currentStreak >= 7) earned = true;
          if (ach.id === 'sniper' && currentResult.accuracy === 100) earned = true;

          if (earned) unlocked.push(ach.id);
      });

      return unlocked;
  };

  const saveSession = (result: SessionResult) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('testplus_history', JSON.stringify(newHistory));

    // Update Stats
    const isNewDay = !stats.lastPracticeDate || new Date(stats.lastPracticeDate).toDateString() !== new Date().toDateString();
    
    // Calculate XP: Base 10 per point + 50 for perfection + 20 for completion
    const sessionXp = (result.score * 10) + (result.accuracy === 100 ? 50 : 20);

    // Simple Daily Goal Logic (20 questions a day = 100%)
    const currentDailyProgress = isNewDay ? 0 : (stats.dailyGoalProgress || 0);
    const questionsAdded = result.totalQuestions;
    const progressIncrement = questionsAdded * 5; // 5% per question
    const newDailyProgress = Math.min(100, currentDailyProgress + progressIncrement);

    const tempStats: UserStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalQuestionsAnswered: stats.totalQuestionsAnswered + result.totalQuestions,
      averageAccuracy: Math.round(((stats.averageAccuracy * stats.totalSessions) + result.accuracy) / (stats.totalSessions + 1)),
      currentStreak: isNewDay ? stats.currentStreak + 1 : stats.currentStreak,
      lastPracticeDate: new Date().toISOString(),
      xp: stats.xp + sessionXp,
      coins: stats.coins + result.coinsEarned,
      unlockedAchievements: stats.unlockedAchievements || [],
      dailyGoalProgress: newDailyProgress,
      bookmarks: stats.bookmarks || []
    };

    // Check Achievements
    const newUnlocked = checkAchievements(tempStats, result);
    const finalStats = { ...tempStats, unlockedAchievements: newUnlocked };
    
    setStats(finalStats);
    localStorage.setItem('testplus_stats', JSON.stringify(finalStats));
  };

  return (
    <AppContext.Provider value={{
      currentContent,
      setCurrentContent,
      history,
      saveSession,
      stats,
      updateCoins,
      toggleBookmark,
      isLoading,
      setIsLoading,
      error,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
