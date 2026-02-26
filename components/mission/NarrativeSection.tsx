import Image from 'next/image'
import type { NarrativeSection as NarrativeSectionType } from '@/lib/types/mission'
import { CheckCircle2 } from 'lucide-react'
import { cn, BLUR_DATA_URL } from '@/lib/utils'

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────

type SectionType = 'problem' | 'action' | 'appeal'

interface NarrativeSectionProps {
  section: NarrativeSectionType
  index: number
  type: SectionType
}

// ────────────────────────────────────────────────────────────────────────────
// 섹션 타입별 라벨
// ────────────────────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<SectionType, string> = {
  problem: '지금 일어나고 있는 일',
  action: '우리가 하고 있는 일',
  appeal: '당신의 마음이 닿을 수 있는 곳',
}

// ────────────────────────────────────────────────────────────────────────────
// 실제 이미지 컴포넌트 (next/image)
// ────────────────────────────────────────────────────────────────────────────

function NarrativeImage({
  src,
  alt,
  caption,
  layout,
}: {
  src: string
  alt: string
  caption?: string
  layout: 'full' | 'half' | 'inset'
}) {
  const wrapperClass = cn(
    'relative overflow-hidden',
    layout === 'full' && 'w-full aspect-video',
    layout === 'half' && 'w-full aspect-4/3',
    layout === 'inset' && 'w-full aspect-4/3'
  )

  const sizes =
    layout === 'full'
      ? '100vw'
      : layout === 'half'
        ? '(max-width: 768px) 100vw, 50vw'
        : '(max-width: 768px) 100vw, 384px'

  return (
    <figure>
      <div className={wrapperClass}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs font-sans text-wwf-dark-gray/60 px-4">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ────────────────────────────────────────────────────────────────────────────

export default function NarrativeSection({
  section,
  index,
  type,
}: NarrativeSectionProps) {
  const isEven = index % 2 === 0
  const firstImage = section.images[0]
  const isFullLayout = firstImage?.layout === 'full'
  const isInsetLayout = firstImage?.layout === 'inset'
  const isHalfLayout = firstImage?.layout === 'half'

  const label = SECTION_LABELS[type]

  return (
    <section
      data-testid={`narrative-section-${type}`}
      className="py-20 md:py-32"
      aria-label={label}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 라벨 */}
        <div className="text-center mb-12 md:mb-16">
          <span
            data-testid={`narrative-label-${type}`}
            className="inline-block font-sans text-sm font-medium tracking-widest uppercase text-wwf-orange"
          >
            {label}
          </span>
        </div>

        {/* Full 레이아웃 (이미지 위 → 텍스트 아래) */}
        {isFullLayout && firstImage && (
          <div className="space-y-12">
            <div className="overflow-hidden rounded-2xl">
              <NarrativeImage
                src={firstImage.src}
                alt={firstImage.alt}
                caption={firstImage.caption}
                layout="full"
              />
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <h2
                data-testid={`narrative-heading-${type}`}
                className="font-serif text-3xl md:text-4xl text-wwf-black mb-6 leading-tight"
              >
                {section.heading}
              </h2>
              <p className="font-sans text-lg leading-relaxed text-wwf-dark-gray">
                {section.body}
              </p>
            </div>
          </div>
        )}

        {/* Half 레이아웃 (이미지-텍스트 좌우 교차) */}
        {isHalfLayout && firstImage && (
          <div
            className={cn(
              'flex flex-col md:flex-row items-center gap-12 md:gap-16',
              !isEven && 'md:flex-row-reverse'
            )}
          >
            {/* 이미지 */}
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl">
              <NarrativeImage
                src={firstImage.src}
                alt={firstImage.alt}
                caption={firstImage.caption}
                layout="half"
              />
            </div>

            {/* 텍스트 */}
            <div className="w-full md:w-1/2">
              <h2
                data-testid={`narrative-heading-${type}`}
                className="font-serif text-3xl md:text-4xl text-wwf-black mb-6 leading-tight"
              >
                {section.heading}
              </h2>
              <p className="font-sans text-lg leading-relaxed text-wwf-dark-gray mb-8">
                {section.body}
              </p>

              {/* activities 목록 (action 타입) */}
              {type === 'action' && section.activities && section.activities.length > 0 && (
                <ul
                  data-testid="narrative-activities"
                  className="space-y-3"
                  aria-label="주요 활동 목록"
                >
                  {section.activities.map((activity) => (
                    <li
                      key={activity}
                      className="flex items-start gap-3 font-sans text-base text-wwf-dark-gray"
                    >
                      <CheckCircle2
                        className="w-5 h-5 text-wwf-orange flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Inset 레이아웃 (텍스트 안에 이미지 float) */}
        {isInsetLayout && firstImage && (
          <div className="max-w-3xl mx-auto">
            <h2
              data-testid={`narrative-heading-${type}`}
              className="font-serif text-3xl md:text-4xl text-wwf-black mb-6 leading-tight text-center"
            >
              {section.heading}
            </h2>
            <div className="clearfix">
              <div className="mb-4 md:float-right md:ml-8 md:mb-4 overflow-hidden rounded-xl w-full md:max-w-xs">
                <NarrativeImage
                  src={firstImage.src}
                  alt={firstImage.alt}
                  caption={firstImage.caption}
                  layout="inset"
                />
              </div>
              <p className="font-sans text-lg leading-relaxed text-wwf-dark-gray">
                {section.body}
              </p>
            </div>
          </div>
        )}

        {/* 이미지 없는 경우 */}
        {!firstImage && (
          <div className="max-w-3xl mx-auto text-center">
            <h2
              data-testid={`narrative-heading-${type}`}
              className="font-serif text-3xl md:text-4xl text-wwf-black mb-6 leading-tight"
            >
              {section.heading}
            </h2>
            <p className="font-sans text-lg leading-relaxed text-wwf-dark-gray">
              {section.body}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
