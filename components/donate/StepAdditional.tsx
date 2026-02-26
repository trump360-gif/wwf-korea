'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useDonationStore, selectEntryMission } from '@/lib/store/donationStore'
import { getMissionBySlug } from '@/lib/data/missions'
import type { ModalStep } from '@/lib/types/donation'

export default function StepAdditional() {
  const entryMission = useDonationStore(selectEntryMission)
  const nextStep = useDonationStore((s) => s.nextStep)

  const mission = entryMission ? getMissionBySlug(entryMission) : null
  const missionName = mission?.name ?? '선택한 미션'

  // "네, 더 알아볼게요" -> 스텝 2-1로 이동
  const handleYes = useCallback(() => {
    // store의 currentStep을 '2-1'로 직접 설정
    useDonationStore.setState((state) => ({
      modal: {
        ...state.modal,
        currentStep: '2-1' as ModalStep,
      },
    }))
  }, [])

  // "미션에 집중할게요" -> 스텝 3으로 이동
  const handleNo = useCallback(() => {
    nextStep() // 2 -> 3
  }, [nextStep])

  return (
    <div data-testid="step-additional" className="space-y-6">
      {/* 상단 타이틀 */}
      <h2 className="font-serif text-lg md:text-xl text-wwf-black leading-snug">
        {missionName}을 향한 마음, 감사합니다.
      </h2>

      {/* 질문 */}
      <p className="text-base text-wwf-dark-gray">
        다른 자연보전 활동에도 함께하시겠어요?
      </p>

      {/* 두 버튼 (동등한 크기, 동등한 비중) */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          data-testid="step-additional-yes"
          onClick={handleYes}
          variant="outline"
          className="w-full h-14 rounded-xl text-base font-medium border-2 border-wwf-orange text-wwf-orange hover:bg-wwf-orange hover:text-white transition-colors"
        >
          네, 더 알아볼게요
        </Button>
        <Button
          data-testid="step-additional-no"
          onClick={handleNo}
          variant="outline"
          className="w-full h-14 rounded-xl text-base font-medium border-2 border-wwf-dark-gray text-wwf-dark-gray hover:bg-wwf-dark-gray hover:text-white transition-colors"
        >
          {missionName}에 집중할게요
        </Button>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-sm text-wwf-light-gray text-center">
        어떤 선택이든 소중합니다
      </p>
    </div>
  )
}
