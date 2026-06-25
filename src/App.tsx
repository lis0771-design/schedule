import { useEffect } from 'react'
import { parse } from 'date-fns'
import { AgendaView } from '@/components/calendar/AgendaView'
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar'
import { DayView } from '@/components/calendar/DayView'
import { MonthView } from '@/components/calendar/MonthView'
import { WeekView } from '@/components/calendar/WeekView'
import { DepartmentLegend } from '@/components/dashboard/DepartmentLegend'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { UpcomingSidebar } from '@/components/dashboard/UpcomingSidebar'
import { EventDetailSheet } from '@/components/events/EventDetailSheet'
import { DepartmentFilter } from '@/components/filters/DepartmentFilter'
import { StatusFilter } from '@/components/filters/StatusFilter'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { loadDefaultSchedule } from '@/lib/parseExcel'
import { useScheduleStore } from '@/store/scheduleStore'

function CalendarViewRouter() {
  const view = useScheduleStore((s) => s.view)

  switch (view) {
    case 'week':
      return <WeekView />
    case 'day':
      return <DayView />
    case 'agenda':
      return <AgendaView />
    default:
      return <MonthView />
  }
}

function App() {
  const loading = useScheduleStore((s) => s.loading)
  const error = useScheduleStore((s) => s.error)
  const setEvents = useScheduleStore((s) => s.setEvents)
  const setLoading = useScheduleStore((s) => s.setLoading)
  const setError = useScheduleStore((s) => s.setError)
  const goToToday = useScheduleStore((s) => s.goToToday)

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const events = await loadDefaultSchedule()
        setEvents(events)
        if (events.length > 0) {
          const firstDate = parse(events[0].date, 'yyyy-MM-dd', new Date())
          useScheduleStore.getState().setCurrentDate(firstDate)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '일정을 불러오지 못했습니다.')
      }
    })()
  }, [setEvents, setLoading, setError])

  return (
    <AppShell>
      <AppHeader />
      <main className="mx-auto max-w-[1600px] px-4 py-4">
        {loading && (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            일정을 불러오는 중...
          </div>
        )}
        {error && !loading && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr_280px]">
              <aside className="hidden lg:block">
                <KpiCards />
              </aside>
              <section className="min-w-0 space-y-4">
                <CalendarToolbar />
                <CalendarViewRouter />
              </section>
              <aside className="hidden xl:block">
                <UpcomingSidebar />
              </aside>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/30 p-3">
              <DepartmentFilter />
              <StatusFilter />
              <Button variant="secondary" size="sm" onClick={goToToday}>
                오늘로 이동
              </Button>
              <div className="flex-1" />
              <DepartmentLegend />
            </div>

            <div className="grid gap-4 lg:hidden">
              <KpiCards />
              <UpcomingSidebar />
            </div>
          </div>
        )}
      </main>
      <EventDetailSheet />
    </AppShell>
  )
}

export default App
