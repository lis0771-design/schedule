const DEPARTMENT_HUES: Record<string, number> = {
  '인사 총무팀': 45,
  '경영 기획팀': 210,
  '마케팅팀': 330,
  '영업팀': 150,
  '개발팀': 260,
  '디자인팀': 280,
  '재무팀': 30,
  '고객지원팀': 190,
  '물류팀': 80,
  '품질관리팀': 120,
  '연구개발팀': 240,
  '법무팀': 0,
  '전 부서': 55,
  '경영진': 20,
  '-': 0,
}

function hashHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

export function getDepartmentHue(department: string): number {
  return DEPARTMENT_HUES[department] ?? hashHue(department)
}

export function getDepartmentColor(department: string, completed = true): {
  bg: string
  border: string
  text: string
} {
  const hue = getDepartmentHue(department)
  const saturation = department === '-' ? 0 : 65
  const lightness = completed ? 88 : 94
  const borderLightness = completed ? 55 : 45

  return {
    bg: `hsl(${hue} ${saturation}% ${lightness}%)`,
    border: `hsl(${hue} ${saturation}% ${borderLightness}%)`,
    text: `hsl(${hue} ${Math.min(saturation + 10, 80)}% 25%)`,
  }
}

export function getDepartmentBadgeClass(department: string): string {
  const hue = getDepartmentHue(department)
  return `bg-[hsl(${hue}_65%_90%)] text-[hsl(${hue}_70%_30%)] border-[hsl(${hue}_65%_70%)]`
}
