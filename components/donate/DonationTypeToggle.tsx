'use client'

import type { DonationType } from '@/lib/types/donation'

interface DonationTypeToggleProps {
  value: DonationType
  onChange: (type: DonationType) => void
}

export default function DonationTypeToggle({ value, onChange }: DonationTypeToggleProps) {
  return (
    <div
      data-testid="donation-type-toggle"
      role="radiogroup"
      aria-label="후원 유형 선택"
      className="flex w-full rounded-full bg-wwf-warm-gray p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'monthly'}
        data-testid="donation-type-monthly"
        onClick={() => onChange('monthly')}
        className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
          value === 'monthly'
            ? 'bg-wwf-orange text-white shadow-sm'
            : 'text-wwf-dark-gray hover:text-wwf-black'
        }`}
      >
        월정기 후원
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'onetime'}
        data-testid="donation-type-onetime"
        onClick={() => onChange('onetime')}
        className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
          value === 'onetime'
            ? 'bg-wwf-orange text-white shadow-sm'
            : 'text-wwf-dark-gray hover:text-wwf-black'
        }`}
      >
        일시 후원
      </button>
    </div>
  )
}
