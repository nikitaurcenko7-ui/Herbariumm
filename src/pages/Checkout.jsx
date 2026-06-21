import React, { useState } from 'react'
import { api } from '../lib/api.js'
import { isPhoneValid, PHONE_ERROR } from '../utils/validation.js'

function saveOrderTrack(trackingNumber) {
  try {
    const current = JSON.parse(localStorage.getItem('herbarium_order_tracks') || '[]')
    const next = [trackingNumber, ...current.filter((item) => item !== trackingNumber)].slice(0, 20)
    localStorage.setItem('herbarium_order_tracks', JSON.stringify(next))
    localStorage.setItem('herbarium_last_track', trackingNumber)
  } catch {
    localStorage.setItem('herbarium_last_track', trackingNumber)
  }
}

export default function Checkout({ navigate, setCart, cart, user }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', comment: '' })
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async () => {
    setError('')
    if (!isPhoneValid(form.phone)) {
      setError(PHONE_ERROR)
      return
    }

    try {
      const data = await api('/orders/', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          items: cart,
          user_id: user?.id,
          user_name: user?.name,
          user_email: user?.email,
        }),
      })
      saveOrderTrack(data.tracking_number)
      setOrder(data)
      setCart([])
    } catch (err) {
      setError(err.message)
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="panel">
          <h1 className="page-title">Заказ оформлен</h1>
          <p className="muted mt-2 text-sm">Сохраните трек-номер, по нему можно проверить статус доставки.</p>
          <div className="track-result mt-5">
            <span>Номер заказа</span>
            <strong>#{order.order_id}</strong>
          </div>
          <div className="track-result mt-2">
            <span>Трек-номер</span>
            <strong>{order.tracking_number}</strong>
          </div>
          <button className="btn-primary mt-4 w-full" onClick={() => navigate('profile')}>Перейти в кабинет</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="panel">
        <h1 className="page-title">Оформление заказа</h1>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <input placeholder="Имя" value={form.name} onChange={(event) => update('name', event.target.value)} />
          <input type="tel" placeholder="Телефон" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
          <input placeholder="Город" value={form.city} onChange={(event) => update('city', event.target.value)} />
          <input placeholder="Адрес или ПВЗ" value={form.address} onChange={(event) => update('address', event.target.value)} />
        </div>
        <textarea className="mt-2" placeholder="Комментарий к заказу" value={form.comment} onChange={(event) => update('comment', event.target.value)} />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary mt-4 w-full" onClick={submit}>Подтвердить заказ</button>
      </div>
    </div>
  )
}
