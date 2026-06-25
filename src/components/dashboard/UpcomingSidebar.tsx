import { parse } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDaysUntil } from '@/lib/dateUtils'
import { getDepartmentBadgeClass } from '@/lib/departmentColors'
import { cn } from '@/lib/utils'
import { useScheduleStore, useUpcomingEvents } from '@/store/scheduleStore'

function formatDday(days: number): string {
  if (days === 0) return 'D-Day'
  if (days === 1) return 'D-1'
  return `D-${days}`
}

export function UpcomingSidebar() {
  const upcoming = useUpcomingEvents(7)
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate)

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">다가오는 일정</CardTitle>
        <p className="text-xs text-muted-foreground">7일 이내 · 미완료 우선</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">다가오는 일정이 없습니다.</p>
        ) : (
          upcoming.map((event) => {
            const days = getDaysUntil(event.date)
            return (
              <button
                key={event.id}
                type="button"
                className={cn(
                  'w-full rounded-lg border p-2.5 text-left transition-colors hover:bg-accent/50',
                  !event.completed && 'border-dashed',
                )}
                onClick={() => {
                  setSelectedEventId(event.id)
                  setCurrentDate(parse(event.date, 'yyyy-MM-dd', new Date()))
                }}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-primary">{formatDday(days)}</span>
                  <Badge variant={event.completed ? 'success' : 'pending'}>
                    {event.completed ? '완료' : '예정'}
                  </Badge>
                </div>
                <p className="text-sm font-medium leading-tight">{event.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {event.isAllDay ? '종일' : event.time}
                  </span>
                  <Badge className={getDepartmentBadgeClass(event.department)} variant="outline">
                    {event.department}
                  </Badge>
                </div>
              </button>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
