export type Language = 'English' | 'Ukrainian' | 'Polish';

export interface Word {
  id: string;
  original: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  usageTip?: string;
  difficulty: number; 
  lastReviewed?: number;
  nextReview?: number;
  masteryLevel: number; // 0-5
  wrongCount: number;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  words: Word[];
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  wordsLearned: number;
  totalAnswers: number;
  correctAnswers: number;
  weakWordIds: string[];
}

export type LearningMode = 'overview' | 'flashcards' | 'quiz' | 'writing' | 'listening' | 'speaking' | 'ai-tutor';