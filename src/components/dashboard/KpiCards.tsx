import { Calendar, CalendarCheck, CalendarClock, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useKpiStats } from '@/store/scheduleStore'

const KPI_ITEMS: {
  key: 'todayCount' | 'weekCount' | 'pendingCount' | 'completionRate'
  label: string
  icon: typeof Calendar
  suffix?: string
}[] = [
  { key: 'todayCount', label: '오늘 일정', icon: Calendar },
  { key: 'weekCount', label: '이번 주', icon: CalendarClock },
  { key: 'pendingCount', label: '미완료', icon: CalendarCheck },
  { key: 'completionRate', label: '완료율', icon: Percent, suffix: '%' },
]

export function KpiCards() {
  const stats = useKpiStats()

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      {KPI_ITEMS.map(({ key, label, icon: Icon, suffix }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats[key]}
              {suffix ?? ''}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
