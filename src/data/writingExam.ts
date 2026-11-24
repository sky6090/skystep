export interface WritingExamPrompt {
  id: 'writing' | 'translation'
  label: string
  timeMin: number
  instruction: string
  source?: string
  reference: string
  checklist: string[]
}

export const writingExam = {
  title: '写作 + 翻译模考',
  durationMin: 60,
  prompts: [
    {
      id: 'writing',
      label: '写作',
      timeMin: 30,
      instruction:
        'Write an essay on the importance of learning from failure. You should write at least 150 words but no more than 200 words.',
      reference: `Failure is often treated as a verdict, but it is better understood as information. When a plan does not work, it shows us where our assumptions were weak and where our skills are still incomplete. The danger is not failure itself; the danger is refusing to look at it closely.

Learning from failure requires honesty. We have to separate the outcome from our self-worth, ask what actually happened, and change one thing at a time. This is slower than blaming someone else or starting over, but it produces knowledge that success alone cannot give us.

Failure also teaches us how to continue. A person who has failed and returned knows that motivation is not a straight line. That knowledge makes the next attempt less fragile.

In the end, failure is not the opposite of success; it is part of the process. The important question is not whether we failed, but whether we learned enough to make the next attempt different.`,
      checklist: [
        '是否回应了题目（学习失败的重要性）',
        '是否在 150–200 词之间',
        '是否有清晰的开头、主体、结尾',
        '是否至少有一个具体例子或解释',
        '是否检查了主谓一致和拼写',
      ],
    },
    {
      id: 'translation',
      label: '翻译',
      timeMin: 30,
      instruction: '将下面这段中文译成英文。',
      source:
        '在信息爆炸的时代，越来越多的人通过短视频获取知识。短视频确实降低了学习的门槛，但也容易让人满足于零散的印象。真正的理解需要时间：提出问题、查找资料、与他人讨论，并用自己的话复述。教育者不应简单地拒绝新工具，而应教学生如何判断信息的质量，如何在碎片之间建立联系。',
      reference: `In an age of information overload, more and more people are learning through short videos. These videos do lower the barrier to knowledge, but they also make it easy to settle for scattered impressions. Real understanding takes time: asking questions, finding sources, discussing ideas with others, and explaining them in your own words. Educators should not simply reject new tools. They should teach students how to judge the quality of information and how to connect the fragments into a larger picture.`,
      checklist: [
        '是否译出了“信息爆炸 / 短视频 / 学习门槛”',
        '是否处理了“零散的印象 / 真正的理解”',
        '是否译出了“判断信息质量 / 建立联系”',
        '英文句子是否有主语和完整谓语',
        '是否检查了冠词、时态和单复数',
      ],
    },
  ] as WritingExamPrompt[],
}
