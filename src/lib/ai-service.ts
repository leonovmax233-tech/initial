import {
  GrammarExercise,
  Lesson,
  PracticeExercise,
  Subject,
  UserStats,
  Word,
} from '../types/learning';
import {
  findLesson,
  generateNextStepRecommendation,
  getAllLessons,
} from './learning-engine';

const GRAMMAR_RULES: Record<string, string> = {
  'present-simple': 'Present Simple використовується для регулярних дій. Додавайте -s для he/she/it.',
  'past-simple': 'Past Simple — для завершених дій у минулому. Друга форма дієслова.',
  'present-continuous': 'Present Continuous — дія відбувається зараз. am/is/are + verb-ing.',
  'present-perfect': 'Present Perfect — зв\'язок минулого з теперішнім. have/has + past participle.',
  'passive-voice': 'Passive Voice — фокус на дії. be + past participle.',
  'python-loops': 'Цикл for ітерує по послідовностях. while — поки умова істинна.',
  'python-functions': 'def створює функцію. return повертає результат.',
};

const TOPIC_VOCAB: Record<string, { original: string; translation: string }[]> = {
  travel: [
    { original: 'Airport', translation: 'Аеропорт' },
    { original: 'Ticket', translation: 'Квиток' },
    { original: 'Hotel', translation: 'Готель' },
    { original: 'Passport', translation: 'Паспорт' },
    { original: 'Luggage', translation: 'Багаж' },
  ],
  work: [
    { original: 'Meeting', translation: 'Зустріч' },
    { original: 'Deadline', translation: 'Дедлайн' },
    { original: 'Salary', translation: 'Зарплата' },
    { original: 'Office', translation: 'Офіс' },
    { original: 'Colleague', translation: 'Колега' },
  ],
  'daily-life': [
    { original: 'Breakfast', translation: 'Сніданок' },
    { original: 'Shopping', translation: 'Покупки' },
    { original: 'Exercise', translation: 'Вправи' },
    { original: 'Sleep', translation: 'Сон' },
    { original: 'Cooking', translation: 'Готування' },
  ],
  education: [
    { original: 'Homework', translation: 'Домашнє завдання' },
    { original: 'Exam', translation: 'Іспит' },
    { original: 'Teacher', translation: 'Вчитель' },
    { original: 'Library', translation: 'Бібліотека' },
    { original: 'Degree', translation: 'Ступінь' },
  ],
  technology: [
    { original: 'Computer', translation: 'Комп\'ютер' },
    { original: 'Internet', translation: 'Інтернет' },
    { original: 'Software', translation: 'ПЗ' },
    { original: 'Password', translation: 'Пароль' },
    { original: 'Download', translation: 'Завантажити' },
  ],
  business: [
    { original: 'Contract', translation: 'Контракт' },
    { original: 'Profit', translation: 'Прибуток' },
    { original: 'Client', translation: 'Клієнт' },
    { original: 'Budget', translation: 'Бюджет' },
    { original: 'Strategy', translation: 'Стратегія' },
  ],
};

function normalizeTopic(topic: string): string {
  const lower = topic.toLowerCase();
  if (lower.includes('travel') || lower.includes('подорож')) return 'travel';
  if (lower.includes('work') || lower.includes('робот')) return 'work';
  if (lower.includes('daily') || lower.includes('повсякден')) return 'daily-life';
  if (lower.includes('education') || lower.includes('освіт')) return 'education';
  if (lower.includes('tech') || lower.includes('технолог')) return 'technology';
  if (lower.includes('business') || lower.includes('бізнес')) return 'business';
  return 'travel';
}

export const AIService = {
  getExplanation(word: Word | string): string {
    const w = typeof word === 'string' ? word : word.original;
    const example = typeof word === 'object' ? word.example : undefined;
    if (example) {
      return `Слово "${w}" часто використовується так: "${example}". Спробуйте уявити ситуацію, де ви його застосуєте.`;
    }
    return `Слово "${w}" — важливе для вашого рівня. Рекомендую метод асоціацій: уявіть візуальний образ у контексті вашого дня.`;
  },

  explainGrammar(topicId: string): string {
    const key = topicId.toLowerCase().replace(/\s+/g, '-');
    for (const [ruleKey, rule] of Object.entries(GRAMMAR_RULES)) {
      if (key.includes(ruleKey) || ruleKey.includes(key)) return rule;
    }
    return GRAMMAR_RULES[key] ?? 'Зверніть увагу на порядок слів і узгодження часів у реченні.';
  },

  getGrammarTip(topicId: string): string {
    return this.explainGrammar(topicId);
  },

  explainMistake(
    exercise: PracticeExercise | GrammarExercise,
    userAnswer: string
  ): string {
    const correct = 'correctAnswer' in exercise ? exercise.correctAnswer : '';
    if (userAnswer.toLowerCase() === correct.toLowerCase()) {
      return 'Правильно! Продовжуйте в тому ж дусі.';
    }
    return `Ваша відповідь "${userAnswer}" неправильна. ${exercise.explanation} Правильна відповідь: "${correct}".`;
  },

  getHint(exercise: PracticeExercise | GrammarExercise, step: number): string {
    const steps = exercise.stepByStep ?? [];
    if (step < steps.length) return steps[step];
    return 'hint' in exercise ? exercise.hint : exercise.explanation;
  },

  generatePracticeExample(lesson: Lesson): PracticeExercise {
    const word = lesson.vocabulary[Math.floor(Math.random() * lesson.vocabulary.length)];
    return {
      id: `ai-gen-${Date.now()}`,
      type: 'writing',
      question: `Перекладіть: "${word.original}"`,
      correctAnswer: word.translation,
      hint: word.example ?? lesson.theory.rules[0],
      stepByStep: [
        `Контекст: ${lesson.title}`,
        word.example ? `Приклад: ${word.example}` : lesson.theory.rules[0],
        `Відповідь: ${word.translation}`,
      ],
      explanation: `${word.original} = ${word.translation}`,
      difficulty: 2,
    };
  },

  async generateSetFromTopic(topic: string): Promise<Omit<Word, 'id' | 'masteryLevel' | 'wrongCount'>[]> {
    const key = normalizeTopic(topic);
    const vocab = TOPIC_VOCAB[key] ?? TOPIC_VOCAB.travel;
    return vocab.map((v) => ({
      original: v.original,
      translation: v.translation,
      example: `Example: I use "${v.original}" every day.`,
    }));
  },

  recommendNextStep(stats: UserStats & { lessonProgress?: unknown[]; topicProgress?: unknown[] }): string {
    const rec = generateNextStepRecommendation(
      stats,
      (stats.lessonProgress as import('../types/learning').LessonProgress[]) ?? [],
      (stats.topicProgress as import('../types/learning').TopicProgress[]) ?? []
    );
    return rec.message;
  },

  recommendLesson(stats: UserStats, lessonProgress: import('../types/learning').LessonProgress[]): Lesson | undefined {
    const rec = generateNextStepRecommendation(stats, lessonProgress, []);
    if (rec.recommendedLessonId) return findLesson(rec.recommendedLessonId);
    const completed = new Set(lessonProgress.filter((l) => l.completed).map((l) => l.lessonId));
    return getAllLessons().find((l) => !completed.has(l.id));
  },

  getSubjectTip(subject: Subject): string {
    const tips: Record<Subject, string> = {
      English: 'Почніть з уроку B1 — Present Simple. Повторюйте слабкі слова щодня.',
      Polish: 'Розпочніть з A1 — Powitania. Вимовляйте слова вголос для кращого запам\'ятовування.',
      Python: 'Почніть з Variables. Пишіть код вручну, не лише читайте.',
    };
    return tips[subject];
  },
};
