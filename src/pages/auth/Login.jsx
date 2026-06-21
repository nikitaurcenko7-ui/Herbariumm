import React, { useState } from 'react'
import { api, normalizeUser } from '../../lib/api.js'
import { EMAIL_ERROR, isEmailValid } from '../../utils/validation.js'

export default function Login({ setUser, navigate }) {
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
      const data = await api('/login/', { method: 'POST', body: JSON.stringify({ email, password }) })
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
        <h1 className="page-title">Вход в кабинет</h1>
        <input className="mt-5" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="mt-2" placeholder="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary mt-4 w-full" onClick={submit}>Войти</button>
        <div className="auth-actions">
          <button onClick={() => navigate('register')}>Регистрация</button>
          <button onClick={() => navigate('forgot')}>Забыли пароль?</button>
        </div>
      </div>
    </div>
  )
}
