import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useScheduleStore } from '@/store/scheduleStore'

export function SearchBar() {
  const searchQuery = useScheduleStore((s) => s.searchQuery)
  const setSearchQuery = useScheduleStore((s) => s.setSearchQuery)

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="일정·비고 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
