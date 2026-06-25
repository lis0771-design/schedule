import { CalendarOff, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDepartmentColor } from '@/lib/departmentColors'
import type { ScheduleEvent } from '@/types/schedule'

interface EventChipProps {
  event: ScheduleEvent
  compact?: boolean
  onClick?: () => void
  className?: string
}

export function EventChip({ event, compact = false, onClick, className }: EventChipProps) {
  const colors = getDepartmentColor(event.department, event.completed)
  const isHoliday = event.department === '-'
  const isAllDept = event.department === '전 부서'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-1 rounded-md border px-1.5 py-0.5 text-left text-xs transition-opacity hover:opacity-80',
        !event.completed && 'border-dashed',
        compact ? 'truncate' : '',
        className,
      )}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {isHoliday && <CalendarOff className="size-3 shrink-0" />}
      {isAllDept && <Users className="size-3 shrink-0" />}
      {!event.isAllDay && event.time && (
        <span className="shrink-0 font-medium opacity-80">{event.time}</span>
      )}
      <span className="truncate font-medium">{event.title}</span>
    </button>
  )
}
