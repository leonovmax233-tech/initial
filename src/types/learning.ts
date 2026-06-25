export type Language = 'English' | 'Ukrainian' | 'Polish';

export interface Word {
  id: string;
  original: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  usageTip?: string;
  difficulty: number; // 1-5
  lastReviewed?: number;
  nextReview?: number;
  masteryLevel: number; // 0-5 (SRS)
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
  accuracy: number;
  weakWords: string[]; // IDs
}

export type LearningMode = 'flashcards' | 'quiz' | 'match' | 'writing' | 'grammar' | 'listening' | 'speaking';