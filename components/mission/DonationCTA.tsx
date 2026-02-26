'use client'

import type { Mission } from '@/lib/types/mission'
import { useDonationStore } from '@/lib/store/donationStore'
import { Heart } from 'lucide-react'

interface DonationCTAProps {
  mission: Mission
}

export default function DonationCTA({ mission }: DonationCTAProps) {
  const openModal = useDonationStore((state) => state.openModal)

  const handleDonate = () => {
    openModal(mission.slug)
  }

  return (
    <section
      data-testid="donation-cta"
      className="py-20 md:py-32 bg-white"
      aria-label="기부 참여 안내"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* CTA 메시지 */}
        <p
          data-testid="donation-cta-message"
          className="font-serif text-2xl md:text-3xl text-wwf-black mb-3 leading-relaxed"
        >
          {mission.ctaMessage}
        </p>

        {/* 임팩트 메시지 */}
        <p
          data-testid="donation-impact-message"
          className="font-sans text-base text-wwf-dark-gray mb-10"
        >
          {mission.impactMessage}
        </p>

        {/* 기부하기 버튼 */}
        <button
          data-testid="donation-cta-button"
          onClick={handleDonate}
          className="inline-flex items-center gap-2.5 bg-wwf-orange text-white px-10 py-4 text-lg font-sans font-semibold rounded-full transition-all duration-200 hover:bg-orange-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2 active:scale-95"
          aria-label={`${mission.fullName} 기부하기`}
        >
          <Heart className="w-5 h-5" aria-hidden="true" />
          기부하기
        </button>
      </div>
    </section>
  )
}
