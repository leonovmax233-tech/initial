import { CourseLevel, Topic } from '../types/learning';

export const ENGLISH_COURSE: CourseLevel[] = [
  {
    level: 'B1',
    topics: [
      {
        id: 'travel-b1',
        title: 'Travel & Tourism',
        description: 'Essential vocabulary for airports, hotels, and sightseeing.',
        explanation: 'At B1 level, you should be able to handle most situations while traveling.',
        vocabulary: [
          { id: '1', original: 'Departure', translation: 'Відправлення', masteryLevel: 0, wrongCount: 0 },
          { id: '2', original: 'Accommodation', translation: 'Проживання', masteryLevel: 0, wrongCount: 0 },
          { id: '3', original: 'Sightseeing', translation: 'Огляд визначних пам\'яток', masteryLevel: 0, wrongCount: 0 },
        ]
      },
      {
        id: 'work-b1',
        title: 'Work & Career',
        description: 'Office life, meetings, and job interviews.',
        explanation: 'Focus on professional communication and basic business terms.',
        vocabulary: [
          { id: '4', original: 'Deadline', translation: 'Крайній термін', masteryLevel: 0, wrongCount: 0 },
          { id: '5', original: 'Promotion', translation: 'Підвищення', masteryLevel: 0, wrongCount: 0 },
        ]
      }
    ]
  },
  {
    level: 'B2',
    topics: [
      {
        id: 'tech-b2',
        title: 'Technology & Future',
        description: 'AI, gadgets, and digital transformation.',
        explanation: 'Discussing complex technical concepts and their impact.',
        vocabulary: [
          { id: '6', original: 'Innovation', translation: 'Інновація', masteryLevel: 0, wrongCount: 0 },
          { id: '7', original: 'Sustainable', translation: 'Сталий', masteryLevel: 0, wrongCount: 0 },
        ]
      }
    ]
  }
];

export const PYTHON_COURSE: Topic[] = [
  {
    id: 'py-vars',
    title: 'Variables & Types',
    description: 'How to store data in Python.',
    explanation: 'Variables are containers for storing data values. Python has no command for declaring a variable.',
    vocabulary: [
      { id: 'p1', original: 'Integer', translation: 'Ціле число', masteryLevel: 0, wrongCount: 0 },
      { id: 'p2', original: 'String', translation: 'Рядок', masteryLevel: 0, wrongCount: 0 },
    ],
    grammarRules: 'x = 5\ny = "Hello"'
  },
  {
    id: 'py-loops',
    title: 'Loops & Iteration',
    description: 'Repeating actions with for and while.',
    explanation: 'A for loop is used for iterating over a sequence.',
    vocabulary: [
      { id: 'p3', original: 'Iteration', translation: 'Ітерація', masteryLevel: 0, wrongCount: 0 },
      { id: 'p4', original: 'Sequence', translation: 'Послідовність', masteryLevel: 0, wrongCount: 0 },
    ],
    grammarRules: 'for i in range(5):\n  print(i)'
  }
];

export const AI_GENERATOR_DATA: Record<string, any[]> = {
  'travel': [
    { original: 'Passport', translation: 'Паспорт' },
    { original: 'Flight', translation: 'Політ' },
    { original: 'Destination', translation: 'Пункт призначення' },
    { original: 'Itinerary', translation: 'Маршрут' },
    { original: 'Boarding pass', translation: 'Посадковий талон' },
  ],
  'business': [
    { original: 'Revenue', translation: 'Дохід' },
    { original: 'Stakeholder', translation: 'Зацікавлена сторона' },
    { original: 'Negotiation', translation: 'Переговори' },
    { original: 'Strategy', translation: 'Стратегія' },
    { original: 'Market share', translation: 'Частка ринку' },
  ]
};