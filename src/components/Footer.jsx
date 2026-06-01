import React, { useState } from 'react'
import forestFooter from '../assets/forest-footer.png'

export default function Footer({ navigate, user }) {
  const [sent, setSent] = useState(false)
  const [authError, setAuthError] = useState(false)
  const contactValue = user ? [user.name, user.email].filter(Boolean).join(', ') : ''

  const submitSupplyRequest = () => {
    if (!user) {
      setSent(false)
      setAuthError(true)
      window.setTimeout(() => navigate('login'), 700)
      return
    }

    setAuthError(false)
    setSent(true)
  }

  return (
    <footer className="footer">
      <img src={forestFooter} alt="" />
      <div className="footer-overlay" />
      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1fr_1.1fr]">
        <div className="footer-copy">
          <h2 className="text-2xl font-extrabold">Herbarium</h2>
          <p className="mt-3 max-w-md text-sm">Натуральные травяные сборы для розницы и бизнеса. Отправляем по России, помогаем подобрать состав и формат поставки.</p>
          <p className="mt-4 text-sm">Телефон: +7 (800) 700-12-30<br />Email: help@herbarium.ru<br />Время ответа: 10:00-19:00 (МСК)</p>
        </div>
        <form id="supply-form" className="panel">
          <h3 className="font-bold">Заявка на крупную поставку</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input placeholder="Компания или ИП" />
            <input placeholder="Телефон" />
            <input key={contactValue || 'guest-contact'} placeholder="Контакт" defaultValue={contactValue} />
            <input placeholder="Плановый объем в месяц" />
          </div>
          <textarea className="mt-2" placeholder="Комментарий: ассортимент, фасовка и доставка" />
          <button type="button" onClick={submitSupplyRequest} className="btn-primary mt-3 w-full">
            {user ? 'Отправить заявку' : 'Войти, чтобы отправить заявку'}
          </button>
          {authError && <p className="error-text">Для отправки оптовой заявки нужно войти в аккаунт.</p>}
          {sent && <p className="success-text">Заявка принята. Мы свяжемся по указанным контактам.</p>}
        </form>
      </div>
    </footer>
  )
}
