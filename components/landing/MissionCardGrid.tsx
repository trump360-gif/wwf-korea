'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { missions } from '@/lib/data/missions'
import { staggerFadeUp, prefersReducedMotion } from '@/lib/animations/scrollAnimations'
import MissionCard from './MissionCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function MissionCardGrid() {
  const gridRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 })
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll('[role="listitem"]'), {
          opacity: 1,
          y: 0,
        })
      }
      return
    }

    const rafId = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
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

        if (!gridRef.current) return
        const cards = Array.from(
          gridRef.current.querySelectorAll<HTMLElement>('[role="listitem"]')
        )
        if (cards.length > 0) {
          staggerFadeUp(cards, { stagger: 0.15, duration: 0.7 })
        }
      })

      return () => ctx.revert()
    })

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <section
      id="mission-card-grid"
      data-testid="mission-card-grid"
      className="py-20 md:py-32"
      aria-labelledby="mission-grid-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2
          ref={headingRef}
          id="mission-grid-heading"
          data-testid="mission-grid-heading"
          className="mb-12 text-center font-serif text-3xl font-bold text-wwf-dark-gray md:mb-16 md:text-4xl"
        >
          당신의 마음이 닿을 수 있는 곳
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
          role="list"
          aria-label="WWF 보전 미션 목록"
        >
          {missions.map((mission) => (
            <div key={mission.slug} role="listitem">
              <MissionCard mission={mission} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
