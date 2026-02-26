import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// ────────────────────────────────────────────────────────────────────────────
// 폰트 등록 (URL 기반 — Vercel 서버리스 호환)
// ────────────────────────────────────────────────────────────────────────────

let fontsRegistered = false

/** route handler에서 baseUrl을 전달받아 폰트를 등록합니다. */
export function registerFonts(baseUrl: string) {
  if (fontsRegistered) return
  Font.register({
    family: 'NotoSansKR',
    fonts: [
      { src: `${baseUrl}/fonts/NotoSansKR-Regular.ttf`, fontWeight: 400 },
      { src: `${baseUrl}/fonts/NotoSansKR-Bold.ttf`, fontWeight: 700 },
    ],
  })
  fontsRegistered = true
}

// ────────────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────────────

interface CertificateProps {
  donorName: string
  amount: string
  donationType: string
  missions: string[]
  date: string
  impactMessage: string
  certificateNumber: string
  logoUrl: string
}

// ────────────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'NotoSansKR',
  },

  // 상단 로고
  logoSection: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoImage: {
    width: 50,
    height: 75,
  },
  logoSubText: {
    fontSize: 10,
    letterSpacing: 6,
    color: '#333333',
    fontFamily: 'NotoSansKR',
  },

  // 구분선
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  dividerThick: {
    height: 2,
    backgroundColor: '#FF6B00',
    marginVertical: 24,
  },

  // 제목
  title: {
    fontSize: 28,
    fontWeight: 700,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 40,
    fontFamily: 'NotoSansKR',
  },

  // 수신자
  recipientSection: {
    marginBottom: 24,
  },
  recipientName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#000000',
    fontFamily: 'NotoSansKR',
  },
  recipientSuffix: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
    fontFamily: 'NotoSansKR',
  },

  // 감사 메시지
  gratitudeText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 1.8,
    marginBottom: 32,
    fontFamily: 'NotoSansKR',
  },

  // 후원 정보 테이블
  infoSection: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    width: 100,
    fontSize: 10,
    color: '#999999',
    letterSpacing: 1,
    fontFamily: 'NotoSansKR',
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
    fontFamily: 'NotoSansKR',
  },

  // 임팩트 메시지
  impactSection: {
    backgroundColor: '#FFF8F0',
    padding: 20,
    borderRadius: 4,
    marginBottom: 32,
  },
  impactText: {
    fontSize: 11,
    color: '#FF6B00',
    textAlign: 'center',
    lineHeight: 1.6,
    fontFamily: 'NotoSansKR',
  },

  // 하단 기증서 번호
  footerSection: {
    marginTop: 'auto',
  },
  certificateNumber: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'NotoSansKR',
  },
  footerOrg: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'NotoSansKR',
  },
})

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function CertificateTemplate({
  donorName,
  amount,
  donationType,
  missions,
  date,
  impactMessage,
  certificateNumber,
  logoUrl,
}: CertificateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 상단 로고 */}
        <View style={styles.logoSection}>
          <Image src={logoUrl} style={styles.logoImage} />
          <Text style={styles.logoSubText}>KOREA</Text>
        </View>

        {/* 구분선 (오렌지) */}
        <View style={styles.dividerThick} />

        {/* 제목 */}
        <Text style={styles.title}>후원 기증서</Text>

        {/* 수신자 */}
        <View style={styles.recipientSection}>
          <Text style={styles.recipientName}>{donorName} 님께</Text>
          <Text style={styles.recipientSuffix}>
            소중한 후원에 진심으로 감사드립니다.
          </Text>
        </View>

        {/* 감사 인사 */}
        <Text style={styles.gratitudeText}>
          귀하의 따뜻한 후원은 지구의 자연환경과 야생동물을 보호하는 데 큰 힘이 됩니다.
          WWF-Korea는 귀하의 지지를 바탕으로 더 나은 지구를 만들기 위해 최선을 다하겠습니다.
        </Text>

        {/* 후원 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>후원 금액</Text>
            <Text style={styles.infoValue}>{amount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>후원 유형</Text>
            <Text style={styles.infoValue}>{donationType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>후원 분야</Text>
            <Text style={styles.infoValue}>{missions.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>후원 일자</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>
        </View>

        {/* 임팩트 메시지 */}
        <View style={styles.impactSection}>
          <Text style={styles.impactText}>{impactMessage}</Text>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 하단 */}
        <View style={styles.footerSection}>
          <Text style={styles.certificateNumber}>
            기증서 번호: {certificateNumber}
          </Text>
          <Text style={styles.footerOrg}>
            WWF-Korea {'\u00B7'} wwfkorea.or.kr
          </Text>
        </View>
      </Page>
    </Document>
  )
}
