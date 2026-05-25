import React, { useState } from 'react'
import { api } from '../lib/api.js'

export default function Checkout({ navigate, setCart, cart }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', comment: '' })
  const [error, setError] = useState('')

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async () => {
    setError('')
    try {
      await api('/orders/', { method: 'POST', body: JSON.stringify({ ...form, items: cart }) })
      setCart([])
      navigate('profile')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="panel">
        <h1 className="page-title">Оформление заказа</h1>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <input placeholder="Имя" value={form.name} onChange={(event) => update('name', event.target.value)} />
          <input placeholder="Телефон" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
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
