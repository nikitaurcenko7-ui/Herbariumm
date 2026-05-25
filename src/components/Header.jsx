import React, { useState } from 'react'
import { Leaf, LogOut, Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react'
import { routes } from '../data/siteData.js'

export default function Header({ route, navigate, user, onLogout, cartCount, theme, toggleTheme }) {
  const [open, setOpen] = useState(false)
  const go = (next) => {
    setOpen(false)
    navigate(next)
  }

  return (
    <header className="site-header">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <button onClick={() => go('home')} className="brand">
          <span><Leaf size={16} /></span>
          Herbarium
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {routes.map(([key, label]) => (
            <button key={key} onClick={() => go(key)} className={`nav-link ${route === key ? 'active' : ''}`}>{label}</button>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={toggleTheme} className="icon-btn" title="Переключить тему">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button onClick={() => go('cart')} className="icon-btn"><ShoppingCart size={16} />{cartCount > 0 && <span>{cartCount}</span>}</button>
          <button onClick={() => go(user ? 'profile' : 'login')} className="nav-link">{user ? user.name : 'Войти'}</button>
          {user && <button onClick={onLogout} className="icon-btn"><LogOut size={16} /></button>}
        </div>
        <button className="icon-btn md:hidden" onClick={() => setOpen(!open)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>

      <div className={`mobile-menu-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="mobile-menu-head">
          <button onClick={() => go('home')} className="brand"><span><Leaf size={16} /></span>Herbarium</button>
          <button className="icon-btn" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        {[...routes, ['cart', 'Корзина'], [user ? 'profile' : 'login', user ? 'Кабинет' : 'Войти']].map(([key, label]) => (
          <button key={key} onClick={() => go(key)}>{label}</button>
        ))}
        <button onClick={() => { toggleTheme(); setOpen(false) }}>{theme === 'dark' ? 'Светлая тема' : 'Темная тема'}</button>
      </div>
    </header>
  )
}
