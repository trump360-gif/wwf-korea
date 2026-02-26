'use client'

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { missions } from '@/lib/data/missions'
import { staggerFadeUp, prefersReducedMotion } from '@/lib/animations/scrollAnimations'
import MissionCard from './MissionCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// SSR에서 useLayoutEffect 경고 방지
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function MissionCardGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  // 모바일 카드 클릭: GSAP pin revert 후 네비게이션 (DOM 충돌 방지)
  const handleMobileCardClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      if (window.matchMedia('(min-width: 768px)').matches) return

      e.preventDefault()
      e.stopPropagation()

      // GSAP pin spacer를 정리한 후 full page navigation으로 이동
      // client-side navigation(router.push)은 GSAP DOM 수정과 React fiber tree 간
      // 불일치로 removeChild 에러를 발생시키므로 전체 페이지 로드 사용
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }

      window.location.href = href
    },
    []
  )

  // GSAP 초기화: useEffect (브라우저 페인트 후 실행 → 레이아웃 측정이 정확함)
  useEffect(() => {
    if (prefersReducedMotion()) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 })
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll('[role="listitem"]'), {
          opacity: 1,
          y: 0,
          yPercent: 0,
        })
      }
      return
    }

    const ctx = gsap.context(() => {
      // 헤딩 페이드업 (공통)
      if (headingRef.current) {
        gsap.set(headingRef.current, { opacity: 0, y: 30 })
        gsap.to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      }

      ScrollTrigger.matchMedia({
        // ── 데스크톱: 기존 stagger 페이드업 ──
        '(min-width: 768px)': function () {
          if (!gridRef.current) return
          const cards = Array.from(
            gridRef.current.querySelectorAll<HTMLElement>('[role="listitem"]')
          )
          if (cards.length > 0) {
            staggerFadeUp(cards, { stagger: 0.15, duration: 0.7 })
          }
        },

        // ── 모바일: 카드 스택 + 핀 ──
        '(max-width: 767px)': function () {
          if (!gridRef.current || !sectionRef.current) return

          const cards = Array.from(
            gridRef.current.querySelectorAll<HTMLElement>('[role="listitem"]')
          )
          if (cards.length < 2) return

          // 첫 번째 카드는 보이고, 나머지는 아래에 대기
          gsap.set(cards, { opacity: 1 })
          cards.slice(1).forEach((card) => {
            gsap.set(card, { yPercent: 100 })
          })

          // 타임라인: 각 카드가 순차적으로 올라옴
          // 카드당 스크롤 거리를 0.75vh로 설정하고 scrub: 1로 부드럽게
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => `+=${(cards.length - 1) * window.innerHeight * 0.75}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          })

          cards.slice(1).forEach((card, i) => {
            tl.to(card, {
              yPercent: 0,
              duration: 1,
              ease: 'power2.out',
            })
            // 마지막 카드를 제외하고 카드 간 짧은 pause
            if (i < cards.length - 2) {
              tl.to({}, { duration: 0.3 })
            }
          })
        },
      })
    })

    ctxRef.current = ctx
  }, [])

  // GSAP cleanup: useLayoutEffect (React DOM 제거 전에 pin spacer 정리)
  useIsomorphicLayoutEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="mission-card-grid"
      data-testid="mission-card-grid"
      className="py-20 md:py-32"
      aria-labelledby="mission-grid-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* 섹션 제목 */}
        <h2
          ref={headingRef}
          id="mission-grid-heading"
          data-testid="mission-grid-heading"
          className="mb-12 text-center font-serif text-3xl font-bold text-wwf-dark-gray md:mb-16 md:text-4xl"
        >
          당신의 마음이 닿을 수 있는 곳
        </h2>

        {/* 미션 카드: 모바일=스택, 데스크톱=그리드 */}
        <div
          ref={gridRef}
          className="relative aspect-3/4 max-h-[75vh] overflow-hidden rounded-2xl md:aspect-auto md:max-h-none md:overflow-visible md:rounded-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          role="list"
          aria-label="WWF 보전 미션 목록"
        >
          {missions.map((mission, index) => (
            <div
              key={mission.slug}
              role="listitem"
              className="absolute inset-0 md:relative md:inset-auto"
              style={{ zIndex: index + 1 }}
              onClickCapture={(e) =>
                handleMobileCardClick(e, `/missions/${mission.slug}`)
              }
            >
              <MissionCard mission={mission} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
