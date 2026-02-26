'use client'

import dynamic from 'next/dynamic'

const DonateModal = dynamic(() => import('./DonateModal'), { ssr: false })

export default function DonateModalLoader() {
  return <DonateModal />
}
