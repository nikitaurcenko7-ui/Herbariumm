import React, { useState } from 'react'

export default function ForgotPassword({ navigate }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="auth-screen">
      <div className="panel auth-card">
        <h1 className="page-title">Восстановление</h1>
        <p className="muted mt-2 text-sm">Укажите email аккаунта. Мы покажем следующий шаг восстановления пароля.</p>
        <input className="mt-5" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        {sent && <p className="success-text">Если аккаунт найден, инструкция отправлена на почту.</p>}
        <button className="btn-primary mt-4 w-full" onClick={() => setSent(true)}>Восстановить пароль</button>
        <div className="auth-actions single"><button onClick={() => navigate('login')}>Вернуться ко входу</button></div>
      </div>
    </div>
  )
}
