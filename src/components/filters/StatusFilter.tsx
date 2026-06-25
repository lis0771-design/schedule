import { Button } from '@/components/ui/button'
import { useScheduleStore } from '@/store/scheduleStore'
import type { StatusFilter } from '@/types/schedule'

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '예정' },
  { value: 'completed', label: '완료' },
]

export function StatusFilter() {
  const statusFilter = useScheduleStore((s) => s.statusFilter)
  const setStatusFilter = useScheduleStore((s) => s.setStatusFilter)

  return (
    <div className="flex items-center gap-1 rounded-lg border p-0.5">
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={statusFilter === opt.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
