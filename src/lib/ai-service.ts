import { Word } from '../types/learning';

export const AIService = {
  async generateSetFromTopic(topic: string): Promise<Partial<Word>[]> {
    // Simulating AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: Record<string, Partial<Word>[]> = {
      'Travel': [
        { original: 'Airport', translation: 'Аеропорт', example: 'I am going to the airport.', pronunciation: '/ˈeəpɔːt/' },
        { original: 'Passport', translation: 'Паспорт', example: 'Don\'t forget your passport.', pronunciation: '/ˈpɑːspɔːt/' },
        { original: 'Ticket', translation: 'Квиток', example: 'Can I see your ticket?', pronunciation: '/ˈtɪkɪt/' },
      ],
      'Business': [
        { original: 'Meeting', translation: 'Зустріч', example: 'The meeting starts at 9 AM.', pronunciation: '/ˈmiːtɪŋ/' },
        { original: 'Contract', translation: 'Контракт', example: 'Please sign the contract.', pronunciation: '/ˈkɒntrækt/' },
      ]
    };

    return mockData[topic] || [
      { original: `${topic} word 1`, translation: 'Переклад 1', example: 'Example sentence.' },
      { original: `${topic} word 2`, translation: 'Переклад 2', example: 'Example sentence.' },
    ];
  },

  async getExplanation(word: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `The word "${word}" is commonly used in daily conversations. A good way to remember it is to associate it with...`;
  }
};