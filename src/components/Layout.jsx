import React from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ChatBubble from './ChatBubble.jsx'
import flowerLeft from '../assets/33123123.png'
import flowerRight from '../assets/3123122313.png'
import flowerBottom from '../assets/312312312312.png'

export default function Layout({ children, route, navigate, user, onLogout, cartCount, theme, toggleTheme }) {
  return (
    <div className="min-h-screen">
      <div className="botanical-bg" />
      <img src={flowerLeft} alt="" className="flower-bg flower-left" />
      <img src={flowerRight} alt="" className="flower-bg flower-right" />
      <img src={flowerBottom} alt="" className="flower-bg flower-bottom" />
      <Header route={route} navigate={navigate} user={user} onLogout={onLogout} cartCount={cartCount} theme={theme} toggleTheme={toggleTheme} />
      <main className="site-main relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-7">
        <div key={route} className="page-transition">{children}</div>
      </main>
      <Footer user={user} />
      <ChatBubble />
    </div>
  )
}
