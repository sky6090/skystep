import type {
  Question,
  ReadingPassage,
  ReadingSection,
} from '@/data/questions.sample'

export const readingPassages2: ReadingPassage[] = [
  {
    id: 'p2-cloze',
    title: 'Sleep Is Part of the Work',
    text: `Students often treat sleep as extra time they can borrow for study. The evidence suggests the opposite. Sleep is not a [1] luxury; it is part of how memory is consolidated. During deep sleep, the brain replays what you learned and [2] connections that would otherwise fade. A single all-nighter can [3] attention and make your notes harder to [4]. The effect is not [5]: it shows up in [6] studies of both students and adults. A [7] schedule with a consistent bedtime is more [8] than a heroic weekend catch-up. Small changes can produce [9] gains in mood and recall. Some late nights are [10], but they should be the exception.`,
  },
  {
    id: 'p2-matching',
    title: 'How to Read a Research Paper',
    text: `A. Read the title and abstract first, before you commit to the details.
B. Skim the section headings so you know how the argument is organized.
C. Identify the question the authors are trying to answer.
D. Check whether the method can actually test the claim.
E. Look at who was studied and how many people took part.
F. Separate the results from the authors' interpretation of them.
G. Read the limitations before you trust the conclusion.
H. Compare the study with earlier work on the same question.
I. Write a one-sentence summary in your own words.
J. End by deciding what you might do differently.`,
  },
  {
    id: 'p2-careful-1',
    title: 'Why We Misremember',
    text: `Memory is not a video recording. When we recall an event, we rebuild it from pieces: what we noticed, what we expected, and what we have heard since. This is efficient, but it also makes memory open to error. In one classic study, people who watched a car accident were asked how fast the cars were going when they “hit” or “smashed into” each other. The word “smashed” led people to estimate a higher speed and, later, to “remember” broken glass that was never there. Eyewitnesses can be sincere and confident while still being wrong. Confidence is not the same as accuracy. The lesson is not that memory is useless. It is that memory needs support: write down important details soon, check the original source when possible, and be suspicious of a vivid story that arrives without evidence. A good record is often more reliable than a strong feeling of certainty.`,
  },
  {
    id: 'p2-careful-2',
    title: 'The Limits of Willpower',
    text: `Many people describe willpower as a fuel tank: you start the day with a full tank, and every difficult choice drains it. The metaphor is useful, but it can mislead. Research suggests that the feeling of depletion depends partly on what we believe about it and partly on the situation. Someone who expects to run out of self-control may give up sooner. More importantly, relying on willpower alone is a fragile strategy. The people who keep good habits often do not resist temptation more often; they arrange their lives so that temptation is less available. They put the phone in another room, prepare the gym bag the night before, and keep fruit on the table instead of biscuits. This is not cheating. It is design. A small amount of friction, placed in the right spot, can do more than a large amount of determination. The lesson is to stop asking “How can I try harder?” and start asking “How can I make the better choice easier?”`,
  },
]

const clozeOptions = [
  'optional',
  'strengthen',
  'impair',
  'retain',
  'marginal',
  'empirical',
  'consistent',
  'sustainable',
  'substantial',
  'unavoidable',
  'temporary',
  'isolate',
  'distract',
  'legitimate',
  'visible',
]

const clozeAnswers = [
  'optional',
  'strengthen',
  'impair',
  'retain',
  'marginal',
  'empirical',
  'consistent',
  'sustainable',
  'substantial',
  'unavoidable',
]

const clozeQuestions: Question[] = clozeAnswers.map((answer, index) => ({
  id: `cloze2-${index + 1}`,
  type: 'banked-cloze',
  passageId: 'p2-cloze',
  prompt: `第 ${index + 1} 空`,
  options: clozeOptions,
  answer,
  sharedOptions: true,
  explanation: `第 ${index + 1} 空应填 ${answer}。先判断词性和搭配，再排除同词性干扰项。`,
}))

const matchingStatements: Array<{ text: string; answer: string; explanation: string }> = [
  {
    text: 'Start with a quick overview before the details.',
    answer: 'A',
    explanation: 'A 段说先读标题和摘要。',
  },
  {
    text: 'Use section headings as a map of the argument.',
    answer: 'B',
    explanation: 'B 段说先扫标题，了解结构。',
  },
  {
    text: 'Know the question the authors are trying to answer.',
    answer: 'C',
    explanation: 'C 段说先确认研究问题。',
  },
  {
    text: 'Ask whether the method can test the claim.',
    answer: 'D',
    explanation: 'D 段说检查方法能否检验主张。',
  },
  {
    text: 'Consider who was studied and how many people took part.',
    answer: 'E',
    explanation: 'E 段说看样本是谁、有多少人。',
  },
  {
    text: 'Separate findings from the authors’ interpretation.',
    answer: 'F',
    explanation: 'F 段说把结果和解释分开。',
  },
  {
    text: 'Read the limitations before trusting the conclusion.',
    answer: 'G',
    explanation: 'G 段说先看局限，再信结论。',
  },
  {
    text: 'Place the study in a larger conversation with earlier work.',
    answer: 'H',
    explanation: 'H 段说和更早的研究比较。',
  },
  {
    text: 'Compress the paper into one sentence.',
    answer: 'I',
    explanation: 'I 段说用自己的话写一句总结。',
  },
  {
    text: 'End by deciding what you might do differently.',
    answer: 'J',
    explanation: 'J 段说最后决定自己可以怎么改。',
  },
]

const matchingQuestions: Question[] = matchingStatements.map((statement, index) => ({
  id: `match2-${index + 1}`,
  type: 'matching',
  passageId: 'p2-matching',
  prompt: statement.text,
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  answer: statement.answer,
  explanation: statement.explanation,
}))

const carefulOne: Question[] = [
  {
    id: 'careful2-1-1',
    type: 'careful-reading',
    passageId: 'p2-careful-1',
    prompt: 'What is the main idea of the passage?',
    options: [
      'Memory works like a video recording.',
      'Memory is rebuilt and can be distorted.',
      'Eyewitnesses are usually dishonest.',
      'Writing things down is unnecessary.',
    ],
    answer: 'B',
    explanation: '文章强调记忆是重建的，因此容易出错。',
  },
  {
    id: 'careful2-1-2',
    type: 'careful-reading',
    passageId: 'p2-careful-1',
    prompt: 'Why does the author mention the car accident study?',
    options: [
      'To show that confident memories can be wrong.',
      'To prove that cars are dangerous.',
      'To explain how to drive safely.',
      'To suggest that eyewitnesses are rare.',
    ],
    answer: 'A',
    explanation: '实验说明措辞会影响回忆，自信不等于准确。',
  },
  {
    id: 'careful2-1-3',
    type: 'careful-reading',
    passageId: 'p2-careful-1',
    prompt: 'What does “rebuild it from pieces” mean?',
    options: [
      'Replay a perfect recording.',
      'Reconstruct an event from partial information.',
      'Forget the event completely.',
      'Copy someone else’s memory.',
    ],
    answer: 'B',
    explanation: '记忆由注意到的片段、预期和后来听到的信息重建。',
  },
  {
    id: 'careful2-1-4',
    type: 'careful-reading',
    passageId: 'p2-careful-1',
    prompt: 'What does the author recommend?',
    options: [
      'Trust vivid memories without question.',
      'Record important details early and check sources.',
      'Avoid all eyewitness accounts.',
      'Never write anything down.',
    ],
    answer: 'B',
    explanation: '作者建议尽早记录、核对原始来源。',
  },
  {
    id: 'careful2-1-5',
    type: 'careful-reading',
    passageId: 'p2-careful-1',
    prompt: 'What is the author’s attitude toward memory?',
    options: ['Dismissive.', 'Cautious.', 'Indifferent.', 'Hostile.'],
    answer: 'B',
    explanation: '作者认为记忆有用但需要支持，态度谨慎。',
  },
]

const carefulTwo: Question[] = [
  {
    id: 'careful2-2-1',
    type: 'careful-reading',
    passageId: 'p2-careful-2',
    prompt: 'What is the main idea of the passage?',
    options: [
      'Willpower is the only key to good habits.',
      'Good habits depend more on design than on trying harder.',
      'People should never feel tired.',
      'Temptation cannot be managed.',
    ],
    answer: 'B',
    explanation: '文章主张改变环境，让好选择更容易。',
  },
  {
    id: 'careful2-2-2',
    type: 'careful-reading',
    passageId: 'p2-careful-2',
    prompt: 'What does the “fuel tank” metaphor suggest?',
    options: [
      'Willpower can be measured in litres.',
      'Willpower is a limited resource that runs out.',
      'People need more petrol.',
      'Habits are impossible to change.',
    ],
    answer: 'B',
    explanation: '燃料箱比喻意志力像有限资源，会被耗尽。',
  },
  {
    id: 'careful2-2-3',
    type: 'careful-reading',
    passageId: 'p2-careful-2',
    prompt: 'According to the passage, what do people with good habits often do?',
    options: [
      'Resist temptation more often.',
      'Arrange their environment to reduce temptation.',
      'Avoid all difficult choices.',
      'Rely on motivation alone.',
    ],
    answer: 'B',
    explanation: '他们通过环境设计减少诱惑，而不是频繁硬抗。',
  },
  {
    id: 'careful2-2-4',
    type: 'careful-reading',
    passageId: 'p2-careful-2',
    prompt: 'Why does the author mention putting the phone in another room?',
    options: [
      'To show how to reduce friction for the better choice.',
      'To prove phones are harmful.',
      'To suggest people should not study.',
      'To explain how to repair a phone.',
    ],
    answer: 'A',
    explanation: '把手机放远，是给坏习惯增加摩擦的例子。',
  },
  {
    id: 'careful2-2-5',
    type: 'careful-reading',
    passageId: 'p2-careful-2',
    prompt: 'What question does the author recommend asking?',
    options: [
      'How can I try harder?',
      'How can I make the better choice easier?',
      'Why am I so lazy?',
      'How can I avoid all effort?',
    ],
    answer: 'B',
    explanation: '结尾把问题从“更努力”改成“让好选择更容易”。',
  },
]

export const readingQuestions2: Question[] = [
  ...clozeQuestions,
  ...matchingQuestions,
  ...carefulOne,
  ...carefulTwo,
]

export const readingSection2: ReadingSection = {
  id: 'reading-section-2',
  title: '阅读专项 · 套题 2',
  durationMin: 40,
  passageIds: ['p2-cloze', 'p2-matching', 'p2-careful-1', 'p2-careful-2'],
  questions: readingQuestions2,
}
