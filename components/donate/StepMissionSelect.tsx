'use client'

import Image from 'next/image'
import { BLUR_DATA_URL } from '@/lib/utils'
import { useDonationStore } from '@/lib/store/donationStore'
import { missions } from '@/lib/data/missions'
import type { MissionSlug } from '@/lib/types/mission'

export default function StepMissionSelect() {
  const selectMission = useDonationStore((s) => s.selectMission)

  return (
    <div data-testid="step-mission-select" className="space-y-5">
      <div>
        <h2 className="font-serif text-lg md:text-xl text-wwf-black leading-snug">
          어떤 활동을 후원하시겠어요?
        </h2>
        <p className="text-sm text-wwf-light-gray mt-1">
          관심 있는 분야를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {missions.map((mission) => (
          <button
            key={mission.slug}
            onClick={() => selectMission(mission.slug as MissionSlug)}
            className="group relative overflow-hidden rounded-xl aspect-[4/3] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2"
          >
            <Image
              src={mission.cardImage}
              alt={mission.fullName}
              fill
              sizes="(max-width: 768px) 45vw, 220px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-white text-sm font-semibold">
                {mission.name}
              </span>
              <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
                {mission.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
