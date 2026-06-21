export function isEmailValid(email) {
  return String(email || '').trim().includes('@')
}

export function isPhoneValid(phone) {
  const value = String(phone || '').trim()
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && /^[\d\s()+-]+$/.test(value)
}

export const EMAIL_ERROR = 'Укажите корректный email с символом @'
export const PHONE_ERROR = 'Укажите корректный номер телефона'
