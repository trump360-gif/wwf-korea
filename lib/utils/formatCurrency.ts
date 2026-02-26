/**
 * 숫자를 한국 원화 형식으로 포맷팅
 * @example formatCurrency(10000) // "10,000원"
 * @example formatCurrency(50000) // "50,000원"
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 숫자를 만원 단위 텍스트로 변환
 * @example formatAmountLabel(10000)  // "1만원"
 * @example formatAmountLabel(50000)  // "5만원"
 * @example formatAmountLabel(100000) // "10만원"
 */
export function formatAmountLabel(amount: number): string {
  const manWon = amount / 10000;
  return `${manWon}만원`;
}
