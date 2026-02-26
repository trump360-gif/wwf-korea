'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useDonationStore, selectDonation, selectEntryMission } from '@/lib/store/donationStore'
import { getMissionBySlug } from '@/lib/data/missions'
import DonationTypeToggle from './DonationTypeToggle'
import AmountSelector from './AmountSelector'

const MIN_AMOUNT = 1000
const MAX_ONETIME = 100_000_000
const MAX_MONTHLY = 10_000_000

export default function StepConfirm() {
  const donation = useDonationStore(selectDonation)
  const entryMission = useDonationStore(selectEntryMission)
  const setAmount = useDonationStore((s) => s.setAmount)
  const setDonationType = useDonationStore((s) => s.setDonationType)
  const nextStep = useDonationStore((s) => s.nextStep)

  const [amountError, setAmountError] = useState<string | undefined>(undefined)
  const [submitted, setSubmitted] = useState(false)

  const mission = entryMission ? getMissionBySlug(entryMission) : null
  const maxAmount = donation.type === 'onetime' ? MAX_ONETIME : MAX_MONTHLY

  const validateAmount = useCallback(
    (value: number): string | undefined => {
      if (value === 0) return '후원 금액을 선택해주세요'
      if (value < MIN_AMOUNT) return `최소 ${MIN_AMOUNT.toLocaleString()}원 이상 입력해주세요`
      if (value > maxAmount)
        return `최대 ${maxAmount.toLocaleString()}원까지 가능합니다`
      return undefined
    },
    [maxAmount]
  )

  const handleAmountChange = useCallback(
    (value: number) => {
      setAmount(value)
      if (submitted) {
        setAmountError(validateAmount(value))
      }
    },
    [setAmount, submitted, validateAmount]
  )

  const handleNext = useCallback(() => {
    setSubmitted(true)
    const error = validateAmount(donation.amount)
    if (error) {
      setAmountError(error)
      return
    }
    setAmountError(undefined)
    nextStep()
  }, [donation.amount, validateAmount, nextStep])

  const isValid = donation.amount >= MIN_AMOUNT && donation.amount <= maxAmount

  return (
    <div data-testid="step-confirm" className="space-y-6">
      {/* 상단 타이틀 */}
      <h2 className="font-serif text-lg md:text-xl text-wwf-black leading-snug">
        {mission
          ? `${mission.fullName}을 위한 후원을 시작합니다`
          : '후원을 시작합니다'}
      </h2>

      {/* 후원 유형 토글 */}
      <DonationTypeToggle value={donation.type} onChange={setDonationType} />

      {/* 금액 선택 */}
      <AmountSelector
        amount={donation.amount}
        donationType={donation.type}
        onChange={handleAmountChange}
        error={amountError}
      />

      {/* 다음 버튼 */}
      <Button
        data-testid="step-confirm-next"
        onClick={handleNext}
        disabled={!isValid}
        className="w-full rounded-full bg-wwf-orange text-white hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 h-12 text-base font-medium"
      >
        다음
      </Button>
    </div>
  )
}
