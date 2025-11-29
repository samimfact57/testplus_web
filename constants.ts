
import { UserStats, Achievement } from "./types";

export const APP_NAME = "TestPlus";

export const INITIAL_STATS: UserStats = {
  totalSessions: 0,
  totalQuestionsAnswered: 0,
  averageAccuracy: 0,
  currentStreak: 0,
  lastPracticeDate: null,
  xp: 0,
  coins: 100, // Welcome bonus
  unlockedAchievements: [],
  bookmarks: [],
  dailyGoalProgress: 0,
};

export const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  hard: 'text-red-600 bg-red-100',
};

// Gamification System
export const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000, 4000, 8000, 15000, 30000, 50000];

export const getLevelInfo = (xp: number) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  const currentThreshold = LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level] || (currentThreshold * 2);
  const progress = Math.min(100, Math.max(0, ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));

  return { level, nextThreshold, progress };
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first practice session.', icon: 'Flag', threshold: 1 },
  { id: 'dedicated', name: 'Dedicated', description: 'Answer 50 questions total.', icon: 'BookOpen', threshold: 50 },
  { id: 'expert', name: 'Subject Expert', description: 'Answer 200 questions total.', icon: 'BrainCircuit', threshold: 200 },
  { id: 'rich', name: 'Coin Collector', description: 'Accumulate 500 coins.', icon: 'Coins', threshold: 500 },
  { id: 'streak_3', name: 'Consistency', description: 'Reach a 3-day streak.', icon: 'Flame', threshold: 3 },
  { id: 'streak_7', name: 'Unstoppable', description: 'Reach a 7-day streak.', icon: 'Zap', threshold: 7 },
  { id: 'sniper', name: 'Sniper', description: 'Achieve 100% accuracy in a session.', icon: 'Target', threshold: 0 }, // Logic handled manually
];
