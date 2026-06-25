import {
  Lesson,
  LessonProgress,
  NextStepRecommendation,
  SessionMistake,
  SkillType,
  Subject,
  TopicProgress,
  UserStats,
} from '../types/learning';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from './course-data';

export function getAllLessons(): Lesson[] {
  const courses = [...ENGLISH_COURSE, ...POLISH_COURSE, ...PYTHON_COURSE];
  const lessons: Lesson[] = [];
  courses.forEach((cl) =>
    cl.topics.forEach((t) => lessons.push(...t.lessons))
  );
  return lessons;
}

export function findLesson(lessonId: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === lessonId);
}

export function calculateAccuracy(correct: number, wrong: number): number {
  const total = correct + wrong;
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function getAdaptiveDifficulty(
  baseDifficulty: number,
  stats: UserStats,
  recentCorrect: boolean
): number {
  let difficulty = stats.adaptiveDifficulty || baseDifficulty;
  if (recentCorrect) {
    difficulty = Math.min(difficulty + 0.15, 5);
  } else {
    difficulty = Math.max(difficulty - 0.3, 1);
  }
  return Math.round(difficulty * 10) / 10;
}

export function filterExercisesByDifficulty<T extends { difficulty: number }>(
  exercises: T[],
  difficulty: number
): T[] {
  const min = Math.max(1, Math.floor(difficulty - 1));
  const max = Math.min(5, Math.ceil(difficulty + 1));
  const filtered = exercises.filter(
    (e) => e.difficulty >= min && e.difficulty <= max
  );
  return filtered.length > 0 ? filtered : exercises;
}

export function updateTopicProgress(
  existing: TopicProgress[],
  topicId: string,
  subject: Subject,
  correct: boolean,
  weakArea?: string
): TopicProgress[] {
  const idx = existing.findIndex((t) => t.topicId === topicId);
  const current: TopicProgress =
    idx >= 0
      ? existing[idx]
      : {
          topicId,
          subject,
          correctCount: 0,
          wrongCount: 0,
          accuracy: 100,
          weakAreas: [],
        };

  const updated: TopicProgress = {
    ...current,
    correctCount: current.correctCount + (correct ? 1 : 0),
    wrongCount: current.wrongCount + (correct ? 0 : 1),
    weakAreas: [...current.weakAreas],
  };
  updated.accuracy = calculateAccuracy(
    updated.correctCount,
    updated.wrongCount
  );

  if (!correct && weakArea && !updated.weakAreas.includes(weakArea)) {
    updated.weakAreas.push(weakArea);
  }

  const result = [...existing];
  if (idx >= 0) result[idx] = updated;
  else result.push(updated);
  return result;
}

export function updateLessonProgress(
  existing: LessonProgress[],
  lessonId: string,
  subject: Subject,
  topicId: string,
  level: Lesson['level'],
  correct: boolean,
  phase?: LessonProgress['phase']
): LessonProgress[] {
  const idx = existing.findIndex((l) => l.lessonId === lessonId);
  const current: LessonProgress =
    idx >= 0
      ? existing[idx]
      : {
          lessonId,
          subject,
          topicId,
          level,
          phase: 'theory',
          correctCount: 0,
          wrongCount: 0,
          completed: false,
          accuracy: 100,
        };

  const updated: LessonProgress = {
    ...current,
    correctCount: current.correctCount + (correct ? 1 : 0),
    wrongCount: current.wrongCount + (correct ? 0 : 1),
    lastStudied: Date.now(),
    phase: phase ?? current.phase,
  };
  updated.accuracy = calculateAccuracy(
    updated.correctCount,
    updated.wrongCount
  );

  const result = [...existing];
  if (idx >= 0) result[idx] = updated;
  else result.push(updated);
  return result;
}

export function updateSkillProgress(
  skills: UserStats['skillProgress'],
  skill: SkillType,
  correct: boolean
): UserStats['skillProgress'] {
  const delta = correct ? 2 : -1;
  return {
    ...skills,
    [skill]: Math.max(0, Math.min(100, skills[skill] + delta)),
  };
}

export function getWeakTopics(
  topicProgress: TopicProgress[]
): TopicProgress[] {
  return topicProgress
    .filter((t) => t.accuracy < 70 || t.wrongCount > t.correctCount)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getWeakLessons(
  lessonProgress: LessonProgress[]
): LessonProgress[] {
  return lessonProgress
    .filter((l) => l.wrongCount > 0 && l.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function generateNextStepRecommendation(
  stats: UserStats,
  lessonProgress: LessonProgress[],
  topicProgress: TopicProgress[]
): NextStepRecommendation {
  const weakLessons = getWeakLessons(lessonProgress);
  const weakTopics = getWeakTopics(topicProgress);
  const allLessons = getAllLessons();

  if (weakLessons.length > 0) {
    const weak = weakLessons[0];
    const lesson = findLesson(weak.lessonId);
    const mistakeRate = 100 - weak.accuracy;
    return {
      message: `Наступний крок: повторити "${lesson?.title ?? weak.lessonId}" (помилок: ${mistakeRate}%)`,
      recommendedLessonId: weak.lessonId,
      recommendedSubject: weak.subject,
      recommendedTopicId: weak.topicId,
      weakTopics: weakTopics.map((t) => t.topicId),
      weakWords: stats.weakWordIds.slice(0, 5),
      repetitionItems: weakTopics.flatMap((t) => t.weakAreas).slice(0, 5),
      priority: mistakeRate > 40 ? 'high' : 'medium',
    };
  }

  if (stats.weakWordIds.length > 3) {
    return {
      message: `Повторіть ${stats.weakWordIds.length} слабких слів перед новим матеріалом`,
      weakTopics: weakTopics.map((t) => t.topicId),
      weakWords: stats.weakWordIds.slice(0, 8),
      repetitionItems: stats.weakWordIds.slice(0, 5),
      priority: 'high',
    };
  }

  const completedIds = new Set(
    lessonProgress.filter((l) => l.completed).map((l) => l.lessonId)
  );
  const nextLesson = allLessons.find((l) => !completedIds.has(l.id));

  if (nextLesson) {
    return {
      message: `Наступний крок: урок "${nextLesson.title}" (${nextLesson.level})`,
      recommendedLessonId: nextLesson.id,
      recommendedSubject: nextLesson.subject,
      recommendedTopicId: nextLesson.topicId,
      weakTopics: weakTopics.map((t) => t.topicId),
      weakWords: stats.weakWordIds.slice(0, 5),
      repetitionItems: [],
      priority: 'medium',
    };
  }

  return {
    message: 'Відмінна робота! Продовжуйте повторення для закріплення матеріалу.',
    weakTopics: weakTopics.map((t) => t.topicId),
    weakWords: stats.weakWordIds.slice(0, 5),
    repetitionItems: [],
    priority: 'low',
  };
}

export function buildSessionReview(
  mistakes: SessionMistake[]
): { summary: string; items: SessionMistake[] } {
  if (mistakes.length === 0) {
    return {
      summary: 'Жодних помилок! Відмінна робота.',
      items: [],
    };
  }
  const rate = mistakes.length;
  return {
    summary: `Знайдено ${rate} помилок. Перегляньте пояснення нижче.`,
    items: mistakes,
  };
}

export interface SpacedRepetitionItem {
  lessonId: string;
  title: string;
  subject: Subject;
  topicId: string;
  level: Lesson['level'];
  intervalLabel: string;
  completedAt: number;
}

// Spaced-repetition milestones: revisit core concepts after 3 days, 1 week, 1 month.
const SPACED_REPETITION_INTERVALS: { label: string; ms: number }[] = [
  { label: '1 місяць', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: '1 тиждень', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '3 дні', ms: 3 * 24 * 60 * 60 * 1000 },
];

// Completed lessons whose last review crossed a 3-day / 1-week / 1-month milestone.
export function getSpacedRepetitionDue(
  lessonProgress: LessonProgress[],
  now: number = Date.now()
): SpacedRepetitionItem[] {
  const lessons = getAllLessons();
  const due: SpacedRepetitionItem[] = [];
  lessonProgress.forEach((lp) => {
    if (!lp.completed || !lp.completedAt) return;
    const elapsed = now - lp.completedAt;
    const milestone = SPACED_REPETITION_INTERVALS.find((i) => elapsed >= i.ms);
    if (!milestone) return;
    const lesson = lessons.find((l) => l.id === lp.lessonId);
    due.push({
      lessonId: lp.lessonId,
      title: lesson?.title ?? lp.lessonId,
      subject: lp.subject,
      topicId: lp.topicId,
      level: lp.level,
      intervalLabel: milestone.label,
      completedAt: lp.completedAt,
    });
  });
  return due.sort((a, b) => a.completedAt - b.completedAt);
}

export function shouldShowHint(
  adaptiveDifficulty: number,
  wrongCount: number
): boolean {
  return adaptiveDifficulty <= 2 || wrongCount >= 2;
}

export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 1.5) return 'Легко';
  if (difficulty <= 2.5) return 'Середньо';
  if (difficulty <= 3.5) return 'Складно';
  return 'Експерт';
}
