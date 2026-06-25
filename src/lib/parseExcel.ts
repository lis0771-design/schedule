import { format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import * as XLSX from 'xlsx'
import type { ScheduleEvent } from '@/types/schedule'

const COLUMN_MAP = {
  date: '날짜',
  weekday: '요일',
  time: '시간',
  title: '주요 일정/내용',
  department: '담당 부서',
  completed: '진행 상태 (완료 여부)',
  note: '비고',
} as const

function formatExcelTime(raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === '') return null
  if (typeof raw === 'number') {
    const totalMinutes = Math.round(raw * 24 * 60)
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
  if (raw instanceof Date) {
    return format(raw, 'HH:mm')
  }
  const str = String(raw).trim()
  if (str.includes(':')) return str.slice(0, 5)
  return str
}

function parseTime(raw: unknown): { time: string | null; isAllDay: boolean } {
  if (raw === '종일' || raw === null || raw === undefined || raw === '') {
    return { time: null, isAllDay: true }
  }
  const formatted = formatExcelTime(raw)
  if (!formatted) return { time: null, isAllDay: true }
  return { time: formatted, isAllDay: false }
}

function parseDate(raw: unknown): string {
  if (raw instanceof Date) {
    return format(raw, 'yyyy-MM-dd')
  }
  if (typeof raw === 'number') {
    const date = XLSX.SSF.parse_date_code(raw)
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
    }
  }
  const str = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10)
  const parsed = parse(str, 'yyyy-MM-dd', new Date())
  if (!Number.isNaN(parsed.getTime())) return format(parsed, 'yyyy-MM-dd')
  return str
}

function parseCompleted(raw: unknown): boolean {
  if (typeof raw === 'boolean') return raw
  if (raw === 'TRUE' || raw === 'true' || raw === 1 || raw === '1' || raw === '완료') return true
  return false
}

function createId(date: string, title: string): string {
  return `${date}-${title}`.replace(/\s+/g, '-')
}

export function parseScheduleExcel(buffer: ArrayBuffer): ScheduleEvent[] {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })

  return rows.map((row) => {
    const date = parseDate(row[COLUMN_MAP.date])
    const dateObj = parse(date, 'yyyy-MM-dd', new Date())
    const weekday = format(dateObj, 'EEEE', { locale: ko })
    const { time, isAllDay } = parseTime(row[COLUMN_MAP.time])
    const title = String(row[COLUMN_MAP.title] ?? '').trim()
    const department = String(row[COLUMN_MAP.department] ?? '-').trim()
    const completed = parseCompleted(row[COLUMN_MAP.completed])
    const noteRaw = row[COLUMN_MAP.note]
    const note = noteRaw === null || noteRaw === undefined || noteRaw === ''
      ? null
      : String(noteRaw).trim()

    return {
      id: createId(date, title),
      date,
      weekday,
      time,
      isAllDay,
      title,
      department,
      completed,
      note,
    }
  })
}

export const DEFAULT_DATA_URL = '/data/골든래빗 일정.xlsx'

export async function loadDefaultSchedule(): Promise<ScheduleEvent[]> {
  const response = await fetch(DEFAULT_DATA_URL)
  if (!response.ok) throw new Error('기본 일정 파일을 불러올 수 없습니다.')
  const buffer = await response.arrayBuffer()
  return parseScheduleExcel(buffer)
}
