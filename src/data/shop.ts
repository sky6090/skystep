import type { PetStage } from '@/domain/pet'

export type ShopItemType = 'food' | 'skin' | 'decor' | 'rename' | 'toy'

export interface ShopItem {
  id: string
  name: string
  type: ShopItemType
  price: number
  description: string
  satiety?: number
  mood?: number
  color?: string
  unlockStage?: PetStage
}

export const shopItems: ShopItem[] = [
  {
    id: 'food_basic',
    name: '基础粮',
    type: 'food',
    price: 10,
    description: '一袋刚好，饱食度 +30。',
    satiety: 30,
  },
  {
    id: 'food_fish',
    name: '小鱼干',
    type: 'food',
    price: 18,
    description: '香一点，饱食度 +45。',
    satiety: 45,
  },
  {
    id: 'food_soup',
    name: '热汤',
    type: 'food',
    price: 15,
    description: '暖胃，饱食度 +35，心情 +5。',
    satiety: 35,
    mood: 5,
  },
  {
    id: 'food_cookie',
    name: '小饼干',
    type: 'food',
    price: 12,
    description: '零嘴，饱食度 +25，心情 +5。',
    satiety: 25,
    mood: 5,
  },
  {
    id: 'food_night',
    name: '夜宵罐头',
    type: 'food',
    price: 30,
    description: '熬夜学习后的奖励，饱食度 +60。',
    satiety: 60,
  },
  {
    id: 'food_feast',
    name: '节日大餐',
    type: 'food',
    price: 50,
    description: '偶尔奢侈一次，饱食度 +80，心情 +10。',
    satiety: 80,
    mood: 10,
  },

  {
    id: 'skin_wheat',
    name: '麦田',
    type: 'skin',
    price: 200,
    description: '麦穗色的毛，像晒过太阳。',
    color: '#d6a23f',
  },
  {
    id: 'skin_lamp',
    name: '夜灯',
    type: 'skin',
    price: 300,
    description: '台灯下的暖黄。',
    color: '#f0b45c',
  },
  {
    id: 'skin_snow',
    name: '初雪',
    type: 'skin',
    price: 400,
    description: '安静的白与灰蓝。',
    color: '#bfd8e8',
  },
  {
    id: 'skin_sea',
    name: '海风',
    type: 'skin',
    price: 500,
    description: '潮湿的蓝绿色。',
    color: '#6f9fb8',
  },
  {
    id: 'skin_festival',
    name: '节日',
    type: 'skin',
    price: 650,
    description: '一小块节日的红。',
    color: '#c9604f',
  },
  {
    id: 'skin_star',
    name: '星夜',
    type: 'skin',
    price: 800,
    description: '深紫与一点点星光。',
    color: '#8b7bb5',
  },
  {
    id: 'skin_growing',
    name: '成长礼',
    type: 'skin',
    price: 0,
    description: '进入成长阶段时解锁。',
    color: '#8faf8c',
    unlockStage: 'growing',
  },
  {
    id: 'skin_mature',
    name: '成熟礼',
    type: 'skin',
    price: 0,
    description: '进入成熟阶段时解锁。',
    color: '#c98a3e',
    unlockStage: 'mature',
  },

  {
    id: 'decor_bookmark',
    name: '书签',
    type: 'decor',
    price: 50,
    description: '夹在今天的单词页里。',
  },
  {
    id: 'decor_cushion',
    name: '坐垫',
    type: 'decor',
    price: 60,
    description: '让书桌前的角落软一点。',
  },
  {
    id: 'decor_clock',
    name: '小闹钟',
    type: 'decor',
    price: 70,
    description: '提醒你休息，而不是催你。',
  },
  {
    id: 'decor_rug',
    name: '地毯',
    type: 'decor',
    price: 80,
    description: '一小块暖色。',
  },
  {
    id: 'decor_plant',
    name: '盆栽',
    type: 'decor',
    price: 90,
    description: '和宠物一起慢慢长。',
  },
  {
    id: 'decor_poster',
    name: '海报',
    type: 'decor',
    price: 100,
    description: '贴一张今天的词。',
  },
  {
    id: 'decor_lamp',
    name: '台灯',
    type: 'decor',
    price: 120,
    description: '夜里多一盏灯。',
  },
  {
    id: 'decor_frame',
    name: '相框',
    type: 'decor',
    price: 150,
    description: '放一张你们的合照。',
  },
  {
    id: 'decor_paperlamp',
    name: '纸灯',
    type: 'decor',
    price: 180,
    description: '纸质的光，安静。',
  },
  {
    id: 'decor_curtain',
    name: '窗帘',
    type: 'decor',
    price: 200,
    description: '把夜色挡在窗外一点。',
  },
  {
    id: 'decor_window',
    name: '小窗',
    type: 'decor',
    price: 250,
    description: '窗外的天色和房间一起变。',
  },
  {
    id: 'decor_star',
    name: '星星挂件',
    type: 'decor',
    price: 300,
    description: '抬头就能看见。',
  },

  {
    id: 'rename',
    name: '改名卡',
    type: 'rename',
    price: 300,
    description: '给同桌换一个名字。',
  },

  {
    id: 'toy_yarn',
    name: '毛线球',
    type: 'toy',
    price: 40,
    description: '滚来滚去，心情 +5。',
    mood: 5,
  },
  {
    id: 'toy_wand',
    name: '逗猫棒',
    type: 'toy',
    price: 50,
    description: '挥一下，心情 +8。',
    mood: 8,
  },
  {
    id: 'toy_box',
    name: '纸箱',
    type: 'toy',
    price: 60,
    description: '猫的宇宙飞船。',
    mood: 5,
  },
  {
    id: 'toy_bell',
    name: '小铃铛',
    type: 'toy',
    price: 80,
    description: '走一步响一下。',
    mood: 8,
  },
]

export const shopById = new Map(shopItems.map((item) => [item.id, item]))

export const shopTypeLabels: Record<ShopItemType, string> = {
  food: '食物',
  skin: '皮肤',
  decor: '装饰',
  rename: '改名卡',
  toy: '玩具',
}
