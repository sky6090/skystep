const DAY_START_HOUR = 4

export function studyDayKey(date = new Date()): string {
  const d = new Date(date)
  if (d.getHours() < DAY_START_HOUR) {
    d.setDate(d.getDate() - 1)
  }
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function startOfStudyDay(date = new Date()): Date {
  const d = new Date(date)
  if (d.getHours() < DAY_START_HOUR) {
    d.setDate(d.getDate() - 1)
  }
  d.setHours(DAY_START_HOUR, 0, 0, 0)
  return d
}

export function studyWeekKey(date = new Date()): string {
  const d = startOfStudyDay(date)
  const mondayOffset = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - mondayOffset)
  return studyDayKey(d)
}

export function studyDayStart(dayKey: string): number {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(year, month - 1, day, DAY_START_HOUR, 0, 0, 0).getTime()
}

export function studyDayRange(dayKey: string): { start: number; end: number } {
  const start = studyDayStart(dayKey)
  return { start, end: start + 86_400_000 }
}

export function previousStudyDayKey(date = new Date()): string {
  const cursor = startOfStudyDay(date)
  cursor.setDate(cursor.getDate() - 1)
  return studyDayKey(cursor)
}

export function nextStudyDayKey(dayKey: string): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  return studyDayKey(new Date(year, month - 1, day + 1, DAY_START_HOUR, 0, 0, 0))
}

export function formatDuration(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / 60_000))
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} 小时` : `${hours} 小时 ${rest} 分钟`
}
