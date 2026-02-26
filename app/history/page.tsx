'use client'

import { useState, useCallback } from 'react'
import { Search, Download, Loader2, FileText, CalendarDays, Banknote } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/layout/Navigation'
import { findDonationRecords } from '@/lib/utils/donationHistory'
import { formatPhoneNumber } from '@/lib/utils/validation'
import type { DonationRecord } from '@/lib/utils/donationHistory'
import { getMissionBySlug } from '@/lib/data/missions'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { MissionSlug } from '@/lib/types/mission'

function getMissionName(slug: string): string {
  const mission = getMissionBySlug(slug as MissionSlug)
  return mission?.name ?? slug
}

interface DownloadState {
  [recordId: string]: 'idle' | 'loading' | 'error'
}

export default function HistoryPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [records, setRecords] = useState<DonationRecord[] | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [nameError, setNameError] = useState('')
  const [contactError, setContactError] = useState('')
  const [downloadStates, setDownloadStates] = useState<DownloadState>({})

  const validate = useCallback((): boolean => {
    let valid = true

    if (!name.trim()) {
      setNameError('이름을 입력해주세요.')
      valid = false
    } else {
      setNameError('')
    }

    if (!contact.trim()) {
      setContactError('이메일 또는 전화번호를 입력해주세요.')
      valid = false
    } else {
      setContactError('')
    }

    return valid
  }, [name, contact])

  const handleSearch = useCallback(() => {
    if (!validate()) return

    const found = findDonationRecords(name.trim(), contact.trim())
    setRecords(found)
    setHasSearched(true)
  }, [name, contact, validate])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const handleDownload = useCallback(async (record: DonationRecord) => {
    setDownloadStates((prev) => ({ ...prev, [record.id]: 'loading' }))

    try {
      const params = new URLSearchParams({
        name: record.donorName,
        amount: String(record.amount),
        type: record.donationType,
        missions: record.selectedMissions.join(','),
        date: record.date,
      })

      const response = await fetch(`/api/certificate?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || '기증서 생성에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wwf-certificate-${record.certificateNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      setDownloadStates((prev) => ({ ...prev, [record.id]: 'idle' }))
    } catch {
      setDownloadStates((prev) => ({ ...prev, [record.id]: 'error' }))
      // 3초 후 에러 상태 초기화
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [record.id]: 'idle' }))
      }, 3000)
    }
  }, [])

  return (
    <>
      <Navigation />
      <main
        data-testid="history-page"
        className="min-h-screen bg-wwf-warm-gray pt-28 md:pt-36 pb-20 px-4"
      >
        <div className="mx-auto max-w-2xl space-y-10">
          {/* 페이지 헤더 */}
          <header className="space-y-2">
            <h1
              data-testid="history-heading"
              className="text-3xl md:text-4xl font-serif font-bold text-wwf-black"
            >
              기부 내역 조회
            </h1>
            <p className="text-wwf-light-gray text-sm md:text-base">
              이름과 이메일 또는 전화번호를 입력하시면 기부 내역을 확인하실 수 있습니다.
            </p>
          </header>

          {/* 검색 폼 */}
          <section
            data-testid="history-search-form"
            aria-label="기부 내역 검색"
            className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* 이름 */}
            <div className="space-y-1.5">
              <label
                htmlFor="search-name"
                className="block text-sm font-semibold text-wwf-dark-gray"
              >
                이름 <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <Input
                id="search-name"
                data-testid="history-search-name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError('')
                }}
                onKeyDown={handleKeyDown}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'error-search-name' : undefined}
                className={nameError ? 'border-red-500' : ''}
              />
              {nameError && (
                <p
                  id="error-search-name"
                  data-testid="history-error-name"
                  className="text-red-500 text-sm"
                  role="alert"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* 이메일 또는 전화번호 */}
            <div className="space-y-1.5">
              <label
                htmlFor="search-contact"
                className="block text-sm font-semibold text-wwf-dark-gray"
              >
                이메일 또는 전화번호 <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <Input
                id="search-contact"
                data-testid="history-search-contact"
                type="text"
                placeholder="example@email.com 또는 010-0000-0000"
                value={contact}
                onChange={(e) => {
                  const val = e.target.value
                  // 숫자로 시작하면 전화번호로 간주하여 자동 하이픈 포맷
                  const isPhone = /^\d/.test(val.replace(/[-\s]/g, ''))
                  setContact(isPhone ? formatPhoneNumber(val) : val)
                  if (contactError) setContactError('')
                }}
                onKeyDown={handleKeyDown}
                aria-invalid={!!contactError}
                aria-describedby={contactError ? 'error-search-contact' : undefined}
                className={contactError ? 'border-red-500' : ''}
              />
              {contactError && (
                <p
                  id="error-search-contact"
                  data-testid="history-error-contact"
                  className="text-red-500 text-sm"
                  role="alert"
                >
                  {contactError}
                </p>
              )}
            </div>

            {/* 조회 버튼 */}
            <Button
              data-testid="history-search-button"
              onClick={handleSearch}
              className="w-full rounded-full bg-wwf-orange text-white hover:bg-orange-600 h-12 text-base font-semibold gap-2 focus-visible:ring-wwf-orange"
              aria-label="기부 내역 조회"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              조회하기
            </Button>
          </section>

          {/* 검색 결과 */}
          {hasSearched && (
            <section
              data-testid="history-results"
              aria-label="기부 내역 조회 결과"
              aria-live="polite"
            >
              {records && records.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-wwf-light-gray">
                    총{' '}
                    <span className="font-semibold text-wwf-orange">
                      {records.length}건
                    </span>
                    의 기부 내역이 조회되었습니다.
                  </p>

                  <ul className="space-y-4" role="list" aria-label="기부 내역 목록">
                    {records.map((record) => {
                      const dlState = downloadStates[record.id] ?? 'idle'
                      const missionNames = record.selectedMissions.map(getMissionName)

                      return (
                        <li
                          key={record.id}
                          data-testid="history-record-item"
                          className="bg-white rounded-2xl p-5 shadow-sm space-y-4"
                        >
                          {/* 상단: 날짜 + 유형 배지 */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-sm text-wwf-light-gray">
                              <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                              <time>{record.date}</time>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                record.donationType === 'monthly'
                                  ? 'bg-orange-100 text-wwf-orange'
                                  : 'bg-gray-100 text-wwf-dark-gray'
                              }`}
                            >
                              {record.donationType === 'monthly' ? '월정기 후원' : '일시 후원'}
                            </span>
                          </div>

                          {/* 미션 목록 */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-wwf-light-gray flex-shrink-0" aria-hidden="true" />
                              <span className="text-xs font-semibold text-wwf-light-gray uppercase tracking-wide">
                                후원 미션
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pl-5">
                              {missionNames.map((missionName, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2.5 py-1 bg-wwf-warm-gray rounded-lg text-xs font-medium text-wwf-dark-gray"
                                >
                                  {missionName}
                                  {record.distribution[record.selectedMissions[idx]] !== undefined && (
                                    <span className="text-wwf-orange ml-1">
                                      {record.distribution[record.selectedMissions[idx]]}%
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 금액 */}
                          <div className="flex items-center gap-1.5">
                            <Banknote className="w-4 h-4 text-wwf-light-gray flex-shrink-0" aria-hidden="true" />
                            <span className="text-lg font-bold text-wwf-black">
                              {formatCurrency(record.amount)}
                            </span>
                            {record.donationType === 'monthly' && (
                              <span className="text-sm text-wwf-light-gray">/ 월</span>
                            )}
                          </div>

                          {/* 증서 번호 + 다운로드 버튼 */}
                          <div className="flex items-center justify-between pt-1 border-t border-wwf-warm-gray">
                            <span className="text-xs text-wwf-light-gray font-mono">
                              {record.certificateNumber}
                            </span>
                            <div className="space-y-1 text-right">
                              <button
                                data-testid="history-download-button"
                                onClick={() => handleDownload(record)}
                                disabled={dlState === 'loading'}
                                aria-label={`${record.date} 기부 기증서 PDF 다운로드`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-wwf-black text-white hover:bg-wwf-dark-gray transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-black focus-visible:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {dlState === 'loading' ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                                    생성 중...
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                                    기증서 PDF
                                  </>
                                )}
                              </button>
                              {dlState === 'error' && (
                                <p className="text-xs text-red-500" role="alert">
                                  다운로드에 실패했습니다. 다시 시도해주세요.
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : (
                <div
                  data-testid="history-empty"
                  className="bg-white rounded-2xl p-10 shadow-sm text-center space-y-3"
                  role="status"
                  aria-label="조회 결과 없음"
                >
                  <div className="w-14 h-14 mx-auto bg-wwf-warm-gray rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-wwf-light-gray" aria-hidden="true" />
                  </div>
                  <p className="text-wwf-dark-gray font-semibold">조회된 내역이 없습니다</p>
                  <p className="text-wwf-light-gray text-sm">
                    이름과 이메일 또는 전화번호를 정확히 입력해주세요.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  )
}
