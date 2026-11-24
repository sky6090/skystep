export interface PlacementQuestion {
  word: string
  options: string[]
  answer: number
}

export const placementQuestions: PlacementQuestion[] = [
  { word: 'abandon', options: ['放弃', '拥抱', '到达', '借出'], answer: 0 },
  { word: 'advocate', options: ['避免', '提倡', '分配', '承认'], answer: 1 },
  { word: 'ambiguous', options: ['雄心勃勃的', '充足的', '模棱两可的', '相似的'], answer: 2 },
  { word: 'anticipate', options: ['参加', '阻止', '分开', '预期'], answer: 3 },
  { word: 'coherent', options: ['连贯的', '竞争的', '谨慎的', '随机的'], answer: 0 },
  { word: 'compelling', options: ['令人疲倦的', '令人信服的', '令人困惑的', '令人尴尬的'], answer: 1 },
  { word: 'deteriorate', options: ['决定', '检测', '恶化', '推迟'], answer: 2 },
  { word: 'diminish', options: ['区分', '发现', '分发', '减少'], answer: 3 },
  { word: 'feasible', options: ['可行的', '易碎的', '灵活的', '正式的'], answer: 0 },
  { word: 'inevitable', options: ['不可见的', '不可避免的', '不完整的', '不合适的'], answer: 1 },
  { word: 'intricate', options: ['有趣的', '内部的', '错综复杂的', '中间的'], answer: 2 },
  { word: 'sophisticated', options: ['简单的', '真诚的', '独立的', '复杂精密的'], answer: 3 },
]

export type VocabLevel = 'basic' | 'intermediate' | 'advanced'

export interface PlacementResult {
  score: number
  estimated: number
  level: VocabLevel
  label: string
}

export function evaluatePlacement(answers: number[]): PlacementResult {
  const score = placementQuestions.reduce(
    (sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0),
    0,
  )
  const estimated = Math.min(6500, 1200 + score * 400)
  const level: VocabLevel = score <= 4 ? 'basic' : score <= 8 ? 'intermediate' : 'advanced'
  const label =
    level === 'basic' ? '基础 · 先补高频' : level === 'advanced' ? '进阶 · 冲六级高分' : '中级 · 六级主力'
  return { score, estimated, level, label }
}
