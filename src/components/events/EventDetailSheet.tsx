import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatKoreanDate, parseISODate } from '@/lib/dateUtils'
import { getDepartmentBadgeClass } from '@/lib/departmentColors'
import { useScheduleStore, useSelectedEvent } from '@/store/scheduleStore'

export function EventDetailSheet() {
  const event = useSelectedEvent()
  const selectedEventId = useScheduleStore((s) => s.selectedEventId)
  const setSelectedEventId = useScheduleStore((s) => s.setSelectedEventId)

  return (
    <Sheet open={!!selectedEventId} onOpenChange={(open) => !open && setSelectedEventId(null)}>
      <SheetContent>
        {event && (
          <>
            <SheetHeader>
              <SheetTitle>{event.title}</SheetTitle>
              <SheetDescription>
                {formatKoreanDate(parseISODate(event.date))}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={event.completed ? 'success' : 'pending'}>
                  {event.completed ? '완료' : '예정'}
                </Badge>
                <Badge className={getDepartmentBadgeClass(event.department)} variant="outline">
                  {event.department}
                </Badge>
              </div>
              <Separator />
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">시간</dt>
                  <dd className="font-medium">{event.isAllDay ? '종일' : event.time}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">요일</dt>
                  <dd className="font-medium">{event.weekday}</dd>
                </div>
                {event.note && (
                  <div>
                    <dt className="text-muted-foreground">비고</dt>
                    <dd className="font-medium">{event.note}</dd>
                  </div>
                )}
              </dl>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
