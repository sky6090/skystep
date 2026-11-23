import type {
  Question,
  ReadingPassage,
  ReadingSection,
} from '@/data/questions.sample'

export const readingPassages3: ReadingPassage[] = [
  {
    id: 'p3-cloze',
    title: 'Writing Is Thinking',
    text: `Many students think writing is only a way to report what they already know. In fact, writing is a tool for thinking. When you try to explain an idea in a [1] way, gaps in your understanding become [2]. A first draft is often [3], but that is not a failure; it is evidence that you are working at the edge of what you can say. The [4] to revise is more useful than the desire to be perfect. A [5] argument needs evidence, not just strong feelings. [6] feedback from a reader can reveal what your sentences actually say, which may be different from what you [7]. Over time, this habit produces [8] improvement in both clarity and confidence. Some days the words will [9], and that is [10]; the important thing is to return to the page.`,
  },
  {
    id: 'p3-matching',
    title: 'How to Build a Reading Habit',
    text: `A. Start with material you actually enjoy.
B. Keep a book within reach, so starting takes no effort.
C. Read in short blocks rather than waiting for a free afternoon.
D. Track pages, not minutes; progress is easier to see.
E. Quit a book you dread, even if other people praise it.
F. Alternate difficult texts with easy ones.
G. Talk about what you read with someone.
H. Reread a favorite passage when you feel stuck.
I. Keep a small note of one idea from each session.
J. Protect a fixed reading slot in your day.`,
  },
  {
    id: 'p3-careful-1',
    title: 'The Value of Boredom',
    text: `Boredom has a bad reputation. We treat it as a problem to be solved with a screen, a snack, or another notification. Yet boredom may be useful. When the mind is not occupied by a task, it begins to wander, and that wandering is not wasted time. It is how the brain connects ideas that do not seem related at first. Some studies suggest that people who have experienced a dull task are later more creative, especially when they are given time to think rather than to react. Constant stimulation removes that space. If every quiet moment is filled, the mind never has to ask, “What else could this be?” This does not mean we should seek boredom on purpose or remove all entertainment. It means we should stop treating every empty minute as an emergency. A walk without headphones, a queue without a phone, or a few minutes before sleep can be enough. The goal is not to be bored; it is to leave room for the mind to make something of its own.`,
  },
  {
    id: 'p3-careful-2',
    title: 'Why Teams Need Quiet Members',
    text: `Teams often reward the loudest voice. The person who speaks first, interrupts often, and fills every pause may look like the leader. But quiet members can contribute in ways that are easy to miss. They often listen more carefully, notice details that others skip, and remember what was said earlier. In a meeting, they may be the first to see that two proposals contradict each other. They may also be better at written work, where they have time to organize their thoughts. The problem is that many team rituals favor people who think out loud. A fast brainstorm rewards speed; a public debate rewards confidence; a meeting with no agenda rewards whoever is willing to talk. None of these formats is wrong, but using only one of them narrows the range of ideas a team can hear. A simple change helps: send the question before the meeting, collect written answers, and then discuss. This gives quiet members a way in without asking them to become someone else. Good teams do not just make room for quiet people; they design the room so quiet people can be heard.`,
  },
]

const clozeOptions = [
  'coherent',
  'visible',
  'rough',
  'willingness',
  'compelling',
  'honest',
  'intended',
  'substantial',
  'fluctuate',
  'inevitable',
  'optional',
  'diminish',
  'legitimate',
  'elaborate',
  'vulnerable',
]

const clozeAnswers = [
  'coherent',
  'visible',
  'rough',
  'willingness',
  'compelling',
  'honest',
  'intended',
  'substantial',
  'fluctuate',
  'inevitable',
]

const clozeQuestions: Question[] = clozeAnswers.map((answer, index) => ({
  id: `cloze3-${index + 1}`,
  type: 'banked-cloze',
  passageId: 'p3-cloze',
  prompt: `第 ${index + 1} 空`,
  options: clozeOptions,
  answer,
  sharedOptions: true,
  explanation: `第 ${index + 1} 空应填 ${answer}。先判断词性和搭配，再排除干扰项。`,
}))

const matchingStatements: Array<{ text: string; answer: string; explanation: string }> = [
  {
    text: 'Choose texts you actually enjoy.',
    answer: 'A',
    explanation: 'A 段说从真正喜欢的材料开始。',
  },
  {
    text: 'Make starting as easy as possible.',
    answer: 'B',
    explanation: 'B 段说把书放在随手能拿到的地方。',
  },
  {
    text: 'Short sessions are easier to sustain.',
    answer: 'C',
    explanation: 'C 段说用短时间读，而不是等一个空闲下午。',
  },
  {
    text: 'Measure progress by pages rather than minutes.',
    answer: 'D',
    explanation: 'D 段说记录页数，不记录分钟。',
  },
  {
    text: 'Stop reading a book you dislike.',
    answer: 'E',
    explanation: 'E 段说哪怕别人夸，读不下去也可以放弃。',
  },
  {
    text: 'Mix difficult and easy material.',
    answer: 'F',
    explanation: 'F 段说难材料和容易的材料交替。',
  },
  {
    text: 'Discuss what you read with someone.',
    answer: 'G',
    explanation: 'G 段说和别人聊读到的内容。',
  },
  {
    text: 'Return to a passage you loved when stuck.',
    answer: 'H',
    explanation: 'H 段说卡住时重读喜欢的段落。',
  },
  {
    text: 'Write down one idea from each session.',
    answer: 'I',
    explanation: 'I 段说每次记下一个想法。',
  },
  {
    text: 'Reserve a regular reading time.',
    answer: 'J',
    explanation: 'J 段说保护固定的阅读时段。',
  },
]

const matchingQuestions: Question[] = matchingStatements.map((statement, index) => ({
  id: `match3-${index + 1}`,
  type: 'matching',
  passageId: 'p3-matching',
  prompt: statement.text,
  options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  answer: statement.answer,
  explanation: statement.explanation,
}))

const carefulOne: Question[] = [
  {
    id: 'careful3-1-1',
    type: 'careful-reading',
    passageId: 'p3-careful-1',
    prompt: 'What is the main idea of the passage?',
    options: [
      'Boredom is always a waste of time.',
      'Boredom can create space for thinking and creativity.',
      'People should remove all entertainment.',
      'Screens make people more creative.',
    ],
    answer: 'B',
    explanation: '文章认为无聊能给大脑留出连接想法的空间。',
  },
  {
    id: 'careful3-1-2',
    type: 'careful-reading',
    passageId: 'p3-careful-1',
    prompt: 'What happens when the mind is not occupied by a task?',
    options: [
      'It shuts down completely.',
      'It wanders and connects unrelated ideas.',
      'It becomes less creative.',
      'It needs a screen immediately.',
    ],
    answer: 'B',
    explanation: '第二段说思维会游走，并连接看似无关的想法。',
  },
  {
    id: 'careful3-1-3',
    type: 'careful-reading',
    passageId: 'p3-careful-1',
    prompt: 'Why does the author mention constant stimulation?',
    options: [
      'To show how it removes the space for wandering.',
      'To prove that entertainment is harmful.',
      'To suggest people should never use phones.',
      'To explain how to become famous.',
    ],
    answer: 'A',
    explanation: '持续刺激占满安静时刻，思维就没有游走空间。',
  },
  {
    id: 'careful3-1-4',
    type: 'careful-reading',
    passageId: 'p3-careful-1',
    prompt: 'What does the author recommend?',
    options: [
      'Seek boredom on purpose every day.',
      'Leave some empty minutes without filling them.',
      'Remove all entertainment from life.',
      'Avoid walking without headphones.',
    ],
    answer: 'B',
    explanation: '作者建议不要把每个空白分钟都当紧急事件填满。',
  },
  {
    id: 'careful3-1-5',
    type: 'careful-reading',
    passageId: 'p3-careful-1',
    prompt: 'What is the author’s attitude toward boredom?',
    options: ['Hostile.', 'Supportive of its useful side.', 'Indifferent.', 'Dismissive.'],
    answer: 'B',
    explanation: '作者承认无聊的名声不好，但强调它的价值。',
  },
]

const carefulTwo: Question[] = [
  {
    id: 'careful3-2-1',
    type: 'careful-reading',
    passageId: 'p3-careful-2',
    prompt: 'What is the main idea of the passage?',
    options: [
      'Quiet people should talk more.',
      'Quiet team members contribute in valuable ways.',
      'Loud people are always bad leaders.',
      'Teams should stop having meetings.',
    ],
    answer: 'B',
    explanation: '文章强调安静成员的倾听、细节和组织能力。',
  },
  {
    id: 'careful3-2-2',
    type: 'careful-reading',
    passageId: 'p3-careful-2',
    prompt: 'What do quiet members often do?',
    options: [
      'Interrupt more often.',
      'Listen carefully and notice details.',
      'Avoid all written work.',
      'Speak first in every meeting.',
    ],
    answer: 'B',
    explanation: '第二段说他们听得更仔细，注意别人跳过的细节。',
  },
  {
    id: 'careful3-2-3',
    type: 'careful-reading',
    passageId: 'p3-careful-2',
    prompt: 'Why can a fast brainstorm favor loud people?',
    options: [
      'It rewards speed and talk time.',
      'It requires written answers.',
      'It gives everyone equal time.',
      'It removes all pressure.',
    ],
    answer: 'A',
    explanation: '快速头脑风暴奖励速度和发言量，不利于慢思考者。',
  },
  {
    id: 'careful3-2-4',
    type: 'careful-reading',
    passageId: 'p3-careful-2',
    prompt: 'What simple change does the author suggest?',
    options: [
      'Ask quiet people to become louder.',
      'Send questions in advance and collect written answers.',
      'Cancel all meetings.',
      'Let the loudest person decide.',
    ],
    answer: 'B',
    explanation: '会前发问题、先收书面回答，再讨论。',
  },
  {
    id: 'careful3-2-5',
    type: 'careful-reading',
    passageId: 'p3-careful-2',
    prompt: 'What does “design the room so quiet people can be heard” mean?',
    options: [
      'Build a quieter office.',
      'Change the format so different voices can contribute.',
      'Ask everyone to whisper.',
      'Remove all chairs.',
    ],
    answer: 'B',
    explanation: '不是让安静的人变成别人，而是改变会议形式。',
  },
]

export const readingQuestions3: Question[] = [
  ...clozeQuestions,
  ...matchingQuestions,
  ...carefulOne,
  ...carefulTwo,
]

export const readingSection3: ReadingSection = {
  id: 'reading-section-3',
  title: '阅读专项 · 套题 3',
  durationMin: 40,
  passageIds: ['p3-cloze', 'p3-matching', 'p3-careful-1', 'p3-careful-2'],
  questions: readingQuestions3,
}
