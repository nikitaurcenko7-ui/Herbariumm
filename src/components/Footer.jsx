import React, { useState } from 'react'
import forestFooter from '../assets/forest-footer.png'
import { api } from '../lib/api.js'

export default function Footer({ navigate, user }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [authNotice, setAuthNotice] = useState(false)
  const contactValue = user ? [user.name, user.email].filter(Boolean).join(', ') : ''
  const [form, setForm] = useState({
    company: '',
    phone: '',
    contact: contactValue,
    volume: '',
    comment: '',
  })

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSent(false)
    setError('')
    setAuthNotice(false)
  }

  const submitSupplyRequest = async () => {
    if (!user) {
      setSent(false)
      setError('')
      setAuthNotice(true)
      window.setTimeout(() => navigate('register'), 900)
      return
    }

    setSending(true)
    setError('')
    try {
      await api('/supply-requests/', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          contact: form.contact || contactValue,
          user_email: user.email,
        }),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
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
            <input placeholder="Компания или ИП" value={form.company} onChange={(event) => setField('company', event.target.value)} />
            <input placeholder="Телефон" value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
            <input key={contactValue || 'guest-contact'} placeholder="Контакт" value={form.contact || contactValue} onChange={(event) => setField('contact', event.target.value)} />
            <input placeholder="Плановый объем в месяц" value={form.volume} onChange={(event) => setField('volume', event.target.value)} />
          </div>
          <textarea className="mt-2" placeholder="Комментарий: ассортимент, фасовка и доставка" value={form.comment} onChange={(event) => setField('comment', event.target.value)} />
          <button type="button" onClick={submitSupplyRequest} disabled={sending} className="btn-primary mt-3 w-full disabled:opacity-60">
            {sending ? 'Отправляем...' : 'Отправить заявку'}
          </button>
          {authNotice && <p className="error-text">Чтобы отправить оптовую заявку, зарегистрируйтесь или войдите в аккаунт.</p>}
          {error && <p className="error-text">{error}</p>}
          {sent && <p className="success-text">Заявка принята. Мы свяжемся по указанным контактам.</p>}
        </form>
      </div>
    </footer>
  )
}
