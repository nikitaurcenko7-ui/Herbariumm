import React, { useEffect, useMemo, useState } from 'react'
import { User } from 'lucide-react'
import TrackingBox from '../components/TrackingBox.jsx'
import { api } from '../lib/api.js'

function getStoredTracks() {
  try {
    return JSON.parse(localStorage.getItem('herbarium_order_tracks') || '[]')
  } catch {
    const lastTrack = localStorage.getItem('herbarium_last_track')
    return lastTrack ? [lastTrack] : []
  }
}

export default function Profile({ user, navigate }) {
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    if (!user) return

    setOrdersLoading(true)
    setOrdersError('')
    api(`/orders/?user_id=${encodeURIComponent(user.id || '')}&user_email=${encodeURIComponent(user.email || '')}`)
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setOrdersError(err.message))
      .finally(() => setOrdersLoading(false))
  }, [user])

  const profileOrders = useMemo(() => {
    const storedTracks = getStoredTracks()
    const knownTracks = new Set(orders.map((order) => order.tracking_number).filter(Boolean))
    const storedOrders = storedTracks
      .filter((track) => track && !knownTracks.has(track))
      .map((track) => ({
        id: track,
        tracking_number: track,
        status: 'Трек сохранен',
        created_at: '',
        items_count: 0,
        total: 0,
      }))

    return [...orders, ...storedOrders]
  }, [orders])

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
          <div className="mt-3">
            <TrackingBox />
          </div>
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

        <div className="panel profile-orders md:col-span-2">
          <h2 className="font-bold">Мои заказы</h2>
          {ordersLoading && <p className="muted mt-2 text-sm">Загружаем заказы...</p>}
          {ordersError && <p className="error-text">{ordersError}</p>}
          {!ordersLoading && !ordersError && profileOrders.length === 0 && (
            <p className="muted mt-2 text-sm">Заказов пока нет.</p>
          )}
          <div className="order-history-list">
            {profileOrders.map((order) => (
              <div className="order-history-card" key={`${order.id}-${order.tracking_number}`}>
                <div>
                  <span>Заказ #{order.id}</span>
                  <strong>{order.tracking_number || 'Трек не указан'}</strong>
                  <small>{order.status}{order.created_at ? ` · ${order.created_at}` : ''}</small>
                </div>
                <div className="order-history-meta">
                  {order.items_count > 0 && <span>{order.items_count} шт.</span>}
                  {order.total > 0 && <strong>{order.total} ₽</strong>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
