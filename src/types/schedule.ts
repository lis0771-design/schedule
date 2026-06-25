export type CalendarView = 'month' | 'week' | 'day' | 'agenda'
export type StatusFilter = 'all' | 'completed' | 'pending'

export interface ScheduleEvent {
  id: string
  date: string
  weekday: string
  time: string | null
  isAllDay: boolean
  title: string
  department: string
  completed: boolean
  note: string | null
}
