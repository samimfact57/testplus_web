
export interface MCQ {
  id: string;
  question: string;
  options: string[];
  answer_index: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  timer_seconds: number;
  hint: string;
  explanation: string;
  source?: string;
  confidence?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mnemonic?: string;
}

export interface GeneratedContent {
  topic: string;
  generated_at: string;
  source?: string;
  confidence?: 'high' | 'medium' | 'low';
  mcqs: MCQ[];
  punchcards: Flashcard[];
  study_plan: string[];
}

export interface SessionResult {
  id: string;
  topic: string;
  date: string; // ISO string
  score: number;
  totalQuestions: number;
  accuracy: number; // percentage 0-100
  timeSpentSeconds: number;
  weakTags: string[];
  correctIds: string[];
  incorrectIds: string[];
  coinsEarned: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // We'll map this string to Lucide icons
  threshold: number;
}

export interface Bookmark {
  id: string;
  question: MCQ;
  topic: string;
  savedAt: string;
}

export interface UserStats {
  totalSessions: number;
  totalQuestionsAnswered: number;
  averageAccuracy: number;
  currentStreak: number;
  lastPracticeDate: string | null; // ISO string
  xp: number;
  coins: number;
  unlockedAchievements: string[];
  bookmarks: Bookmark[];
  dailyGoalProgress: number; // 0-100 representing daily activity
}

export interface GenerationSettings {
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  timerMode: 'fast' | 'standard' | 'relaxed';
}

// For chart data
export interface PerformanceDataPoint {
  date: string;
  accuracy: number;
}
