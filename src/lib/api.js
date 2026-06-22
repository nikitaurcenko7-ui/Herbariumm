export const API_BASE = 'https://herbariumm.onrender.com/api'

export function normalizeUser(user) {
  if (!user) return null
  return user.email === 'admin@herbarium.ru' ? { ...user, is_admin: true } : user
}

export async function api(path, options = {}) {
  let adminEmail = ''
  try {
    const storedUser = JSON.parse(localStorage.getItem('herbarium_user') || 'null')
    adminEmail = storedUser?.is_admin ? storedUser.email : ''
  } catch {
    adminEmail = ''
  }

  const adminQuery = adminEmail && path.startsWith('/admin/') ? `${path.includes('?') ? '&' : '?'}admin=${encodeURIComponent(adminEmail)}` : ''
  const response = await fetch(`${API_BASE}${path}${adminQuery}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Ошибка запроса')
  return data
}
