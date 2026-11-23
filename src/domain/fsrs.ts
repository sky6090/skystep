import {
  DefaultScheduler,
  Rating,
  type DefaultSchedulerCard,
  type Grade,
} from 'ts-fsrs'

type Scheduler = Awaited<ReturnType<typeof DefaultScheduler<'FSRS-6'>>>
export type FsrsCard = DefaultSchedulerCard<'FSRS-6'>

let schedulerPromise: Promise<Scheduler> | null = null

export function getScheduler(): Promise<Scheduler> {
  if (!schedulerPromise) {
    schedulerPromise = DefaultScheduler<'FSRS-6'>({
      version: 'FSRS-6',
      desiredRetention: 0.9,
      maximumInterval: 90,
      enableShortTerm: false,
      learningSteps: [],
      relearningSteps: [],
      enableFuzz: true,
    })
  }
  return schedulerPromise
}

export async function createNewCard(now = new Date()): Promise<FsrsCard> {
  const scheduler = await getScheduler()
  return scheduler.newCard({ now })
}

export async function applyRating(card: FsrsCard, rating: Grade, now = new Date()) {
  const scheduler = await getScheduler()
  return scheduler.review({ card, grade: rating, now })
}

export { Rating }
