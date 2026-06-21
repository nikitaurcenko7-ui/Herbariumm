import React, { useEffect, useState } from 'react'

const CONSENT_KEY = 'herbarium_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(CONSENT_KEY) !== 'accepted')
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-label="Согласие на использование cookies">
      <div>
        <strong>Cookies и персональные данные</strong>
        <p>Сайт использует cookies и обрабатывает персональную информацию для работы сервиса.</p>
      </div>
      <button type="button" onClick={accept}>Согласен</button>
    </div>
  )
}
