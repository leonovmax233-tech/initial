import { CourseLevel } from '../../types/learning';
import { buildLesson, buildTopicLessons, LessonTemplate } from './lesson-builder';

const TOPICS = [
  { id: 'travel', title: 'Подорожі', desc: 'Vocabulary and grammar for travel situations.' },
  { id: 'work', title: 'Робота', desc: 'Professional communication and workplace English.' },
  { id: 'daily-life', title: 'Повсякденне життя', desc: 'Everyday conversations and routines.' },
  { id: 'education', title: 'Освіта', desc: 'Academic language and study skills.' },
  { id: 'technology', title: 'Технології', desc: 'Digital world vocabulary and expressions.' },
  { id: 'business', title: 'Бізнес', desc: 'Meetings, negotiations, and business writing.' },
];

const GRAMMAR_BY_LEVEL: Record<string, { title: string; explanation: string; rules: string[]; grammar: { sentence: string; options: string[]; correct: string; explanation: string } }[]> = {
  B1: [
    { title: 'Present Simple', explanation: 'Used for habits, facts, and regular actions.', rules: ['Add -s for he/she/it', 'Use do/does for questions', 'Use don\'t/doesn\'t for negatives'], grammar: { sentence: 'She ___ to work every day.', options: ['go', 'goes', 'going', 'went'], correct: 'goes', explanation: 'Third person singular takes -s.' } },
    { title: 'Past Simple', explanation: 'Used for completed actions in the past.', rules: ['Regular verbs: add -ed', 'Irregular verbs have special forms', 'Use did for questions'], grammar: { sentence: 'I ___ to Paris last year.', options: ['go', 'went', 'gone', 'going'], correct: 'went', explanation: 'Go → went (irregular past form).' } },
    { title: 'Present Continuous', explanation: 'Used for actions happening now or temporary situations.', rules: ['Form: am/is/are + verb-ing', 'Not used with stative verbs', 'Often with now, at the moment'], grammar: { sentence: 'They ___ dinner right now.', options: ['cook', 'cooks', 'are cooking', 'cooked'], correct: 'are cooking', explanation: 'Action in progress → Present Continuous.' } },
    { title: 'Future with Will', explanation: 'Used for predictions and spontaneous decisions.', rules: ['Form: will + base verb', 'No -s for third person', 'Use won\'t for negatives'], grammar: { sentence: 'It ___ rain tomorrow.', options: ['will', 'is', 'was', 'has'], correct: 'will', explanation: 'Prediction about future → will + verb.' } },
    { title: 'Comparatives', explanation: 'Compare two things using -er or more.', rules: ['Short adj: add -er (+ than)', 'Long adj: more + adj (+ than)', 'Irregular: good→better, bad→worse'], grammar: { sentence: 'This hotel is ___ than the last one.', options: ['good', 'better', 'best', 'more good'], correct: 'better', explanation: 'Comparing two → comparative form.' } },
  ],
  'B1+': [
    { title: 'Present Perfect', explanation: 'Connects past actions to the present.', rules: ['Form: have/has + past participle', 'Use with ever, never, just, already', 'Focus on result, not time'], grammar: { sentence: 'I ___ never ___ sushi.', options: ['have / eat', 'have / eaten', 'has / eaten', 'had / eaten'], correct: 'have / eaten', explanation: 'Experience up to now → Present Perfect.' } },
    { title: 'Past Continuous', explanation: 'Action in progress at a specific past time.', rules: ['Form: was/were + verb-ing', 'Often with when/while', 'Background action in stories'], grammar: { sentence: 'While I ___, the phone rang.', options: ['sleep', 'slept', 'was sleeping', 'am sleeping'], correct: 'was sleeping', explanation: 'Ongoing past action → Past Continuous.' } },
    { title: 'Modal Verbs', explanation: 'Express ability, permission, obligation.', rules: ['can/could = ability', 'must/have to = obligation', 'should = advice'], grammar: { sentence: 'You ___ wear a seatbelt.', options: ['can', 'must', 'might', 'would'], correct: 'must', explanation: 'Obligation → must.' } },
    { title: 'First Conditional', explanation: 'Real possibilities in the future.', rules: ['If + Present Simple, will + verb', 'Both clauses can swap order', 'Comma if if-clause comes first'], grammar: { sentence: 'If it rains, we ___ at home.', options: ['stay', 'will stay', 'stayed', 'staying'], correct: 'will stay', explanation: 'Real future possibility → First Conditional.' } },
    { title: 'Relative Clauses', explanation: 'Add information about nouns using who/which/that.', rules: ['who for people', 'which/that for things', 'Omit pronoun if object'], grammar: { sentence: 'The man ___ called is my boss.', options: ['who', 'which', 'where', 'when'], correct: 'who', explanation: 'Person → who.' } },
  ],
  B2: [
    { title: 'Passive Voice', explanation: 'Focus on action rather than doer.', rules: ['Form: be + past participle', 'Use when agent is unknown', 'Common in formal writing'], grammar: { sentence: 'The report ___ yesterday.', options: ['submitted', 'was submitted', 'is submitting', 'has submit'], correct: 'was submitted', explanation: 'Past passive → was + past participle.' } },
    { title: 'Reported Speech', explanation: 'Report what someone said.', rules: ['Tenses shift back one step', 'Say/tell/ask change form', 'Time expressions change'], grammar: { sentence: 'She said she ___ tired.', options: ['is', 'was', 'be', 'has been'], correct: 'was', explanation: 'Present → Past in reported speech.' } },
    { title: 'Third Conditional', explanation: 'Hypothetical past situations.', rules: ['If + Past Perfect, would have + pp', 'Impossible to change now', 'Express regret'], grammar: { sentence: 'If I had studied, I ___ the exam.', options: ['pass', 'passed', 'would pass', 'would have passed'], correct: 'would have passed', explanation: 'Hypothetical past → Third Conditional.' } },
    { title: 'Gerunds & Infinitives', explanation: 'Verb forms after other verbs.', rules: ['Some verbs + gerund (enjoy doing)', 'Some verbs + infinitive (want to do)', 'Some take both with meaning change'], grammar: { sentence: 'I enjoy ___ books.', options: ['read', 'reading', 'to read', 'reads'], correct: 'reading', explanation: 'Enjoy + gerund (-ing).' } },
    { title: 'Advanced Linkers', explanation: 'Connect ideas in complex sentences.', rules: ['However = contrast', 'Furthermore = addition', 'Therefore = result'], grammar: { sentence: '___ , the project was completed on time.', options: ['However', 'Furthermore', 'Therefore', 'Although'], correct: 'Furthermore', explanation: 'Adding information → Furthermore.' } },
  ],
  C1: [
    { title: 'Inversion', explanation: 'Reverse word order for emphasis.', rules: ['Never/Rarely + inversion', 'Not only... but also', 'Formal register'], grammar: { sentence: 'Never ___ such a beautiful sunset.', options: ['I saw', 'have I seen', 'I have seen', 'did I saw'], correct: 'have I seen', explanation: 'Never + auxiliary + subject → inversion.' } },
    { title: 'Subjunctive Mood', explanation: 'Express wishes, demands, suggestions.', rules: ['I suggest he go (not goes)', 'It is vital that she be informed', 'Formal and fixed expressions'], grammar: { sentence: 'It is essential that he ___ on time.', options: ['is', 'be', 'was', 'being'], correct: 'be', explanation: 'Subjunctive after essential → base form.' } },
    { title: 'Cleft Sentences', explanation: 'Emphasize part of a sentence.', rules: ['It is/was... that/who', 'What I need is...', 'Focus on specific information'], grammar: { sentence: 'It was John ___ broke the news.', options: ['who', 'which', 'what', 'where'], correct: 'who', explanation: 'Cleft sentence emphasizing person → who.' } },
    { title: 'Discourse Markers', explanation: 'Organize extended speech and writing.', rules: ['To begin with = start', 'In conclusion = end', 'On the other hand = contrast'], grammar: { sentence: '___, we must consider the economic impact.', options: ['On the other hand', 'In conclusion', 'To begin with', 'For instance'], correct: 'To begin with', explanation: 'Starting argument → To begin with.' } },
    { title: 'Nominalization', explanation: 'Turn verbs/adjectives into nouns.', rules: ['develop → development', 'analyze → analysis', 'Formal academic style'], grammar: { sentence: 'The ___ of the plan took months.', options: ['develop', 'developed', 'development', 'developing'], correct: 'development', explanation: 'Nominalized form needed after The.' } },
  ],
};

const VOCAB_BY_TOPIC: Record<string, VocabItem[]> = {
  travel: [
    { original: 'Passport', translation: 'Паспорт', example: 'Don\'t forget your passport.' },
    { original: 'Luggage', translation: 'Багаж', example: 'My luggage is heavy.' },
    { original: 'Departure', translation: 'Відправлення', example: 'Departure is at 6 AM.' },
    { original: 'Reservation', translation: 'Бронювання', example: 'I have a reservation.' },
  ],
  work: [
    { original: 'Deadline', translation: 'Дедлайн', example: 'The deadline is Friday.' },
    { original: 'Colleague', translation: 'Колега', example: 'My colleague is helpful.' },
    { original: 'Promotion', translation: 'Підвищення', example: 'She got a promotion.' },
    { original: 'Interview', translation: 'Співбесіда', example: 'The interview went well.' },
  ],
  'daily-life': [
    { original: 'Groceries', translation: 'Продукти', example: 'I need to buy groceries.' },
    { original: 'Appointment', translation: 'Зустріч/прийом', example: 'I have a doctor\'s appointment.' },
    { original: 'Neighbourhood', translation: 'Район', example: 'It\'s a quiet neighbourhood.' },
    { original: 'Routine', translation: 'Рутина', example: 'My morning routine is simple.' },
  ],
  education: [
    { original: 'Assignment', translation: 'Завдання', example: 'The assignment is due Monday.' },
    { original: 'Scholarship', translation: 'Стипендія', example: 'She won a scholarship.' },
    { original: 'Graduate', translation: 'Випускник', example: 'He is a university graduate.' },
    { original: 'Research', translation: 'Дослідження', example: 'Research takes time.' },
  ],
  technology: [
    { original: 'Software', translation: 'Програмне забезпечення', example: 'Install the software first.' },
    { original: 'Database', translation: 'База даних', example: 'Store data in a database.' },
    { original: 'Update', translation: 'Оновлення', example: 'Run the latest update.' },
    { original: 'Cybersecurity', translation: 'Кібербезпека', example: 'Cybersecurity is important.' },
  ],
  business: [
    { original: 'Negotiation', translation: 'Переговори', example: 'The negotiation was successful.' },
    { original: 'Investment', translation: 'Інвестиція', example: 'We need more investment.' },
    { original: 'Revenue', translation: 'Дохід', example: 'Revenue increased this year.' },
    { original: 'Stakeholder', translation: 'Зацікавлена сторона', example: 'All stakeholders were informed.' },
  ],
};

interface VocabItem {
  original: string;
  translation: string;
  example?: string;
}

function generateEnglishLevel(level: 'B1' | 'B1+' | 'B2' | 'C1'): CourseLevel['topics'] {
  const grammar = GRAMMAR_BY_LEVEL[level];
  const topics = TOPICS.map((topic, topicIdx) => {
    const lessons: LessonTemplate[] = [];
    const vocab = VOCAB_BY_TOPIC[topic.id];

    grammar.forEach((g, gIdx) => {
      const lessonNum = topicIdx * grammar.length + gIdx + 1;
      if (lessonNum > 15) return;

      lessons.push({
        id: `en-${level.toLowerCase().replace('+', 'p')}-${topic.id}-l${gIdx + 1}`,
        title: `${g.title} — ${topic.title}`,
        explanation: `${g.explanation} Context: ${topic.desc}`,
        rules: g.rules,
        examples: vocab.slice(0, 2).map((v) => ({
          original: v.example ?? v.original,
          translation: `${v.original} = ${v.translation}`,
        })),
        vocabulary: vocab,
        grammarPoints: [{
          sentence: g.grammar.sentence,
          options: g.grammar.options,
          correctAnswer: g.grammar.correct,
          explanation: g.grammar.explanation,
          hint: `Правило: ${g.rules[0]}`,
          steps: g.rules.map((r, i) => `Крок ${i + 1}: ${r}`).concat([`Відповідь: ${g.grammar.correct}`]),
        }],
        practiceQuestions: vocab.map((v) => ({
          question: `Translate: "${v.original}"`,
          correctAnswer: v.translation,
          hint: v.example ?? g.rules[0],
          steps: [`"${v.original}" is a ${topic.title.toLowerCase()} word.`, v.example ? `Example: ${v.example}` : g.rules[0], `Answer: ${v.translation}`],
          explanation: `${v.original} = ${v.translation}`,
          type: 'writing' as const,
        })),
      });
    });

    // Add extra vocabulary-only lessons to reach 15+ per level
    if (lessons.length < 4) {
      lessons.push({
        id: `en-${level.toLowerCase().replace('+', 'p')}-${topic.id}-vocab`,
        title: `Vocabulary — ${topic.title}`,
        explanation: `Essential ${topic.title.toLowerCase()} vocabulary for ${level} level.`,
        rules: [`Learn ${vocab.length} key words`, 'Use them in example sentences', 'Practice daily'],
        examples: vocab.map((v) => ({ original: v.original, translation: v.translation })),
        vocabulary: vocab,
        practiceQuestions: vocab.map((v) => ({
          question: `What is the translation of "${v.original}"?`,
          options: [v.translation, 'Невідомо', 'Інше слово', 'Пропустити'].sort(() => Math.random() - 0.5),
          correctAnswer: v.translation,
          hint: `Think about ${topic.title.toLowerCase()} context`,
          steps: [`Word: ${v.original}`, v.example ?? 'Use context clues', `Translation: ${v.translation}`],
          explanation: v.example ?? `${v.original} = ${v.translation}`,
          type: 'multiple-choice' as const,
        })),
      });
    }

    return {
      id: `en-${level.toLowerCase().replace('+', 'p')}-${topic.id}`,
      title: topic.title,
      description: topic.desc,
      subject: 'English' as const,
      lessons: buildTopicLessons(
        `en-${level.toLowerCase().replace('+', 'p')}-${topic.id}`,
        topic.title,
        'English',
        level,
        lessons
      ),
    };
  });

  return topics;
}

function padLessonsToMinimum(topics: CourseLevel['topics'], minPerLevel: number): CourseLevel['topics'] {
  return topics.map((topic) => {
    while (topic.lessons.length < Math.ceil(minPerLevel / TOPICS.length)) {
      const extraIdx = topic.lessons.length + 1;
      const vocab = VOCAB_BY_TOPIC[topic.id.replace(/^en-\w+-/, '')] ?? VOCAB_BY_TOPIC.travel;
      const extra = buildLesson({
        id: `${topic.id}-extra-${extraIdx}`,
        title: `${topic.title} — Practice ${extraIdx}`,
        topicId: topic.id,
        subject: 'English',
        level: topic.lessons[0]?.level ?? 'B1',
        explanation: `Additional practice for ${topic.title}. Review vocabulary and apply grammar rules.`,
        rules: ['Review previous lessons', 'Practice with examples', 'Test yourself'],
        examples: vocab.map((v) => ({ original: v.original, translation: v.translation })),
        vocabulary: vocab,
        practiceQuestions: vocab.map((v) => ({
          question: `"${v.original}" means:`,
          options: [v.translation, 'Ні', 'Можливо', 'Не знаю'].filter((o, i, a) => a.indexOf(o) === i).slice(0, 4),
          correctAnswer: v.translation,
          hint: v.example ?? 'Use context',
          steps: [`Recall: ${v.original}`, `Example helps: ${v.example ?? 'think of context'}`, `Answer: ${v.translation}`],
          explanation: `${v.original} = ${v.translation}`,
          type: 'multiple-choice' as const,
        })),
      });
      topic.lessons.push(extra);
    }
    return topic;
  });
}

export const ENGLISH_COURSE: CourseLevel[] = [
  { level: 'B1', topics: padLessonsToMinimum(generateEnglishLevel('B1'), 15) },
  { level: 'B1+', topics: padLessonsToMinimum(generateEnglishLevel('B1+'), 15) },
  { level: 'B2', topics: padLessonsToMinimum(generateEnglishLevel('B2'), 15) },
  { level: 'C1', topics: padLessonsToMinimum(generateEnglishLevel('C1'), 15) },
];
