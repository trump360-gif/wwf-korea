import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { missions, getMissionBySlug } from '@/lib/data/missions'
import type { MissionSlug } from '@/lib/types/mission'
import MissionHero from '@/components/mission/MissionHero'
import ScrollNarrative from '@/components/mission/ScrollNarrative'

// ────────────────────────────────────────────────────────────────────────────
// 정적 파라미터 생성 (6개 미션 페이지 사전 빌드)
// ────────────────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return missions.map((m) => ({ slug: m.slug }))
}

// ────────────────────────────────────────────────────────────────────────────
// 메타데이터 생성
// ────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const mission = getMissionBySlug(slug as MissionSlug)

  if (!mission) {
    return {
      title: 'Mission Not Found | WWF-Korea',
    }
  }

  return {
    title: `${mission.fullName} | WWF-Korea`,
    description: mission.description,
    keywords: mission.keywords,
    openGraph: {
      title: `${mission.fullName} | WWF-Korea`,
      description: mission.description,
      type: 'website',
    },
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 페이지 컴포넌트
// ────────────────────────────────────────────────────────────────────────────

export default async function MissionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mission = getMissionBySlug(slug as MissionSlug)

  if (!mission) {
    notFound()
  }

  return (
    <>
      <MissionHero mission={mission} />
      <ScrollNarrative mission={mission} />
    </>
  )
}
