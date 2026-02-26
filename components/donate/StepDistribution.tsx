'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useDonationStore,
  selectSelectedMissions,
  selectDistribution,
  selectDonation,
} from '@/lib/store/donationStore'
import { missions } from '@/lib/data/missions'
import { MISSION_COLORS } from '@/lib/constants/missionColors'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { MissionSlug } from '@/lib/types/mission'

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
}

// ────────────────────────────────────────────────────────────────────────────
// 도넛 차트 (GSAP 애니메이션)
// ────────────────────────────────────────────────────────────────────────────

// SVG viewBox는 고정, 실제 렌더 크기만 CSS로 조절
const DONUT_SIZE = 190
const CX = DONUT_SIZE / 2
const CY = DONUT_SIZE / 2
const R = 68
const STROKE = 22
const CIRCUMFERENCE = 2 * Math.PI * R
const GAP_DEGREES = 3 // 세그먼트 간 갭 (도)
const GAP_LENGTH = (GAP_DEGREES / 360) * CIRCUMFERENCE

interface DonutChartProps {
  distribution: Record<MissionSlug, number>
  selectedMissions: MissionSlug[]
  amount: number
}

function DonutChart({ distribution, selectedMissions, amount }: DonutChartProps) {
  const circleRefs = useRef<Map<MissionSlug, SVGCircleElement>>(new Map())
  const prevDataRef = useRef<{ dasharray: string; dashoffset: number }[]>([])

  useEffect(() => {
    const totalGap = GAP_LENGTH * selectedMissions.length
    const usableCircumference = CIRCUMFERENCE - totalGap

    let cumulativeOffset = 0

    selectedMissions.forEach((slug, i) => {
      const percent = distribution[slug] ?? 0
      const segmentLength = Math.max(0, (percent / 100) * usableCircumference)
      const offset = cumulativeOffset

      const circle = circleRefs.current.get(slug)
      if (circle) {
        gsap.to(circle, {
          attr: {
            'stroke-dasharray': `${segmentLength} ${CIRCUMFERENCE - segmentLength}`,
            'stroke-dashoffset': -(offset),
          },
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      cumulativeOffset += segmentLength + GAP_LENGTH
    })
  }, [distribution, selectedMissions])

  // 초기 렌더링용 (GSAP 적용 전 위치)
  const initialSegments = useMemo(() => {
    const totalGap = GAP_LENGTH * selectedMissions.length
    const usable = CIRCUMFERENCE - totalGap
    let cum = 0

    return selectedMissions.map((slug) => {
      const percent = distribution[slug] ?? 0
      const seg = Math.max(0, (percent / 100) * usable)
      const off = cum
      cum += seg + GAP_LENGTH
      return { slug, dasharray: `${seg} ${CIRCUMFERENCE - seg}`, dashoffset: -off }
    })
  }, []) // 초기값만

  return (
    <div className="relative flex items-center justify-center w-[150px] h-[150px] md:w-[190px] md:h-[190px]">
      <svg
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* 배경 원 */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="#F0F0F0"
          strokeWidth={STROKE}
        />
        {/* 세그먼트 */}
        {selectedMissions.map((slug, i) => {
          const initial = initialSegments[i]
          return (
            <circle
              key={slug}
              ref={(el) => {
                if (el) circleRefs.current.set(slug, el)
              }}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={MISSION_COLORS[slug]}
              strokeWidth={STROKE}
              strokeDasharray={initial?.dasharray ?? `0 ${CIRCUMFERENCE}`}
              strokeDashoffset={initial?.dashoffset ?? 0}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          )
        })}
      </svg>
      {/* 중앙 텍스트 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] md:text-[11px] text-wwf-light-gray">총 후원금</span>
        <span className="text-sm md:text-lg font-bold text-wwf-black">
          {formatCurrency(amount)}
        </span>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 비율 슬라이더 행
// ────────────────────────────────────────────────────────────────────────────

interface SliderRowProps {
  slug: MissionSlug
  percent: number
  amount: number
  onChange: (slug: MissionSlug, value: number) => void
}

function SliderRow({ slug, percent, amount, onChange }: SliderRowProps) {
  const mission = missions.find((m) => m.slug === slug)
  const Icon = mission ? iconMap[mission.icon] : null
  const color = MISSION_COLORS[slug]
  const sliderAmount = Math.round((percent / 100) * amount)

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleStartEdit = useCallback(() => {
    setEditValue(String(percent))
    setIsEditing(true)
  }, [percent])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleCommitEdit = useCallback(() => {
    setIsEditing(false)
    const parsed = parseInt(editValue, 10)
    if (isNaN(parsed)) return
    const clamped = Math.max(5, Math.min(95, parsed))
    onChange(slug, clamped)
  }, [editValue, slug, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCommitEdit()
      if (e.key === 'Escape') setIsEditing(false)
    },
    [handleCommitEdit]
  )

  return (
    <div className="space-y-1.5 md:space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className="w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color }} />
            </div>
          )}
          <span className="text-sm font-medium text-wwf-dark-gray">
            {mission?.name}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          {isEditing ? (
            <span className="text-sm font-bold tabular-nums" style={{ color }}>
              <input
                ref={inputRef}
                type="number"
                min={5}
                max={95}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleCommitEdit}
                onKeyDown={handleKeyDown}
                className="w-10 text-right font-bold tabular-nums bg-transparent border-b-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                style={{ borderColor: color, color }}
              />
              %
            </span>
          ) : (
            <button
              type="button"
              onClick={handleStartEdit}
              className="text-sm font-bold tabular-nums cursor-text hover:opacity-70 transition-opacity"
              style={{ color }}
              aria-label={`${mission?.name} 비율 직접 입력 (현재 ${percent}%)`}
            >
              {percent}%
            </button>
          )}
          <span className="text-xs text-wwf-light-gray tabular-nums">
            {formatCurrency(sliderAmount)}
          </span>
        </div>
      </div>

      {/* 레인지 슬라이더 */}
      <input
        type="range"
        min={5}
        max={95}
        value={percent}
        onChange={(e) => onChange(slug, Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, #E5E5E5 ${percent}%, #E5E5E5 100%)`,
          color: color,
        }}
        aria-label={`${mission?.name} 배분 비율: ${percent}%`}
      />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────────────────────────────────────

export default function StepDistribution() {
  const selectedMissions = useDonationStore(selectSelectedMissions)
  const distribution = useDonationStore(selectDistribution)
  const { amount } = useDonationStore(selectDonation)
  const setDistribution = useDonationStore((s) => s.setDistribution)
  const nextStep = useDonationStore((s) => s.nextStep)

  const handleSliderChange = useCallback(
    (changedSlug: MissionSlug, newValue: number) => {
      const others = selectedMissions.filter((s) => s !== changedSlug)
      if (others.length === 0) return

      const remaining = 100 - newValue
      const othersCurrentTotal = others.reduce(
        (sum, slug) => sum + (distribution[slug] ?? 0),
        0
      )

      const newDist = { ...distribution }
      newDist[changedSlug] = newValue

      if (othersCurrentTotal === 0) {
        const perOther = Math.floor(remaining / others.length)
        others.forEach((slug, i) => {
          newDist[slug] = i === 0 ? remaining - perOther * (others.length - 1) : perOther
        })
      } else {
        let distributed = 0
        others.forEach((slug, i) => {
          if (i === others.length - 1) {
            newDist[slug] = Math.max(0, remaining - distributed)
          } else {
            const share = Math.round(
              ((distribution[slug] ?? 0) / othersCurrentTotal) * remaining
            )
            newDist[slug] = share
            distributed += share
          }
        })
      }

      setDistribution(newDist as Record<MissionSlug, number>)
    },
    [selectedMissions, distribution, setDistribution]
  )

  const handleEqualDistribute = useCallback(() => {
    const count = selectedMissions.length
    if (count === 0) return

    const base = Math.floor(100 / count)
    const remainder = 100 % count
    const newDist = {} as Record<MissionSlug, number>
    selectedMissions.forEach((slug, i) => {
      newDist[slug] = i === 0 ? base + remainder : base
    })
    setDistribution(newDist)
  }, [selectedMissions, setDistribution])

  const handleNext = useCallback(() => {
    nextStep()
  }, [nextStep])

  const missionEntries = useMemo(
    () =>
      selectedMissions.map((slug) => ({
        slug,
        percent: distribution[slug] ?? 0,
      })),
    [selectedMissions, distribution]
  )

  return (
    <div data-testid="step-distribution" className="space-y-3 md:space-y-5">
      <h2 className="font-serif text-lg md:text-xl text-wwf-black leading-snug">
        후원금 배분을 조절해보세요
      </h2>

      {/* 도넛 차트 */}
      <div className="flex justify-center py-0 md:py-1">
        <DonutChart
          distribution={distribution}
          selectedMissions={selectedMissions}
          amount={amount}
        />
      </div>

      {/* 슬라이더 영역 */}
      <div className="space-y-3 md:space-y-4">
        {missionEntries.map(({ slug, percent }) => (
          <SliderRow
            key={slug}
            slug={slug}
            percent={percent}
            amount={amount}
            onChange={handleSliderChange}
          />
        ))}
      </div>

      {/* 균등 배분 버튼 */}
      <button
        type="button"
        onClick={handleEqualDistribute}
        className="w-full flex items-center justify-center gap-1.5 text-sm text-wwf-light-gray hover:text-wwf-orange font-medium transition-colors py-1"
        data-testid="equal-distribute-button"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        균등 배분으로 초기화
      </button>

      <Button
        data-testid="step-distribution-next"
        onClick={handleNext}
        className="w-full rounded-full bg-wwf-orange text-white hover:bg-orange-600 h-12 text-base font-medium"
      >
        다음
      </Button>
    </div>
  )
}
