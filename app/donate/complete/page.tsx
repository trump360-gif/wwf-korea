'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useDonationStore } from '@/lib/store/donationStore'
import { getMissionBySlug } from '@/lib/data/missions'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { MissionSlug } from '@/lib/types/mission'
import ThankYouMessage from '@/components/thankyou/ThankYouMessage'
import DonationSummary from '@/components/thankyou/DonationSummary'
import CertificateDownload from '@/components/thankyou/CertificateDownload'

function formatDate(d: Date): string {
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}년 ${month}월 ${day}일`
}

function slugToName(slug: MissionSlug): string {
  const mission = getMissionBySlug(slug)
  return mission?.name ?? slug
}

export default function DonateCompletePage() {
  const router = useRouter()
  const restoreFromSession = useDonationStore((s) => s.restoreFromSession)
  const donation = useDonationStore((s) => s.donation)
  const donor = useDonationStore((s) => s.donor)

  const [isReady, setIsReady] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    restoreFromSession()
    setIsReady(true)
  }, [restoreFromSession])

  // 상태가 없으면 (직접 URL 접근 등) 메인으로 리다이렉트
  useEffect(() => {
    if (isReady && (!donor.name || donation.amount === 0 || donation.selectedMissions.length === 0)) {
      setShouldRedirect(true)
      router.replace('/')
    }
  }, [isReady, donor.name, donation.amount, donation.selectedMissions.length, router])

  if (!isReady || shouldRedirect) {
    return null
  }

  const missionNames = donation.selectedMissions.map(slugToName)
  const dateStr = formatDate(new Date())

  const summaryMissions = donation.selectedMissions.map((slug) => ({
    name: slugToName(slug),
    percentage: donation.distribution[slug] ?? 0,
  }))

  return (
    <section className="min-h-dvh bg-wwf-warm-gray pt-28 md:pt-36 pb-20 px-4">
      <div className="mx-auto max-w-lg space-y-10">
        {/* 감사 메시지 */}
        <ThankYouMessage missionNames={missionNames} />

        {/* 후원 요약 */}
        <DonationSummary
          donorName={donor.name}
          amount={donation.amount}
          donationType={donation.type}
          missions={summaryMissions}
          date={dateStr}
        />

        {/* PDF 다운로드 */}
        <div className="text-center">
          <CertificateDownload
            donorName={donor.name}
            amount={donation.amount}
            donationType={donation.type === 'monthly' ? 'monthly' : 'onetime'}
            missions={donation.selectedMissions}
            date={dateStr}
          />
        </div>

        {/* 메인으로 돌아가기 */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wwf-dark-gray hover:text-wwf-orange transition-colors"
          >
            메인으로 돌아가기
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
