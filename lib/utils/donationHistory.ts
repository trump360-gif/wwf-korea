export interface DonationRecord {
  id: string
  donorName: string
  email: string
  phone: string
  amount: number
  donationType: 'monthly' | 'onetime'
  selectedMissions: string[]
  distribution: Record<string, number>
  date: string // YYYY년 M월 D일
  certificateNumber: string
}

const STORAGE_KEY = 'wwf-donation-history'

export function saveDonationRecord(record: DonationRecord): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getAllDonationRecords()
    const updated = [record, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.warn('[donationHistory] saveDonationRecord: localStorage 저장 실패', error)
  }
}

export function findDonationRecords(name: string, contact: string): DonationRecord[] {
  const all = getAllDonationRecords()
  const trimmedName = name.trim()
  const trimmedContact = contact.trim()

  const contactDigits = trimmedContact.replace(/\D/g, '')

  return all.filter((record) => {
    const nameMatch = record.donorName === trimmedName
    const contactMatch =
      record.email === trimmedContact ||
      record.phone === trimmedContact ||
      record.phone.replace(/\D/g, '') === contactDigits
    return nameMatch && contactMatch
  })
}

function getAllDonationRecords(): DonationRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DonationRecord[]
  } catch {
    return []
  }
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `WWF-${year}-${random}`
}
