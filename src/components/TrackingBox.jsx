import React, { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { api } from '../lib/api.js'

export default function TrackingBox({ initialValue = '' }) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTrackingNumber(initialValue || localStorage.getItem('herbarium_last_track') || '')
  }, [initialValue])

  const checkOrder = async () => {
    setError('')
    setResult(null)

    if (!trackingNumber.trim()) {
      setError('Введите трек-номер')
      return
    }

    setLoading(true)
    try {
      const data = await api('/track-order/', {
        method: 'POST',
        body: JSON.stringify({ tracking_number: trackingNumber }),
      })
      setResult(data.order)
      localStorage.setItem('herbarium_last_track', data.order.tracking_number)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CheckCircle2 className="mb-3 text-accent" />
      <h3 className="font-bold">Отслеживание заказа</h3>
      <p className="muted mt-2 text-sm">Введите трек-номер, чтобы узнать текущий статус доставки.</p>
      <input className="mt-3" placeholder="Введите трек-номер" value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
      <button className="btn-primary mt-2 w-full" onClick={checkOrder} disabled={loading}>
        {loading ? 'Проверяем...' : 'Проверить'}
      </button>
      {error && <p className="error-text">{error}</p>}
      {result && (
        <div className="track-status">
          <span>Заказ #{result.id}</span>
          <strong>{result.status}</strong>
          <small>{result.city ? `${result.city}, ` : ''}{result.created_at}</small>
        </div>
      )}
    </>
  )
}
