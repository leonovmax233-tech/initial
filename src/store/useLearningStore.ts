import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudySet, UserStats, Word } from '../types/learning';

interface LearningState {
  sets: StudySet[];
  stats: UserStats;
  addSet: (set: StudySet) => void;
  updateSet: (set: StudySet) => void;
  deleteSet: (id: string) => void;
  recordResult: (setId: string, wordId: string, correct: boolean) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      sets: [],
      stats: {
        xp: 0,
        level: 1,
        streak: 0,
        lastActivityDate: new Date().toLocaleDateString(),
        wordsLearned: 0,
        totalAnswers: 0,
        correctAnswers: 0,
        weakWordIds: [],
      },
      addSet: (newSet) => set((state) => ({ sets: [newSet, ...state.sets] })),
      updateSet: (updatedSet) => set((state) => ({
        sets: state.sets.map(s => s.id === updatedSet.id ? updatedSet : s)
      })),
      deleteSet: (id) => set((state) => ({ sets: state.sets.filter((s) => s.id !== id) })),
      addXP: (amount) => set((state) => {
        const newXP = state.stats.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;
        return { stats: { ...state.stats, xp: newXP, level: newLevel } };
      }),
      updateStreak: () => set((state) => {
        const today = new Date().toLocaleDateString();
        if (state.stats.lastActivityDate === today) return state;
        const lastDate = new Date(state.stats.lastActivityDate);
        const diff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        return {
          stats: {
            ...state.stats,
            streak: diff === 1 ? state.stats.streak + 1 : 1,
            lastActivityDate: today,
          }
        };
      }),
      recordResult: (setId, wordId, correct) => set((state) => {
        const newSets = state.sets.map((s) => {
          if (s.id !== setId) return s;
          return {
            ...s,
            words: s.words.map((w) => {
              if (w.id !== wordId) return w;
              const newLevel = correct ? Math.min(w.masteryLevel + 1, 5) : Math.max(w.masteryLevel - 1, 0);
              const newWrongCount = correct ? w.wrongCount : (w.wrongCount || 0) + 1;
              return {
                ...w,
                masteryLevel: newLevel,
                wrongCount: newWrongCount,
                lastReviewed: Date.now(),
                nextReview: Date.now() + (Math.pow(2, newLevel) * 24 * 60 * 60 * 1000),
              };
            }),
          };
        });

        const totalAnswers = state.stats.totalAnswers + 1;
        const correctAnswers = state.stats.correctAnswers + (correct ? 1 : 0);
        const weakWordIds = [...state.stats.weakWordIds];
        if (!correct && !weakWordIds.includes(wordId)) weakWordIds.push(wordId);
        if (correct && weakWordIds.includes(wordId)) {
          const word = newSets.find(s => s.id === setId)?.words.find(w => w.id === wordId);
          if (word && word.masteryLevel > 3) {
            const index = weakWordIds.indexOf(wordId);
            weakWordIds.splice(index, 1);
          }
        }

        return { 
          sets: newSets,
          stats: { ...state.stats, totalAnswers, correctAnswers, weakWordIds }
        };
      }),
    }),
    { name: 'lingua-flow-v2-storage' }
  )
);