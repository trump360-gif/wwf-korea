interface ThankYouMessageProps {
  missionNames: string[]
}

export default function ThankYouMessage({ missionNames }: ThankYouMessageProps) {
  const primaryMission = missionNames[0] || '자연 보전'

  return (
    <div className="text-center space-y-4">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-wwf-black">
        감사합니다.
      </h1>
      <p className="font-serif text-xl text-wwf-dark-gray">
        당신의 마음이 {primaryMission}에 닿았습니다.
      </p>
    </div>
  )
}
