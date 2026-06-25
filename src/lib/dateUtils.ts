import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  isWeekend,
  parse,
  startOfWeek,
} from 'date-fns'
import { ko } from 'date-fns/locale'

export function parseISODate(date: string): Date {
  return parse(date, 'yyyy-MM-dd', new Date())
}

export function formatKoreanDate(date: Date | string, pattern = 'M월 d일 (EEE)'): string {
  const d = typeof date === 'string' ? parseISODate(date) : date
  return format(d, pattern, { locale: ko })
}

export function formatMonthLabel(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko })
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  }
}

export function getMonthGridDays(month: Date): Date[] {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1)
  const start = startOfWeek(firstDay, { weekStartsOn: 0 })
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(addDays(start, i))
  }
  return days
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getTimeSlots(startHour = 9, endHour = 18): string[] {
  const slots: string[] = []
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

export function timeToMinutes(time: string | null): number {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function getDaysUntil(date: string, from = new Date()): number {
  const target = parseISODate(date)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  return Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export { isSameDay, isToday, isWeekend }
