'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { countUpAnimation, prefersReducedMotion } from '@/lib/animations/scrollAnimations'

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

interface ImpactStat {
  value: string
  unit: string
  label: string
}

// ────────────────────────────────────────────────────────────────────────────
// 숫자 파싱: "600만+", "13,000+", "100+" → { numeric: number, suffix: string }
// ────────────────────────────────────────────────────────────────────────────

function parseStatValue(value: string): { numeric: number; suffix: string } {
  // 후행 "+" 제거 후 파싱
  const cleaned = value.replace(/\+$/, '').trim()

  // "만" 단위 처리 (예: "600만" → 6000000)
  const manMatch = cleaned.match(/^([\d,]+)만$/)
  if (manMatch) {
    const base = parseInt(manMatch[1].replace(/,/g, ''), 10)
    return { numeric: base * 10000, suffix: '+' }
  }

  // 일반 숫자 (콤마 제거)
  const numeric = parseInt(cleaned.replace(/,/g, ''), 10)
  const hasSuffix = value.endsWith('+')
  return { numeric: isNaN(numeric) ? 0 : numeric, suffix: hasSuffix ? '+' : '' }
}

// ────────────────────────────────────────────────────────────────────────────
// 카운트업 표시 포매터
// "600만+" → numeric=6000000 → 표시는 "만" 단위 축약
// ────────────────────────────────────────────────────────────────────────────

function formatDisplayValue(raw: string, counted: number): string {
  const manMatch = raw.replace(/\+$/, '').match(/^[\d,]+만$/)
  if (manMatch) {
    // 만 단위 축약 표기 유지
    const man = Math.floor(counted / 10000)
    return `${man.toLocaleString('ko-KR')}만${raw.endsWith('+') ? '+' : ''}`
  }
  return `${counted.toLocaleString('ko-KR')}${raw.endsWith('+') ? '+' : ''}`
}

// ────────────────────────────────────────────────────────────────────────────
// 데이터
// ────────────────────────────────────────────────────────────────────────────

const IMPACT_STATS: ImpactStat[] = [
  {
    value: '100+',
    unit: '개국',
    label: '활동 중인 국가',
  },
  {
    value: '600만+',
    unit: '명',
    label: '전 세계 후원자',
  },
  {
    value: '13,000+',
    unit: '개',
    label: '보전 프로젝트',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// 단일 통계 아이템
// ────────────────────────────────────────────────────────────────────────────

interface StatItemProps {
  stat: ImpactStat
  index: number
}

function StatItem({ stat, index }: StatItemProps) {
  const valueRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = valueRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      const { numeric } = parseStatValue(stat.value)

      if (prefersReducedMotion()) {
        el.textContent = stat.value
        return
      }

      // 초기값 설정
      el.textContent = formatDisplayValue(stat.value, 0)

      const counter = { value: 0 }
      gsap.to(counter, {
        value: numeric,
        duration: 2,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = formatDisplayValue(stat.value, Math.floor(counter.value))
        },
        onComplete() {
          el.textContent = stat.value
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [stat.value])

  return (
    <div
      data-testid={`impact-stat-${index}`}
      className="flex flex-col items-center text-center"
    >
      {/* 숫자 + 단위 */}
      <div className="flex items-baseline gap-1">
        <dt
          ref={valueRef}
          className="font-display text-5xl font-bold text-wwf-black"
          aria-label={`${stat.value} ${stat.unit}`}
        >
          {stat.value}
        </dt>
        <span
          className="font-display text-2xl font-semibold text-wwf-dark-gray"
          aria-hidden="true"
        >
          {stat.unit}
        </span>
      </div>

      {/* 라벨 */}
      <dd className="mt-2 font-sans text-sm text-wwf-dark-gray md:text-base">
        {stat.label}
      </dd>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────────────────────────────────────

export default function ImpactNumbers() {
  return (
    <section
      data-testid="impact-numbers-section"
      className="bg-wwf-warm-gray py-20 md:py-32"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* 섹션 제목 (시각적으로 숨김 — 스크린리더용) */}
        <h2 id="impact-heading" className="sr-only">
          WWF 글로벌 영향력
        </h2>

        <dl
          className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6"
          aria-label="WWF 글로벌 임팩트 수치"
        >
          {IMPACT_STATS.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} />
          ))}
        </dl>
      </div>
    </section>
  )
}
