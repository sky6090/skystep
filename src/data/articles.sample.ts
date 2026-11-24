export interface ArticleSentence {
  en: string
  zh: string
  targets: string[]
}

export interface WritingArticle {
  id: string
  title: string
  theme: string
  targetWords: string[]
  sentences: ArticleSentence[]
  targetMeanings?: Record<string, string>
  generated?: boolean
}

export const sampleArticles: WritingArticle[] = [
  {
    id: 'a1',
    title: 'A Plan That Survives a Busy Week',
    theme: '学习',
    targetWords: ['advocate', 'feasible', 'persistent', 'substantial', 'coherent'],
    sentences: [
      {
        en: 'Many students advocate a detailed study plan, yet few plans survive a busy week.',
        zh: '许多学生提倡详细的学习计划，但很少有能撑过忙碌一周的计划。',
        targets: ['advocate'],
      },
      {
        en: 'A feasible plan starts with twenty new words a day, not a hundred.',
        zh: '一个可行的计划从每天二十个新词开始，而不是一百个。',
        targets: ['feasible'],
      },
      {
        en: 'Persistent review matters more than one long session before the exam.',
        zh: '坚持不懈的复习比考前一次长时间学习更重要。',
        targets: ['persistent'],
      },
      {
        en: 'After a month, those small sessions produce substantial progress and a coherent vocabulary.',
        zh: '一个月后，这些小段时间会带来实质性进步和连贯的词汇量。',
        targets: ['substantial', 'coherent'],
      },
    ],
  },
  {
    id: 'a2',
    title: 'When Memory Slips',
    theme: '记忆',
    targetWords: ['ambiguous', 'deteriorate', 'diminish', 'inevitable', 'vulnerable'],
    sentences: [
      {
        en: 'If you never review, your memory of new words will deteriorate.',
        zh: '如果你从不复习，你对新词的记忆就会恶化。',
        targets: ['deteriorate'],
      },
      {
        en: 'The meaning of an ambiguous word becomes clearer when you meet it in a sentence.',
        zh: '当一个模棱两可的词出现在句子里时，它的意思会更清楚。',
        targets: ['ambiguous'],
      },
      {
        en: 'Small errors diminish only when you notice and correct them.',
        zh: '只有当你注意到并改正时，小错误才会减少。',
        targets: ['diminish'],
      },
      {
        en: 'Some forgetting is inevitable, so a good system should keep you from feeling vulnerable.',
        zh: '有些遗忘是不可避免的，所以好的系统应该让你不感到脆弱。',
        targets: ['inevitable', 'vulnerable'],
      },
    ],
  },
  {
    id: 'a3',
    title: 'Evidence Before Opinion',
    theme: '方法',
    targetWords: ['anticipate', 'compelling', 'empirical', 'legitimate', 'viable'],
    sentences: [
      {
        en: 'We anticipate that online study will remain popular, but popularity is not evidence.',
        zh: '我们预期在线学习会继续流行，但流行并不是证据。',
        targets: ['anticipate'],
      },
      {
        en: 'A compelling argument needs empirical support, not just a strong opinion.',
        zh: '一个令人信服的论点需要实证支持，而不只是强烈的观点。',
        targets: ['compelling', 'empirical'],
      },
      {
        en: 'It is legitimate to ask where the data came from.',
        zh: '询问数据来自哪里是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'Only then can we decide whether the method is viable for most students.',
        zh: '只有那时我们才能判断这个方法对大多数学生是否可行。',
        targets: ['viable'],
      },
    ],
  },
  {
    id: 'a4',
    title: 'The Cost of Easy Answers',
    theme: '注意力',
    targetWords: ['manipulate', 'notorious', 'obsolete', 'profound', 'reluctant'],
    sentences: [
      {
        en: 'Some apps manipulate attention with endless notifications.',
        zh: '有些应用用无尽的通知操纵注意力。',
        targets: ['manipulate'],
      },
      {
        en: 'The most notorious ones are designed to keep you scrolling, not learning.',
        zh: '最臭名昭著的那些应用被设计成让你一直滑动，而不是学习。',
        targets: ['notorious'],
      },
      {
        en: 'A method that worked five years ago may already be obsolete.',
        zh: '五年前有效的方法现在可能已经过时。',
        targets: ['obsolete'],
      },
      {
        en: 'A profound change starts when you are reluctant to accept easy answers.',
        zh: '当你勉强接受简单答案时，深刻的改变就开始了。',
        targets: ['profound', 'reluctant'],
      },
    ],
  },
  {
    id: 'a5',
    title: 'Small Changes, Real Progress',
    theme: '坚持',
    targetWords: ['fluctuate', 'inhibit', 'intricate', 'plausible', 'sophisticated'],
    sentences: [
      {
        en: 'Motivation tends to fluctuate, so do not trust it as your only engine.',
        zh: '动力容易波动，所以不要把它当作唯一的引擎。',
        targets: ['fluctuate'],
      },
      {
        en: 'Fear of mistakes can inhibit practice, especially when the task is intricate.',
        zh: '害怕犯错会抑制练习，尤其是当任务错综复杂时。',
        targets: ['inhibit', 'intricate'],
      },
      {
        en: 'A plausible plan is better than a sophisticated plan you never follow.',
        zh: '一个看似合理的计划，胜过一个你从不执行的复杂精密计划。',
        targets: ['plausible', 'sophisticated'],
      },
    ],
  },
  {
    id: 'a6',
    title: 'A Tentative Start',
    theme: '开始',
    targetWords: ['tentative', 'elaborate', 'feasible', 'reluctant', 'legitimate'],
    sentences: [
      {
        en: 'A tentative plan is better than no plan, as long as you review it.',
        zh: '一个暂定的计划胜过没有计划，只要你会回顾它。',
        targets: ['tentative'],
      },
      {
        en: 'Do not make the first week too elaborate; a simple routine is easier to keep.',
        zh: '不要把第一周安排得太详尽；简单的日程更容易坚持。',
        targets: ['elaborate'],
      },
      {
        en: 'A feasible start is twenty minutes a day, not two hours.',
        zh: '一个可行的开始是每天二十分钟，而不是两小时。',
        targets: ['feasible'],
      },
      {
        en: 'If you are reluctant to begin, promise yourself only five minutes.',
        zh: '如果你不情愿开始，就只答应自己五分钟。',
        targets: ['reluctant'],
      },
      {
        en: 'It is legitimate to change the plan when your schedule changes.',
        zh: '当日程变化时，调整计划是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a7',
    title: 'Feedback That Helps',
    theme: '反馈',
    targetWords: ['compelling', 'empirical', 'undermine', 'profound', 'coherent'],
    sentences: [
      {
        en: 'A compelling comment names one thing you did well and one thing to change.',
        zh: '一个令人信服的评论会指出你做得好的一点和需要改变的一点。',
        targets: ['compelling'],
      },
      {
        en: 'Advice without empirical evidence is only a preference.',
        zh: '没有实证支持的建议只是一种偏好。',
        targets: ['empirical'],
      },
      {
        en: 'Harsh words can undermine confidence, even when the advice is right.',
        zh: '严厉的话会削弱信心，即使建议是对的。',
        targets: ['undermine'],
      },
      {
        en: 'A profound change may follow one honest conversation.',
        zh: '一次诚实的对话可能带来深刻的改变。',
        targets: ['profound'],
      },
      {
        en: 'Good feedback should be coherent: one problem, one next step.',
        zh: '好的反馈应该连贯：一个问题，一个下一步。',
        targets: ['coherent'],
      },
    ],
  },
  {
    id: 'a8',
    title: 'The Cost of Multitasking',
    theme: '注意力',
    targetWords: ['inhibit', 'diminish', 'manipulate', 'vulnerable', 'inevitable'],
    sentences: [
      {
        en: 'Switching tasks constantly can inhibit deep work.',
        zh: '不断切换任务会抑制深度工作。',
        targets: ['inhibit'],
      },
      {
        en: 'Your attention may diminish after every notification.',
        zh: '每次通知之后，你的注意力都可能减少。',
        targets: ['diminish'],
      },
      {
        en: 'Some apps manipulate the urge to check them again.',
        zh: '有些应用会操纵你再次查看它们的冲动。',
        targets: ['manipulate'],
      },
      {
        en: 'When your focus is fragmented, you become vulnerable and easily distracted.',
        zh: '当注意力被切碎时，你就会变得脆弱，容易被干扰。',
        targets: ['vulnerable'],
      },
      {
        en: 'Some loss of focus is inevitable, so build a short reset ritual.',
        zh: '注意力下降是不可避免的，所以建立一个简短的恢复仪式。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a9',
    title: 'Questions Worth Asking',
    theme: '提问',
    targetWords: ['ambiguous', 'plausible', 'anticipate', 'sophisticated', 'tentative'],
    sentences: [
      {
        en: 'An ambiguous question is hard to answer, but it can reveal what you do not know.',
        zh: '一个模棱两可的问题很难回答，但它能揭示你不知道的地方。',
        targets: ['ambiguous'],
      },
      {
        en: 'A plausible answer is not the same as a correct one.',
        zh: '一个看似合理的答案不等于正确答案。',
        targets: ['plausible'],
      },
      {
        en: 'Good students anticipate the next question instead of waiting for it.',
        zh: '好学生会预期下一个问题，而不是等它出现。',
        targets: ['anticipate'],
      },
      {
        en: 'A sophisticated question is often simpler than it sounds.',
        zh: '一个复杂精密的问题往往比听起来简单。',
        targets: ['sophisticated'],
      },
      {
        en: 'Start with a tentative answer, then test it.',
        zh: '先给出一个试探性的答案，再检验它。',
        targets: ['tentative'],
      },
    ],
  },
  {
    id: 'a10',
    title: 'A System You Can Keep',
    theme: '系统',
    targetWords: ['feasible', 'persistent', 'elaborate', 'substantial', 'legitimate', 'viable'],
    sentences: [
      {
        en: 'A feasible system fits the time you actually have.',
        zh: '一个可行的系统会适配你真正拥有的时间。',
        targets: ['feasible'],
      },
      {
        en: 'Persistent small steps beat an elaborate plan you never start.',
        zh: '坚持不懈的小步胜过一个你从不开始的详尽计划。',
        targets: ['persistent', 'elaborate'],
      },
      {
        en: 'Substantial progress is usually the result of boring repetition.',
        zh: '实质性进步通常是枯燥重复的结果。',
        targets: ['substantial'],
      },
      {
        en: 'It is legitimate to skip a day when you are ill, as long as you return.',
        zh: '生病时跳过一天是合理的，只要你会回来。',
        targets: ['legitimate'],
      },
      {
        en: 'Find a viable rhythm before you add more words.',
        zh: '在增加更多单词之前，先找到一个可行的节奏。',
        targets: ['viable'],
      },
    ],
  },
  {
    id: 'a11',
    title: 'The Two-Minute Rule',
    theme: '开始',
    targetWords: ['tentative', 'feasible', 'persistent', 'diminish'],
    sentences: [
      {
        en: 'A tentative start is easier than a perfect plan.',
        zh: '一个暂定的开始比完美的计划更容易。',
        targets: ['tentative'],
      },
      {
        en: 'Two minutes a day is feasible, even on a busy day.',
        zh: '每天两分钟是可行的，即使很忙。',
        targets: ['feasible'],
      },
      {
        en: 'Persistent effort matters more than a burst of motivation.',
        zh: '坚持不懈的努力比一时的动力更重要。',
        targets: ['persistent'],
      },
      {
        en: 'Small excuses can diminish progress if you let them.',
        zh: '如果你放任，小借口会削弱进步。',
        targets: ['diminish'],
      },
    ],
  },
  {
    id: 'a12',
    title: 'Reading for Evidence',
    theme: '阅读',
    targetWords: ['compelling', 'empirical', 'legitimate', 'ambiguous'],
    sentences: [
      {
        en: 'A compelling argument is not the same as a popular one.',
        zh: '一个令人信服的论点不等于一个流行的论点。',
        targets: ['compelling'],
      },
      {
        en: 'Ask whether the claim has empirical support.',
        zh: '问一问这个主张是否有实证支持。',
        targets: ['empirical'],
      },
      {
        en: 'It is legitimate to doubt a study with no data.',
        zh: '怀疑一项没有数据的研究是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'An ambiguous result should be reported as ambiguous.',
        zh: '一个模棱两可的结果应该被如实报告为模棱两可。',
        targets: ['ambiguous'],
      },
    ],
  },
  {
    id: 'a13',
    title: 'A Quieter Kind of Progress',
    theme: '进步',
    targetWords: ['profound', 'substantial', 'coherent', 'inevitable'],
    sentences: [
      {
        en: 'A profound change rarely happens in one day.',
        zh: '深刻的改变很少在一天内发生。',
        targets: ['profound'],
      },
      {
        en: 'Substantial progress is often invisible week by week.',
        zh: '实质性进步往往一周一周地看不见。',
        targets: ['substantial'],
      },
      {
        en: 'Keep a coherent record so you can see the pattern.',
        zh: '保持连贯的记录，这样你能看到规律。',
        targets: ['coherent'],
      },
      {
        en: 'Some setbacks are inevitable, but they are not the end.',
        zh: '有些挫折是不可避免的，但它们不是终点。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a14',
    title: 'When Plans Meet Reality',
    theme: '计划',
    targetWords: ['elaborate', 'viable', 'reluctant', 'undermine'],
    sentences: [
      {
        en: 'An elaborate plan can collapse when one thing goes wrong.',
        zh: '当一个环节出错时，一个详尽的计划可能崩溃。',
        targets: ['elaborate'],
      },
      {
        en: 'A viable plan leaves room for a bad day.',
        zh: '一个可行的计划会给糟糕的一天留出空间。',
        targets: ['viable'],
      },
      {
        en: 'You may be reluctant to cut a task you planned.',
        zh: '你可能不情愿删掉一个计划好的任务。',
        targets: ['reluctant'],
      },
      {
        en: 'Ignoring your limits can undermine the whole routine.',
        zh: '忽视自己的极限会削弱整个日常安排。',
        targets: ['undermine'],
      },
    ],
  },
  {
    id: 'a15',
    title: 'The Cost of Comparison',
    theme: '比较',
    targetWords: ['manipulate', 'notorious', 'deteriorate', 'vulnerable'],
    sentences: [
      {
        en: 'Social media can manipulate how you see your own progress.',
        zh: '社交媒体会操纵你对自己进步的看法。',
        targets: ['manipulate'],
      },
      {
        en: 'The most notorious accounts show only the best moments.',
        zh: '最臭名昭著的账号只展示最好的时刻。',
        targets: ['notorious'],
      },
      {
        en: 'Constant comparison can make your confidence deteriorate.',
        zh: '不断比较会让你的信心恶化。',
        targets: ['deteriorate'],
      },
      {
        en: 'You become vulnerable when your worth depends on likes.',
        zh: '当你的价值取决于点赞时，你就变得脆弱。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a16',
    title: 'Small Experiments',
    theme: '实验',
    targetWords: ['plausible', 'tentative', 'empirical', 'feasible'],
    sentences: [
      {
        en: 'A plausible idea still needs a small test.',
        zh: '一个看似合理的想法仍然需要一个小测试。',
        targets: ['plausible'],
      },
      {
        en: 'Treat the first attempt as tentative, not final.',
        zh: '把第一次尝试当作试探性的，而不是最终版。',
        targets: ['tentative'],
      },
      {
        en: 'Empirical evidence beats a strong opinion.',
        zh: '实证证据胜过强烈的观点。',
        targets: ['empirical'],
      },
      {
        en: 'If the test is feasible, run it for a week.',
        zh: '如果测试可行，就运行一周。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a17',
    title: 'The Value of a Second Draft',
    theme: '写作',
    targetWords: ['coherent', 'elaborate', 'substantial', 'legitimate'],
    sentences: [
      {
        en: 'A first draft is rarely coherent, and that is normal.',
        zh: '初稿很少是连贯的，这很正常。',
        targets: ['coherent'],
      },
      {
        en: 'Do not make the first version too elaborate.',
        zh: '不要把第一版弄得太详尽。',
        targets: ['elaborate'],
      },
      {
        en: 'A second draft can produce substantial improvement.',
        zh: '第二稿能带来实质性提升。',
        targets: ['substantial'],
      },
      {
        en: 'It is legitimate to cut what does not serve the reader.',
        zh: '删掉对读者无用的内容是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a18',
    title: 'Attention Is a Choice',
    theme: '注意力',
    targetWords: ['manipulate', 'inhibit', 'fluctuate', 'vulnerable'],
    sentences: [
      {
        en: 'Some apps manipulate the urge to check them.',
        zh: '有些应用会操纵你查看它们的冲动。',
        targets: ['manipulate'],
      },
      {
        en: 'A noisy room can inhibit deep work.',
        zh: '嘈杂的房间会抑制深度工作。',
        targets: ['inhibit'],
      },
      {
        en: 'Attention will fluctuate, so plan for it.',
        zh: '注意力会波动，所以要提前计划。',
        targets: ['fluctuate'],
      },
      {
        en: 'You are vulnerable when you never decide what matters.',
        zh: '当你从不决定什么重要时，你就很脆弱。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a19',
    title: 'Questions Without Easy Answers',
    theme: '提问',
    targetWords: ['ambiguous', 'profound', 'plausible', 'inevitable'],
    sentences: [
      {
        en: 'An ambiguous question can be more useful than a false answer.',
        zh: '一个模棱两可的问题可能比一个错误答案更有用。',
        targets: ['ambiguous'],
      },
      {
        en: 'A profound question may take years to answer.',
        zh: '一个深刻的问题可能需要多年才能回答。',
        targets: ['profound'],
      },
      {
        en: 'A plausible answer is only a starting point.',
        zh: '一个看似合理的答案只是起点。',
        targets: ['plausible'],
      },
      {
        en: 'Some uncertainty is inevitable, and that is not failure.',
        zh: '有些不确定性是不可避免的，那不是失败。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a20',
    title: 'A System for Bad Days',
    theme: '系统',
    targetWords: ['persistent', 'diminish', 'feasible', 'viable'],
    sentences: [
      {
        en: 'Persistent habits survive bad days better than motivation.',
        zh: '坚持不懈的习惯比动力更能熬过糟糕的日子。',
        targets: ['persistent'],
      },
      {
        en: 'When energy is low, diminish the task, not the goal.',
        zh: '精力低时，减少任务量，而不是降低目标。',
        targets: ['diminish'],
      },
      {
        en: 'A feasible fallback keeps the streak alive.',
        zh: '一个可行的备用方案能让连续性保持。',
        targets: ['feasible'],
      },
      {
        en: 'Find a viable minimum you can do even when tired.',
        zh: '找一个即使累了也能做到的可行最低量。',
        targets: ['viable'],
      },
    ],
  },
  {
    id: 'a21',
    title: 'Learning in Public',
    theme: '表达',
    targetWords: ['vulnerable', 'legitimate', 'compelling', 'coherent'],
    sentences: [
      {
        en: 'Sharing a draft can make you feel vulnerable, but it also invites help.',
        zh: '分享草稿会让你感到脆弱，但它也会带来帮助。',
        targets: ['vulnerable'],
      },
      {
        en: 'It is legitimate to say that you are still learning.',
        zh: '承认自己还在学习是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'A compelling explanation is usually simpler than it first looks.',
        zh: '一个令人信服的解释通常比乍看之下更简单。',
        targets: ['compelling'],
      },
      {
        en: 'Ask a reader whether your argument feels coherent from start to finish.',
        zh: '问读者你的论证从头到尾是否连贯。',
        targets: ['coherent'],
      },
    ],
  },
  {
    id: 'a22',
    title: 'The Cost of Perfect Notes',
    theme: '笔记',
    targetWords: ['elaborate', 'diminish', 'substantial', 'feasible'],
    sentences: [
      {
        en: 'An elaborate set of notes can take more time than the reading itself.',
        zh: '一套详尽的笔记可能比阅读本身花的时间还多。',
        targets: ['elaborate'],
      },
      {
        en: 'If copying replaces thinking, the notes diminish in value.',
        zh: '如果抄写取代了思考，笔记的价值就会减少。',
        targets: ['diminish'],
      },
      {
        en: 'A few substantial ideas are worth more than a page of highlights.',
        zh: '几个实质性想法比一整页高亮更有价值。',
        targets: ['substantial'],
      },
      {
        en: 'A feasible note system is one you will actually use.',
        zh: '一个可行的笔记系统是你真正会用的那个。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a23',
    title: 'A Better Way to Argue',
    theme: '论证',
    targetWords: ['ambiguous', 'empirical', 'legitimate', 'undermine'],
    sentences: [
      {
        en: 'An ambiguous claim is hard to test, so make it specific.',
        zh: '一个模棱两可的主张很难检验，所以要把它说具体。',
        targets: ['ambiguous'],
      },
      {
        en: 'Bring empirical evidence before you raise your voice.',
        zh: '在提高音量之前，先拿出实证证据。',
        targets: ['empirical'],
      },
      {
        en: 'It is legitimate to change your mind when the data changes.',
        zh: '当数据变化时改变想法是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'Personal attacks undermine the argument you are trying to make.',
        zh: '人身攻击会削弱你试图提出的论点。',
        targets: ['undermine'],
      },
    ],
  },
  {
    id: 'a24',
    title: 'The Pace of Understanding',
    theme: '理解',
    targetWords: ['profound', 'tentative', 'persistent', 'inevitable'],
    sentences: [
      {
        en: 'A profound idea often arrives slowly, in pieces.',
        zh: '一个深刻的想法往往缓慢地、零碎地到来。',
        targets: ['profound'],
      },
      {
        en: 'Start with a tentative explanation and revise it.',
        zh: '先给出一个试探性的解释，再修改它。',
        targets: ['tentative'],
      },
      {
        en: 'Persistent questioning is more useful than a quick answer.',
        zh: '坚持不懈的提问比快速答案更有用。',
        targets: ['persistent'],
      },
      {
        en: 'Some confusion is inevitable when you learn something new.',
        zh: '学习新东西时，有些困惑是不可避免的。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a25',
    title: 'What Feedback Is For',
    theme: '反馈',
    targetWords: ['compelling', 'manipulate', 'vulnerable', 'coherent'],
    sentences: [
      {
        en: 'A compelling piece of feedback describes what the reader actually saw.',
        zh: '一个令人信服的反馈会描述读者实际看到的内容。',
        targets: ['compelling'],
      },
      {
        en: 'Do not let one comment manipulate your whole self-image.',
        zh: '不要让一条评论操纵你的整个自我认知。',
        targets: ['manipulate'],
      },
      {
        en: 'You are vulnerable to praise that only repeats what you want to hear.',
        zh: '当赞美只重复你想听的话时，你是脆弱的。',
        targets: ['vulnerable'],
      },
      {
        en: 'Good feedback leaves you with a more coherent next step.',
        zh: '好的反馈会让你得到一个更连贯的下一步。',
        targets: ['coherent'],
      },
    ],
  },
  {
    id: 'a26',
    title: 'The Discipline of Finishing',
    theme: '完成',
    targetWords: ['persistent', 'reluctant', 'viable', 'substantial'],
    sentences: [
      {
        en: 'Persistent work on one draft beats starting five new ones.',
        zh: '坚持不懈地打磨一篇稿子，胜过开始五个新稿。',
        targets: ['persistent'],
      },
      {
        en: 'You may be reluctant to finish because finishing invites judgment.',
        zh: '你可能不情愿完成，因为完成会招来评判。',
        targets: ['reluctant'],
      },
      {
        en: 'Set a viable standard, not a perfect one.',
        zh: '设定一个可行的标准，而不是完美的标准。',
        targets: ['viable'],
      },
      {
        en: 'A finished draft, even a rough one, is a substantial achievement.',
        zh: '一篇完成的草稿，即使粗糙，也是实质性成就。',
        targets: ['substantial'],
      },
    ],
  },
  {
    id: 'a27',
    title: 'When Research Meets Headlines',
    theme: '媒体',
    targetWords: ['notorious', 'ambiguous', 'empirical', 'plausible'],
    sentences: [
      {
        en: 'Headlines are notorious for making small studies sound certain.',
        zh: '新闻标题以把小研究说得确定无疑而臭名昭著。',
        targets: ['notorious'],
      },
      {
        en: 'The original finding may be more ambiguous than the headline.',
        zh: '原始发现可能比标题更模棱两可。',
        targets: ['ambiguous'],
      },
      {
        en: 'Look for empirical details: sample size, method, and limits.',
        zh: '寻找实证细节：样本量、方法和局限。',
        targets: ['empirical'],
      },
      {
        en: 'A plausible story is not proof, even when it is repeated.',
        zh: '一个看似合理的故事不是证据，即使它被反复转述。',
        targets: ['plausible'],
      },
    ],
  },
  {
    id: 'a28',
    title: 'The Quiet Cost of Haste',
    theme: '节奏',
    targetWords: ['deteriorate', 'diminish', 'inevitable', 'vulnerable'],
    sentences: [
      {
        en: 'When you rush every task, the quality of your work can deteriorate.',
        zh: '当你赶每一个任务时，工作质量可能会恶化。',
        targets: ['deteriorate'],
      },
      {
        en: 'Sleep loss can diminish your ability to notice mistakes.',
        zh: '睡眠不足会削弱你发现错误的能力。',
        targets: ['diminish'],
      },
      {
        en: 'Some mistakes are inevitable when you are moving fast.',
        zh: '快速推进时，有些错误是不可避免的。',
        targets: ['inevitable'],
      },
      {
        en: 'A tired mind is vulnerable to simple distractions.',
        zh: '疲惫的大脑是脆弱的，容易受简单干扰影响。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a29',
    title: 'Designing for Better Decisions',
    theme: '设计',
    targetWords: ['feasible', 'manipulate', 'coherent', 'legitimate'],
    sentences: [
      {
        en: 'A feasible design starts with the decision the user needs to make.',
        zh: '一个可行的设计从用户需要做的决定开始。',
        targets: ['feasible'],
      },
      {
        en: 'Dark patterns manipulate users into choices they did not intend.',
        zh: '暗黑模式会操纵用户做出他们并不想要的选择。',
        targets: ['manipulate'],
      },
      {
        en: 'A coherent interface makes the next step obvious.',
        zh: '一个连贯的界面会让下一步显而易见。',
        targets: ['coherent'],
      },
      {
        en: 'It is legitimate to ask what a design is optimizing for.',
        zh: '追问一个设计在优化什么是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a30',
    title: 'The Long Game',
    theme: '长期',
    targetWords: ['persistent', 'substantial', 'profound', 'inevitable'],
    sentences: [
      {
        en: 'Persistent practice is boring, but it compounds.',
        zh: '坚持不懈的练习很枯燥，但它会累积。',
        targets: ['persistent'],
      },
      {
        en: 'Substantial results often arrive after a long flat period.',
        zh: '实质性成果往往在漫长的平台期之后到来。',
        targets: ['substantial'],
      },
      {
        en: 'A profound change in habit is rarely dramatic at the start.',
        zh: '习惯的深刻改变在开始时很少是戏剧性的。',
        targets: ['profound'],
      },
      {
        en: 'Some plateaus are inevitable, so plan for them.',
        zh: '有些平台期是不可避免的，所以要提前计划。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a31',
    title: 'The Skill of Asking',
    theme: '提问',
    targetWords: ['ambiguous', 'compelling', 'legitimate', 'tentative'],
    sentences: [
      {
        en: 'An ambiguous question can open a better conversation.',
        zh: '一个模棱两可的问题可以开启更好的对话。',
        targets: ['ambiguous'],
      },
      {
        en: 'A compelling answer usually begins with a precise question.',
        zh: '一个令人信服的答案通常始于精确的问题。',
        targets: ['compelling'],
      },
      {
        en: 'It is legitimate to ask for more context.',
        zh: '要求更多背景是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'Keep your first conclusion tentative until you hear the rest.',
        zh: '在听完其余内容前，保持你的第一个结论是试探性的。',
        targets: ['tentative'],
      },
    ],
  },
  {
    id: 'a32',
    title: 'Notes That Talk Back',
    theme: '笔记',
    targetWords: ['coherent', 'substantial', 'manipulate', 'feasible'],
    sentences: [
      {
        en: 'A coherent note connects a fact to a question.',
        zh: '一条连贯的笔记把事实和问题连起来。',
        targets: ['coherent'],
      },
      {
        en: 'Substantial notes are short but carry a real idea.',
        zh: '实质性笔记很短，但承载真正的想法。',
        targets: ['substantial'],
      },
      {
        en: 'Do not let a note-taking app manipulate what you notice.',
        zh: '不要让笔记应用操纵你注意什么。',
        targets: ['manipulate'],
      },
      {
        en: 'A feasible system is one you can use in five minutes.',
        zh: '一个可行的系统是你五分钟内能用的。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a33',
    title: 'A Map, Not a Cage',
    theme: '计划',
    targetWords: ['elaborate', 'viable', 'reluctant', 'persistent'],
    sentences: [
      {
        en: 'An elaborate plan can become a cage instead of a map.',
        zh: '一个详尽的计划可能变成笼子而不是地图。',
        targets: ['elaborate'],
      },
      {
        en: 'A viable plan leaves room for surprise.',
        zh: '一个可行的计划给意外留出空间。',
        targets: ['viable'],
      },
      {
        en: 'You may be reluctant to change a plan you spent hours on.',
        zh: '你可能不情愿改变一个花了几小时做的计划。',
        targets: ['reluctant'],
      },
      {
        en: 'Persistent revision is what keeps a plan useful.',
        zh: '坚持不懈的修改才能让计划保持有用。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a34',
    title: 'Learning From a Bad Week',
    theme: '恢复',
    targetWords: ['deteriorate', 'inevitable', 'vulnerable', 'persistent'],
    sentences: [
      {
        en: 'One bad week can make your confidence deteriorate.',
        zh: '一个糟糕的一周可能让你的信心恶化。',
        targets: ['deteriorate'],
      },
      {
        en: 'Some lost days are inevitable; they are not a verdict.',
        zh: '有些失去的日子是不可避免的；它们不是判决。',
        targets: ['inevitable'],
      },
      {
        en: 'When you are tired, you are vulnerable to self-criticism.',
        zh: '疲惫时，你更脆弱，容易自我批评。',
        targets: ['vulnerable'],
      },
      {
        en: 'Persistent return matters more than a perfect record.',
        zh: '坚持不懈地回来比完美记录更重要。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a35',
    title: 'The Right Amount of Doubt',
    theme: '判断',
    targetWords: ['plausible', 'empirical', 'ambiguous', 'profound'],
    sentences: [
      {
        en: 'A plausible explanation can still be wrong.',
        zh: '一个看似合理的解释仍可能是错的。',
        targets: ['plausible'],
      },
      {
        en: 'Empirical checks are how you tell the difference.',
        zh: '实证检验是你分辨差异的方法。',
        targets: ['empirical'],
      },
      {
        en: 'An ambiguous result should not be forced into a clean story.',
        zh: '一个模棱两可的结果不应被强行塞进干净的故事。',
        targets: ['ambiguous'],
      },
      {
        en: 'A profound question may survive several answers.',
        zh: '一个深刻的问题可能经历多个答案仍然存在。',
        targets: ['profound'],
      },
    ],
  },
  {
    id: 'a36',
    title: 'Why We Rehearse',
    theme: '练习',
    targetWords: ['inhibit', 'diminish', 'substantial', 'persistent'],
    sentences: [
      {
        en: 'Fear of mistakes can inhibit rehearsal.',
        zh: '害怕犯错会抑制排练。',
        targets: ['inhibit'],
      },
      {
        en: 'If you only rehearse what you know, the challenge may diminish.',
        zh: '如果你只排练已会的，挑战可能会减少。',
        targets: ['diminish'],
      },
      {
        en: 'Substantial improvement comes from repeating the hard part.',
        zh: '实质性进步来自重复困难的部分。',
        targets: ['substantial'],
      },
      {
        en: 'Persistent rehearsal turns a fragile skill into a habit.',
        zh: '坚持不懈的排练把脆弱的技能变成习惯。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a37',
    title: 'The Shape of an Argument',
    theme: '论证',
    targetWords: ['coherent', 'compelling', 'undermine', 'legitimate'],
    sentences: [
      {
        en: 'A coherent argument tells the reader where it is going.',
        zh: '一个连贯的论证会告诉读者它要往哪走。',
        targets: ['coherent'],
      },
      {
        en: 'A compelling example can carry more weight than a definition.',
        zh: '一个令人信服的例子可能比定义更有分量。',
        targets: ['compelling'],
      },
      {
        en: 'A weak analogy can undermine an otherwise good point.',
        zh: '一个薄弱的类比会削弱原本不错的观点。',
        targets: ['undermine'],
      },
      {
        en: 'It is legitimate to state the limits of your claim.',
        zh: '说明你主张的局限是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a38',
    title: 'Slow Progress, Real Progress',
    theme: '进步',
    targetWords: ['profound', 'substantial', 'inevitable', 'diminish'],
    sentences: [
      {
        en: 'Profound progress often looks like nothing for weeks.',
        zh: '深刻的进步常常几周都看起来像没什么。',
        targets: ['profound'],
      },
      {
        en: 'Substantial gains are built from unremarkable days.',
        zh: '实质性收益由不起眼的日子累积而成。',
        targets: ['substantial'],
      },
      {
        en: 'Some plateaus are inevitable, not a sign of failure.',
        zh: '有些平台期是不可避免的，不是失败的迹象。',
        targets: ['inevitable'],
      },
      {
        en: 'Do not let a plateau diminish your willingness to continue.',
        zh: '不要让平台期削弱你继续的意愿。',
        targets: ['diminish'],
      },
    ],
  },
  {
    id: 'a39',
    title: 'When Attention Breaks',
    theme: '注意力',
    targetWords: ['fluctuate', 'manipulate', 'vulnerable', 'inhibit'],
    sentences: [
      {
        en: 'Attention will fluctuate even when you have a plan.',
        zh: '即使有计划，注意力也会波动。',
        targets: ['fluctuate'],
      },
      {
        en: 'Some apps manipulate the moment you feel bored.',
        zh: '有些应用会操纵你感到无聊的那一刻。',
        targets: ['manipulate'],
      },
      {
        en: 'When your focus is weak, you are vulnerable to every notification.',
        zh: '注意力弱时，你会变得脆弱，每条通知都能影响你。',
        targets: ['vulnerable'],
      },
      {
        en: 'A noisy environment can inhibit the first ten minutes of work.',
        zh: '嘈杂的环境会抑制工作的前十分钟。',
        targets: ['inhibit'],
      },
    ],
  },
  {
    id: 'a40',
    title: 'A Practice You Can Keep',
    theme: '系统',
    targetWords: ['feasible', 'viable', 'tentative', 'persistent'],
    sentences: [
      {
        en: 'A feasible practice fits the time you really have.',
        zh: '一个可行的练习适配你真正拥有的时间。',
        targets: ['feasible'],
      },
      {
        en: 'A viable minimum is better than an ambitious zero.',
        zh: '一个可行的最低量胜过雄心勃勃的零。',
        targets: ['viable'],
      },
      {
        en: 'Start with a tentative version and adjust it.',
        zh: '先从一个试探性的版本开始，再调整。',
        targets: ['tentative'],
      },
      {
        en: 'Persistent return is the whole method.',
        zh: '坚持不懈地回来就是全部方法。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a41',
    title: 'The First Five Minutes',
    theme: '开始',
    targetWords: ['tentative', 'feasible', 'persistent', 'diminish'],
    sentences: [
      {
        en: 'A tentative first step is enough to begin.',
        zh: '一个试探性的第一步就足以开始。',
        targets: ['tentative'],
      },
      {
        en: 'Make the first five minutes feasible, not impressive.',
        zh: '让前五分钟是可行的，而不是令人印象深刻的。',
        targets: ['feasible'],
      },
      {
        en: 'Persistent repetition does more than one intense session.',
        zh: '坚持不懈的重复比一次高强度练习更有用。',
        targets: ['persistent'],
      },
      {
        en: 'If you wait for perfect conditions, your practice will diminish.',
        zh: '如果你等完美条件，练习就会减少。',
        targets: ['diminish'],
      },
    ],
  },
  {
    id: 'a42',
    title: 'Learning to Disagree',
    theme: '分歧',
    targetWords: ['compelling', 'legitimate', 'undermine', 'coherent'],
    sentences: [
      {
        en: 'A compelling disagreement starts with what you agree on.',
        zh: '一个令人信服的异议从你们同意的地方开始。',
        targets: ['compelling'],
      },
      {
        en: 'It is legitimate to change your position when you hear a better argument.',
        zh: '听到更好的论证时改变立场是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'Mocking the other side can undermine your own case.',
        zh: '嘲笑对方会削弱你自己的论点。',
        targets: ['undermine'],
      },
      {
        en: 'A coherent reply answers the strongest version of the other view.',
        zh: '一个连贯的回应会回答对方最强的版本。',
        targets: ['coherent'],
      },
    ],
  },
  {
    id: 'a43',
    title: 'The Uses of Confusion',
    theme: '理解',
    targetWords: ['ambiguous', 'profound', 'inevitable', 'vulnerable'],
    sentences: [
      {
        en: 'An ambiguous feeling can be the beginning of a precise question.',
        zh: '一种模棱两可的感觉可以成为精确问题的起点。',
        targets: ['ambiguous'],
      },
      {
        en: 'A profound insight often starts as confusion.',
        zh: '一个深刻的洞见常常始于困惑。',
        targets: ['profound'],
      },
      {
        en: 'Some confusion is inevitable when you leave your comfort zone.',
        zh: '离开舒适区时，有些困惑是不可避免的。',
        targets: ['inevitable'],
      },
      {
        en: 'You are vulnerable when you pretend to understand.',
        zh: '当你假装理解时，你是脆弱的。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a44',
    title: 'A Smaller Ask',
    theme: '习惯',
    targetWords: ['feasible', 'viable', 'reluctant', 'persistent'],
    sentences: [
      {
        en: 'A feasible ask is small enough to say yes to.',
        zh: '一个可行的请求小到足以让人答应。',
        targets: ['feasible'],
      },
      {
        en: 'A viable habit survives a bad day.',
        zh: '一个可行的习惯能熬过糟糕的一天。',
        targets: ['viable'],
      },
      {
        en: 'You may be reluctant to start with something so small.',
        zh: '你可能不情愿从这么小的事情开始。',
        targets: ['reluctant'],
      },
      {
        en: 'Persistent small asks add up.',
        zh: '坚持不懈的小请求会累积。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a45',
    title: 'Evidence in Everyday Life',
    theme: '判断',
    targetWords: ['empirical', 'plausible', 'manipulate', 'ambiguous'],
    sentences: [
      {
        en: 'Empirical evidence is useful even when it is boring.',
        zh: '实证证据即使无聊也有用。',
        targets: ['empirical'],
      },
      {
        en: 'A plausible story can travel faster than a true one.',
        zh: '一个看似合理的故事可能比真实故事传播得更快。',
        targets: ['plausible'],
      },
      {
        en: 'Some headlines manipulate the reader’s sense of risk.',
        zh: '有些标题会操纵读者对风险的感受。',
        targets: ['manipulate'],
      },
      {
        en: 'An ambiguous study should not be reported as a clear result.',
        zh: '一个模棱两可的研究不应被报道为明确结果。',
        targets: ['ambiguous'],
      },
    ],
  },
  {
    id: 'a46',
    title: 'The Cost of Constant Switching',
    theme: '注意力',
    targetWords: ['inhibit', 'fluctuate', 'diminish', 'vulnerable'],
    sentences: [
      {
        en: 'Constant switching can inhibit deep work.',
        zh: '不断切换会抑制深度工作。',
        targets: ['inhibit'],
      },
      {
        en: 'Your attention will fluctuate across the day.',
        zh: '你的注意力会在一天中波动。',
        targets: ['fluctuate'],
      },
      {
        en: 'Each interruption can diminish the quality of your thinking.',
        zh: '每次打断都会削弱思考的质量。',
        targets: ['diminish'],
      },
      {
        en: 'You are vulnerable to distraction when you have no clear next step.',
        zh: '当没有明确的下一步时，你会变得脆弱，容易被干扰。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a47',
    title: 'What Makes a Good Question',
    theme: '提问',
    targetWords: ['compelling', 'tentative', 'coherent', 'legitimate'],
    sentences: [
      {
        en: 'A compelling question makes the next step obvious.',
        zh: '一个令人信服的问题让下一步显而易见。',
        targets: ['compelling'],
      },
      {
        en: 'Start with a tentative version and let the reader react.',
        zh: '先给一个试探性的版本，让读者反应。',
        targets: ['tentative'],
      },
      {
        en: 'A coherent set of questions is easier to answer.',
        zh: '一组连贯的问题更容易回答。',
        targets: ['coherent'],
      },
      {
        en: 'It is legitimate to ask what the question is really for.',
        zh: '追问这个问题究竟为了什么是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a48',
    title: 'Progress You Can See',
    theme: '进步',
    targetWords: ['substantial', 'profound', 'persistent', 'inevitable'],
    sentences: [
      {
        en: 'Substantial progress is easier to see in a monthly review.',
        zh: '实质性进步在月度回顾中更容易看到。',
        targets: ['substantial'],
      },
      {
        en: 'Profound changes often begin with a small, boring habit.',
        zh: '深刻的改变常常始于一个小的、无聊的习惯。',
        targets: ['profound'],
      },
      {
        en: 'Persistent effort is not the same as forcing yourself.',
        zh: '坚持不懈的努力不等于强迫自己。',
        targets: ['persistent'],
      },
      {
        en: 'Some slow periods are inevitable, even when you do everything right.',
        zh: '即使你做对了一切，有些缓慢期也是不可避免的。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a49',
    title: 'The Discipline of Less',
    theme: '简洁',
    targetWords: ['elaborate', 'diminish', 'viable', 'feasible'],
    sentences: [
      {
        en: 'An elaborate system can hide the fact that you are not practicing.',
        zh: '一个详尽的系统可能掩盖你并没有练习的事实。',
        targets: ['elaborate'],
      },
      {
        en: 'Remove one feature and watch the friction diminish.',
        zh: '删掉一个功能，看看阻力是否减少。',
        targets: ['diminish'],
      },
      {
        en: 'A viable workflow has fewer decisions, not more.',
        zh: '一个可行的工作流有更少的决定，而不是更多。',
        targets: ['viable'],
      },
      {
        en: 'A feasible routine is one you can repeat on a bad day.',
        zh: '一个可行的日常是你在糟糕的一天也能重复的。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a50',
    title: 'A Long, Quiet Practice',
    theme: '长期',
    targetWords: ['persistent', 'substantial', 'inevitable', 'profound'],
    sentences: [
      {
        en: 'Persistent practice is a relationship, not a sprint.',
        zh: '坚持不懈的练习是一种关系，不是短跑。',
        targets: ['persistent'],
      },
      {
        en: 'Substantial results come from many unremarkable sessions.',
        zh: '实质性成果来自许多不起眼的练习。',
        targets: ['substantial'],
      },
      {
        en: 'Some plateaus are inevitable; they are part of the work.',
        zh: '有些平台期是不可避免的；它们是工作的一部分。',
        targets: ['inevitable'],
      },
      {
        en: 'A profound change can look ordinary from the outside.',
        zh: '深刻的改变从外面看可能很普通。',
        targets: ['profound'],
      },
    ],
  },
  {
    id: 'a51',
    title: 'The Art of the Small Test',
    theme: '实验',
    targetWords: ['tentative', 'empirical', 'feasible', 'plausible'],
    sentences: [
      {
        en: 'A tentative idea becomes useful when you test it.',
        zh: '一个试探性的想法在被检验时才有用。',
        targets: ['tentative'],
      },
      {
        en: 'Empirical evidence can turn a guess into a decision.',
        zh: '实证证据能把猜测变成决定。',
        targets: ['empirical'],
      },
      {
        en: 'A feasible test fits inside one afternoon.',
        zh: '一个可行的测试能在一个下午内完成。',
        targets: ['feasible'],
      },
      {
        en: 'A plausible explanation is still only a candidate.',
        zh: '一个看似合理的解释仍然只是候选。',
        targets: ['plausible'],
      },
    ],
  },
  {
    id: 'a52',
    title: 'Reading Beyond the Headline',
    theme: '媒体',
    targetWords: ['notorious', 'ambiguous', 'compelling', 'empirical'],
    sentences: [
      {
        en: 'A notorious headline can make a small study sound huge.',
        zh: '一个臭名昭著的标题能让小研究听起来很重大。',
        targets: ['notorious'],
      },
      {
        en: 'The original finding may be more ambiguous.',
        zh: '原始发现可能更模棱两可。',
        targets: ['ambiguous'],
      },
      {
        en: 'A compelling story is not the same as evidence.',
        zh: '一个令人信服的故事不等同于证据。',
        targets: ['compelling'],
      },
      {
        en: 'Look for empirical details before you share it.',
        zh: '分享前先找实证细节。',
        targets: ['empirical'],
      },
    ],
  },
  {
    id: 'a53',
    title: 'A Kinder Way to Fail',
    theme: '失败',
    targetWords: ['vulnerable', 'inevitable', 'persistent', 'profound'],
    sentences: [
      {
        en: 'You are vulnerable when you hide every mistake.',
        zh: '当你隐藏每个错误时，你是脆弱的。',
        targets: ['vulnerable'],
      },
      {
        en: 'Some failure is inevitable in any real practice.',
        zh: '任何真实练习中，有些失败是不可避免的。',
        targets: ['inevitable'],
      },
      {
        en: 'Persistent return is how you learn from it.',
        zh: '坚持不懈地回来是你从中学习的方式。',
        targets: ['persistent'],
      },
      {
        en: 'A profound lesson can come from a small failure.',
        zh: '一个深刻的教训可能来自一次小失败。',
        targets: ['profound'],
      },
    ],
  },
  {
    id: 'a54',
    title: 'Building a Second Brain',
    theme: '笔记',
    targetWords: ['coherent', 'elaborate', 'substantial', 'manipulate'],
    sentences: [
      {
        en: 'A coherent system connects notes to projects.',
        zh: '一个连贯的系统把笔记和项目连起来。',
        targets: ['coherent'],
      },
      {
        en: 'An elaborate system can become a second job.',
        zh: '一个详尽的系统可能变成第二份工作。',
        targets: ['elaborate'],
      },
      {
        en: 'Substantial value comes from using the notes, not storing them.',
        zh: '实质性价值来自使用笔记，而不是储存。',
        targets: ['substantial'],
      },
      {
        en: 'Do not let a tool manipulate how you think.',
        zh: '不要让工具操纵你的思考方式。',
        targets: ['manipulate'],
      },
    ],
  },
  {
    id: 'a55',
    title: 'The Value of a Slow Start',
    theme: '开始',
    targetWords: ['reluctant', 'tentative', 'persistent', 'diminish'],
    sentences: [
      {
        en: 'You may be reluctant to start slowly.',
        zh: '你可能不情愿慢慢开始。',
        targets: ['reluctant'],
      },
      {
        en: 'A tentative first week is better than a false start.',
        zh: '一个试探性的第一周胜过错误的开始。',
        targets: ['tentative'],
      },
      {
        en: 'Persistent practice grows from a pace you can keep.',
        zh: '坚持不懈的练习来自你能保持的节奏。',
        targets: ['persistent'],
      },
      {
        en: 'If the pace is too high, your motivation will diminish.',
        zh: '如果节奏太快，你的动机会减少。',
        targets: ['diminish'],
      },
    ],
  },
  {
    id: 'a56',
    title: 'When Evidence Conflicts',
    theme: '证据',
    targetWords: ['empirical', 'ambiguous', 'legitimate', 'undermine'],
    sentences: [
      {
        en: 'Empirical studies can disagree with each other.',
        zh: '实证研究可能彼此不一致。',
        targets: ['empirical'],
      },
      {
        en: 'An ambiguous finding should be reported with its limits.',
        zh: '一个模棱两可的发现应连同局限一起报告。',
        targets: ['ambiguous'],
      },
      {
        en: 'It is legitimate to wait for more evidence.',
        zh: '等待更多证据是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'A single study cannot undermine a whole field.',
        zh: '一项研究不能削弱整个领域。',
        targets: ['undermine'],
      },
    ],
  },
  {
    id: 'a57',
    title: 'Making Room for Boredom',
    theme: '注意力',
    targetWords: ['profound', 'vulnerable', 'inevitable', 'diminish'],
    sentences: [
      {
        en: 'A profound idea often arrives during a boring walk.',
        zh: '一个深刻的想法常在无聊的散步中出现。',
        targets: ['profound'],
      },
      {
        en: 'You are vulnerable to constant stimulation.',
        zh: '面对持续刺激，你是脆弱的。',
        targets: ['vulnerable'],
      },
      {
        en: 'Some empty time is inevitable in a human day.',
        zh: '在人的一天里，有些空白时间是不可避免的。',
        targets: ['inevitable'],
      },
      {
        en: 'If you fill every gap, your attention will diminish.',
        zh: '如果你填满每个空隙，注意力会减少。',
        targets: ['diminish'],
      },
    ],
  },
  {
    id: 'a58',
    title: 'The Practice of Explaining',
    theme: '表达',
    targetWords: ['coherent', 'compelling', 'substantial', 'legitimate'],
    sentences: [
      {
        en: 'A coherent explanation is easier to remember.',
        zh: '一个连贯的解释更容易记住。',
        targets: ['coherent'],
      },
      {
        en: 'A compelling example can do more than a long definition.',
        zh: '一个令人信服的例子可能胜过冗长定义。',
        targets: ['compelling'],
      },
      {
        en: 'Substantial understanding shows up when you can teach it.',
        zh: '实质性理解在你能够教别人时显现。',
        targets: ['substantial'],
      },
      {
        en: 'It is legitimate to say “I am not sure yet”.',
        zh: '说“我还不确定”是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a59',
    title: 'A Plan for Low Energy',
    theme: '恢复',
    targetWords: ['feasible', 'viable', 'diminish', 'persistent'],
    sentences: [
      {
        en: 'A feasible plan for low energy is shorter, not harder.',
        zh: '一个可行的低精力计划是更短，而不是更难。',
        targets: ['feasible'],
      },
      {
        en: 'A viable minimum keeps the habit alive.',
        zh: '一个可行的最低量让习惯保持。',
        targets: ['viable'],
      },
      {
        en: 'When energy is low, diminish the scope, not the standard.',
        zh: '精力低时，减少范围，而不是降低标准。',
        targets: ['diminish'],
      },
      {
        en: 'Persistent return matters more than a perfect day.',
        zh: '坚持不懈地回来比完美的一天更重要。',
        targets: ['persistent'],
      },
    ],
  },
  {
    id: 'a60',
    title: 'What We Owe Our Attention',
    theme: '注意力',
    targetWords: ['manipulate', 'inhibit', 'fluctuate', 'vulnerable'],
    sentences: [
      {
        en: 'Some apps manipulate your attention for profit.',
        zh: '有些应用为了利润操纵你的注意力。',
        targets: ['manipulate'],
      },
      {
        en: 'A crowded feed can inhibit concentration.',
        zh: '拥挤的信息流会抑制专注。',
        targets: ['inhibit'],
      },
      {
        en: 'Your focus will fluctuate; plan around it.',
        zh: '你的注意力会波动；围绕它做计划。',
        targets: ['fluctuate'],
      },
      {
        en: 'You are vulnerable when you never choose what to ignore.',
        zh: '当你从不选择忽略什么时，你是脆弱的。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a61',
    title: 'The Habit of Checking In',
    theme: '回顾',
    targetWords: ['persistent', 'substantial', 'diminish', 'feasible'],
    sentences: [
      {
        en: 'A short check-in can keep a habit persistent.',
        zh: '一次简短的检查能让习惯持续下去。',
        targets: ['persistent'],
      },
      {
        en: 'Substantial change often starts with a weekly review.',
        zh: '实质性改变常从每周回顾开始。',
        targets: ['substantial'],
      },
      {
        en: 'If you never review, small problems can diminish your motivation.',
        zh: '如果从不回顾，小问题会削弱你的动机。',
        targets: ['diminish'],
      },
      {
        en: 'A feasible check-in takes five minutes, not an hour.',
        zh: '一次可行的检查花五分钟，而不是一小时。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a62',
    title: 'A Better Kind of Rest',
    theme: '恢复',
    targetWords: ['vulnerable', 'inevitable', 'profound', 'coherent'],
    sentences: [
      {
        en: 'You are vulnerable when you treat rest as a reward.',
        zh: '当你把休息当作奖励时，你是脆弱的。',
        targets: ['vulnerable'],
      },
      {
        en: 'Some rest is inevitable if you want to keep going.',
        zh: '如果你想继续，某些休息是不可避免的。',
        targets: ['inevitable'],
      },
      {
        en: 'A profound rest is not the same as a passive scroll.',
        zh: '深刻的休息不等于被动刷屏。',
        targets: ['profound'],
      },
      {
        en: 'A coherent day includes both work and recovery.',
        zh: '连贯的一天包括工作和恢复。',
        targets: ['coherent'],
      },
    ],
  },
  {
    id: 'a63',
    title: 'Learning From People Who Disagree',
    theme: '分歧',
    targetWords: ['compelling', 'undermine', 'legitimate', 'empirical'],
    sentences: [
      {
        en: 'A compelling critic can teach you more than a friendly echo.',
        zh: '一个令人信服的批评者能比友好的回声教得更多。',
        targets: ['compelling'],
      },
      {
        en: 'Attack the argument, not the person, or you undermine your own case.',
        zh: '攻击论点而不是人，否则你会削弱自己的立场。',
        targets: ['undermine'],
      },
      {
        en: 'It is legitimate to ask for the evidence behind a claim.',
        zh: '要求一个主张背后的证据是合理的。',
        targets: ['legitimate'],
      },
      {
        en: 'Empirical examples are harder to dismiss than opinions.',
        zh: '实证例子比观点更难被忽视。',
        targets: ['empirical'],
      },
    ],
  },
  {
    id: 'a64',
    title: 'The Cost of False Urgency',
    theme: '节奏',
    targetWords: ['manipulate', 'fluctuate', 'vulnerable', 'inhibit'],
    sentences: [
      {
        en: 'False urgency can manipulate your sense of priority.',
        zh: '虚假的紧迫感会操纵你的优先级判断。',
        targets: ['manipulate'],
      },
      {
        en: 'Your energy will fluctuate, so not every task deserves the same speed.',
        zh: '你的精力会波动，不是每个任务都值得同样的速度。',
        targets: ['fluctuate'],
      },
      {
        en: 'You are vulnerable when everything feels urgent.',
        zh: '当一切都很紧急时，你是脆弱的。',
        targets: ['vulnerable'],
      },
      {
        en: 'Constant urgency can inhibit careful thinking.',
        zh: '持续紧迫会抑制仔细思考。',
        targets: ['inhibit'],
      },
    ],
  },
  {
    id: 'a65',
    title: 'A Small Room for Error',
    theme: '计划',
    targetWords: ['feasible', 'viable', 'reluctant', 'tentative'],
    sentences: [
      {
        en: 'A feasible plan leaves a small room for error.',
        zh: '一个可行的计划为错误留出小空间。',
        targets: ['feasible'],
      },
      {
        en: 'A viable routine still works when one part fails.',
        zh: '一个可行的日常在一个环节失败时仍能运作。',
        targets: ['viable'],
      },
      {
        en: 'You may be reluctant to plan for failure.',
        zh: '你可能不情愿为失败做计划。',
        targets: ['reluctant'],
      },
      {
        en: 'A tentative backup is better than no backup.',
        zh: '一个试探性的备用方案胜过没有备用方案。',
        targets: ['tentative'],
      },
    ],
  },
  {
    id: 'a66',
    title: 'What a Good Day Looks Like',
    theme: '进步',
    targetWords: ['substantial', 'persistent', 'profound', 'inevitable'],
    sentences: [
      {
        en: 'A good day is not always a substantial one.',
        zh: '一个好日子不一定是实质性的一天。',
        targets: ['substantial'],
      },
      {
        en: 'Persistent small wins make a week feel different.',
        zh: '坚持不懈的小胜利会让一周感觉不同。',
        targets: ['persistent'],
      },
      {
        en: 'A profound change can begin with one honest hour.',
        zh: '深刻的改变可以始于一个诚实的小时。',
        targets: ['profound'],
      },
      {
        en: 'Some wasted days are inevitable; they do not erase the work.',
        zh: '有些浪费的日子是不可避免的；它们不会抹掉工作。',
        targets: ['inevitable'],
      },
    ],
  },
  {
    id: 'a67',
    title: 'The Work Before the Work',
    theme: '专注',
    targetWords: ['elaborate', 'diminish', 'coherent', 'feasible'],
    sentences: [
      {
        en: 'An elaborate warm-up can become a way to avoid the real work.',
        zh: '一个详尽的预热可能变成逃避真正工作的方式。',
        targets: ['elaborate'],
      },
      {
        en: 'If the preparation keeps growing, your output will diminish.',
        zh: '如果准备不断膨胀，产出会减少。',
        targets: ['diminish'],
      },
      {
        en: 'A coherent start is one small step you can repeat.',
        zh: '一个连贯的开始是你能重复的一小步。',
        targets: ['coherent'],
      },
      {
        en: 'A feasible warm-up takes less than two minutes.',
        zh: '一个可行的预热不到两分钟。',
        targets: ['feasible'],
      },
    ],
  },
  {
    id: 'a68',
    title: 'When You Cannot Focus',
    theme: '专注',
    targetWords: ['fluctuate', 'inhibit', 'diminish', 'vulnerable'],
    sentences: [
      {
        en: 'Your focus will fluctuate even on a good day.',
        zh: '即使状态好，你的注意力也会波动。',
        targets: ['fluctuate'],
      },
      {
        en: 'A messy desk can inhibit the first attempt.',
        zh: '凌乱的桌子会抑制第一次尝试。',
        targets: ['inhibit'],
      },
      {
        en: 'If you wait for focus, your practice will diminish.',
        zh: '如果你等专注，练习会减少。',
        targets: ['diminish'],
      },
      {
        en: 'You are vulnerable when your plan has no smaller version.',
        zh: '当你的计划没有更小版本时，你是脆弱的。',
        targets: ['vulnerable'],
      },
    ],
  },
  {
    id: 'a69',
    title: 'The Value of a Finished Thing',
    theme: '完成',
    targetWords: ['substantial', 'reluctant', 'persistent', 'legitimate'],
    sentences: [
      {
        en: 'A finished thing, even imperfect, has substantial value.',
        zh: '一件完成的东西，即使不完美，也有实质性价值。',
        targets: ['substantial'],
      },
      {
        en: 'You may be reluctant to call it done.',
        zh: '你可能不情愿说它完成了。',
        targets: ['reluctant'],
      },
      {
        en: 'Persistent revision is useful only if you eventually ship.',
        zh: '坚持不懈的修改只有在你最终交付时才有用。',
        targets: ['persistent'],
      },
      {
        en: 'It is legitimate to stop when the work meets the brief.',
        zh: '当作品符合要求时停下是合理的。',
        targets: ['legitimate'],
      },
    ],
  },
  {
    id: 'a70',
    title: 'A Practice for the Long Term',
    theme: '长期',
    targetWords: ['persistent', 'viable', 'feasible', 'profound'],
    sentences: [
      {
        en: 'Persistent practice is built on a viable routine.',
        zh: '坚持不懈的练习建立在可行的日常上。',
        targets: ['persistent'],
      },
      {
        en: 'A viable routine can survive a busy month.',
        zh: '一个可行的日常能熬过忙碌的一个月。',
        targets: ['viable'],
      },
      {
        en: 'A feasible minimum is better than an abandoned ideal.',
        zh: '一个可行的最低量胜过被放弃的理想。',
        targets: ['feasible'],
      },
      {
        en: 'A profound change is usually a quiet one.',
        zh: '深刻的改变通常是安静的。',
        targets: ['profound'],
      },
    ],
  },
]

export const articleById = new Map(sampleArticles.map((article) => [article.id, article]))
