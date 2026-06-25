import { CourseLevel, Priority } from '../../types/learning';
import { buildLesson, buildTopicLessons } from './lesson-builder';

const TOPICS = [
  { id: 'travel', title: 'Podróże', desc: 'Słownictwo podróżnicze i zwroty.', priority: 'essential' as Priority },
  { id: 'work', title: 'Praca', desc: 'Język zawodowy i biurowy.', priority: 'essential' as Priority },
  { id: 'daily-life', title: 'Codzienne życie', desc: 'Rozmowy codzienne i rutyny.', priority: 'essential' as Priority },
  { id: 'education', title: 'Edukacja', desc: 'Język akademicki i szkolny.', priority: 'standard' as Priority },
  { id: 'technology', title: 'Technologia', desc: 'Słownictwo cyfrowe.', priority: 'standard' as Priority },
  { id: 'business', title: 'Biznes', desc: 'Spotkania i negocjacje.', priority: 'standard' as Priority },
];

const ESSENTIAL_GRAMMAR_TITLES = new Set([
  'Powitania',
  'Czasownik być',
  'Pytania',
  'Rzeczowniki',
  'Przypadki',
]);

const POLISH_TOPIC_THEORY: Record<string, { explanation: string; rules: string[]; examples: { original: string; translation: string }[] }> = {
  travel: {
    explanation: 'Podróżowanie — słownictwo i zwroty przydatne w podróży: bilet, pociąg, dworzec, kierunki.',
    rules: [
      'Bilet: bilet, peron, kasownik, ulga',
      'Kierunki: w lewo, w prawo, prosto, obok',
      'Transport: pociąg, autobus, stacja, odjazd',
    ],
    examples: [
      { original: 'Gdzie jest stacja?', translation: 'Де знаходиться станція?' },
      { original: 'Poproszę bilet do Krakowa.', translation: 'Один квиток до Кракова, будь ласка.' },
      { original: 'Kiedy odjeżdża pociąg?', translation: 'Коли відправляється потяг?' },
      { original: 'Skręć w lewo.', translation: 'Поверніть ліворуч.' },
      { original: 'Ile kosztuje bilet?', translation: 'Скільки коштує квиток?' },
    ],
  },
  work: {
    explanation: 'Praca — słownictwo zawodowe: biuro, spotkanie, praca, szef.',
    rules: [
      'Biuro: biuro, kolega, szef, komputer',
      'Spotkania: spotkanie, porządek obrad, protokół',
      'Kariera: praca, umowa, pensja, awans',
    ],
    examples: [
      { original: 'Mam spotkanie o 10.', translation: 'У мене зустріч о 10.' },
      { original: 'Gdzie jest moje biuro?', translation: 'Де мій офіс?' },
      { original: 'Mój szef jest miły.', translation: 'Мій начальник приємний.' },
      { original: 'Podpisaliśmy umowę.', translation: 'Ми підписали контракт.' },
      { original: 'Kiedy jest spotkanie?', translation: 'Коли зустріч?' },
    ],
  },
  'daily-life': {
    explanation: 'Codzienne życie — rozmowy i rutyna: powitania, jedzenie, zakupy.',
    rules: [
      'Powitania: cześć, dzień dobry, do widzenia',
      'Jedzenie: obiad, kolacja, chleb, woda',
      'Zakupy: sklep, cena, kupić, zapłacić',
    ],
    examples: [
      { original: 'Cześć! Jak się masz?', translation: 'Привіт! Як справи?' },
      { original: 'Co robisz dzisiaj?', translation: 'Що ти робиш сьогодні?' },
      { original: 'Idę do sklepu.', translation: 'Я йду в магазин.' },
      { original: 'Ile to kosztuje?', translation: 'Скільки це коштує?' },
      { original: 'Smacznego!', translation: 'Смачного!' },
    ],
  },
};

const GRAMMAR_A1 = [
  { title: 'Powitania', explanation: 'Podstawowe zwroty grzecznościowe.', rules: ['Dzień dobry — formalnie', 'Cześć — nieformalnie', 'Do widzenia — pożegnanie'], sentence: '___! Jak się masz?', options: ['Dzień dobry', 'Do widzenia', 'Dziękuję', 'Proszę'], correct: 'Dzień dobry' },
  { title: 'Liczebniki', explanation: 'Liczby od 1 do 100.', rules: ['Jeden, dwa, trzy...', '11-19 mają specjalne formy', 'Setki: sto, dwieście'], sentence: 'Mam ___ lata.', options: ['dwadzieścia', 'dwadzieścia dwa', 'dwadzieścia trzy', 'trzydzieści'], correct: 'dwadzieścia' },
  { title: 'Rzeczowniki', explanation: 'Rodzaj męski, żeński, nijaki.', rules: ['-a → zazwyczaj żeński', 'Brak końcówki → męski', '-o/-e → nijaki'], sentence: 'To jest ___.', options: ['dom', 'doma', 'domu', 'domem'], correct: 'dom' },
  { title: 'Czasownik być', explanation: 'Odmiana czasownika być.', rules: ['jestem, jesteś, jest', 'jesteśmy, jesteście, są', 'Używaj z przymiotnikami'], sentence: 'On ___ studentem.', options: ['jestem', 'jest', 'są', 'jesteś'], correct: 'jest' },
  { title: 'Pytania', explanation: 'Tworzenie pytań z kto/co/gdzie.', rules: ['Kto? — osoby', 'Co? — rzeczy', 'Gdzie? — miejsca'], sentence: '___ to jest?', options: ['Kto', 'Co', 'Gdzie', 'Kiedy'], correct: 'Co' },
];

const GRAMMAR_A2 = [
  { title: 'Czas przeszły', explanation: 'Czasowniki w czasie przeszłym.', rules: ['-łem/-łam dla I osoby', 'Formy nieregularne', 'Niedokończony: byłem + -ł'], sentence: 'Wczoraj ___ do kina.', options: ['idę', 'szedłem', 'pójdę', 'chodzę'], correct: 'szedłem' },
  { title: 'Przyszłość', explanation: 'Wyrażanie przyszłości.', rules: ['będę + imiesłów', 'Pójdę — perfective', 'Idę jutro — present for future'], sentence: 'Jutro ___ do lekarza.', options: ['idę', 'poszedłem', 'pójdę', 'chodziłem'], correct: 'pójdę' },
  { title: 'Przypadki', explanation: 'Mianownik, dopełniacz, celownik.', rules: ['Kto? Co? — mianownik', 'Kogo? Czego? — dopełniacz', 'Komu? Czemu? — celownik'], sentence: 'Nie mam ___.', options: ['pieniądze', 'pieniędzy', 'pieniądz', 'pieniądzem'], correct: 'pieniędzy' },
  { title: 'Przymiotniki', explanation: 'Odmiana przymiotników.', rules: ['Zgodność z rodzajem', 'Zgodność z liczbą', 'Stopniowanie: -szy, naj-'], sentence: 'To jest ___ dom.', options: ['duży', 'duża', 'duże', 'dużego'], correct: 'duży' },
  { title: 'Zaimki', explanation: 'Zaimki osobowe i dzierżawcze.', rules: ['ja, ty, on/ona/ono', 'mój, twój, jego/jej', 'Nasz, wasz, ich'], sentence: 'To jest ___ książka.', options: ['mój', 'moja', 'moje', 'moim'], correct: 'moja' },
];

const GRAMMAR_B1 = [
  { title: 'Tryb warunkowy', explanation: 'Wyrażanie warunków.', rules: ['Gdybym miał...', 'Chciałbym...', 'Formalny rejestr'], sentence: 'Gdybym miał czas, ___ więcej.', options: ['czytam', 'czytałbym', 'przeczytam', 'czytałem'], correct: 'czytałbym' },
  { title: 'Strona bierna', explanation: 'Konstrukcje bierne.', rules: ['zostać + imiesłów', 'Formalny styl', 'Często w wiadomościach'], sentence: 'Dom ___ zbudowany w 1990.', options: ['jest', 'został', 'będzie', 'był'], correct: 'został' },
  { title: 'Imiesłowy', explanation: 'Formy imiesłowowe.', rules: ['-ący/-ąca — czynny', '-ny/-na — bierny', 'Równoczesność lub kolejność'], sentence: '___ książkę, usiadł.', options: ['Czytając', 'Przeczytawszy', 'Czyta', 'Czytał'], correct: 'Przeczytawszy' },
  { title: 'Zdania podrzędne', explanation: 'Łączenie zdań w zdania złożone.', rules: ['że, żeby, gdy', 'Który, która, które', 'Ponieważ, chociaż'], sentence: 'Wiem, ___ on przyjdzie.', options: ['że', 'żeby', 'gdyby', 'aby'], correct: 'że' },
  { title: 'Słownictwo biznesowe', explanation: 'Język formalny w pracy.', rules: ['Pan/Pani — formalność', 'Proszę o... — prośby', 'Z poważaniem — zakończenie'], sentence: '___ o odpowiedź.', options: ['Proszę', 'Prosi', 'Prosił', 'Prosić'], correct: 'Proszę' },
];

const VOCAB: Record<string, { original: string; translation: string; example?: string }[]> = {
  travel: [
    { original: 'Bilet', translation: 'Квиток', example: 'Kupiłem bilet na pociąg.' },
    { original: 'Lotnisko', translation: 'Аеропорт', example: 'Lotnisko jest duże.' },
    { original: 'Mapa', translation: 'Карта', example: 'Potrzebuję mapy miasta.' },
    { original: 'Hotel', translation: 'Готель', example: 'Hotel jest blisko centrum.' },
  ],
  work: [
    { original: 'Praca', translation: 'Робота', example: 'Moja praca jest ciekawa.' },
    { original: 'Szef', translation: 'Начальник', example: 'Szef jest w biurze.' },
    { original: 'Spotkanie', translation: 'Зустріч', example: 'Spotkanie o dziesiątej.' },
    { original: 'Umowa', translation: 'Договір', example: 'Podpisałem umowę.' },
  ],
  'daily-life': [
    { original: 'Sklep', translation: 'Магазин', example: 'Idę do sklepu.' },
    { original: 'Rodzina', translation: 'Сім\'я', example: 'Moja rodzina jest duża.' },
    { original: 'Jedzenie', translation: 'Їжа', example: 'Lubię polskie jedzenie.' },
    { original: 'Pogoda', translation: 'Погода', example: 'Dzisiaj ładna pogoda.' },
  ],
  education: [
    { original: 'Szkoła', translation: 'Школа', example: 'Szkoła zaczyna się o ósmej.' },
    { original: 'Nauczyciel', translation: 'Вчитель', example: 'Nauczyciel jest cierpliwy.' },
    { original: 'Egzamin', translation: 'Іспит', example: 'Egzamin był trudny.' },
    { original: 'Lekcja', translation: 'Урок', example: 'Lekcja trwa 45 minut.' },
  ],
  technology: [
    { original: 'Komputer', translation: 'Комп\'ютер', example: 'Komputer jest nowy.' },
    { original: 'Internet', translation: 'Інтернет', example: 'Internet nie działa.' },
    { original: 'Hasło', translation: 'Пароль', example: 'Zmień hasło.' },
    { original: 'Aplikacja', translation: 'Додаток', example: 'Pobierz aplikację.' },
  ],
  business: [
    { original: 'Firma', translation: 'Компанія', example: 'Firma rośnie szybko.' },
    { original: 'Klient', translation: 'Клієнт', example: 'Klient jest zadowolony.' },
    { original: 'Oferta', translation: 'Пропозиція', example: 'Oferta jest atrakcyjna.' },
    { original: 'Zysk', translation: 'Прибуток', example: 'Zysk wzrósł o 10%.' },
  ],
};

function generatePolishLevel(
  level: 'A1' | 'A2' | 'B1',
  grammar: typeof GRAMMAR_A1
): CourseLevel['topics'] {
  return TOPICS.map((topic) => {
    const vocab = VOCAB[topic.id];
    const templates = grammar.map((g, idx) => ({
      id: `pl-${level.toLowerCase()}-${topic.id}-l${idx + 1}`,
      title: `${g.title} — ${topic.title}`,
      explanation: g.explanation,
      rules: g.rules,
      examples: vocab.slice(0, 2).map((v) => ({
        original: v.example ?? v.original,
        translation: `${v.original} = ${v.translation}`,
      })),
      vocabulary: vocab,
      grammarPoints: [{
        sentence: g.sentence,
        options: g.options,
        correctAnswer: g.correct,
        explanation: g.explanation,
        hint: g.rules[0],
        steps: g.rules.map((r, i) => `Крок ${i + 1}: ${r}`).concat([`Відповідь: ${g.correct}`]),
      }],
      practiceQuestions: vocab.map((v) => ({
        question: `Переклад: "${v.original}"`,
        correctAnswer: v.translation,
        hint: v.example ?? g.rules[0],
        steps: [`Слово: ${v.original}`, v.example ?? g.rules[0], `Відповідь: ${v.translation}`],
        explanation: `${v.original} = ${v.translation}`,
        type: 'writing' as const,
      })).concat(
        ESSENTIAL_GRAMMAR_TITLES.has(g.title)
          ? vocab.flatMap((v) => ([
              {
                question: `Wybierz: "${v.original}"`,
                options: [v.translation, 'Невідомо', 'Інше', 'Пропустити'].sort(() => Math.random() - 0.5),
                correctAnswer: v.translation,
                hint: v.example ?? g.rules[0],
                steps: [g.rules[0], v.example ?? g.title, `Відповідь: ${v.translation}`],
                explanation: v.example ?? `${v.original} = ${v.translation}`,
                type: 'multiple-choice' as const,
              },
              {
                question: `Użyj w zdaniu: "${v.original}"`,
                correctAnswer: v.translation,
                hint: v.example ?? g.rules[0],
                steps: [g.rules[0], v.example ?? g.title, `Відповідь: ${v.translation}`],
                explanation: `${v.original} = ${v.translation}`,
                type: 'writing' as const,
              },
            ]))
          : []
      ),
    }));

    // Extra vocab lessons
    templates.push({
      id: `pl-${level.toLowerCase()}-${topic.id}-vocab`,
      title: `Słownictwo — ${topic.title}`,
      explanation: `Słownictwo tematyczne: ${topic.title}.`,
      rules: ['Ucz się po 4 słowa dziennie', 'Twórz zdania przykładowe', 'Powtarzaj na głos'],
      examples: vocab.map((v) => ({ original: v.original, translation: v.translation })),
      vocabulary: vocab,
      grammarPoints: [],
      practiceQuestions: vocab.map((v) => ({
        question: `"${v.original}" to:`,
        options: [v.translation, 'Невідомо', 'Інше', 'Пропустити'],
        correctAnswer: v.translation,
        hint: v.example ?? topic.desc,
        steps: [`${v.original}`, v.example ?? topic.desc, v.translation],
        explanation: v.example ?? `${v.original} = ${v.translation}`,
        type: 'multiple-choice' as const,
      })),
    });

    return {
      id: `pl-${level.toLowerCase()}-${topic.id}`,
      title: topic.title,
      description: topic.desc,
      subject: 'Polish' as const,
      priority: topic.priority,
      section: topic.priority === 'essential' ? '⭐ ESSENTIAL POLISH' : 'More Topics',
      theory: POLISH_TOPIC_THEORY[topic.id],
      practiceTasks: topic.priority === 'essential' ? Array.from({ length: 15 }, (_, i) => `Zadanie ${i + 1}: Ćwicz słownictwo i gramatykę — ${topic.title}`) : undefined,
      lessons: buildTopicLessons(
        `pl-${level.toLowerCase()}-${topic.id}`,
        topic.title,
        'Polish',
        level,
        templates
      ),
    };
  });
}

function ensureMinLessons(topics: CourseLevel['topics'], minTotal: number): CourseLevel['topics'] {
  const perTopic = Math.ceil(minTotal / TOPICS.length);
  return topics.map((topic) => {
    const topicKey = topic.id.split('-').slice(2).join('-');
    const vocab = VOCAB[topicKey] ?? VOCAB.travel;
    while (topic.lessons.length < perTopic) {
      const n = topic.lessons.length + 1;
      topic.lessons.push(
        buildLesson({
          id: `${topic.id}-practice-${n}`,
          title: `${topic.title} — Ćwiczenie ${n}`,
          topicId: topic.id,
          subject: 'Polish',
          level: topic.lessons[0]?.level ?? 'A1',
          explanation: `Dodatkowe ćwiczenia: ${topic.title}.`,
          rules: ['Powtórz słownictwo', 'Użyj w zdaniu', 'Sprawdź odpowiedź'],
          examples: vocab.map((v) => ({ original: v.original, translation: v.translation })),
          vocabulary: vocab,
          practiceQuestions: vocab.map((v) => ({
            question: `Co znaczy "${v.original}"?`,
            options: [v.translation, 'Nic', 'Coś innego', 'Nie wiem'],
            correctAnswer: v.translation,
            hint: v.example ?? 'Pomyśl o kontekście',
            steps: [v.original, v.example ?? 'Kontekst tematyczny', v.translation],
            explanation: `${v.original} = ${v.translation}`,
            type: 'multiple-choice' as const,
          })),
        })
      );
    }
    return topic;
  });
}

export const POLISH_COURSE: CourseLevel[] = [
  { level: 'A1', topics: ensureMinLessons(generatePolishLevel('A1', GRAMMAR_A1), 12) },
  { level: 'A2', topics: ensureMinLessons(generatePolishLevel('A2', GRAMMAR_A2), 12) },
  { level: 'B1', topics: ensureMinLessons(generatePolishLevel('B1', GRAMMAR_B1), 12) },
];
