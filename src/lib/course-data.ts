import { CourseLevel } from '../types/learning';

export const ENGLISH_COURSE: CourseLevel[] = [
  {
    level: 'B1',
    topics: [
      {
        id: 'grammar-b1',
        title: 'Core Grammar',
        description: 'Master the essential tenses and structures.',
        lessons: [
          {
            id: 'b1-l1',
            title: 'Present Simple',
            explanation: 'Used for habits, facts, and regular actions. Add -s for he/she/it.',
            vocabulary: [
              { id: 'e1', original: 'Habit', translation: 'Звичка', masteryLevel: 0, wrongCount: 0 },
              { id: 'e2', original: 'Fact', translation: 'Факт', masteryLevel: 0, wrongCount: 0 },
            ]
          },
          {
            id: 'b1-l2',
            title: 'Past Simple',
            explanation: 'Used for completed actions in the past. Use the second form of the verb.',
            vocabulary: [
              { id: 'e3', original: 'Yesterday', translation: 'Вчора', masteryLevel: 0, wrongCount: 0 },
              { id: 'e4', original: 'Ago', translation: 'Тому (назад)', masteryLevel: 0, wrongCount: 0 },
            ]
          }
        ]
      }
    ]
  },
  {
    level: 'B2',
    topics: [
      {
        id: 'advanced-b2',
        title: 'Complex Structures',
        description: 'Passive voice and advanced vocabulary.',
        lessons: [
          {
            id: 'b2-l1',
            title: 'Passive Voice',
            explanation: 'Focus on the action rather than the doer. Form: be + past participle.',
            vocabulary: [
              { id: 'e5', original: 'Constructed', translation: 'Побудований', masteryLevel: 0, wrongCount: 0 },
            ]
          }
        ]
      }
    ]
  }
];

export const POLISH_COURSE: CourseLevel[] = [
  {
    level: 'A1',
    topics: [
      {
        id: 'basics-a1',
        title: 'Podstawy',
        description: 'Pierwsze kroki w języku polskim.',
        lessons: [
          {
            id: 'a1-l1',
            title: 'Powitania',
            explanation: 'Podstawowe zwroty grzecznościowe.',
            vocabulary: [
              { id: 'p1', original: 'Dzień dobry', translation: 'Добрий день', masteryLevel: 0, wrongCount: 0 },
              { id: 'p2', original: 'Cześć', translation: 'Привіт', masteryLevel: 0, wrongCount: 0 },
            ]
          }
        ]
      }
    ]
  }
];

export const PYTHON_COURSE: CourseLevel[] = [
  {
    level: 'Beginner',
    topics: [
      {
        id: 'py-basics',
        title: 'Python Fundamentals',
        description: 'Start your journey as a developer.',
        lessons: [
          {
            id: 'py-l1',
            title: 'Variables & Data Types',
            explanation: 'Variables store data. Types include int, float, str, and bool.',
            vocabulary: [
              { id: 'py1', original: 'Variable', translation: 'Змінна', masteryLevel: 0, wrongCount: 0 },
              { id: 'py2', original: 'Integer', translation: 'Ціле число', masteryLevel: 0, wrongCount: 0 },
            ]
          },
          {
            id: 'py-l2',
            title: 'Loops (for/while)',
            explanation: 'Loops repeat code. "for" iterates over sequences, "while" runs as long as a condition is true.',
            vocabulary: [
              { id: 'py3', original: 'Iteration', translation: 'Ітерація', masteryLevel: 0, wrongCount: 0 },
            ]
          }
        ]
      }
    ]
  }
];