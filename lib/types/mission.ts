export type MissionSlug =
  | 'climate-energy'
  | 'ocean'
  | 'wildlife'
  | 'food'
  | 'freshwater'
  | 'forest'

export interface NarrativeImage {
  src: string
  alt: string
  caption?: string
  layout: 'full' | 'half' | 'inset'
}

export interface NarrativeSection {
  heading: string
  body: string
  images: NarrativeImage[]
  activities?: string[]
}

export interface Stat {
  value: string
  unit: string
  label: string
}

export interface Mission {
  slug: MissionSlug
  name: string
  fullName: string
  subtitle: string
  description: string
  icon: string
  heroImage: string
  cardImage: string
  keywords: string[]
  narrative: {
    problem: NarrativeSection
    action: NarrativeSection
    appeal: NarrativeSection
  }
  stats: Stat[]
  impactMessage: string
  ctaMessage: string
}
