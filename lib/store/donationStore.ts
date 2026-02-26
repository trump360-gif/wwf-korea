import { create } from 'zustand'
import type { MissionSlug } from '@/lib/types/mission'
import type { DonationType, DonorInfo, ModalStep, DonationState } from '@/lib/types/donation'

// ────────────────────────────────────────────────────────────────────────────
// 액션 인터페이스
// ────────────────────────────────────────────────────────────────────────────

interface DonationActions {
  /** 기부 모달을 엽니다. 미션 없이 호출하면 미션 선택(Step 0)부터 시작합니다. */
  openModal: (missionSlug?: MissionSlug) => void
  /** 기부 모달을 닫고 전체 상태를 초기화합니다. */
  closeModal: () => void
  /** 현재 스텝에서 다음 스텝으로 이동합니다. */
  nextStep: () => void
  /** 현재 스텝에서 이전 스텝으로 이동합니다. */
  prevStep: () => void
  /** Step 0에서 미션을 선택하고 Step 1로 이동합니다. */
  selectMission: (slug: MissionSlug) => void
  /** 기부 금액을 설정합니다. 0은 미선택 상태입니다. */
  setAmount: (amount: number) => void
  /** 기부 유형(정기/일시)을 설정합니다. */
  setDonationType: (type: DonationType) => void
  /** 미션 선택을 토글합니다. entryMission은 제거할 수 없습니다. */
  toggleMission: (slug: MissionSlug) => void
  /** 배분 비율을 직접 설정합니다. (합계 100% 보장은 호출자 책임) */
  setDistribution: (distribution: Record<MissionSlug, number>) => void
  /** 기부자 정보 필드를 업데이트합니다. */
  setDonorInfo: (field: keyof DonorInfo, value: string) => void
  /** 기부 관련 상태(modal 제외)를 초기값으로 리셋합니다. */
  resetDonation: () => void
  /** 현재 상태를 sessionStorage에 저장합니다. (감사 페이지 이동 전 호출) */
  completeDonation: () => void
  /** sessionStorage에서 기부 완료 상태를 복구합니다. (감사 페이지에서 호출) */
  restoreFromSession: () => void
}

// ────────────────────────────────────────────────────────────────────────────
// 스토어 타입
// ────────────────────────────────────────────────────────────────────────────

type DonationStore = DonationState & DonationActions

// ────────────────────────────────────────────────────────────────────────────
// 초기값
// ────────────────────────────────────────────────────────────────────────────

const SESSION_STORAGE_KEY = 'wwf-donation-complete'

const INITIAL_DONATION_STATE: DonationState = {
  modal: {
    isOpen: false,
    currentStep: 1,
    entryMission: null,
  },
  donation: {
    type: 'monthly',
    amount: 0,
    selectedMissions: [],
    distribution: {} as Record<MissionSlug, number>,
  },
  donor: {
    name: '',
    email: '',
    phone: '',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// 유틸리티: distribution 자동 계산
// ────────────────────────────────────────────────────────────────────────────

/**
 * selectedMissions 배열을 받아 각 미션에 균등 배분된 퍼센트를 계산합니다.
 *
 * - 100을 미션 수로 나눈 몫(Math.floor)을 기본 배분으로 사용합니다.
 * - 나머지 퍼센트(100 % missions.length)는 첫 번째 미션에 추가합니다.
 * - 미션이 없으면 빈 객체를 반환합니다.
 */
function calcDistribution(missions: MissionSlug[]): Record<MissionSlug, number> {
  if (missions.length === 0) {
    return {} as Record<MissionSlug, number>
  }

  const base = Math.floor(100 / missions.length)
  const remainder = 100 % missions.length

  return missions.reduce<Record<MissionSlug, number>>((acc, slug, index) => {
    acc[slug] = index === 0 ? base + remainder : base
    return acc
  }, {} as Record<MissionSlug, number>)
}

// ────────────────────────────────────────────────────────────────────────────
// 스토어 생성
// ────────────────────────────────────────────────────────────────────────────

export const useDonationStore = create<DonationStore>((set, get) => ({
  // ── 초기 상태 ──────────────────────────────────────────────────────────────
  ...INITIAL_DONATION_STATE,

  // ── 액션 ──────────────────────────────────────────────────────────────────

  openModal: (missionSlug) => {
    if (missionSlug) {
      // 미션 지정 기부: Step 1부터 시작
      set({
        modal: {
          isOpen: true,
          currentStep: 1,
          entryMission: missionSlug,
        },
        donation: {
          type: 'monthly',
          amount: 0,
          selectedMissions: [missionSlug],
          distribution: calcDistribution([missionSlug]),
        },
        donor: { name: '', email: '', phone: '' },
      })
    } else {
      // 일반 기부: Step 0 (미션 선택)부터 시작
      set({
        modal: {
          isOpen: true,
          currentStep: 0,
          entryMission: null,
        },
        donation: {
          type: 'monthly',
          amount: 0,
          selectedMissions: [],
          distribution: {} as Record<MissionSlug, number>,
        },
        donor: { name: '', email: '', phone: '' },
      })
    }
  },

  closeModal: () => {
    get().resetDonation()
    set((state) => ({
      modal: {
        ...state.modal,
        isOpen: false,
      },
    }))
  },

  nextStep: () => {
    set((state) => {
      const current = state.modal.currentStep

      let next: ModalStep
      if (current === 0) {
        next = 1
      } else if (current === 1) {
        next = 2
      } else if (current === 2) {
        next = 3
      } else if (current === '2-1') {
        // 추가 미션이 선택되었으면 배분 조정 스텝으로, 아니면 결제로
        next = state.donation.selectedMissions.length > 1 ? '2-2' : 3
      } else if (current === '2-2') {
        next = 3
      } else {
        next = 3
      }

      return {
        modal: {
          ...state.modal,
          currentStep: next,
        },
      }
    })
  },

  selectMission: (slug) => {
    set((state) => ({
      modal: {
        ...state.modal,
        currentStep: 1 as ModalStep,
        entryMission: slug,
      },
      donation: {
        ...state.donation,
        selectedMissions: [slug],
        distribution: calcDistribution([slug]),
      },
    }))
  },

  prevStep: () => {
    set((state) => {
      const current = state.modal.currentStep
      const hasEntryMission = state.modal.entryMission !== null

      let prev: ModalStep
      if (current === 1) {
        prev = hasEntryMission ? 1 : 0
      } else if (current === 2) {
        prev = 1
      } else if (current === '2-1') {
        prev = 2
      } else if (current === '2-2') {
        prev = '2-1'
      } else if (current === 3) {
        // 복수 미션이면 배분 스텝으로, 아니면 추가 선택 스텝으로
        prev = state.donation.selectedMissions.length > 1 ? '2-2' : 2
      } else {
        prev = 0
      }

      return {
        modal: {
          ...state.modal,
          currentStep: prev,
        },
      }
    })
  },

  setAmount: (amount) => {
    set((state) => ({
      donation: {
        ...state.donation,
        amount,
      },
    }))
  },

  setDonationType: (type) => {
    set((state) => ({
      donation: {
        ...state.donation,
        type,
      },
    }))
  },

  toggleMission: (slug) => {
    set((state) => {
      const { selectedMissions, distribution } = state.donation
      const { entryMission } = state.modal

      // entryMission은 제거 불가
      const isEntry = slug === entryMission
      const isSelected = selectedMissions.includes(slug)

      let nextMissions: MissionSlug[]

      if (isSelected) {
        // 이미 선택된 경우 → 제거 (entryMission은 제거 불가)
        if (isEntry) {
          return state
        }
        nextMissions = selectedMissions.filter((s) => s !== slug)
      } else {
        // 선택되지 않은 경우 → 추가
        nextMissions = [...selectedMissions, slug]
      }

      return {
        donation: {
          ...state.donation,
          selectedMissions: nextMissions,
          distribution: calcDistribution(nextMissions),
        },
      }
    })
  },

  setDistribution: (distribution) => {
    set((state) => ({
      donation: {
        ...state.donation,
        distribution,
      },
    }))
  },

  setDonorInfo: (field, value) => {
    set((state) => ({
      donor: {
        ...state.donor,
        [field]: value,
      },
    }))
  },

  resetDonation: () => {
    set(INITIAL_DONATION_STATE)
  },

  completeDonation: () => {
    if (typeof window === 'undefined') return

    const state = get()
    const snapshot = {
      modal: state.modal,
      donation: state.donation,
      donor: state.donor,
    }

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      // sessionStorage 용량 초과 등 예외 상황을 조용히 처리합니다.
      console.warn('[donationStore] completeDonation: sessionStorage 저장 실패', error)
    }
  },

  restoreFromSession: () => {
    if (typeof window === 'undefined') return

    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (!raw) return

      const snapshot = JSON.parse(raw) as DonationState

      set({
        modal: { ...snapshot.modal, isOpen: false },
        donation: snapshot.donation,
        donor: snapshot.donor,
      })

      // 1회성 복구 — 읽은 즉시 삭제합니다.
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch (error) {
      console.warn('[donationStore] restoreFromSession: sessionStorage 복구 실패', error)
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  },
}))

// ────────────────────────────────────────────────────────────────────────────
// 선택적 셀렉터 (컴포넌트에서 개별 구독 시 사용)
// ────────────────────────────────────────────────────────────────────────────

/** 모달 상태만 구독합니다. */
export const selectModal = (s: DonationStore) => s.modal

/** 기부 정보만 구독합니다. */
export const selectDonation = (s: DonationStore) => s.donation

/** 기부자 정보만 구독합니다. */
export const selectDonor = (s: DonationStore) => s.donor

/** 현재 스텝만 구독합니다. */
export const selectCurrentStep = (s: DonationStore) => s.modal.currentStep

/** 진입 미션만 구독합니다. */
export const selectEntryMission = (s: DonationStore) => s.modal.entryMission

/** 선택된 미션 목록만 구독합니다. */
export const selectSelectedMissions = (s: DonationStore) => s.donation.selectedMissions

/** distribution만 구독합니다. */
export const selectDistribution = (s: DonationStore) => s.donation.distribution
