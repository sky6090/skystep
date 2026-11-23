export type QuestionType = 'banked-cloze' | 'matching' | 'careful-reading'

export interface ReadingPassage {
  id: string
  title: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  passageId: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
  sharedOptions?: boolean
}

export interface ReadingSection {
  id: string
  title: string
  durationMin: number
  passageIds: string[]
  questions: Question[]
}

export const readingPassages: ReadingPassage[] = [
  {
    id: 'p-cloze',
    title: 'A System That Survives a Busy Week',
    text: `Many students advocate a single study method, but no method is [1] for every learner. A [2] system combines short sessions with retrieval practice. Without review, memory can [3], and small gains may [4]. [5] effort matters more than one long night before the exam. The evidence is not [6]: [7] studies point in the same direction. A [8] plan that you actually follow beats a complicated one you abandon. Over time, small sessions produce [9] progress. Some forgetting is [10], so the goal is a system that keeps you from feeling vulnerable.`,
  },
  {
    id: 'p-matching',
    title: 'Building a Study Routine',
    text: `A. Choose a fixed time of day for study, even if it is only twenty minutes.
B. Keep the first session short enough that starting does not feel like a punishment.
C. Put your phone in another room, not just face down on the desk.
D. Clear yesterday's review before you add new words.
E. Test yourself instead of rereading the same page.
F. Track whether you finished the session, not how long you sat at the desk.
G. Leave one day a week free for catch-up, so a missed day does not break the plan.
H. Protect your sleep; memory consolidation depends on rest.
I. Change your study place when you feel stuck, even if it is just another table.
J. Reward yourself after the session, not during it.`,
  },
  {
    id: 'p-careful-1',
    title: 'The Case for Slow Reading',
    text: `Many study guides tell students to read faster. Skimming can help you locate a fact, but it rarely helps you understand how an argument fits together. In one experiment, students who read a passage slowly and then explained it in their own words remembered more than students who read it twice quickly. The fast readers reported feeling confident, but their confidence was often an illusion: they recognized the words without being able to use the ideas. Slow reading is not about reading every word aloud. It means pausing at the end of a paragraph, asking what the author is claiming, and connecting it to what you already know. This takes time, but it is time spent building a model of the text rather than collecting isolated facts. For exam preparation, the habit is especially useful. A careful reader can spot the difference between a main idea and an example, which is exactly what many reading questions test.`,
  },
  {
    id: 'p-careful-2',
    title: 'Why Small Parks Matter',
    text: `City planners once believed that a few large parks were enough. Small parks, often no bigger than a parking lot, are now seen as part of the daily infrastructure of a neighborhood. They are close enough to visit without a car, which matters for children, older people, and anyone with a short break. A small park can lower street temperature, absorb rainwater, and give people a place to meet. Critics argue that small parks cannot replace large ones: they lack space for sports fields and may attract only nearby residents. Supporters reply that the question is not either/or. A city needs both. The advantage of a small park is frequency. A large park may be visited once a month; a small one can be part of a daily walk. That frequency is what turns a public space into a habit. The design matters, too. A bench in the shade, a safe crossing, and a few trees can make a tiny space feel cared for. The lesson is simple: cities should stop thinking of parks as destinations and start treating them as everyday equipment.`,
  },
]

const clozeOptions = [
  'feasible',
  'coherent',
  'deteriorate',
  'diminish',
  'persistent',
  'ambiguous',
  'empirical',
  'plausible',
  'substantial',
  'inevitable',
  'advocate',
  'fluctuate',
  'inhibit',
  'legitimate',
  'intricate',
]

const clozeAnswers = [
  'feasible',
  'coherent',
  'deteriorate',
  'diminish',
  'persistent',
  'ambiguous',
  'empirical',
  'plausible',
  'substantial',
  'inevitable',
]

const clozeQuestions: Question[] = clozeAnswers.map((answer, index) => ({
  id: `cloze-${index + 1}`,
  type: 'banked-cloze',
  passageId: 'p-cloze',
  prompt: `第 ${index + 1} 空`,
  options: clozeOptions,
  answer,
  sharedOptions: true,
  explanation: `第 ${index + 1} 空应填 ${answer}。结合上下文判断词义与词性，注意同词性干扰项。`,
}))

const matchingStatements: Array<{ text: string; answer: string; explanation: string }> = [
  {
    text: 'A regular time makes it easier to start studying.',
    answer: 'A',
    explanation: 'A 段说固定时间，即使只有二十分钟。',
  },
  {
    text: 'A short first session lowers the resistance to starting.',
    answer: 'B',
    explanation: 'B 段说第一次不要太长，避免开始像惩罚。',
  },
  {
    text: 'Putting the phone physically away reduces temptation.',
    answer: 'C',
    explanation: 'C 段说把手机放到另一个房间，而不是扣在桌上。',
  },
  {
    text: 'Finish yesterday’s review before adding new material.',
    answer: 'D',
    explanation: 'D 段说先清昨天的复习，再加新词。',
  },
  {
    text: 'Testing yourself works better than rereading.',
    answer: 'E',
    explanation: 'E 段直接说 test yourself instead of rereading。',
  },
  {
    text: 'Measure completion rather than time spent sitting.',
    answer: 'F',
    explanation: 'F 段说记录是否完成，而不是坐了多久。',
  },
  {
    text: 'Leave room for a missed day without breaking the plan.',
    answer: 'G',
    explanation: 'G 段说每周留一天补进度。',
  },
  {
    text: 'Memory consolidation depends on rest.',
    answer: 'H',
    explanation: 'H 段说保护睡眠，记忆巩固依赖休息。',
  },
  {
    text: 'A different place can help when you feel stuck.',
    answer: 'I',
    explanation: 'I 段说卡住时换个地方。',
  },
  {
    text: 'Rewards work better after the effort.',
    answer: 'J',
    explanation: 'J 段说学习后再奖励，而不是学习中。',
  },
]

const matchingQuestions: Question[] = matchingStatements.map((statement, index) => ({
  id: `match-${index + 1}`,
  type: 'matching',
  passageId: 'p-matching',
  prompt: statement.text,
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  answer: statement.answer,
  explanation: statement.explanation,
}))

const carefulOne: Question[] = [
  {
    id: 'careful1-1',
    type: 'careful-reading',
    passageId: 'p-careful-1',
    prompt: 'What is the main idea of the passage?',
    options: [
      'Reading faster is always better.',
      'Slow reading helps readers build understanding.',
      'Students should memorize every word.',
      'Study guides are unreliable.',
    ],
    answer: 'B',
    explanation: '文章主张慢读帮助理解论证结构，而不是只收集事实。',
  },
  {
    id: 'careful1-2',
    type: 'careful-reading',
    passageId: 'p-careful-1',
    prompt: 'Why does the author mention the experiment?',
    options: [
      'To show that fast readers are less confident.',
      'To contrast confident recognition with actual understanding.',
      'To prove that slow reading is popular.',
      'To explain how to read aloud.',
    ],
    answer: 'B',
    explanation: '实验说明快速阅读者感觉自信，但只是识别了词，不能用观点。',
  },
  {
    id: 'careful1-3',
    type: 'careful-reading',
    passageId: 'p-careful-1',
    prompt: 'What does “the illusion of competence” refer to?',
    options: [
      'The belief that skimming equals learning.',
      'The ability to recognize words.',
      'The habit of reading twice.',
      'The fear of exams.',
    ],
    answer: 'A',
    explanation: '错觉指把“看过/认得”当成“学会”。',
  },
  {
    id: 'careful1-4',
    type: 'careful-reading',
    passageId: 'p-careful-1',
    prompt: 'According to the passage, what should a slow reader do at the end of a paragraph?',
    options: [
      'Memorize the first sentence.',
      'Ask what the author is claiming.',
      'Read the paragraph again quickly.',
      'Count the words.',
    ],
    answer: 'B',
    explanation: '文章说在段末暂停，问作者在主张什么。',
  },
  {
    id: 'careful1-5',
    type: 'careful-reading',
    passageId: 'p-careful-1',
    prompt: 'What is the author’s attitude toward slow reading?',
    options: ['Doubtful.', 'Supportive.', 'Neutral.', 'Critical.'],
    answer: 'B',
    explanation: '作者用实验和考试场景支持慢读。',
  },
]

const carefulTwo: Question[] = [
  {
    id: 'careful2-1',
    type: 'careful-reading',
    passageId: 'p-careful-2',
    prompt: 'What changed in city planning?',
    options: [
      'Large parks are no longer useful.',
      'Small parks are now part of daily infrastructure.',
      'Parks are being removed.',
      'Sports fields are more important.',
    ],
    answer: 'B',
    explanation: '文章说小公园被视为社区日常基础设施的一部分。',
  },
  {
    id: 'careful2-2',
    type: 'careful-reading',
    passageId: 'p-careful-2',
    prompt: 'Why are small parks useful for older people?',
    options: [
      'They have sports fields.',
      'They are close enough to visit without a car.',
      'They are larger than large parks.',
      'They are open only on weekends.',
    ],
    answer: 'B',
    explanation: '文章说小公园近，不需要开车。',
  },
  {
    id: 'careful2-3',
    type: 'careful-reading',
    passageId: 'p-careful-2',
    prompt: 'What do critics say about small parks?',
    options: [
      'They cannot replace large ones.',
      'They are too expensive.',
      'Large parks are dangerous.',
      'Small parks should be private.',
    ],
    answer: 'A',
    explanation: '批评者说小公园不能替代大公园。',
  },
  {
    id: 'careful2-4',
    type: 'careful-reading',
    passageId: 'p-careful-2',
    prompt: 'What is the advantage of a small park?',
    options: [
      'It can host major events.',
      'It is visited frequently.',
      'It has more trees.',
      'It is easier to design.',
    ],
    answer: 'B',
    explanation: '小公园的优势是频率高，可以成为日常习惯。',
  },
  {
    id: 'careful2-5',
    type: 'careful-reading',
    passageId: 'p-careful-2',
    prompt: 'What does the author suggest?',
    options: [
      'Cities should build only small parks.',
      'Parks should be treated as everyday equipment.',
      'Large parks should be closed.',
      'Parks should be destinations only.',
    ],
    answer: 'B',
    explanation: '结尾说不要把公园只当目的地，要当日常设施。',
  },
]

export const readingQuestions: Question[] = [
  ...clozeQuestions,
  ...matchingQuestions,
  ...carefulOne,
  ...carefulTwo,
]

export const readingSection: ReadingSection = {
  id: 'reading-section-1',
  title: '阅读专项 · 套题 1',
  durationMin: 40,
  passageIds: ['p-cloze', 'p-matching', 'p-careful-1', 'p-careful-2'],
  questions: readingQuestions,
}

export const passageById = new Map(readingPassages.map((passage) => [passage.id, passage]))
export const questionById = new Map(readingQuestions.map((question) => [question.id, question]))
