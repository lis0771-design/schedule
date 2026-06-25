import { isSameMonth, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { getMonthGridDays } from '@/lib/dateUtils'
import { EventChip } from '@/components/calendar/EventChip'
import { getEventsForDate, useFilteredEvents, useScheduleStore } from '@/store/scheduleStore'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function MonthView() {
  const currentDate = useScheduleStore((s) => s.currentDate)
  const events = useFilteredEvents()
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate)
  const days = getMonthGridDays(currentDate)

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              'px-2 py-2 text-center text-xs font-medium',
              i === 0 && 'text-red-500',
              i === 6 && 'text-blue-500',
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = getEventsForDate(events, day)
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)
          const weekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[100px] border-b border-r p-1.5',
                !inMonth && 'bg-muted/30 text-muted-foreground',
                weekend && inMonth && 'bg-muted/20',
              )}
              onClick={() => setCurrentDate(day)}
            >
              <div
                className={cn(
                  'mb-1 flex size-7 items-center justify-center rounded-full text-sm font-medium',
                  today && 'bg-primary text-primary-foreground',
                )}
              >
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    compact
                    onClick={() => setSelectedEventId(event.id)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <p className="px-1 text-[10px] text-muted-foreground">
                    +{dayEvents.length - 3} 더보기
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
