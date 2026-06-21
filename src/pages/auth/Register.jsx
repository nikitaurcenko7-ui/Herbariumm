import React, { useState } from 'react'
import { api, normalizeUser } from '../../lib/api.js'
import { EMAIL_ERROR, isEmailValid } from '../../utils/validation.js'

export default function Register({ setUser, navigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (!isEmailValid(email)) {
      setError(EMAIL_ERROR)
      return
    }

    try {
      const data = await api('/register/', { method: 'POST', body: JSON.stringify({ name, email, password }) })
      const normalized = normalizeUser(data.user)
      setUser(normalized)
      localStorage.setItem('herbarium_user', JSON.stringify(normalized))
      navigate('profile')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-screen">
      <div className="panel auth-card">
        <h1 className="page-title">Регистрация</h1>
        <p className="muted mt-2 text-sm">Создайте аккаунт, чтобы сохранять заказы и быстрее оформлять покупки.</p>
        <input className="mt-5" placeholder="Имя" value={name} onChange={(event) => setName(event.target.value)} />
        <input className="mt-2" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="mt-2" placeholder="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary mt-4 w-full" onClick={submit}>Зарегистрироваться</button>
        <div className="auth-actions single"><button onClick={() => navigate('login')}>Уже есть аккаунт? Войти</button></div>
      </div>
    </div>
  )
}
