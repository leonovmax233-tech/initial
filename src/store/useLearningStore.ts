import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LessonPhase,
  LessonProgress,
  SessionMistake,
  SkillType,
  StudySet,
  TopicProgress,
  UserStats,
} from '../types/learning';
import {
  calculateAccuracy,
  generateNextStepRecommendation,
  getAdaptiveDifficulty,
  updateLessonProgress,
  updateSkillProgress,
  updateTopicProgress,
} from '../lib/learning-engine';

interface LearningState {
  sets: StudySet[];
  stats: UserStats;
  lessonProgress: LessonProgress[];
  topicProgress: TopicProgress[];
  sessionMistakes: SessionMistake[];

  addSet: (set: StudySet) => void;
  updateSet: (set: StudySet) => void;
  deleteSet: (id: string) => void;
  recordResult: (
    setId: string,
    wordId: string,
    correct: boolean,
    skill?: SkillType
  ) => void;
  recordLessonResult: (
    lessonId: string,
    subject: StudySet['subject'],
    topicId: string,
    level: LessonProgress['level'],
    correct: boolean,
    mistake?: SessionMistake
  ) => void;
  completeLessonPhase: (
    lessonId: string,
    subject: StudySet['subject'],
    topicId: string,
    level: LessonProgress['level'],
    phase: LessonPhase
  ) => void;
  markLessonComplete: (lessonId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  clearSessionMistakes: () => void;
  getRecommendation: () => ReturnType<typeof generateNextStepRecommendation>;
}

const defaultSkillProgress = {
  vocabulary: 0,
  grammar: 0,
  writing: 0,
  listening: 0,
  python: 0,
};

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActivityDate: new Date().toLocaleDateString(),
  weakWordIds: [],
  weakTopicIds: [],
  wordsLearned: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  accuracy: 100,
  skillProgress: defaultSkillProgress,
  adaptiveDifficulty: 2,
  preferences: {
    theme: 'system',
    sessionSize: 20,
    weakWordsPriority: true,
  },
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      sets: [],
      stats: defaultStats,
      lessonProgress: [],
      topicProgress: [],
      sessionMistakes: [],

      addSet: (newSet) => set((state) => ({ sets: [newSet, ...state.sets] })),
      updateSet: (updatedSet) =>
        set((state) => ({
          sets: state.sets.map((s) => (s.id === updatedSet.id ? updatedSet : s)),
        })),
      deleteSet: (id) =>
        set((state) => ({ sets: state.sets.filter((s) => s.id !== id) })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.stats.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return { stats: { ...state.stats, xp: newXP, level: newLevel } };
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toLocaleDateString();
          if (state.stats.lastActivityDate === today) return state;
          const lastDate = new Date(state.stats.lastActivityDate);
          const diff = Math.floor(
            (Date.now() - lastDate.getTime()) / (1000 * 3600 * 24)
          );
          return {
            stats: {
              ...state.stats,
              streak: diff === 1 ? state.stats.streak + 1 : 1,
              lastActivityDate: today,
            },
          };
        }),

      recordResult: (setId, wordId, correct, skill = 'vocabulary') =>
        set((state) => {
          const newSets = state.sets.map((s) => {
            if (s.id !== setId) return s;
            return {
              ...s,
              words: s.words.map((w) => {
                if (w.id !== wordId) return w;
                const newLevel = correct
                  ? Math.min(w.masteryLevel + 1, 5)
                  : Math.max(w.masteryLevel - 1, 0);
                return {
                  ...w,
                  masteryLevel: newLevel,
                  wrongCount: correct ? w.wrongCount : w.wrongCount + 1,
                  lastReviewed: Date.now(),
                  nextReview:
                    Date.now() +
                    Math.pow(2, newLevel) * 24 * 60 * 60 * 1000,
                };
              }),
            };
          });

          const totalAnswers = state.stats.totalAnswers + 1;
          const correctAnswers =
            state.stats.correctAnswers + (correct ? 1 : 0);
          const accuracy = calculateAccuracy(correctAnswers, totalAnswers - correctAnswers);

          let weakWordIds = [...state.stats.weakWordIds];
          if (!correct && !weakWordIds.includes(wordId))
            weakWordIds.push(wordId);
          if (correct && weakWordIds.includes(wordId)) {
            const word = newSets
              .find((s) => s.id === setId)
              ?.words.find((w) => w.id === wordId);
            if (word && word.masteryLevel > 3) {
              weakWordIds = weakWordIds.filter((id) => id !== wordId);
            }
          }

          const wordsLearned =
            state.stats.wordsLearned +
            (correct &&
            newSets
              .find((s) => s.id === setId)
              ?.words.find((w) => w.id === wordId)?.masteryLevel === 3
              ? 1
              : 0);

          const adaptiveDifficulty = getAdaptiveDifficulty(
            state.stats.adaptiveDifficulty,
            state.stats,
            correct
          );

          return {
            sets: newSets,
            stats: {
              ...state.stats,
              totalAnswers,
              correctAnswers,
              accuracy,
              weakWordIds,
              wordsLearned,
              adaptiveDifficulty,
              skillProgress: updateSkillProgress(
                state.stats.skillProgress,
                skill,
                correct
              ),
            },
          };
        }),

      recordLessonResult: (lessonId, subject, topicId, level, correct, mistake) =>
        set((state) => ({
          lessonProgress: updateLessonProgress(
            state.lessonProgress,
            lessonId,
            subject!,
            topicId,
            level,
            correct
          ),
          topicProgress: updateTopicProgress(
            state.topicProgress,
            topicId,
            subject!,
            correct,
            lessonId
          ),
          sessionMistakes: mistake
            ? [...state.sessionMistakes, mistake]
            : state.sessionMistakes,
          stats: {
            ...state.stats,
            totalAnswers: state.stats.totalAnswers + 1,
            correctAnswers: state.stats.correctAnswers + (correct ? 1 : 0),
            accuracy: calculateAccuracy(
              state.stats.correctAnswers + (correct ? 1 : 0),
              state.stats.totalAnswers + 1 - (state.stats.correctAnswers + (correct ? 1 : 0))
            ),
            adaptiveDifficulty: getAdaptiveDifficulty(
              state.stats.adaptiveDifficulty,
              state.stats,
              correct
            ),
            weakTopicIds: !correct
              ? [...new Set([...state.stats.weakTopicIds, topicId])]
              : state.stats.weakTopicIds,
          },
        })),

      completeLessonPhase: (lessonId, subject, topicId, level, phase) =>
        set((state) => ({
          lessonProgress: updateLessonProgress(
            state.lessonProgress,
            lessonId,
            subject!,
            topicId,
            level,
            true,
            phase
          ),
        })),

      markLessonComplete: (lessonId) =>
        set((state) => ({
          lessonProgress: state.lessonProgress.map((lp) =>
            lp.lessonId === lessonId
              ? { ...lp, completed: true, completedAt: Date.now(), phase: 'complete' }
              : lp
          ),
        })),

      clearSessionMistakes: () => set({ sessionMistakes: [] }),

      getRecommendation: () => {
        const state = get();
        return generateNextStepRecommendation(
          state.stats,
          state.lessonProgress,
          state.topicProgress
        );
      },
    }),
    { name: 'lingua-flow-v2-storage', version: 3,
      merge: (persisted, current) => {
        const p = persisted as Partial<LearningState>;
        return {
          ...current,
          ...p,
          stats: {
            ...defaultStats,
            ...(p.stats ?? {}),
            skillProgress: {
              ...defaultSkillProgress,
              ...((p.stats as UserStats)?.skillProgress ?? {}),
            },
            preferences: {
              ...defaultStats.preferences,
              ...((p.stats as UserStats)?.preferences ?? {}),
            },
          },
          lessonProgress: p.lessonProgress ?? [],
          topicProgress: p.topicProgress ?? [],
          sessionMistakes: p.sessionMistakes ?? [],
        };
      },
    }
  )
);
