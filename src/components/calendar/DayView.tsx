import { formatKoreanDate, getTimeSlots } from '@/lib/dateUtils'
import { EventChip } from '@/components/calendar/EventChip'
import { getEventsForDate, useFilteredEvents, useScheduleStore } from '@/store/scheduleStore'

export function DayView() {
  const currentDate = useScheduleStore((s) => s.currentDate)
  const events = useFilteredEvents()
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)
  const dayEvents = getEventsForDate(events, currentDate)
  const allDay = dayEvents.filter((e) => e.isAllDay)
  const timed = dayEvents.filter((e) => !e.isAllDay)
  const slots = getTimeSlots()

  return (
    <div className="rounded-xl border">
      <div className="border-b bg-muted/50 p-4">
        <h3 className="text-lg font-semibold">{formatKoreanDate(currentDate)}</h3>
        <p className="text-sm text-muted-foreground">{dayEvents.length}건의 일정</p>
      </div>

      {allDay.length > 0 && (
        <div className="border-b bg-amber-50/50 p-3 dark:bg-amber-950/20">
          <p className="mb-2 text-xs font-medium text-muted-foreground">종일</p>
          <div className="space-y-1">
            {allDay.map((event) => (
              <EventChip
                key={event.id}
                event={event}
                onClick={() => setSelectedEventId(event.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="divide-y">
        {slots.map((slot) => {
          const slotEvents = timed.filter((e) => e.time?.startsWith(slot.slice(0, 2)))
          return (
            <div key={slot} className="grid grid-cols-[80px_1fr] gap-3 p-3">
              <span className="text-sm text-muted-foreground">{slot}</span>
              <div className="space-y-1">
                {slotEvents.length === 0 ? (
                  <span className="text-xs text-muted-foreground/50">—</span>
                ) : (
                  slotEvents.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEventId(event.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
