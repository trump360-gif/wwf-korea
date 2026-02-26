import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, Font } from '@react-pdf/renderer'
import { createElement } from 'react'
import CertificateTemplate, { registerFonts } from '@/lib/pdf/CertificateTemplate'
import { getMissionBySlug } from '@/lib/data/missions'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { MissionSlug } from '@/lib/types/mission'

// ────────────────────────────────────────────────────────────────────────────
// 유틸리티
// ────────────────────────────────────────────────────────────────────────────

function generateCertificateNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000) // 5자리 랜덤
  return `WWF-${year}-${random}`
}

function missionSlugToName(slug: string): string {
  const mission = getMissionBySlug(slug as MissionSlug)
  return mission?.name ?? slug
}

function getImpactMessage(slugs: string[]): string {
  if (slugs.length === 0) {
    return '당신의 후원으로 지구의 자연환경이 보호됩니다.'
  }
  const mission = getMissionBySlug(slugs[0] as MissionSlug)
  return mission?.impactMessage ?? '당신의 후원으로 지구의 자연환경이 보호됩니다.'
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/certificate
// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const name = searchParams.get('name')
  const amountStr = searchParams.get('amount')
  const type = searchParams.get('type')
  const missionsStr = searchParams.get('missions')
  const date = searchParams.get('date')

  // ── 검증 ───────────────────────────────────────────────────────────────
  if (!name || !amountStr || !type || !missionsStr || !date) {
    return NextResponse.json(
      {
        error: 'VALIDATION_ERROR',
        message: '필수 파라미터가 누락되었습니다. (name, amount, type, missions, date)',
      },
      { status: 400 }
    )
  }

  const amount = Number(amountStr)
  if (Number.isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      {
        error: 'VALIDATION_ERROR',
        message: '유효하지 않은 금액입니다.',
      },
      { status: 400 }
    )
  }

  // ── PDF 데이터 준비 ─────────────────────────────────────────────────────
  const missionSlugs = missionsStr.split(',').map((s) => s.trim()).filter(Boolean)
  const missionNames = missionSlugs.map(missionSlugToName)
  const donationType = type === 'monthly' ? '정기 후원' : '일시 후원'
  const impactMessage = getImpactMessage(missionSlugs)
  const certificateNumber = generateCertificateNumber()

  // ── base URL 결정 (Vercel / 로컬 모두 지원) ────────────────────────────
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  const host = request.headers.get('host') ?? 'localhost:3000'
  const baseUrl = `${proto}://${host}`

  // ── PDF 생성 ────────────────────────────────────────────────────────────
  try {
    // URL 기반 폰트 등록 & 사전 로드
    registerFonts(baseUrl)
    await Font.load({ fontFamily: 'NotoSansKR', fontWeight: 400 })
    await Font.load({ fontFamily: 'NotoSansKR', fontWeight: 700 })

    const element = createElement(CertificateTemplate, {
      donorName: name,
      amount: formatCurrency(amount),
      donationType,
      missions: missionNames,
      date,
      impactMessage,
      certificateNumber,
      logoUrl: `${baseUrl}/images/wwf-logo.png`,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any)
    const uint8 = new Uint8Array(buffer)

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="wwf-certificate.pdf"',
      },
    })
  } catch (err) {
    console.error('[/api/certificate] PDF 생성 실패:', err)
    return NextResponse.json(
      {
        error: 'PDF_GENERATION_ERROR',
        message: 'PDF 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
