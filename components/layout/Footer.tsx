import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

const footerLinks = {
  donation: {
    title: '후원 안내',
    links: [
      { label: '정기 후원', href: '/#donate' },
      { label: '일시 후원', href: '/#donate' },
      { label: '기업 후원', href: '/corporate' },
      { label: '유산 기부', href: '/legacy' },
      { label: '후원금 사용 내역', href: '/transparency' },
    ],
  },
  about: {
    title: 'WWF 소개',
    links: [
      { label: 'WWF-Korea 소개', href: '/about' },
      { label: '주요 활동', href: '/campaigns' },
      { label: '뉴스레터', href: '/newsletter' },
      { label: '채용 정보', href: '/careers' },
      { label: '언론 보도', href: '/press' },
    ],
  },
}

const contact = {
  address: '서울특별시 마포구 독막로 320, 태영데시앙 305호',
  phone: '02-708-3400',
  email: 'wwfkorea@wwfkor.or.kr',
}

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="bg-wwf-black text-white"
      role="contentinfo"
      aria-label="WWF Korea 푸터"
    >
      {/* 상단 영역 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="mb-10 md:mb-14">
          {/* 로고 */}
          <div data-testid="footer-logo" className="mb-4">
            <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
              WWF
            </span>
            <span className="block text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-white/60 mt-0.5">
              KOREA
            </span>
          </div>
          {/* 슬로건 */}
          <p
            data-testid="footer-slogan"
            className="text-white/70 font-sans text-sm md:text-base leading-relaxed max-w-sm"
          >
            사람과 자연이 조화로운 미래를 만들어갑니다
          </p>
        </div>

        {/* 중앙 영역: 3열 그리드 */}
        <div
          data-testid="footer-links"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-8"
        >
          {/* 후원 안내 */}
          <div data-testid="footer-section-donation">
            <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-wwf-orange mb-4">
              {footerLinks.donation.title}
            </h3>
            <ul className="space-y-2.5" aria-label="후원 안내 링크 목록">
              {footerLinks.donation.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* WWF 소개 */}
          <div data-testid="footer-section-about">
            <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-wwf-orange mb-4">
              {footerLinks.about.title}
            </h3>
            <ul className="space-y-2.5" aria-label="WWF 소개 링크 목록">
              {footerLinks.about.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div data-testid="footer-section-contact">
            <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-wwf-orange mb-4">
              연락처
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-wwf-orange mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="font-sans text-sm text-white/60 leading-relaxed">
                  {contact.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 text-wwf-orange shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${contact.phone.replace(/-/g, '')}`}
                  data-testid="footer-phone"
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-150"
                  aria-label={`전화번호 ${contact.phone}`}
                >
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail
                  className="w-4 h-4 text-wwf-orange shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${contact.email}`}
                  data-testid="footer-email"
                  className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-150 break-all"
                  aria-label={`이메일 ${contact.email}`}
                >
                  {contact.email}
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-white/10" />

      {/* 하단 영역 */}
      <div
        data-testid="footer-bottom"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/40 order-2 sm:order-1">
            &copy; 2026 WWF-Korea. All rights reserved.
          </p>
          <nav
            className="flex items-center gap-4 order-1 sm:order-2"
            aria-label="법적 정보 링크"
          >
            <Link
              href="/privacy"
              data-testid="footer-privacy-link"
              className="font-sans text-xs text-white/40 hover:text-white/70 transition-colors duration-150 underline-offset-4 hover:underline"
            >
              개인정보처리방침
            </Link>
            <span className="text-white/20" aria-hidden="true">|</span>
            <Link
              href="/terms"
              data-testid="footer-terms-link"
              className="font-sans text-xs text-white/40 hover:text-white/70 transition-colors duration-150 underline-offset-4 hover:underline"
            >
              이용약관
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
