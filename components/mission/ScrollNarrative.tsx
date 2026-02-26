import type { Mission } from '@/lib/types/mission'
import NarrativeSection from './NarrativeSection'
import StatHighlight from './StatHighlight'
import DonationCTA from './DonationCTA'

interface ScrollNarrativeProps {
  mission: Mission
}

export default function ScrollNarrative({ mission }: ScrollNarrativeProps) {
  const { narrative, stats } = mission

  return (
    <div data-testid="scroll-narrative">
      {/* 1. 문제 섹션 */}
      <NarrativeSection
        section={narrative.problem}
        index={0}
        type="problem"
      />

      {/* 2. 통계 하이라이트 */}
      <StatHighlight stats={stats} />

      {/* 3. 활동 섹션 */}
      <NarrativeSection
        section={narrative.action}
        index={1}
        type="action"
      />

      {/* 4. 호소 섹션 */}
      <NarrativeSection
        section={narrative.appeal}
        index={2}
        type="appeal"
      />

      {/* 5. 기부 CTA */}
      <DonationCTA mission={mission} />
    </div>
  )
}
