'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { formatAmountLabel } from '@/lib/utils/formatCurrency'
import type { DonationType } from '@/lib/types/donation'

const PRESET_AMOUNTS = [10000, 30000, 50000, 100000] as const

interface AmountSelectorProps {
  amount: number
  donationType: DonationType
  onChange: (amount: number) => void
  error?: string
}

export default function AmountSelector({
  amount,
  donationType,
  onChange,
  error,
}: AmountSelectorProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const maxAmount = donationType === 'onetime' ? 100_000_000 : 10_000_000

  const handlePresetClick = useCallback(
    (preset: number) => {
      setIsCustom(false)
      setCustomValue('')
      onChange(preset)
    },
    [onChange]
  )

  const handleCustomFocus = useCallback(() => {
    setIsCustom(true)
    if (amount > 0 && !PRESET_AMOUNTS.includes(amount as (typeof PRESET_AMOUNTS)[number])) {
      setCustomValue(amount.toLocaleString('ko-KR'))
    }
  }, [amount])

  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // 숫자만 필터
      const raw = e.target.value.replace(/[^\d]/g, '')
      if (raw === '') {
        setCustomValue('')
        onChange(0)
        return
      }

      const num = parseInt(raw, 10)
      if (isNaN(num)) return

      // 최대값 제한
      const clamped = Math.min(num, maxAmount)
      setCustomValue(clamped.toLocaleString('ko-KR'))
      onChange(clamped)
    },
    [onChange, maxAmount]
  )

  const isPresetSelected = (preset: number) => !isCustom && amount === preset

  return (
    <div data-testid="amount-selector" className="space-y-3">
      {/* 프리셋 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            data-testid={`amount-preset-${preset}`}
            onClick={() => handlePresetClick(preset)}
            className={`rounded-lg py-3 text-sm font-medium transition-all border ${
              isPresetSelected(preset)
                ? 'bg-wwf-orange text-white border-wwf-orange'
                : 'bg-white text-wwf-dark-gray border-gray-200 hover:border-wwf-orange hover:text-wwf-orange'
            }`}
          >
            {formatAmountLabel(preset)}
          </button>
        ))}
      </div>

      {/* 직접 입력 */}
      <div className="relative">
        <Input
          data-testid="amount-custom-input"
          type="text"
          inputMode="numeric"
          placeholder="직접 입력"
          aria-label="후원 금액 직접 입력"
          aria-describedby={error ? 'amount-error' : undefined}
          value={isCustom ? customValue : ''}
          onFocus={handleCustomFocus}
          onChange={handleCustomChange}
          className={`pr-8 ${
            isCustom && amount > 0
              ? 'border-wwf-orange ring-1 ring-wwf-orange/30'
              : ''
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-wwf-light-gray pointer-events-none">
          원
        </span>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p id="amount-error" data-testid="amount-error" className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
