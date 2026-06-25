import { Moon, Rabbit, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/filters/SearchBar'
import { FileUploadButton } from '@/components/events/FileUploadDialog'
import { formatMonthLabel } from '@/lib/dateUtils'
import { useScheduleStore } from '@/store/scheduleStore'

export function AppHeader() {
  const currentDate = useScheduleStore((s) => s.currentDate)
  const darkMode = useScheduleStore((s) => s.darkMode)
  const toggleDarkMode = useScheduleStore((s) => s.toggleDarkMode)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rabbit className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">골든래빗 일정</h1>
            <p className="text-xs text-muted-foreground">{formatMonthLabel(currentDate)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchBar />
          <FileUploadButton />
          <Button variant="outline" size="icon" onClick={toggleDarkMode} aria-label="다크모드 토글">
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  )
}
