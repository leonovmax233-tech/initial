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

export interface Lesson {
  id: string;
  title: string;
  explanation: string;
  vocabulary: Word[];
  practiceTasks?: string[]; // Placeholder for specific tasks
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
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
  preferences: {
    theme: 'light' | 'dark' | 'system';
    sessionSize: number;
    weakWordsPriority: boolean;
  };
}

export type LearningMode = 'flashcards' | 'quiz' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'match';