# 스크롤 내러티브 설계

**PRD 참조:** 섹션 6.4, 6.6, 8.2, 9.5

---

## 내러티브 3단 구조

| 섹션 | 제목 | 콘텐츠 |
|------|------|--------|
| 1. 문제 제기 | "지금 일어나고 있는 일" | 와이드 사진 + 문제 본문 + 통계 하이라이트 |
| 2. WWF 활동 | "우리가 하고 있는 일" | 사진-텍스트 교차 배치 + 활동 목록 |
| 3. 참여 호소 | "당신의 마음이 닿을 수 있는 곳" | 마무리 텍스트 + 기부하기 CTA |

---

## 레이아웃 패턴

- 최대 콘텐츠: 1200px / 본문 텍스트: 720px 이내
- 사진: 전폭(full-bleed) 사용 → 몰입감
- 텍스트:이미지 비율 ≈ 3:7
- CTA: 내러티브 흐름의 자연스러운 끝에 배치 (하단 고정 X)

---

## GSAP 애니메이션

### 텍스트
- 섹션 진입 시 하단→상단 페이드업
- stagger: 0.1s per element
- ease: power2.out

### 사진
- 패럴랙스 스크롤 (speed 0.5)
- 또는 스케일 트랜지션 (1.1 → 1.0)

### 통계 숫자
- 뷰포트 진입 시 0 → 목표값 카운트업
- duration: 2s
- ease: power1.out

### 구현 패턴

```typescript
// 클라이언트 컴포넌트에서만 사용
'use client'

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // ScrollTrigger 설정
  }, containerRef)
  return () => ctx.revert()
}, [])
```

### prefers-reduced-motion 대응

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // 요소를 즉시 최종 상태로 표시
}
```

---

## 이미지 레이아웃 타입

| layout | 설명 | 해상도 |
|--------|------|--------|
| full | 전폭 full-bleed (16:9) | 1440x810 |
| half | 반폭 (4:3) | 720x540 |
| inset | 본문 삽입 (4:3) | 720x540 |
