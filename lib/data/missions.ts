import type { Mission, MissionSlug } from '@/lib/types/mission'

export const missions: Mission[] = [
  {
    slug: 'climate-energy',
    name: '기후·에너지',
    fullName: '기후·에너지 보전',
    subtitle: '지구의 온도를 지키는 일',
    description: '탄소 감축과 재생에너지 전환으로 1.5°C 목표를 지킵니다.',
    icon: 'Sun',
    heroImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=800&fit=crop&q=80',
    keywords: ['1.5도 목표', '탄소 감축', '재생에너지 전환'],
    narrative: {
      problem: {
        heading: '지구가 보내는 경고',
        body: '산업화 이후 전 세계 온실가스 배출량은 꾸준히 증가해왔고, 그 결과 지구 평균 기온은 이미 1.1°C 이상 상승했습니다. 기온 상승이 1.5°C를 넘는 순간, 폭염·홍수·가뭄 같은 극한 기상 현상은 걷잡을 수 없이 가속될 것입니다. 지금 우리가 선택하는 에너지의 방향이 미래 세대가 살아갈 지구의 온도를 결정합니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1570358934836-6802981e481e?w=1920&h=1080&fit=crop&q=80',
            alt: '기후변화로 인한 빙하 녹음',
            caption: '빠르게 줄어드는 극지방 빙하',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 기후 행동',
        body: 'WWF-Korea는 어스아워 캠페인을 통해 전 국민이 기후 위기의 심각성을 직접 체감할 수 있는 자리를 만들어왔습니다. 기후행동 서포터즈 프로그램은 시민들이 일상에서 탄소를 줄이는 구체적인 실천을 이어가도록 돕고, 기후행동 라운드테이블은 기업과 정부, 시민사회가 함께 에너지 전환 방안을 논의하는 플랫폼이 되고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=720&h=540&fit=crop&q=80',
            alt: '어스아워 캠페인 현장',
            caption: '전 세계 180여 개국이 함께하는 어스아워',
            layout: 'half',
          },
        ],
        activities: ['어스아워 캠페인', '기후행동 서포터즈', '기후행동 라운드테이블'],
      },
      appeal: {
        heading: '에너지 전환, 지금 함께해주세요',
        body: '재생에너지로의 전환은 선택이 아니라 생존의 문제입니다. 당신의 후원 한 걸음이 정책을 바꾸고, 기업을 움직이며, 더 많은 시민이 기후행동에 동참하게 만드는 힘이 됩니다. 지구의 온도를 지키는 일에 함께해주세요.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=720&h=540&fit=crop&q=80',
            alt: '재생에너지 풍력발전',
            caption: '미래를 향한 에너지 전환',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '1.5',
        unit: '°C',
        label: '지구 온도 상승 목표',
      },
      {
        value: '1.1',
        unit: '°C',
        label: '현재 지구 평균 기온 상승',
      },
      {
        value: '180',
        unit: '개국',
        label: '어스아워 참여 국가',
      },
    ],
    impactMessage: '당신의 후원으로 지구의 온도를 지킵니다',
    ctaMessage: '기후 위기 대응에 함께해주세요',
  },
  {
    slug: 'ocean',
    name: '해양',
    fullName: '해양 보전',
    subtitle: '바다가 보내는 조용한 신호',
    description: '불법어업과 플라스틱 오염으로부터 해양 생태계를 지킵니다.',
    icon: 'Waves',
    heroImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=800&fit=crop&q=80',
    keywords: ['해양 생태계', '플라스틱 오염', '불법어업'],
    narrative: {
      problem: {
        heading: '침묵하는 바다',
        body: '전 세계 어획량의 12~30%가 불법·비보고·비규제(IUU) 어업에서 비롯된 것으로 추정됩니다. 여기에 매년 800만 톤 이상의 플라스틱 쓰레기가 바다로 흘러들어 해양 생물의 생존을 위협합니다. 눈에 보이지 않는 해저 깊숙이까지 쌓인 침적 어구와 해양 쓰레기는 바다 생태계를 천천히 무너뜨리고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop&q=80',
            alt: '해양 플라스틱 오염',
            caption: '바다로 흘러드는 플라스틱 쓰레기',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 바다 보호 활동',
        body: 'WWF-Korea는 바닷속에 버려진 침적 어구를 수거하고, 바다거북과 상어 같은 취약 해양 생물의 서식지를 보호하는 활동을 이어가고 있습니다. 해안 정화 캠페인을 통해 시민들이 직접 쓰레기를 줍고 바다와 연결되는 경험을 만들어가고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=720&h=540&fit=crop&q=80',
            alt: '침적 어구 수거 활동',
            caption: '바닷속 침적 어구를 수거하는 활동',
            layout: 'half',
          },
        ],
        activities: ['침적 어구 수거', '바다거북 서식지 보호', '해안 정화 캠페인'],
      },
      appeal: {
        heading: '바다를 되살리는 일에 함께해주세요',
        body: '건강한 바다는 지구 산소의 절반을 만들어내고, 수십억 명의 식량을 책임집니다. 바다를 지키는 일은 곧 우리 자신을 지키는 일입니다. 당신의 후원이 해양 생태계 회복의 첫걸음이 됩니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=720&h=540&fit=crop&q=80',
            alt: '건강한 산호초 생태계',
            caption: '다양한 생명이 살아가는 건강한 바다',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '1,600',
        unit: 'kg',
        label: '수거된 해양 쓰레기',
      },
      {
        value: '12~30',
        unit: '%',
        label: '전 세계 불법어업 비율',
      },
      {
        value: '800',
        unit: '만 톤',
        label: '매년 바다로 유입되는 플라스틱',
      },
    ],
    impactMessage: '당신의 후원으로 해양 생태계가 보호됩니다',
    ctaMessage: '바다의 내일을 함께 지켜주세요',
  },
  {
    slug: 'wildlife',
    name: '야생동물',
    fullName: '야생동물 보전',
    subtitle: '함께 살아가는 이웃들',
    description: '멸종위기 야생동물의 서식지를 보호하고 생물다양성을 지킵니다.',
    icon: 'PawPrint',
    heroImage: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=800&fit=crop&q=80',
    keywords: ['멸종위기종', '서식지 보호', '생물다양성'],
    narrative: {
      problem: {
        heading: '사라져 가는 이웃들',
        body: '국내에서만 282종의 야생동물이 멸종위기에 처해 있습니다. 서식지 파괴와 기후변화, 불법 포획이 맞물리며 동물들은 설 자리를 잃어가고 있습니다. 한번 끊어진 생태계의 연결고리는 복원하는 데 수십 년이 걸리고, 어떤 종은 영영 돌아오지 못합니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=1920&h=1080&fit=crop&q=80',
            alt: '멸종위기 두루미',
            caption: '철원 DMZ에서 겨울을 나는 두루미',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 야생동물 보전 활동',
        body: 'WWF-Korea는 유네스코 생물권보전지역으로 지정된 광릉숲의 생물다양성 증진 활동을 벌이고, 철원 DMZ에서 겨울을 나는 두루미의 서식지를 보전하는 데 힘을 쏟고 있습니다. 애니스테이 캠페인을 통해 사람들이 야생동물의 삶과 더 가깝게 연결되도록 돕고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=720&h=540&fit=crop&q=80',
            alt: '광릉숲 생물다양성',
            caption: '광릉숲에서 살아가는 다양한 생명들',
            layout: 'half',
          },
        ],
        activities: ['애니스테이 캠페인', 'DMZ 두루미 서식지 보전', '광릉숲 생물다양성 증진'],
      },
      appeal: {
        heading: '그들의 자리를 지켜주세요',
        body: '야생동물은 우리와 지구를 함께 나눠 쓰는 이웃입니다. 한 종이 사라지면 그것이 연결된 수많은 생명이 흔들립니다. 당신의 후원이 그들의 서식지를 지키고, 끊어진 생태계를 잇는 다리가 됩니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=720&h=540&fit=crop&q=80',
            alt: '야생동물 서식지 보전',
            caption: '보전된 서식지에서 살아가는 야생동물',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '282',
        unit: '종',
        label: '국내 멸종위기 야생동물',
      },
      {
        value: '1',
        unit: '만 마리',
        label: 'DMZ 월동 두루미 개체수',
      },
    ],
    impactMessage: '당신의 후원으로 야생동물의 서식지가 지켜집니다',
    ctaMessage: '야생동물의 내일을 함께 만들어주세요',
  },
  {
    slug: 'food',
    name: '식량',
    fullName: '식량 시스템 전환',
    subtitle: '내일의 식탁을 위하여',
    description: '지속가능한 농업과 식량 시스템 전환으로 지구와 사람 모두를 살립니다.',
    icon: 'Wheat',
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&h=800&fit=crop&q=80',
    keywords: ['지속가능한 식량', '농업 전환', '식량 안보'],
    narrative: {
      problem: {
        heading: '식탁 위의 환경 위기',
        body: '현재의 식량 시스템은 전 세계 온실가스 배출의 약 30%를 차지하며 토지와 물, 생물다양성에 막대한 압력을 가하고 있습니다. 대규모 단일 작물 재배와 과도한 화학비료 사용은 토양을 황폐화시키고, 농업용 물 사용은 담수 자원을 고갈시킵니다. 지금의 방식으로는 증가하는 인구를 지속적으로 먹여 살릴 수 없습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop&q=80',
            alt: '농업과 환경',
            caption: '식량 생산이 환경에 미치는 영향',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 식량 시스템 전환 활동',
        body: 'WWF-Korea는 지속가능한 농업 방식을 확산하고, 음식물 낭비를 줄이며, 친환경 소비를 일상화하는 캠페인을 이어가고 있습니다. 기업과의 협력을 통해 공급망 전반에서 환경 영향을 줄이는 방향으로의 전환을 촉진합니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=720&h=540&fit=crop&q=80',
            alt: '지속가능한 농업',
            caption: '지속가능한 방식으로 가꾸는 농지',
            layout: 'half',
          },
        ],
        activities: ['지속가능한 농업 확산', '음식물 낭비 감소 캠페인', '기업 공급망 개선 협력'],
      },
      appeal: {
        heading: '내일의 식탁을 위해 지금 행동해주세요',
        body: '우리가 먹는 음식 하나하나가 지구에 영향을 줍니다. 식량 시스템의 전환은 기후를 안정시키고, 생물다양성을 되살리며, 미래 세대가 충분히 먹을 수 있는 세상을 만드는 일입니다. 내일의 식탁을 지키는 일에 함께해주세요.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=720&h=540&fit=crop&q=80',
            alt: '지속가능한 식탁',
            caption: '지구와 함께하는 지속가능한 식탁',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '30',
        unit: '%',
        label: '식량 시스템의 환경 영향',
      },
      {
        value: '1/3',
        unit: '',
        label: '전 세계 생산 식량 중 낭비 비율',
      },
    ],
    impactMessage: '당신의 후원으로 지속가능한 식량 시스템을 만듭니다',
    ctaMessage: '지속가능한 미래 식탁에 함께해주세요',
  },
  {
    slug: 'freshwater',
    name: '담수',
    fullName: '담수 보전',
    subtitle: '생명이 흐르는 곳',
    description: '하천과 습지를 보전하고 수달 같은 담수 생물의 서식지를 지킵니다.',
    icon: 'Droplets',
    heroImage: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop&q=80',
    keywords: ['하천·습지 보전', '수자원 보호', '담수 생태계'],
    narrative: {
      problem: {
        heading: '마르고 사라지는 강',
        body: '1970년 이후 담수 생물 개체수는 전 세계적으로 83% 감소한 것으로 나타납니다. 댐 건설, 하천 오염, 무분별한 지하수 개발이 강과 습지를 빠르게 황폐화시키고 있습니다. 담수 생태계는 지구 전체 생물종의 10%가 살아가는 중요한 보금자리이지만, 육상과 해양 서식지에 비해 훨씬 빠른 속도로 사라지고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop&q=80',
            alt: '하천 생태계',
            caption: '생명이 살아 숨 쉬는 강과 습지',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 담수 보전 활동',
        body: 'WWF-Korea는 수달이 서식하는 하천의 쓰레기를 정화하고, 수달과 물새들이 쉬어갈 수 있는 인공섬 쉼터를 설치하는 활동을 이어가고 있습니다. 하천 생태계 모니터링과 시민 참여 프로그램을 통해 담수 환경 보전의 중요성을 알리고 있습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=720&h=540&fit=crop&q=80',
            alt: '수달 서식지 보호',
            caption: '하천 정화 활동과 수달 서식지 복원',
            layout: 'half',
          },
        ],
        activities: ['수달 서식지 하천 정화', '인공섬 쉼터 설치', '담수 생태계 모니터링'],
      },
      appeal: {
        heading: '맑은 물과 생명을 이어주세요',
        body: '강은 생명이 흐르는 길입니다. 건강한 담수 생태계는 깨끗한 식수를 보장하고, 홍수를 조절하며, 수천 종의 생물이 살아갈 수 있는 환경을 만듭니다. 당신의 후원이 강과 습지를 살리고, 그 안에서 숨 쉬는 모든 생명을 지킵니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=720&h=540&fit=crop&q=80',
            alt: '건강한 담수 생태계',
            caption: '보전된 하천에서 살아가는 수달',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '83',
        unit: '%',
        label: '감소한 담수 생물 개체수',
      },
      {
        value: '10',
        unit: '%',
        label: '담수 생태계에 사는 지구 생물 비율',
      },
    ],
    impactMessage: '당신의 후원으로 맑은 물과 생명이 이어집니다',
    ctaMessage: '강과 습지를 살리는 일에 함께해주세요',
  },
  {
    slug: 'forest',
    name: '산림',
    fullName: '산림 보전',
    subtitle: '숲이 들려주는 이야기',
    description: '산림 보전과 생태계 복원으로 지구의 허파를 지킵니다.',
    icon: 'TreePine',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop&q=80',
    cardImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=800&fit=crop&q=80',
    keywords: ['산림 보전', '생태계 복원', '탄소 흡수'],
    narrative: {
      problem: {
        heading: '사라지는 숲',
        body: '매년 전 세계에서 4.8백만 헥타르의 산림이 사라지고 있습니다. 농지 개간과 도시화, 불법 벌목이 맞물리며 지구의 허파가 빠르게 줄어들고 있습니다. 숲은 탄소를 흡수하고 기후를 조절하며 수백만 종의 생물이 살아가는 터전이지만, 한번 사라진 원시림은 수백 년이 지나도 완전히 되살아나기 어렵습니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&h=1080&fit=crop&q=80',
            alt: '산림 벌채',
            caption: '빠르게 사라지는 지구의 숲',
            layout: 'full',
          },
        ],
      },
      action: {
        heading: 'WWF의 산림 보전 활동',
        body: 'WWF-Korea는 유네스코 생물권보전지역으로 지정된 광릉숲의 생물다양성 증진 활동과 희귀·특산식물 보호 사업을 이어가고 있습니다. 지속가능한 산림 경영 원칙이 현장에서 실현될 수 있도록 정책 제안과 현장 활동을 병행합니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=720&h=540&fit=crop&q=80',
            alt: '광릉숲 생태계',
            caption: '유네스코 생물권보전지역 광릉숲',
            layout: 'half',
          },
        ],
        activities: ['광릉숲 생물다양성 증진', '희귀·특산식물 보호', '지속가능한 산림 경영 정책 제안'],
      },
      appeal: {
        heading: '숲이 다시 숨 쉬도록 함께해주세요',
        body: '건강한 숲은 우리가 마시는 공기를 만들고, 물을 정화하며, 기후변화를 완화하는 가장 강력한 자연의 힘입니다. 당신의 후원이 사라져가는 숲을 지키고, 생태계를 복원하며, 다음 세대에게 살아있는 지구를 물려주는 일이 됩니다.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=720&h=540&fit=crop&q=80',
            alt: '울창한 산림',
            caption: '보전된 숲에서 살아가는 생명들',
            layout: 'inset',
          },
        ],
      },
    },
    stats: [
      {
        value: '4.8',
        unit: '백만 ha',
        label: '매년 사라지는 산림 면적',
      },
      {
        value: '80',
        unit: '%',
        label: '육상 생물의 숲 의존도',
      },
    ],
    impactMessage: '당신의 후원으로 숲이 다시 숨 쉽니다',
    ctaMessage: '지구의 허파를 지키는 일에 함께해주세요',
  },
]

export function getMissionBySlug(slug: MissionSlug): Mission | undefined {
  return missions.find((mission) => mission.slug === slug)
}
