export type Language = 'English' | 'Ukrainian' | 'Polish';
export type Subject = 'English' | 'Polish' | 'Python';
export type Level = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'C1' | 'Beginner' | 'Intermediate' | 'Junior';

export type LessonPhase = 'theory' | 'practice' | 'quiz' | 'review' | 'complete';
export type SkillType = 'vocabulary' | 'grammar' | 'writing' | 'listening' | 'python';
export type ExerciseType = 'multiple-choice' | 'writing' | 'fill-blank' | 'code';

export interface Word {
  id: string;
  original: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  masteryLevel: number;
  wrongCount: number;
  topicId?: string;
  lastReviewed?: number;
  nextReview?: number;
}

export interface TheoryContent {
  explanation: string;
  rules: string[];
  examples: { original: string; translation: string }[];
}

export interface PracticeExercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string;
  hint: string;
  stepByStep: string[];
  explanation: string;
  difficulty: number;
}

export interface GrammarExercise {
  id: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  stepByStep: string[];
  topicId?: string;
}

export interface CodeExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  stepByStep: string[];
  explanation: string;
  solution: string;
  difficulty: number;
}

export interface Lesson {
  id: string;
  title: string;
  explanation: string;
  topicId: string;
  subject: Subject;
  level: Level;
  theory: TheoryContent;
  vocabulary: Word[];
  practiceExercises: PracticeExercise[];
  quizQuestions: PracticeExercise[];
  grammarExercises: GrammarExercise[];
  codeExercises?: CodeExercise[];
  practiceTasks?: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  lessons: Lesson[];
}

export interface CourseLevel {
  level: Level;
  topics: Topic[];
}

export interface StudySet {
  id: string;
  title: string;
  description?: string;
  subject?: Subject;
  sourceLanguage?: Language;
  targetLanguage?: Language;
  lessonId?: string;
  topicId?: string;
  words: Word[];
  createdAt: number;
}

export interface LessonProgress {
  lessonId: string;
  subject: Subject;
  topicId: string;
  level: Level;
  phase: LessonPhase;
  correctCount: number;
  wrongCount: number;
  completed: boolean;
  completedAt?: number;
  lastStudied?: number;
  accuracy: number;
}

export interface TopicProgress {
  topicId: string;
  subject: Subject;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  weakAreas: string[];
}

export interface SkillProgress {
  vocabulary: number;
  grammar: number;
  writing: number;
  listening: number;
  python: number;
}

export interface SessionMistake {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface NextStepRecommendation {
  message: string;
  recommendedLessonId?: string;
  recommendedSubject?: Subject;
  recommendedTopicId?: string;
  weakTopics: string[];
  weakWords: string[];
  repetitionItems: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  weakWordIds: string[];
  weakTopicIds: string[];
  wordsLearned: number;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  skillProgress: SkillProgress;
  adaptiveDifficulty: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    sessionSize: number;
    weakWordsPriority: boolean;
  };
}

export type LearningMode =
  | 'flashcards'
  | 'quiz'
  | 'writing'
  | 'listening'
  | 'speaking'
  | 'grammar'
  | 'match'
  | 'overview'
  | 'ai-tutor'
  | 'code';
