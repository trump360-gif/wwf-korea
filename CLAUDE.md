# Project CLAUDE.md

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines.**
@./.taskmaster/CLAUDE.md

---

## 세션 시작 시 자동 로딩 (Claude 필수 수행)

**첫 작업 요청 받으면 아래 파일을 먼저 읽고 시작할 것:**
```
1. .taskmaster/docs/types-snapshot.md  ← 타입 컨텍스트 복구 (있는 경우)
2. lib/data/missions.ts               ← 미션 데이터 타입 정의
3. lib/store/donationStore.ts          ← Zustand 스토어 타입
```

> 사용자가 별도 지시 없어도 Claude가 자동 수행

---

## PRD 논의 및 설계 프로토콜

**트리거**: "PRD 논의 시작" 혹은 "새 기능 설계" 언급 시 즉시 실행

### 플랫폼 연동 분석

이 프로젝트는 **프론트엔드 전용 SPA 프로토타입**이므로 4각 연동 대신 아래 구조:

| 플랫폼 | 고려 사항 |
|--------|----------|
| **FE (Web)** | Next.js App Router, SSG/CSR 혼합, 반응형 (Desktop/Tablet/Mobile) |
| **API** | 프로토타입 단계 — 실제 백엔드 없음. PDF 생성 API Route만 존재 |
| **결제** | UI/UX만 구현. 실제 PG 연동 제외 |

### 문서 계층화

```
.taskmaster/docs/
├── prd.md                    ← 전체 PRD (이 프로젝트의 Master PRD)
└── features/
    ├── donation-flow.md      ← 기부 플로우 상세 명세
    ├── scroll-narrative.md   ← 스크롤 내러티브 설계
    └── certificate-pdf.md    ← 기증서 PDF 명세
```

### Type-First 설계

```
코드 작성 전:
1. lib/types/ 에서 타입 먼저 정의
2. 단일 진실 공급원(SSOT) 원칙 고수
3. Mission, Donation, Donor 타입이 모든 컴포넌트의 기반
```

---

## API 명세

### [GET] /api/certificate (기증서 PDF 생성)

**Request (Query):**
| 필드 | 타입 | 필수 | 설명 |
|-----|------|-----|------|
| name | string | O | 기부자 이름 |
| amount | number | O | 기부 금액 |
| type | 'monthly' \| 'onetime' | O | 후원 유형 |
| missions | string | O | 쉼표 구분 미션 slug |
| date | string | O | ISO 8601 기부일 |

**Response (200):**
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="wwf-certificate.pdf"

**Error Responses:**
| 상태 | 코드 | 조건 |
|-----|------|-----|
| 400 | VALIDATION_ERROR | 필수 파라미터 누락 |

---

## UI-API 연동 명세

### / (메인 랜딩페이지)

| UI 요소 | 이벤트 | API 호출 | 사용 필드 | 성공 시 | 실패 시 |
|--------|-------|---------|----------|--------|--------|
| 페이지 로드 | mount | 없음 (SSG) | missions 정적 데이터 | 렌더링 | - |
| 미션 카드 | click | 없음 | slug | /missions/[slug] 이동 | - |

### /missions/[slug] (미션별 랜딩)

| UI 요소 | 이벤트 | API 호출 | 사용 필드 | 성공 시 | 실패 시 |
|--------|-------|---------|----------|--------|--------|
| 페이지 로드 | mount | 없음 (SSG) | mission 정적 데이터 | 렌더링 | 404 페이지 |
| 기부하기 CTA | click | 없음 | slug | 기부 모달 open | - |
| 스크롤 | scroll | 없음 | - | GSAP 애니메이션 | - |

### 기부 모달 (전역)

| UI 요소 | 이벤트 | API 호출 | 사용 필드 | 성공 시 | 실패 시 |
|--------|-------|---------|----------|--------|--------|
| 금액 프리셋 | click | 없음 | amount | Zustand 상태 업데이트 | - |
| 직접 입력 | input | 없음 | amount | 검증 후 상태 업데이트 | 인라인 에러 |
| 다음 버튼 | click | 없음 | - | 다음 스텝 이동 | 검증 에러 표시 |
| 후원하기 | click | 없음 (프로토타입) | donor 전체 | /donate/complete 이동 | 검증 에러 |

### /donate/complete (감사 페이지)

| UI 요소 | 이벤트 | API 호출 | 사용 필드 | 성공 시 | 실패 시 |
|--------|-------|---------|----------|--------|--------|
| 페이지 로드 | mount | 없음 | Zustand 상태 | 감사 메시지 표시 | / 리다이렉트 |
| PDF 다운로드 | click | GET /api/certificate | name, amount, missions, date | PDF 다운로드 | 에러 토스트 |

---

## 프로젝트 초기 세팅 체크리스트

### 필수 패키지

```bash
# 상태관리
npm install zustand

# 애니메이션
npm install gsap

# PDF 생성
npm install @react-pdf/renderer

# UI 컴포넌트
npx shadcn@latest init

# 유틸리티
npm install clsx tailwind-merge class-variance-authority lucide-react
```

### 타입 폴더 구조

```bash
mkdir -p lib/types lib/data lib/store lib/utils lib/animations lib/pdf
```

### 초기 세팅 체크리스트

- [ ] Next.js + TypeScript + Tailwind 프로젝트 생성
- [ ] shadcn/ui 초기화 + 필수 컴포넌트 설치 (button, dialog, input, checkbox, radio-group, progress)
- [ ] Zustand 설치 및 donationStore 생성
- [ ] GSAP + ScrollTrigger 설치
- [ ] @react-pdf/renderer 설치
- [ ] 폰트 설정 (Noto Serif KR, Playfair Display, Pretendard)
- [ ] Tailwind 디자인 토큰 설정 (컬러, 타이포 스케일)
- [ ] lib/types/ 타입 정의 완료
- [ ] lib/data/missions.ts 데이터 파일 작성
- [ ] next.config.ts standalone 설정
- [ ] tsconfig.json strict 모드 확인
- [ ] 디렉토리 구조 생성 (components/, lib/, public/images/)

---

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 프로젝트명 | WWF-Korea 기부 플랫폼 |
| Tech Stack | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Zustand, GSAP, @react-pdf/renderer |
| 생성일 | 2026-02-24 |
| PRD | .taskmaster/docs/prd.md |
| 배포 | standalone 빌드 → Docker → CodeB Blue-Green |
