'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Menu, X, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDonationStore } from '@/lib/store/donationStore'

const NAV_MISSIONS = [
  { slug: 'climate-energy', name: '기후·에너지' },
  { slug: 'ocean', name: '해양' },
  { slug: 'wildlife', name: '야생동물' },
  { slug: 'forest', name: '산림' },
  { slug: 'freshwater', name: '담수' },
  { slug: 'food', name: '식량' },
]

interface NavigationProps {
  showBack?: boolean
  backHref?: string
  transparent?: boolean
}

export default function Navigation({
  showBack = false,
  backHref = '/',
  transparent = false,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const openModal = useDonationStore((s) => s.openModal)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isScrolledOrOpaque = scrolled || !transparent

  return (
    <header
      data-testid="navigation"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolledOrOpaque
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="메인 네비게이션"
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* 왼쪽: 뒤로가기 버튼 또는 로고 */}
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                href={backHref}
                data-testid="nav-back-button"
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  isScrolledOrOpaque
                    ? 'text-wwf-dark-gray hover:text-wwf-orange'
                    : 'text-white hover:text-wwf-orange'
                )}
                aria-label="이전 페이지로 돌아가기"
              >
                <ArrowLeft className={cn('w-4 h-4', !isScrolledOrOpaque && 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]')} aria-hidden="true" />
                <span className="hidden sm:inline">뒤로가기</span>
              </Link>
            )}

            {/* WWF 로고 */}
            <Link
              href="/"
              data-testid="nav-logo"
              className={cn(
                'flex items-center gap-2 group transition-all duration-300',
                !isScrolledOrOpaque && 'opacity-0 pointer-events-none'
              )}
              aria-label="WWF Korea 홈으로 이동"
            >
              <Image
                src="/images/wwf-logo.svg"
                alt="WWF"
                width={34}
                height={50}
                className="h-10 md:h-12 w-auto transition-all duration-300"
                priority
              />
              <span
                className={cn(
                  'text-[10px] md:text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors',
                  'text-wwf-dark-gray group-hover:text-wwf-orange'
                )}
              >
                KOREA
              </span>
            </Link>
          </div>

          {/* 가운데: 데스크탑 네비게이션 링크 (펼침) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === '/'
                  ? 'text-wwf-orange'
                  : isScrolledOrOpaque
                    ? 'text-wwf-dark-gray hover:text-wwf-orange hover:bg-wwf-warm-gray'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              홈
            </Link>

            <span className={cn(
              'w-px h-4 mx-1',
              isScrolledOrOpaque ? 'bg-gray-200' : 'bg-white/20'
            )} />

            {NAV_MISSIONS.map((mission) => (
              <Link
                key={mission.slug}
                href={`/missions/${mission.slug}`}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                  pathname === `/missions/${mission.slug}`
                    ? 'text-wwf-orange'
                    : isScrolledOrOpaque
                      ? 'text-wwf-dark-gray hover:text-wwf-orange hover:bg-wwf-warm-gray'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {mission.name}
              </Link>
            ))}
          </div>

          {/* 오른쪽: 내역 조회 링크 + 데스크탑 기부 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/history"
              data-testid="nav-history-link"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                pathname === '/history'
                  ? 'text-wwf-orange'
                  : isScrolledOrOpaque
                    ? 'text-wwf-dark-gray hover:text-wwf-orange hover:bg-wwf-warm-gray'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
              aria-label="기부 내역 조회 페이지로 이동"
            >
              내역 조회
            </Link>
            <button
              data-testid="nav-donate-button"
              onClick={() => openModal()}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold',
                'transition-all duration-200',
                'bg-wwf-orange text-white',
                'hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2',
                'active:scale-95'
              )}
              aria-label="기부하기 모달 열기"
            >
              <Heart className={cn('w-4 h-4', !isScrolledOrOpaque && 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]')} aria-hidden="true" />
              기부하기
            </button>
          </div>

          {/* 오른쪽: 모바일 햄버거 메뉴 */}
          <button
            data-testid="nav-mobile-menu-button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={cn(
              'md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors',
              isScrolledOrOpaque
                ? 'text-wwf-black hover:bg-wwf-warm-gray'
                : 'text-white hover:bg-white/20'
            )}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className={cn('w-5 h-5', !isScrolledOrOpaque && 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]')} aria-hidden="true" />
            ) : (
              <Menu className={cn('w-5 h-5', !isScrolledOrOpaque && 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]')} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 패널 */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            data-testid="nav-mobile-menu"
            className="md:hidden border-t border-wwf-warm-gray bg-white pb-4"
            role="dialog"
            aria-modal="false"
            aria-label="모바일 네비게이션 메뉴"
          >
            <div className="pt-2 px-2 space-y-1">
              <Link
                href="/"
                className={cn(
                  'block px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  pathname === '/'
                    ? 'text-wwf-orange bg-orange-50'
                    : 'text-wwf-dark-gray hover:bg-wwf-warm-gray'
                )}
              >
                홈
              </Link>

              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-wwf-light-gray uppercase tracking-wider">
                  우리의 활동
                </span>
              </div>
              {NAV_MISSIONS.map((mission) => (
                <Link
                  key={mission.slug}
                  href={`/missions/${mission.slug}`}
                  className={cn(
                    'block px-4 py-2.5 pl-6 text-sm rounded-lg transition-colors',
                    pathname === `/missions/${mission.slug}`
                      ? 'text-wwf-orange bg-orange-50 font-medium'
                      : 'text-wwf-dark-gray hover:bg-wwf-warm-gray'
                  )}
                >
                  {mission.name}
                </Link>
              ))}

              <Link
                href="/history"
                data-testid="nav-mobile-history-link"
                className={cn(
                  'block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  pathname === '/history'
                    ? 'text-wwf-orange bg-orange-50'
                    : 'text-wwf-dark-gray hover:bg-wwf-warm-gray'
                )}
              >
                내역 조회
              </Link>

              <div className="pt-3 px-2">
                <button
                  data-testid="nav-mobile-donate-button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openModal('ocean')
                  }}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold',
                    'bg-wwf-orange text-white',
                    'hover:bg-orange-600 active:scale-95 transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2'
                  )}
                  aria-label="기부하기 모달 열기"
                >
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  기부하기
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
