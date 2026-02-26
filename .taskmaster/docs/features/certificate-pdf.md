# 기증서 PDF 명세

**PRD 참조:** 섹션 5.2, 9.6

---

## 기증서 레이아웃 (A4 세로)

```
┌─────────────────────────────────┐
│                                 │
│          WWF 로고               │
│                                 │
│     ─────────────────────       │
│                                 │
│       후원 기증서                │
│                                 │
│     홍길동 님께                  │
│                                 │
│     귀하의 소중한 후원에          │
│     깊이 감사드립니다.           │
│                                 │
│     후원 금액: 50,000원          │
│     후원 유형: 월정기 후원        │
│     후원 미션: 해양, 기후·에너지   │
│     후원 일자: 2026년 2월 19일    │
│                                 │
│     "당신의 후원으로              │
│      해양 생태계가 보호됩니다"    │
│                                 │
│     ─────────────────────       │
│                                 │
│     기증서 번호: WWF-2026-XXXXX  │
│     WWF-Korea · wwfkorea.or.kr  │
│                                 │
└─────────────────────────────────┘
```

---

## 데이터 필드

| 항목 | 소스 | 설명 |
|------|------|------|
| 기부자 이름 | donationStore.donor.name | 사용자 입력 |
| 기부 금액 | donationStore.donation.amount | formatCurrency 적용 |
| 후원 유형 | donationStore.donation.type | 'monthly' → '월정기 후원' |
| 후원 미션 | donationStore.donation.selectedMissions | slug → name 변환 |
| 기부 일자 | 현재 날짜 | YYYY년 M월 D일 형식 |
| 임팩트 메시지 | missions[slug].impactMessage | 첫 번째 미션 기준 |
| 기증서 번호 | 자동 생성 | WWF-{YYYY}-{5자리 랜덤} |

---

## 기술 구현

### 한글 폰트 이슈
- @react-pdf/renderer는 한글 폰트 수동 등록 필요
- Noto Sans KR Regular (~4MB) 사용
- 번들 사이즈 영향 → **서버사이드 생성 우선, 클라이언트 폴백**

### 구현 방식

```
1차: 서버 API Route (app/api/certificate/route.ts)
  - renderToBuffer()로 PDF 생성
  - Content-Type: application/pdf 반환
  - 클라이언트 번들에 폰트 미포함

2차 (폴백): 클라이언트 생성
  - pdf() 함수로 Blob 생성
  - URL.createObjectURL → 다운로드
  - @react-pdf/renderer 동적 import 필수
```

### 로딩 UX
- 버튼 클릭 → 스피너 + "기증서 생성 중..."
- 버튼 비활성화
- 완료 시 자동 다운로드
