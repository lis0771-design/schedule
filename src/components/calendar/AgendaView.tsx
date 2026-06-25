import { parse } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatKoreanDate } from '@/lib/dateUtils'
import { getDepartmentBadgeClass } from '@/lib/departmentColors'
import { cn } from '@/lib/utils'
import { useFilteredEvents, useScheduleStore } from '@/store/scheduleStore'

export function AgendaView() {
  const events = useFilteredEvents()
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)

  const grouped = events.reduce<Record<string, typeof events>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = []
    acc[event.date].push(event)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort()

  if (sortedDates.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-muted-foreground">
        표시할 일정이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            {formatKoreanDate(parse(date, 'yyyy-MM-dd', new Date()))}
          </h3>
          <div className="space-y-2">
            {grouped[date].map((event) => (
              <Card
                key={event.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-accent/50',
                  !event.completed && 'border-dashed',
                )}
                onClick={() => setSelectedEventId(event.id)}
              >
                <CardContent className="flex flex-wrap items-center gap-2 p-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {event.isAllDay ? '종일' : event.time}
                  </span>
                  <span className="flex-1 font-medium">{event.title}</span>
                  <Badge className={getDepartmentBadgeClass(event.department)} variant="outline">
                    {event.department}
                  </Badge>
                  <Badge variant={event.completed ? 'success' : 'pending'}>
                    {event.completed ? '완료' : '예정'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
