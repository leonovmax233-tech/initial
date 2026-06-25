import { Word } from '../types/learning';

const GRAMMAR_RULES: Record<string, string> = {
  'present-simple': 'Present Simple використовується для регулярних дій. Додавайте -s для he/she/it.',
  'past-simple': 'Past Simple використовується для завершених дій у минулому. Використовуйте другу форму дієслова.',
  'python-loops': 'Цикли for в Python використовуються для ітерації по списках або діапазонах.',
};

export const AIService = {
  getExplanation(word: string): string {
    return `Слово "${word}" є важливим для вашого рівня. Рекомендую використовувати метод асоціацій: уявіть візуальний образ цього слова у контексті вашого дня.`;
  },
  
  getGrammarTip(topicId: string): string {
    return GRAMMAR_RULES[topicId] || "Зверніть увагу на порядок слів у реченні.";
  },

  recommendNextStep(stats: any): string {
    if (stats.weakWordIds.length > 5) return "У вас накопичилося багато складних слів. Рекомендую режим 'Слабкі слова'.";
    if (stats.xp < 500) return "Ви чудово почали! Спробуйте пройти тест з теми 'Подорожі'.";
    return "Час вивчити щось нове в розділі Python!";
  }
};