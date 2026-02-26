'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
  LucideIcon,
} from 'lucide-react'
import type { Mission } from '@/lib/types/mission'
import { BLUR_DATA_URL } from '@/lib/utils'

const MISSION_ICONS: Record<string, LucideIcon> = {
  Sun,
  Waves,
  PawPrint,
  Wheat,
  Droplets,
  TreePine,
}

interface MissionCardProps {
  mission: Mission
}

export default function MissionCard({ mission }: MissionCardProps) {
  const IconComponent = MISSION_ICONS[mission.icon]

  return (
    <Link
      href={`/missions/${mission.slug}`}
      data-testid={`mission-card-${mission.slug}`}
      className="group relative block aspect-3/4 overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2"
      aria-label={`${mission.name} 미션 페이지로 이동`}
    >
      {/* 배경 이미지 */}
      <Image
        src={mission.cardImage}
        alt={mission.fullName}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />

      {/* 하단 오버레이 */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* 카드 콘텐츠 */}
      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        {/* 상단: 아이콘 */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          aria-hidden="true"
        >
          {IconComponent && (
            <IconComponent className="h-5 w-5 text-white" strokeWidth={1.5} />
          )}
        </div>

        {/* 하단: 텍스트 */}
        <div>
          {/* 호버 시 페이드인 설명 */}
          <p
            data-testid={`mission-card-description-${mission.slug}`}
            className="mb-3 font-sans text-sm leading-relaxed text-white/90 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            aria-hidden="true"
          >
            {mission.description}
          </p>

          {/* 미션명 */}
          <h3 className="font-serif text-xl font-semibold text-white">
            {mission.name}
          </h3>

          {/* 서브타이틀 */}
          <p className="mt-1 font-sans text-xs text-white/70">
            {mission.subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}
