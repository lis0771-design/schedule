import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getDepartmentColor } from '@/lib/departmentColors'
import { useDepartments, useScheduleStore } from '@/store/scheduleStore'

export function DepartmentFilter() {
  const departments = useDepartments()
  const selectedDepartments = useScheduleStore((s) => s.selectedDepartments)
  const toggleDepartment = useScheduleStore((s) => s.toggleDepartment)
  const setSelectedDepartments = useScheduleStore((s) => s.setSelectedDepartments)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="size-4" />
          부서
          {selectedDepartments.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {selectedDepartments.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">부서 필터</p>
          {selectedDepartments.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDepartments([])}>
              초기화
            </Button>
          )}
        </div>
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {departments.map((dept) => {
            const colors = getDepartmentColor(dept)
            return (
              <label
                key={dept}
                className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-accent"
              >
                <Checkbox
                  checked={selectedDepartments.includes(dept)}
                  onCheckedChange={() => toggleDepartment(dept)}
                />
                <span
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {dept}
                </span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
