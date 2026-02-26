'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useDonationStore, selectModal, selectCurrentStep, selectEntryMission } from '@/lib/store/donationStore'
import type { ModalStep } from '@/lib/types/donation'
import StepMissionSelect from './StepMissionSelect'
import StepConfirm from './StepConfirm'
import StepAdditional from './StepAdditional'
import StepCategorySelect from './StepCategorySelect'
import StepDistribution from './StepDistribution'
import StepPayment from './StepPayment'

// ────────────────────────────────────────────────────────────────────────────
// 스텝 렌더러
// ────────────────────────────────────────────────────────────────────────────

function StepRenderer({ step }: { step: ModalStep }) {
  switch (step) {
    case 0:
      return <StepMissionSelect />
    case 1:
      return <StepConfirm />
    case 2:
      return <StepAdditional />
    case '2-1':
      return <StepCategorySelect />
    case '2-2':
      return <StepDistribution />
    case 3:
      return <StepPayment />
    default:
      return null
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 프로그레스 값 계산
// ────────────────────────────────────────────────────────────────────────────

function getProgressValue(step: ModalStep): number {
  if (step === 0) return 0
  if (step === 1) return 25
  if (step === 2 || step === '2-1') return 50
  if (step === '2-2') return 75
  return 100
}

// ────────────────────────────────────────────────────────────────────────────
// 닫기 확인 다이얼로그 (인라인)
// ────────────────────────────────────────────────────────────────────────────

interface ConfirmCloseDialogProps {
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmCloseDialog({ onConfirm, onCancel }: ConfirmCloseDialogProps) {
  return (
    <div
      data-testid="donate-confirm-close-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-close-title"
      aria-describedby="confirm-close-desc"
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 rounded-lg md:rounded-lg"
    >
      <div className="bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full">
        <h2
          id="confirm-close-title"
          className="text-base font-semibold text-wwf-dark-gray mb-2"
        >
          후원 정보 삭제
        </h2>
        <p
          id="confirm-close-desc"
          className="text-sm text-wwf-light-gray mb-6"
        >
          작성 중인 후원 정보가 사라집니다. 닫으시겠어요?
        </p>
        <div className="flex gap-3">
          <button
            data-testid="donate-confirm-close-cancel"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-wwf-light-gray text-sm font-medium text-wwf-dark-gray hover:bg-wwf-warm-gray transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2"
          >
            계속 작성
          </button>
          <button
            data-testid="donate-confirm-close-confirm"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-wwf-orange text-white text-sm font-medium hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange focus-visible:ring-offset-2"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 모달 헤더 (프로그레스 + 닫기/뒤로가기)
// ────────────────────────────────────────────────────────────────────────────

interface ModalHeaderProps {
  step: ModalStep
  isMobile: boolean
  canGoBack: boolean
  onBack: () => void
  onClose: () => void
}

function ModalHeader({ step, isMobile, canGoBack, onBack, onClose }: ModalHeaderProps) {
  const progressValue = getProgressValue(step)

  return (
    <div data-testid="donate-modal-header" className="flex flex-col gap-3 px-5 pt-5 pb-0">
      {/* 모바일: 드래그 핸들 */}
      {isMobile && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200"
          aria-hidden="true"
        />
      )}

      <div className="flex items-center justify-between">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="w-16">
          {canGoBack && (
            <button
              data-testid="donate-modal-back-button"
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-medium text-wwf-dark-gray hover:text-wwf-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange rounded"
              aria-label="이전 단계로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>이전</span>
            </button>
          )}
        </div>

        {/* 가운데: 스텝 인디케이터 */}
        <div
          data-testid="donate-step-indicator"
          className="flex items-center gap-1.5"
          aria-label={`스텝 진행 상황`}
        >
          {([1, 2, 3] as const).map((s) => {
            const isActive =
              s === 1
                ? step === 1
                : s === 2
                ? step === 2 || step === '2-1' || step === '2-2'
                : step === 3
            const isPast =
              s === 1
                ? step !== 0 && step !== 1
                : s === 2
                ? step === 3
                : false

            return (
              <span
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-wwf-orange'
                    : isPast
                    ? 'bg-wwf-orange/40'
                    : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )
          })}
        </div>

        {/* 오른쪽: 닫기 버튼 */}
        <div className="w-16 flex justify-end">
          <button
            data-testid="donate-modal-close-button"
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-medium text-wwf-light-gray hover:text-wwf-dark-gray transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-orange rounded"
            aria-label="기부 모달 닫기"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>닫기</span>
          </button>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <Progress
        data-testid="donate-progress-bar"
        value={progressValue}
        aria-label={`후원 진행률 ${progressValue}%`}
        className="h-1 bg-gray-100"
      />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 스텝 콘텐츠 (애니메이션 포함)
// ────────────────────────────────────────────────────────────────────────────

interface StepContentProps {
  step: ModalStep
  prevStep: ModalStep | null
}

function StepContent({ step, prevStep }: StepContentProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayStep, setDisplayStep] = useState(step)
  const prevStepRef = useRef(prevStep)

  // 방향 계산
  const getStepOrder = (s: ModalStep): number => {
    if (s === 0) return -1
    if (s === 1) return 0
    if (s === 2) return 1
    if (s === '2-1') return 2
    if (s === '2-2') return 3
    return 4
  }

  const isForward =
    prevStepRef.current !== null
      ? getStepOrder(step) > getStepOrder(prevStepRef.current)
      : true

  useEffect(() => {
    if (prevStepRef.current !== null && prevStepRef.current !== step) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setDisplayStep(step)
        setIsAnimating(false)
        prevStepRef.current = step
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setDisplayStep(step)
      prevStepRef.current = step
    }
  }, [step])

  return (
    <div
      data-testid="donate-step-content"
      className="overflow-hidden"
      style={{ minHeight: '14rem' }}
    >
      <div
        className={`transition-all duration-200 ease-in-out ${
          isAnimating
            ? isForward
              ? '-translate-x-4 opacity-0'
              : 'translate-x-4 opacity-0'
            : 'translate-x-0 opacity-100'
        }`}
      >
        <StepRenderer step={displayStep} />
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 데스크톱 모달 (shadcn Dialog 기반)
// ────────────────────────────────────────────────────────────────────────────

interface DesktopModalProps {
  isOpen: boolean
  step: ModalStep
  prevStep: ModalStep | null
  showConfirm: boolean
  canGoBack: boolean
  onBack: () => void
  onClose: () => void
  onConfirmClose: () => void
  onCancelClose: () => void
  onOpenChange: (open: boolean) => void
}

function DesktopModal({
  isOpen,
  step,
  prevStep,
  showConfirm,
  canGoBack,
  onBack,
  onClose,
  onConfirmClose,
  onCancelClose,
  onOpenChange,
}: DesktopModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay data-testid="donate-modal-overlay" />
        <div
          data-testid="donate-modal-desktop"
          role="dialog"
          aria-modal="true"
          aria-label="기부 모달"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[520px] bg-white rounded-2xl shadow-2xl outline-none overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          style={{ position: 'fixed' }}
        >
          {/* 닫기 확인 다이얼로그 오버레이 */}
          {showConfirm && (
            <ConfirmCloseDialog
              onConfirm={onConfirmClose}
              onCancel={onCancelClose}
            />
          )}

          <ModalHeader step={step} isMobile={false} canGoBack={canGoBack} onBack={onBack} onClose={onClose} />

          <div className="px-5 pb-5 pt-4">
            <StepContent step={step} prevStep={prevStep} />
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 모바일 바텀시트 (커스텀 구현)
// ────────────────────────────────────────────────────────────────────────────

interface MobileBottomSheetProps {
  isOpen: boolean
  step: ModalStep
  prevStep: ModalStep | null
  showConfirm: boolean
  canGoBack: boolean
  onBack: () => void
  onClose: () => void
  onConfirmClose: () => void
  onCancelClose: () => void
}

function MobileBottomSheet({
  isOpen,
  step,
  prevStep,
  showConfirm,
  canGoBack,
  onBack,
  onClose,
  onConfirmClose,
  onCancelClose,
}: MobileBottomSheetProps) {
  // 포커스 트랩을 위한 ref
  const sheetRef = useRef<HTMLDivElement>(null)

  // 2단계 마운트: mounted(DOM 존재) → visible(애니메이션 트리거)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      // 다음 프레임에서 visible 전환 → CSS transition 실행
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
      // 닫기 애니메이션 완료 후 언마운트
      const timer = setTimeout(() => setMounted(false), 350)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Esc 키 닫기
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 포커스 트랩
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return

    sheetRef.current.focus()

    const sheet = sheetRef.current
    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return

      const firstEl = focusableElements[0]
      const lastEl = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabTrap)
    return () => document.removeEventListener('keydown', handleTabTrap)
  }, [isOpen])

  if (!mounted) return null

  return (
    <div
      data-testid="donate-modal-mobile"
      className="fixed inset-0 z-50"
      aria-hidden={!isOpen}
    >
      {/* 배경 오버레이 */}
      <div
        data-testid="donate-modal-mobile-overlay"
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 바텀시트 */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="기부 모달"
        tabIndex={-1}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl outline-none transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '95vh', overflowY: 'auto' }}
      >
        {/* 닫기 확인 다이얼로그 오버레이 */}
        {showConfirm && (
          <ConfirmCloseDialog
            onConfirm={onConfirmClose}
            onCancel={onCancelClose}
          />
        )}

        <ModalHeader step={step} isMobile={true} canGoBack={canGoBack} onBack={onBack} onClose={onClose} />

        <div className="px-5 pb-safe-or-5 pt-4 pb-8">
          <StepContent step={step} prevStep={prevStep} />
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// DonateModal (메인 컨테이너)
// ────────────────────────────────────────────────────────────────────────────

export default function DonateModal() {
  const modal = useDonationStore(selectModal)
  const currentStep = useDonationStore(selectCurrentStep)
  const entryMission = useDonationStore(selectEntryMission)
  const closeModal = useDonationStore((s) => s.closeModal)
  const prevStepAction = useDonationStore((s) => s.prevStep)

  const [isMobile, setIsMobile] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [prevStep, setPrevStep] = useState<ModalStep | null>(null)

  // ── 미디어 쿼리: 768px 미만 = 모바일 ─────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    handleChange(mq)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  // ── currentStep 변경 시 prevStep 추적 ────────────────────────────────────
  const prevStepRef = useRef<ModalStep | null>(null)
  useEffect(() => {
    setPrevStep(prevStepRef.current)
    prevStepRef.current = currentStep
  }, [currentStep])

  // ── history.pushState 연동 ────────────────────────────────────────────
  useEffect(() => {
    if (modal.isOpen) {
      // 모달 열릴 때 히스토리 항목 추가
      window.history.pushState({ donateModal: true }, '')
    }
  }, [modal.isOpen])

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 뒤로가기 시 모달 닫기
      if (modal.isOpen) {
        // pushState로 추가된 항목이 아닌 경우에도 모달 닫기
        if (!e.state?.donateModal) {
          handleClose()
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [modal.isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 닫기 로직 ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (currentStep === 0 || currentStep === 1) {
      // 스텝 0, 1: 즉시 닫기
      closeModal()
      setShowConfirm(false)
    } else {
      // 스텝 2+: 확인 다이얼로그
      setShowConfirm(true)
    }
  }, [currentStep, closeModal])

  const handleConfirmClose = useCallback(() => {
    closeModal()
    setShowConfirm(false)
  }, [closeModal])

  const handleCancelClose = useCallback(() => {
    setShowConfirm(false)
  }, [])

  // ── Dialog onOpenChange 핸들러 (Esc, 오버레이 클릭) ────────────────────
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleClose()
      }
    },
    [handleClose]
  )

  // ── 뒤로가기 로직 ──────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    prevStepAction()
  }, [prevStepAction])

  // step 0: 항상 불가, step 1 + entryMission: 불가 (미션 카드에서 직접 진입)
  const canGoBack =
    currentStep !== 0 && !(currentStep === 1 && entryMission !== null)

  // ── 모달이 닫혀있으면 렌더링하지 않음 ──────────────────────────────────
  if (!modal.isOpen && !showConfirm) {
    return null
  }

  return isMobile ? (
    <MobileBottomSheet
      isOpen={modal.isOpen}
      step={currentStep}
      prevStep={prevStep}
      showConfirm={showConfirm}
      canGoBack={canGoBack}
      onBack={handleBack}
      onClose={handleClose}
      onConfirmClose={handleConfirmClose}
      onCancelClose={handleCancelClose}
    />
  ) : (
    <DesktopModal
      isOpen={modal.isOpen}
      step={currentStep}
      prevStep={prevStep}
      showConfirm={showConfirm}
      canGoBack={canGoBack}
      onBack={handleBack}
      onClose={handleClose}
      onConfirmClose={handleConfirmClose}
      onCancelClose={handleCancelClose}
      onOpenChange={handleOpenChange}
    />
  )
}
