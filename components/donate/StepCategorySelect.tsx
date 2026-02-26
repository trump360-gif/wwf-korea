'use client'

import { useCallback } from 'react'
import {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  useDonationStore,
  selectEntryMission,
  selectSelectedMissions,
} from '@/lib/store/donationStore'
import { missions } from '@/lib/data/missions'
import { MISSION_COLORS } from '@/lib/constants/missionColors'
import type { MissionSlug } from '@/lib/types/mission'

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
}

export default function StepCategorySelect() {
  const entryMission = useDonationStore(selectEntryMission)
  const selectedMissions = useDonationStore(selectSelectedMissions)
  const toggleMission = useDonationStore((s) => s.toggleMission)
  const nextStep = useDonationStore((s) => s.nextStep)

  const otherMissions = missions.filter((m) => m.slug !== entryMission)

  const handleToggle = useCallback(
    (slug: MissionSlug) => {
      toggleMission(slug)
    },
    [toggleMission]
  )

  const handleNext = useCallback(() => {
    nextStep()
  }, [nextStep])

  // entryMission 제외한 추가 선택된 미션
  const additionalSelected = selectedMissions.filter((s) => s !== entryMission)

  return (
    <div data-testid="step-category-select" className="space-y-5">
      <h2 className="font-serif text-lg md:text-xl text-wwf-black leading-snug">
        함께 관심 가져주실 곳을 선택해주세요
      </h2>

      {/* 미션 카드 리스트 */}
      <div className="space-y-2">
        {otherMissions.map((mission) => {
          const Icon = iconMap[mission.icon]
          const isSelected = selectedMissions.includes(mission.slug)
          const color = MISSION_COLORS[mission.slug]

          return (
            <label
              key={mission.slug}
              data-testid={`mission-card-${mission.slug}`}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-wwf-orange bg-orange-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(mission.slug)}
                className="data-[state=checked]:bg-wwf-orange data-[state=checked]:border-wwf-orange"
              />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {Icon && (
                  <div
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'scale-110' : 'bg-wwf-warm-gray scale-100'
                    }`}
                    style={isSelected ? { backgroundColor: `${color}15` } : undefined}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: isSelected ? color : '#333333' }}
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-wwf-dark-gray">{mission.name}</p>
                  <p className="text-xs text-wwf-light-gray truncate">{mission.subtitle}</p>
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {/* 선택된 미션 태그 뱃지 */}
      {additionalSelected.length > 0 && (
        <div
          data-testid="selected-badges"
          className="flex flex-wrap gap-2 pt-1"
        >
          {additionalSelected.map((slug) => {
            const mission = missions.find((m) => m.slug === slug)
            const color = MISSION_COLORS[slug]
            if (!mission) return null

            return (
              <button
                key={slug}
                type="button"
                onClick={() => handleToggle(slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  border: `1px solid ${color}30`,
                }}
                aria-label={`${mission.name} 선택 해제`}
              >
                {mission.name}
                <X className="w-3 h-3" />
              </button>
            )
          })}
        </div>
      )}

      <Button
        data-testid="step-category-next"
        onClick={handleNext}
        className="w-full rounded-full bg-wwf-orange text-white hover:bg-orange-600 h-12 text-base font-medium"
      >
        다음
      </Button>
    </div>
  )
}
