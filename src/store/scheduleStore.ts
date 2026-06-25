import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  endOfWeek,
  isSameDay,
  isWithinInterval,
  parse,
  startOfWeek,
} from 'date-fns'
import type { CalendarView, ScheduleEvent, StatusFilter } from '@/types/schedule'

interface ScheduleState {
  events: ScheduleEvent[]
  loading: boolean
  error: string | null
  currentDate: Date
  view: CalendarView
  selectedEventId: string | null
  searchQuery: string
  selectedDepartments: string[]
  statusFilter: StatusFilter
  darkMode: boolean
  setEvents: (events: ScheduleEvent[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentDate: (date: Date) => void
  setView: (view: CalendarView) => void
  setSelectedEventId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  toggleDepartment: (department: string) => void
  setSelectedDepartments: (departments: string[]) => void
  setStatusFilter: (filter: StatusFilter) => void
  toggleDarkMode: () => void
  goToToday: () => void
}

export function applyFilters(
  events: ScheduleEvent[],
  searchQuery: string,
  selectedDepartments: string[],
  statusFilter: StatusFilter,
): ScheduleEvent[] {
  return events.filter((event) => {
    if (selectedDepartments.length > 0 && !selectedDepartments.includes(event.department)) {
      return false
    }
    if (statusFilter === 'completed' && !event.completed) return false
    if (statusFilter === 'pending' && event.completed) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const haystack = `${event.title} ${event.note ?? ''} ${event.department}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      events: [],
      loading: true,
      error: null,
      currentDate: new Date(),
      view: 'month',
      selectedEventId: null,
      searchQuery: '',
      selectedDepartments: [],
      statusFilter: 'all',
      darkMode: false,

      setEvents: (events) => set({ events, loading: false, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      setCurrentDate: (currentDate) => set({ currentDate }),
      setView: (view) => set({ view }),
      setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleDepartment: (department) =>
        set((state) => ({
          selectedDepartments: state.selectedDepartments.includes(department)
            ? state.selectedDepartments.filter((d) => d !== department)
            : [...state.selectedDepartments, department],
        })),
      setSelectedDepartments: (selectedDepartments) => set({ selectedDepartments }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      toggleDarkMode: () =>
        set((state) => {
          const darkMode = !state.darkMode
          document.documentElement.classList.toggle('dark', darkMode)
          return { darkMode }
        }),
      goToToday: () => set({ currentDate: new Date() }),
    }),
    {
      name: 'golden-rabbit-schedule',
      partialize: (state) => ({
        darkMode: state.darkMode,
        view: state.view,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    },
  ),
)

export function useFilteredEvents(): ScheduleEvent[] {
  const events = useScheduleStore((s) => s.events)
  const searchQuery = useScheduleStore((s) => s.searchQuery)
  const selectedDepartments = useScheduleStore((s) => s.selectedDepartments)
  const statusFilter = useScheduleStore((s) => s.statusFilter)

  return useMemo(
    () => applyFilters(events, searchQuery, selectedDepartments, statusFilter),
    [events, searchQuery, selectedDepartments, statusFilter],
  )
}

export function useDepartments(): string[] {
  const events = useScheduleStore((s) => s.events)
  return useMemo(
    () => [...new Set(events.map((e) => e.department))].sort(),
    [events],
  )
}

export function useSelectedEvent(): ScheduleEvent | null {
  const events = useScheduleStore((s) => s.events)
  const selectedEventId = useScheduleStore((s) => s.selectedEventId)
  return events.find((e) => e.id === selectedEventId) ?? null
}

export function useKpiStats() {
  const events = useFilteredEvents()

  return useMemo(() => {
    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 0 })

    const todayCount = events.filter((e) =>
      isSameDay(parse(e.date, 'yyyy-MM-dd', new Date()), today),
    ).length

    const weekCount = events.filter((e) => {
      const d = parse(e.date, 'yyyy-MM-dd', new Date())
      return isWithinInterval(d, { start: weekStart, end: weekEnd })
    }).length

    const pendingCount = events.filter((e) => !e.completed).length
    const completionRate = events.length
      ? Math.round((events.filter((e) => e.completed).length / events.length) * 100)
      : 0

    return { todayCount, weekCount, pendingCount, completionRate, total: events.length }
  }, [events])
}

export function useUpcomingEvents(limit = 7) {
  const events = useFilteredEvents()

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return events
      .filter((e) => {
        const d = parse(e.date, 'yyyy-MM-dd', new Date())
        const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff >= 0 && diff <= limit
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return timeToMinutes(a.time) - timeToMinutes(b.time)
      })
  }, [events, limit])
}

function timeToMinutes(time: string | null): number {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function getEventsForDate(events: ScheduleEvent[], date: Date): ScheduleEvent[] {
  return events
    .filter((e) => isSameDay(parse(e.date, 'yyyy-MM-dd', new Date()), date))
    .sort((a, b) => {
      if (a.isAllDay !== b.isAllDay) return a.isAllDay ? -1 : 1
      return timeToMinutes(a.time) - timeToMinutes(b.time)
    })
}
