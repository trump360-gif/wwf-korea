import type { Stat } from '@/lib/types/mission'

interface StatHighlightProps {
  stats: Stat[]
}

export default function StatHighlight({ stats }: StatHighlightProps) {
  return (
    <section
      data-testid="stat-highlight"
      className="bg-wwf-warm-gray py-20"
      aria-label="주요 통계"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="contents">
              {/* 통계 아이템 */}
              <div
                data-testid={`stat-item-${index}`}
                className="flex flex-col items-center text-center px-8 md:px-12 py-6 md:py-0"
              >
                {/* 숫자 + 단위 */}
                <div className="flex items-baseline gap-1">
                  <span
                    data-testid={`stat-value-${index}`}
                    className="font-display text-6xl md:text-8xl font-bold text-wwf-black leading-none"
                    aria-label={`${stat.value}${stat.unit}`}
                  >
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span
                      className="text-2xl text-wwf-dark-gray font-sans font-medium"
                      aria-hidden="true"
                    >
                      {stat.unit}
                    </span>
                  )}
                </div>

                {/* 라벨 */}
                <p
                  data-testid={`stat-label-${index}`}
                  className="mt-3 text-lg font-sans text-wwf-dark-gray max-w-[180px] leading-snug"
                >
                  {stat.label}
                </p>
              </div>

              {/* 구분선 (마지막 아이템 제외) */}
              {index < stats.length - 1 && (
                <>
                  {/* 데스크톱: 세로선 */}
                  <div
                    className="hidden md:block w-px h-20 bg-wwf-dark-gray/20 shrink-0"
                    aria-hidden="true"
                  />
                  {/* 모바일: 가로선 */}
                  <div
                    className="md:hidden w-16 h-px bg-wwf-dark-gray/20 shrink-0"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
