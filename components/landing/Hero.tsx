'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/animations/scrollAnimations'
import { BLUR_DATA_URL } from '@/lib/utils'

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollButtonRef = useRef<HTMLButtonElement>(null)

  const handleScrollDown = useCallback(() => {
    const missionSection = document.getElementById('mission-card-grid')
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // 즉시 최종 상태로 설정
        gsap.set(
          [headlineRef.current, subtitleRef.current, scrollButtonRef.current],
          { opacity: 1, y: 0 }
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 초기 숨김 상태
      gsap.set(
        [headlineRef.current, subtitleRef.current, scrollButtonRef.current],
        { opacity: 0, y: 30 }
      )

      // 순차 등장
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: 0.2,
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.4'
        )
        .to(
          scrollButtonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.3'
        )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      data-testid="hero-section"
      className="relative h-screen w-full overflow-hidden"
      aria-label="메인 히어로 섹션"
    >
      {/* 배경 이미지 */}
      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80"
        alt="우주에서 바라본 지구"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />

      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />

      {/* 헤더 영역 그라데이션 (네비게이션 가독성 확보) */}
      <div
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 via-black/30 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* 메인 헤드라인 */}
        <h1
          ref={headlineRef}
          data-testid="hero-headline"
          className="font-serif text-5xl font-bold text-white md:text-7xl"
        >
          <span className="block">지금, 자연이</span>
          <span className="block mt-2 md:mt-4">보내는 신호</span>
        </h1>

        {/* WWF 소개 한 줄 */}
        <p
          ref={subtitleRef}
          data-testid="hero-subtitle"
          className="mt-6 max-w-md font-sans text-base text-white/80 md:mt-8 md:text-lg"
        >
          사람과 자연이 조화로운 미래를 만들어갑니다
        </p>

        {/* 스크롤 다운 인디케이터 */}
        <button
          ref={scrollButtonRef}
          data-testid="hero-scroll-button"
          onClick={handleScrollDown}
          className="mt-16 flex flex-col items-center gap-2 font-sans text-sm font-medium text-white/70 transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:mt-20"
          aria-label="미션 카드 섹션으로 스크롤 내리기"
        >
          <span>알아보기</span>
          <span
            className="block animate-bounce text-xl leading-none"
            aria-hidden="true"
          >
            ↓
          </span>
        </button>
      </div>
    </section>
  )
}
