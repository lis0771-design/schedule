# 골든래빗 일정 대시보드

골든래빗 팀 일정을 시각화하는 React 대시보드입니다.

## 기능

- 월 / 주 / 일 / 목록 4가지 캘린더 뷰
- KPI 카드 (오늘, 이번 주, 미완료, 완료율)
- 다가오는 일정 사이드바 (7일 이내)
- 부서·완료 상태 필터, 검색
- 이벤트 상세 Sheet
- Excel 파일 업로드
- 다크모드

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. `vercel.json`에 SPA fallback이 포함되어 있습니다.

또는 Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

## 데이터

- 기본 데이터: `public/data/골든래빗 일정.xlsx`
- 루트의 `골든래빗 일정.xlsx`를 수정한 뒤 `public/data/`에 복사하면 배포 데이터가 갱신됩니다.
