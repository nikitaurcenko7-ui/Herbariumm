import React from 'react'
import { User } from 'lucide-react'

export default function Profile({ user, navigate }) {
  if (!user) {
    return (
      <div className="panel mx-auto max-w-xl">
        <h1 className="page-title">Личный кабинет</h1>
        <p className="muted mt-2 text-sm">Войдите в аккаунт, чтобы видеть профиль и заказы.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('login')}>Войти</button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Личный кабинет</h1>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.3fr]">
        <div className="panel">
          <div className="flex items-center gap-3">
            <span className="avatar"><User /></span>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="muted text-sm">{user.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('catalog')} className="btn-primary mt-5 w-full">Повторить заказ</button>
          {user.is_admin && <button onClick={() => navigate('admin')} className="btn-ghost mt-2 w-full">Админ панель</button>}
        </div>

        <div className="panel profile-summary">
          <h2 className="font-bold">Мой профиль</h2>
          {[
            ['Статус', user.is_admin ? 'Администратор' : 'Покупатель'],
            ['Email', user.email || 'Не указан'],
            ['Сервис', 'Персональные условия и быстрый повтор заказа']
          ].map(([label, value]) => (
            <div className="profile-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
