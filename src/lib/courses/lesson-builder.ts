import {
  CodeExercise,
  GrammarExercise,
  Lesson,
  Level,
  PracticeExercise,
  Subject,
  Word,
} from '../../types/learning';

let exerciseCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++exerciseCounter}`;

export interface VocabItem {
  original: string;
  translation: string;
  example?: string;
}

export interface LessonTemplate {
  id: string;
  title: string;
  topicId: string;
  subject: Subject;
  level: Level;
  explanation: string;
  rules: string[];
  examples: { original: string; translation: string }[];
  vocabulary: VocabItem[];
  grammarPoints?: {
    sentence: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    hint: string;
    steps: string[];
  }[];
  practiceQuestions?: {
    question: string;
    options?: string[];
    correctAnswer: string;
    hint: string;
    steps: string[];
    explanation: string;
    type?: 'multiple-choice' | 'writing' | 'fill-blank';
  }[];
  codeExercises?: Omit<CodeExercise, 'id'>[];
}

export function resetExerciseCounter() {
  exerciseCounter = 0;
}

export function buildLesson(template: LessonTemplate): Lesson {
  const prefix = template.id;

  const vocabulary: Word[] = template.vocabulary.map((v, i) => ({
    id: `${prefix}-w${i + 1}`,
    original: v.original,
    translation: v.translation,
    example: v.example,
    masteryLevel: 0,
    wrongCount: 0,
    topicId: template.topicId,
  }));

  const grammarExercises: GrammarExercise[] = (
    template.grammarPoints ?? []
  ).map((g, i) => ({
    id: `${prefix}-g${i + 1}`,
    sentence: g.sentence,
    options: g.options,
    correctAnswer: g.correctAnswer,
    explanation: g.explanation,
    hint: g.hint,
    stepByStep: g.steps,
    topicId: template.topicId,
  }));

  const baseDifficulty =
    template.level === 'A1' || template.level === 'Beginner'
      ? 1
      : template.level === 'A2' || template.level === 'B1' || template.level === 'Intermediate'
        ? 2
        : template.level === 'B1+' || template.level === 'B2'
          ? 3
          : 4;

  const practiceExercises: PracticeExercise[] = (
    template.practiceQuestions ?? buildDefaultPractice(vocabulary, template)
  ).map((p, i) => ({
    id: `${prefix}-p${i + 1}`,
    type: p.type ?? (p.options ? 'multiple-choice' : 'writing'),
    question: p.question,
    options: p.options,
    correctAnswer: p.correctAnswer,
    hint: p.hint,
    stepByStep: p.steps,
    explanation: p.explanation,
    difficulty: baseDifficulty,
  }));

  const quizQuestions: PracticeExercise[] = vocabulary
    .slice(0, 4)
    .map((w, i) => {
      const others = vocabulary
        .filter((_, j) => j !== i)
        .map((v) => v.translation);
      const options = [
        w.translation,
        ...others.slice(0, 3),
      ].sort(() => Math.random() - 0.5);
      return {
        id: `${prefix}-q${i + 1}`,
        type: 'multiple-choice' as const,
        question: `Переклад: "${w.original}"`,
        options,
        correctAnswer: w.translation,
        hint: w.example
          ? `Приклад: ${w.example}`
          : `Починається на "${w.translation[0]}"`,
        stepByStep: [
          `Слово "${w.original}" означає "${w.translation}".`,
          w.example ? `Приклад: ${w.example}` : 'Запам\'ятайте асоціацію з контекстом.',
          `Правильна відповідь: ${w.translation}`,
        ],
        explanation: `"${w.original}" = "${w.translation}"`,
        difficulty: baseDifficulty,
      };
    });

  const codeExercises: CodeExercise[] | undefined = template.codeExercises?.map(
    (c, i) => ({ ...c, id: `${prefix}-c${i + 1}` })
  );

  return {
    id: template.id,
    title: template.title,
    explanation: template.explanation,
    topicId: template.topicId,
    subject: template.subject,
    level: template.level,
    theory: {
      explanation: template.explanation,
      rules: template.rules,
      examples: template.examples,
    },
    vocabulary,
    practiceExercises,
    quizQuestions,
    grammarExercises,
    codeExercises,
  };
}

function buildDefaultPractice(
  vocabulary: Word[],
  template: LessonTemplate
): LessonTemplate['practiceQuestions'] {
  return vocabulary.slice(0, 3).map((w) => ({
    question: `Як перекладається "${w.original}"?`,
    correctAnswer: w.translation,
    hint: w.example ?? `Подумайте про контекст: ${template.title}`,
    steps: [
      `Розберіть слово "${w.original}" по частинах.`,
      w.example ? `Приклад використання: ${w.example}` : 'Згадайте правило з теорії.',
      `Відповідь: ${w.translation}`,
    ],
    explanation: `"${w.original}" перекладається як "${w.translation}".`,
    type: 'writing' as const,
  }));
}

export function buildTopicLessons(
  topicId: string,
  topicTitle: string,
  subject: Subject,
  level: Level,
  templates: Omit<LessonTemplate, 'topicId' | 'subject' | 'level'>[]
): Lesson[] {
  return templates.map((t) =>
    buildLesson({ ...t, topicId, subject, level })
  );
}
