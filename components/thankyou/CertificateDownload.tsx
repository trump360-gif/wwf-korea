'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface CertificateDownloadProps {
  donorName: string
  amount: number
  donationType: string
  missions: string[]
  date: string
}

export default function CertificateDownload({
  donorName,
  amount,
  donationType,
  missions,
  date,
}: CertificateDownloadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        name: donorName,
        amount: String(amount),
        type: donationType,
        missions: missions.join(','),
        date,
      })

      const response = await fetch(`/api/certificate?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.error || '기증서 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wwf-certificate.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '기증서 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-wwf-black text-white hover:bg-wwf-dark-gray transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wwf-black focus-visible:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            기증서 생성 중...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" aria-hidden="true" />
            기증서 PDF 다운로드
          </>
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
