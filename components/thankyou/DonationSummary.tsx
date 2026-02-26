import { formatCurrency } from '@/lib/utils/formatCurrency'

interface DonationSummaryProps {
  donorName: string
  amount: number
  donationType: 'monthly' | 'onetime'
  missions: { name: string; percentage: number }[]
  date: string
}

export default function DonationSummary({
  donorName,
  amount,
  donationType,
  missions,
  date,
}: DonationSummaryProps) {
  const typeLabel = donationType === 'monthly' ? '월정기 후원' : '일시 후원'

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
      {/* 기부자 이름 */}
      <h2 className="font-serif text-2xl font-bold text-wwf-black">
        {donorName} 님의 후원
      </h2>

      {/* 후원 유형 + 금액 */}
      <div className="space-y-1">
        <p className="text-sm text-wwf-light-gray">{typeLabel}</p>
        <p className="text-3xl font-bold text-wwf-orange">
          {formatCurrency(amount)}
        </p>
      </div>

      {/* 구분선 */}
      <hr className="border-gray-100" />

      {/* 미션별 배분 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-wwf-dark-gray uppercase tracking-wide">
          후원 배분
        </h3>
        <ul className="space-y-2">
          {missions.map((mission) => (
            <li
              key={mission.name}
              className="flex items-center justify-between"
            >
              <span className="text-wwf-dark-gray">{mission.name}</span>
              <span className="text-sm font-medium text-wwf-light-gray">
                {mission.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 구분선 */}
      <hr className="border-gray-100" />

      {/* 날짜 */}
      <p className="text-sm text-wwf-light-gray">{date}</p>
    </div>
  )
}
