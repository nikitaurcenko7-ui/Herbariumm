export const ADMIN_LOGIN = 'admin@herbarium.ru'

export function normalizeEmailLogin(email) {
  return String(email || '').trim().toLowerCase()
}

export function isEmailValid(email) {
  const value = normalizeEmailLogin(email)

  const parts = value.split('@')
  if (parts.length !== 2) return false

  const [name, domain] = parts
  return Boolean(name && domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.'))
}

export function isPhoneValid(phone) {
  const value = String(phone || '').trim()
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && /^[\d\s()+-]+$/.test(value)
}

export const EMAIL_ERROR = 'Укажите корректный email с символом @ и точкой'
export const PHONE_ERROR = 'Укажите корректный номер телефона'
