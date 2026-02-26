import type { MissionSlug } from './mission'

export type DonationType = 'monthly' | 'onetime'

export type ModalStep = 0 | 1 | 2 | '2-1' | '2-2' | 3

export interface DonorInfo {
  name: string
  email: string
  phone: string
}

export interface DonationState {
  modal: {
    isOpen: boolean
    currentStep: ModalStep
    entryMission: MissionSlug | null
  }
  donation: {
    type: DonationType
    amount: number
    selectedMissions: MissionSlug[]
    distribution: Record<MissionSlug, number>
  }
  donor: DonorInfo
}
