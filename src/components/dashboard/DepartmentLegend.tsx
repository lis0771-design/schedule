import { getDepartmentColor } from '@/lib/departmentColors'
import { useDepartments } from '@/store/scheduleStore'

export function DepartmentLegend() {
  const departments = useDepartments()

  if (departments.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">부서 범례</span>
      {departments.map((dept) => {
        const colors = getDepartmentColor(dept)
        return (
          <span
            key={dept}
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
            style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
          >
            {dept}
          </span>
        )
      })}
    </div>
  )
}
