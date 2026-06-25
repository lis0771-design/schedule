import { format, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { getTimeSlots, getWeekDays } from '@/lib/dateUtils'
import { EventChip } from '@/components/calendar/EventChip'
import { getEventsForDate, useFilteredEvents, useScheduleStore } from '@/store/scheduleStore'

export function WeekView() {
  const currentDate = useScheduleStore((s) => s.currentDate)
  const events = useFilteredEvents()
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)
  const weekDays = getWeekDays(currentDate)
  const slots = getTimeSlots()

  return (
    <div className="overflow-x-auto rounded-xl border">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-8 border-b bg-muted/50">
          <div className="p-2 text-xs text-muted-foreground">시간</div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'border-l p-2 text-center text-xs font-medium',
                isToday(day) && 'bg-primary/10 text-primary',
              )}
            >
              <div>{format(day, 'M/d', { locale: ko })}</div>
              <div>{format(day, 'EEE', { locale: ko })}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 border-b bg-amber-50/50 dark:bg-amber-950/20">
          <div className="p-2 text-xs font-medium text-muted-foreground">종일</div>
          {weekDays.map((day) => {
            const allDay = getEventsForDate(events, day).filter((e) => e.isAllDay)
            return (
              <div key={`allday-${day.toISOString()}`} className="space-y-0.5 border-l p-1">
                {allDay.map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    compact
                    onClick={() => setSelectedEventId(event.id)}
                  />
                ))}
              </div>
            )
          })}
        </div>

        {slots.map((slot) => (
          <div key={slot} className="grid grid-cols-8 border-b">
            <div className="p-2 text-xs text-muted-foreground">{slot}</div>
            {weekDays.map((day) => {
              const timed = getEventsForDate(events, day).filter(
                (e) => !e.isAllDay && e.time?.startsWith(slot.slice(0, 2)),
              )
              return (
                <div key={`${day.toISOString()}-${slot}`} className="min-h-[48px] space-y-0.5 border-l p-1">
                  {timed.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      compact
                      onClick={() => setSelectedEventId(event.id)}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
