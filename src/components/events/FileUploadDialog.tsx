import { useRef } from 'react'
import { parse } from 'date-fns'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseScheduleExcel } from '@/lib/parseExcel'
import { useScheduleStore } from '@/store/scheduleStore'

export function FileUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const setEvents = useScheduleStore((s) => s.setEvents)
  const setDataSource = useScheduleStore((s) => s.setDataSource)
  const setError = useScheduleStore((s) => s.setError)
  const setCurrentDate = useScheduleStore((s) => s.setCurrentDate)

  const handleFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer()
      const events = parseScheduleExcel(buffer)
      setEvents(events)
      setDataSource('excel')
      if (events.length > 0) {
        setCurrentDate(parse(events[0].date, 'yyyy-MM-dd', new Date()))
      }
    } catch {
      setError('Excel 파일을 읽을 수 없습니다. 형식을 확인해 주세요.')
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ''
        }}
      />
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" />
        <span className="hidden sm:inline">업로드</span>
      </Button>
    </>
  )
}
