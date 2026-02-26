'use client'

import { useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  useDonationStore,
  selectDonation,
  selectDonor,
  selectSelectedMissions,
  selectDistribution,
} from '@/lib/store/donationStore'
import { missions } from '@/lib/data/missions'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
} from '@/lib/utils/validation'
import {
  saveDonationRecord,
  generateCertificateNumber,
} from '@/lib/utils/donationHistory'
import type { DonationRecord } from '@/lib/utils/donationHistory'

type PaymentMethod = 'credit-card' | 'bank-transfer' | 'easy-pay'

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
}

export default function StepPayment() {
  const donation = useDonationStore(selectDonation)
  const donor = useDonationStore(selectDonor)
  const selectedMissions = useDonationStore(selectSelectedMissions)
  const distribution = useDonationStore(selectDistribution)
  const setDonorInfo = useDonationStore((s) => s.setDonorInfo)
  const completeDonation = useDonationStore((s) => s.completeDonation)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // 미션별 이름/퍼센트 목록
  const missionDistributions = useMemo(() => {
    return selectedMissions.map((slug) => {
      const m = missions.find((mission) => mission.slug === slug)
      return {
        slug,
        name: m?.name ?? slug,
        percent: distribution[slug] ?? 0,
      }
    })
  }, [selectedMissions, distribution])

  // 필드 블러 시 검증
  const handleBlur = useCallback(
    (field: keyof FieldErrors) => {
      setTouched((prev) => ({ ...prev, [field]: true }))

      let result
      switch (field) {
        case 'name':
          result = validateName(donor.name)
          break
        case 'email':
          result = validateEmail(donor.email)
          break
        case 'phone':
          result = validatePhone(donor.phone)
          break
      }

      setFieldErrors((prev) => ({
        ...prev,
        [field]: result?.valid ? undefined : result?.message,
      }))
    },
    [donor]
  )

  // 이름 변경
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDonorInfo('name', e.target.value)
      if (touched.name) {
        const result = validateName(e.target.value)
        setFieldErrors((prev) => ({
          ...prev,
          name: result.valid ? undefined : result.message,
        }))
      }
    },
    [setDonorInfo, touched.name]
  )

  // 이메일 변경
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDonorInfo('email', e.target.value)
      if (touched.email) {
        const result = validateEmail(e.target.value)
        setFieldErrors((prev) => ({
          ...prev,
          email: result.valid ? undefined : result.message,
        }))
      }
    },
    [setDonorInfo, touched.email]
  )

  // 연락처 변경 (자동 하이픈)
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value)
      setDonorInfo('phone', formatted)
      if (touched.phone) {
        const result = validatePhone(formatted)
        setFieldErrors((prev) => ({
          ...prev,
          phone: result.valid ? undefined : result.message,
        }))
      }
    },
    [setDonorInfo, touched.phone]
  )

  // 전체 폼 유효성 검사
  const isFormValid = useMemo(() => {
    const nameValid = validateName(donor.name).valid
    const emailValid = validateEmail(donor.email).valid
    const phoneValid = validatePhone(donor.phone).valid
    return nameValid && emailValid && phoneValid && paymentMethod !== ''
  }, [donor, paymentMethod])

  // 후원하기 클릭
  const handleSubmit = useCallback(() => {
    // 최종 검증
    const nameResult = validateName(donor.name)
    const emailResult = validateEmail(donor.email)
    const phoneResult = validatePhone(donor.phone)

    setTouched({ name: true, email: true, phone: true })
    setFieldErrors({
      name: nameResult.valid ? undefined : nameResult.message,
      email: emailResult.valid ? undefined : emailResult.message,
      phone: phoneResult.valid ? undefined : phoneResult.message,
    })

    if (!nameResult.valid || !emailResult.valid || !phoneResult.valid || paymentMethod === '') {
      return
    }

    completeDonation()

    // localStorage에 기부 내역 저장
    const record: DonationRecord = {
      id: Date.now().toString(),
      donorName: donor.name,
      email: donor.email,
      phone: donor.phone,
      amount: donation.amount,
      donationType: donation.type,
      selectedMissions: [...selectedMissions],
      distribution: { ...distribution },
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      certificateNumber: generateCertificateNumber(),
    }
    saveDonationRecord(record)

    // full page navigation으로 React DOM 충돌 회피
    // closeModal + client-side navigation 조합에서 removeChild 에러 발생하므로
    // 모달 상태 초기화 없이 페이지를 완전히 새로 로드
    window.location.href = '/donate/complete'
  }, [donor, paymentMethod, completeDonation])

  return (
    <div data-testid="step-payment" className="space-y-6">
      {/* 기부 요약 카드 */}
      <div
        data-testid="donation-summary"
        className="bg-wwf-warm-gray rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-wwf-light-gray">
            {donation.type === 'monthly' ? '월정기 후원' : '일시 후원'}
          </span>
          <span className="text-lg font-semibold text-wwf-black">
            {formatCurrency(donation.amount)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-1.5">
          {missionDistributions.map(({ slug, name, percent }) => (
            <div key={slug} className="flex items-center justify-between text-sm">
              <span className="text-wwf-dark-gray">{name}</span>
              <span className="text-wwf-orange font-medium">{percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 기부자 정보 폼 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-wwf-dark-gray">후원자 정보</h3>

        {/* 이름 */}
        <div>
          <label htmlFor="donor-name" className="sr-only">이름</label>
          <Input
            id="donor-name"
            data-testid="donor-name"
            type="text"
            placeholder="이름"
            value={donor.name}
            onChange={handleNameChange}
            onBlur={() => handleBlur('name')}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'error-name' : undefined}
            className={fieldErrors.name ? 'border-red-500' : ''}
          />
          {fieldErrors.name && (
            <p id="error-name" data-testid="error-name" className="text-red-500 text-sm mt-1" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label htmlFor="donor-email" className="sr-only">이메일</label>
          <Input
            id="donor-email"
            data-testid="donor-email"
            type="email"
            placeholder="이메일"
            value={donor.email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'error-email' : undefined}
            className={fieldErrors.email ? 'border-red-500' : ''}
          />
          {fieldErrors.email && (
            <p id="error-email" data-testid="error-email" className="text-red-500 text-sm mt-1" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* 연락처 */}
        <div>
          <label htmlFor="donor-phone" className="sr-only">연락처</label>
          <Input
            id="donor-phone"
            data-testid="donor-phone"
            type="tel"
            placeholder="연락처"
            value={donor.phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur('phone')}
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? 'error-phone' : undefined}
            className={fieldErrors.phone ? 'border-red-500' : ''}
          />
          {fieldErrors.phone && (
            <p id="error-phone" data-testid="error-phone" className="text-red-500 text-sm mt-1" role="alert">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      {/* 결제 수단 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-wwf-dark-gray">결제 수단</h3>

        <RadioGroup
          data-testid="payment-method"
          value={paymentMethod}
          onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
        >
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'credit-card'
                ? 'border-wwf-orange bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <RadioGroupItem value="credit-card" />
            <span className="text-sm text-wwf-dark-gray">신용카드</span>
          </label>

          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'bank-transfer'
                ? 'border-wwf-orange bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <RadioGroupItem value="bank-transfer" />
            <span className="text-sm text-wwf-dark-gray">계좌이체</span>
          </label>

          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'easy-pay'
                ? 'border-wwf-orange bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <RadioGroupItem value="easy-pay" />
            <span className="text-sm text-wwf-dark-gray">간편결제</span>
          </label>
        </RadioGroup>
      </div>

      {/* 후원하기 버튼 */}
      <Button
        data-testid="step-payment-submit"
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="w-full rounded-full bg-wwf-orange text-white hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 h-12 text-base font-medium"
      >
        후원하기
      </Button>
    </div>
  )
}
