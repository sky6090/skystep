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

export function formatDuration(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / 60_000))
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} 小时` : `${hours} 小时 ${rest} 分钟`
}
