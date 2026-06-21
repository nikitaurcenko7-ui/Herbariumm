import React from 'react'
import { X } from 'lucide-react'

export default function Cart({ cart, setCart, navigate, user }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const checkout = () => {
    if (!user) {
      navigate('register')
      return
    }
    navigate('checkout')
  }

  return (
    <div>
      <h1 className="page-title">Корзина</h1>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {cart.length === 0 && (
            <div className="panel">
              Корзина пуста.
              <button onClick={() => navigate('catalog')} className="link-btn">Перейти в каталог</button>
            </div>
          )}

          {cart.map((item) => (
            <div className="panel flex items-center justify-between gap-3" key={item.id}>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="muted text-sm">{item.qty} шт. x {item.price} ₽</p>
              </div>
              <button className="icon-btn" onClick={() => setCart(cart.filter((product) => product.id !== item.id))}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <aside className="panel h-fit">
          <h2 className="text-xl font-bold">Итого: {total} ₽</h2>
          {!user && cart.length > 0 && <p className="muted mt-3 text-sm">Чтобы оформить заказ, войдите или зарегистрируйтесь.</p>}
          <button disabled={!cart.length} onClick={checkout} className="btn-primary mt-4 w-full disabled:opacity-50">
            Оформить заказ
          </button>
        </aside>
      </div>
    </div>
  )
}
