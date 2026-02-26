import Image from 'next/image'
import type { Mission } from '@/lib/types/mission'
import { ChevronDown } from 'lucide-react'
import { BLUR_DATA_URL } from '@/lib/utils'

interface MissionHeroProps {
  mission: Mission
}

export default function MissionHero({ mission }: MissionHeroProps) {
  return (
    <section
      data-testid="mission-hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      aria-label={`${mission.fullName} 히어로 섹션`}
    >
      {/* 배경 이미지 */}
      <Image
        src={mission.heroImage}
        alt={`${mission.fullName} 대표 이미지`}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />

      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
      />

      {/* 헤더 영역 그라데이션 (네비게이션 가독성 확보) */}
      <div
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 via-black/30 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* 중앙 텍스트 콘텐츠 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* 키워드 태그 */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-8"
          aria-label="미션 키워드"
        >
          {mission.keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-block px-3 py-1 rounded-full text-xs font-sans font-medium text-white/90 border border-white/30 bg-white/10"
            >
              {keyword}
            </span>
          ))}
        </div>

        {/* 미션 전체명 */}
        <h1
          data-testid="mission-hero-title"
          className="font-serif text-5xl md:text-7xl text-white font-bold leading-tight"
        >
          {mission.fullName}
        </h1>

        {/* 미션 부제목 */}
        <p
          data-testid="mission-hero-subtitle"
          className="font-sans text-xl md:text-2xl text-white/80 mt-4 leading-relaxed"
        >
          {mission.subtitle}
        </p>
      </div>

      {/* 스크롤 다운 인디케이터 */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-sans text-xs text-white/60 tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown
          className="w-5 h-5 text-white/60 animate-bounce"
        />
      </div>
    </section>
  )
}
