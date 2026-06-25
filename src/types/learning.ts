export type Language = 'English' | 'Ukrainian' | 'Polish';
export type Subject = 'English' | 'Polish' | 'Python';
export type Level = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'C1' | 'Beginner' | 'Intermediate' | 'Junior';

export interface Word {
  id: string;
  original: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  masteryLevel: number;
  wrongCount: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  explanation: string;
  vocabulary: Word[];
  grammarRules?: string;
}

export interface CourseLevel {
  level: Level;
  topics: Topic[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  weakWordIds: string[];
}

export type LearningMode = 'flashcards' | 'quiz' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'match';