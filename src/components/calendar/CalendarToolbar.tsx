import { addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatMonthLabel } from '@/lib/dateUtils'
import { useScheduleStore } from '@/store/scheduleStore'
import type { CalendarView } from '@/types/schedule'

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: 'month', label: '월' },
  { value: 'week', label: '주' },
  { value: 'day', label: '일' },
  { value: 'agenda', label: '목록' },
]

export function CalendarToolbar() {
  const currentDate = useScheduleStore((s) => s.currentDate)
  const view = useScheduleStore((s) => s.view)
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate)
  const setView = useScheduleStore((s) => s.setView)
  const goToToday = useScheduleStore((s) => s.goToToday)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft />
        </Button>
        <h2 className="min-w-[140px] text-center text-lg font-semibold">
          {formatMonthLabel(currentDate)}
        </h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="sm" onClick={goToToday}>
          오늘
        </Button>
      </div>
      <Tabs value={view} onValueChange={(v) => setView(v as CalendarView)}>
        <TabsList>
          {VIEWS.map((v) => (
            <TabsTrigger key={v.value} value={v.value}>
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
