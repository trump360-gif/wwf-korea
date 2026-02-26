import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP 플러그인 등록 (클라이언트에서만)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ────────────────────────────────────────────────────────────────────────────
// prefers-reduced-motion 체크
// ────────────────────────────────────────────────────────────────────────────

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ────────────────────────────────────────────────────────────────────────────
// 텍스트 페이드업 애니메이션
// 뷰포트 진입 시 y: 40 → 0, opacity: 0 → 1
// ────────────────────────────────────────────────────────────────────────────

export function fadeUpAnimation(
  element: HTMLElement,
  options?: { delay?: number; duration?: number }
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0 })
    return
  }

  const { delay = 0, duration = 0.8 } = options ?? {}

  gsap.set(element, { opacity: 0, y: 40 })

  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      once: true,
    },
  })
}

// ────────────────────────────────────────────────────────────────────────────
// Staggered 페이드업 (카드 그리드 등)
// 각 요소 0.15s 딜레이로 순차 등장
// ────────────────────────────────────────────────────────────────────────────

export function staggerFadeUp(
  elements: HTMLElement[],
  options?: { stagger?: number; duration?: number }
) {
  if (elements.length === 0) return

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 })
    return
  }

  const { stagger = 0.15, duration = 0.7 } = options ?? {}

  gsap.set(elements, { opacity: 0, y: 40 })

  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 85%',
      once: true,
    },
  })
}

// ────────────────────────────────────────────────────────────────────────────
// 카운트업 애니메이션 (통계 숫자)
// 0에서 targetValue까지 카운트업, innerText 업데이트
// ────────────────────────────────────────────────────────────────────────────

export function countUpAnimation(
  element: HTMLElement,
  targetValue: number,
  options?: { duration?: number; suffix?: string }
) {
  if (prefersReducedMotion()) {
    element.textContent = formatCountValue(targetValue, options?.suffix)
    return
  }

  const { duration = 2, suffix = '' } = options ?? {}
  const counter = { value: 0 }

  gsap.fromTo(
    counter,
    { value: 0 },
    {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate() {
        element.textContent = formatCountValue(
          Math.floor(counter.value),
          suffix
        )
      },
      onComplete() {
        element.textContent = formatCountValue(targetValue, suffix)
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

function formatCountValue(value: number, suffix?: string): string {
  const formatted = value.toLocaleString('ko-KR')
  return suffix ? `${formatted}${suffix}` : formatted
}

// ────────────────────────────────────────────────────────────────────────────
// 이미지 패럴랙스
// y축 패럴랙스, speed 기본 0.5
// ────────────────────────────────────────────────────────────────────────────

export function parallaxAnimation(
  element: HTMLElement,
  options?: { speed?: number }
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { y: 0 })
    return
  }

  const { speed = 0.5 } = options ?? {}
  const yOffset = 80 * speed

  gsap.fromTo(
    element,
    { y: -yOffset },
    {
      y: yOffset,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 이미지 스케일 트랜지션
// scale 1.1 → 1.0
// ────────────────────────────────────────────────────────────────────────────

export function scaleAnimation(element: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(element, { scale: 1 })
    return
  }

  gsap.fromTo(
    element,
    { scale: 1.1 },
    {
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        once: true,
      },
    }
  )
}
