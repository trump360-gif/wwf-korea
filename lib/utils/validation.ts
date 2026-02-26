export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * 이름 검증: 2자 이상, 공백만으로 구성된 값 불가
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length < 2) {
    return { valid: false, message: "이름을 입력해주세요" };
  }
  return { valid: true };
}

/**
 * 이메일 형식 검증
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, message: "올바른 이메일 주소를 입력해주세요" };
  }
  return { valid: true };
}

/**
 * 연락처 검증: 숫자 10~11자리
 */
export function validatePhone(phone: string): ValidationResult {
  const digitsOnly = phone.replace(/\D/g, "");
  if (!digitsOnly || digitsOnly.length < 10 || digitsOnly.length > 11) {
    return { valid: false, message: "연락처를 입력해주세요" };
  }
  return { valid: true };
}

/**
 * 전화번호 자동 하이픈 포맷팅
 * @example formatPhoneNumber("01012345678") // "010-1234-5678"
 * @example formatPhoneNumber("0212345678")  // "02-1234-5678"
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  // 02 지역번호 (8~9자리)
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // 010, 011, 016, 017, 018, 019 등 11자리 휴대폰
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}
