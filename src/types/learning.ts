export type Language = 'English' | 'Ukrainian' | 'Polish';
export type Subject = 'Language' | 'Python';

export interface Word {
  id: string;
  original: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  usageTip?: string;
  difficulty: number; 
  masteryLevel: number; 
  wrongCount: number;
}

export interface GrammarExercise {
  id: string;
  sentence: string; // "He ___ football every day."
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface PythonTopic {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Junior';
  explanation: string;
  codeExample: string;
  tasks: {
    question: string;
    options: string[];
    correct: string;
  }[];
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  level?: string;
  words: Word[];
  grammar?: GrammarExercise[];
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  wordsLearned: number;
  pythonProgress: number; // 0-100
  weakWordIds: string[];
}

export type LearningMode = 'overview' | 'flashcards' | 'quiz' | 'writing' | 'listening' | 'speaking' | 'grammar' | 'match' | 'ai-tutor';