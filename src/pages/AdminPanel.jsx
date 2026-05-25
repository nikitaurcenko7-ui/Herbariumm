import React, { useEffect, useMemo, useState } from 'react'
import { BarChart3, Boxes, ShieldCheck, Trash2 } from 'lucide-react'

const emptyProduct = {
  title: '',
  category: 'Травяные сборы',
  form: 'Пакет',
  price: 0,
  popular: false,
  tone: 'from-lime-200 to-emerald-500',
  image_url: '',
  description: ''
}

export default function AdminPanel({ api, navigate, refreshProducts, user }) {
  const [tab, setTab] = useState('analytics')
  const [analyticsTab, setAnalyticsTab] = useState('online')
  const [summary, setSummary] = useState(null)
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [message, setMessage] = useState('')

  const loadAdminData = async () => {
    setMessage('')
    const [summaryData, productsData, usersData] = await Promise.all([
      api('/admin/summary/'),
      api('/admin/products/'),
      api('/admin/users/')
    ])
    setSummary(summaryData)
    setProducts(productsData.products)
    setUsers(usersData.users)
  }

  useEffect(() => {
    loadAdminData().catch(() => setMessage('Нет доступа к админ-панели'))
  }, [])

  const maxChart = useMemo(() => Math.max(...(summary?.chart || []).map((item) => item.value), 1), [summary])
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const createProduct = async () => {
    const data = await api('/admin/products/', { method: 'POST', body: JSON.stringify(form) })
    setProducts((current) => [...current, data.product])
    setForm(emptyProduct)
    refreshProducts()
    setMessage('Товар добавлен на сайт')
  }

  const deleteProduct = async (id) => {
    await api(`/admin/products/${id}/`, { method: 'DELETE' })
    setProducts((current) => current.filter((product) => product.id !== id))
    refreshProducts()
    setMessage('Товар удален')
  }

  const toggleAdmin = async (target) => {
    const data = await api('/admin/users/', {
      method: 'POST',
      body: JSON.stringify({ user_id: target.id, is_admin: !target.is_admin })
    })
    setUsers((current) => current.map((item) => item.id === target.id ? data.user : item))
  }

  if (!user?.is_admin) {
    return (
      <div className="panel admin-denied">
        <h1 className="page-title">Доступ закрыт</h1>
        <p className="muted mt-2">Эта страница доступна только администраторам.</p>
        <button className="btn-primary mt-4" onClick={() => navigate('profile')}>Вернуться в кабинет</button>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Herbarium admin</p>
          <h1 className="page-title">Панель управления</h1>
        </div>
        <button className="btn-ghost" onClick={() => navigate('profile')}>В кабинет</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'analytics' ? 'active' : ''} onClick={() => setTab('analytics')}><BarChart3 size={18} /> Аналитика</button>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><Boxes size={18} /> Товары</button>
        <button className={tab === 'admins' ? 'active' : ''} onClick={() => setTab('admins')}><ShieldCheck size={18} /> Админы</button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {tab === 'analytics' && summary && (
        <section className="admin-analytics">
          <div className="analytics-subtabs">
            <button className={analyticsTab === 'online' ? 'active' : ''} onClick={() => setAnalyticsTab('online')}>Онлайн и пользователи</button>
            <button className={analyticsTab === 'sales' ? 'active' : ''} onClick={() => setAnalyticsTab('sales')}>Продажи и выручка</button>
          </div>

          {analyticsTab === 'online' && (
            <div className="admin-grid">
              {[
                ['Сейчас онлайн', summary.stats.online],
                ['Пользователи', summary.stats.users],
                ['Товаров в каталоге', summary.stats.products]
              ].map(([label, value]) => <div className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
              <div className="panel admin-chart">
                <h2>Онлайн-активность за 7 дней</h2>
                <div className="chart-bars">
                  {summary.chart.map((item) => (
                    <div key={item.label} style={{ '--h': `${Math.max(10, (item.value / maxChart) * 100)}%` }}>
                      <span />
                      <small>{item.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {analyticsTab === 'sales' && (
            <div className="admin-grid">
              {[
                ['Заказы', summary.stats.orders],
                ['Куплено товаров', summary.stats.purchases],
                ['Выручка', `${summary.stats.revenue} ₽`],
                ['Средний чек', `${summary.stats.orders ? Math.round(summary.stats.revenue / summary.stats.orders) : 0} ₽`]
              ].map(([label, value]) => <div className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
              <div className="panel admin-chart">
                <h2>Заказы за последние 7 дней</h2>
                <div className="chart-bars">
                  {summary.chart.map((item) => (
                    <div key={item.label} style={{ '--h': `${Math.max(10, (item.value / maxChart) * 100)}%` }}>
                      <span />
                      <small>{item.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === 'products' && (
        <section className="admin-products">
          <div className="panel admin-form">
            <h2>Добавить товар</h2>
            <input placeholder="Название" value={form.title} onChange={(event) => setField('title', event.target.value)} />
            <input placeholder="Категория" value={form.category} onChange={(event) => setField('category', event.target.value)} />
            <input placeholder="Форма" value={form.form} onChange={(event) => setField('form', event.target.value)} />
            <input placeholder="Цена" type="number" value={form.price} onChange={(event) => setField('price', Number(event.target.value))} />
            <input placeholder="Картинка товара URL или /assets/name.png" value={form.image_url} onChange={(event) => setField('image_url', event.target.value)} />
            <textarea placeholder="Описание" value={form.description} onChange={(event) => setField('description', event.target.value)} />
            <label className="admin-check"><input type="checkbox" checked={form.popular} onChange={(event) => setField('popular', event.target.checked)} /> Популярный товар</label>
            <button className="btn-primary" onClick={createProduct}>Добавить на сайт</button>
          </div>
          <div className="admin-list">
            {products.map((product) => (
              <article className="panel admin-row" key={product.id}>
                <div>
                  <strong>{product.title}</strong>
                  <span>{product.category} / {product.form} / {product.price} ₽</span>
                </div>
                <button className="icon-btn" onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'admins' && (
        <section className="admin-list">
          {users.map((item) => (
            <article className="panel admin-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.email || item.username}</span>
              </div>
              <button className={item.is_admin ? 'btn-primary small' : 'btn-ghost'} onClick={() => toggleAdmin(item)}>
                {item.is_admin ? 'Забрать админа' : 'Дать админа'}
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
