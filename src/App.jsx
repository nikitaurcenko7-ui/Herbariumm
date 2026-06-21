import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import './index.css'

import CookieConsent from './components/CookieConsent.jsx'
import Layout from './components/Layout.jsx'
import { ProductModal } from './components/Product.jsx'
import { useRoute } from './hooks/useRoute.js'
import { api, normalizeUser } from './lib/api.js'

import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Delivery from './pages/Delivery.jsx'
import Contacts from './pages/Contacts.jsx'
import Profile from './pages/Profile.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

function App() {
  const [route, navigate] = useRoute()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [user, setUser] = useState(() => {
    try {
      return normalizeUser(JSON.parse(localStorage.getItem('herbarium_user') || 'null'))
    } catch {
      return null
    }
  })
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    api('/products/')
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))

    api('/session/')
      .then((data) => {
        if (!data.user) return
        setUser((current) => {
          const merged = normalizeUser({ ...(current || {}), ...data.user })
          localStorage.setItem('herbarium_user', JSON.stringify(merged))
          return merged
        })
      })
      .catch(() => null)
  }, [])

  const refreshProducts = () => api('/products/').then((data) => setProducts(data.products)).catch(() => null)

  const requireAccountForCart = () => {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'info',
      title: 'Нужен аккаунт',
      text: 'Войдите или зарегистрируйтесь, чтобы добавить товар в корзину.',
      showConfirmButton: false,
      timer: 3600,
      timerProgressBar: true,
      customClass: {
        popup: 'herb-toast',
        title: 'herb-toast-title',
        timerProgressBar: 'herb-toast-progress'
      }
    })
    navigate('register')
  }

  const addToCart = (product, qty = 1) => {
    if (!user) {
      requireAccountForCart()
      return false
    }

    setCart((items) => {
      const current = items.find((item) => item.id === product.id)
      if (current) {
        return items.map((item) => item.id === product.id ? { ...item, qty: item.qty + qty } : item)
      }
      return [...items, { ...product, qty }]
    })
    return true
  }

  const addProductFromModal = (product, qty) => {
    if (!addToCart(product, qty)) {
      setSelectedProduct(null)
      return
    }

    setSelectedProduct(null)
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: 'Товар добавлен в корзину',
      text: `${product.title} - ${qty} шт.`,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      customClass: {
        popup: 'herb-toast',
        title: 'herb-toast-title',
        timerProgressBar: 'herb-toast-progress'
      }
    })
  }

  const quickBuyProduct = (product) => {
    if (!addToCart(product, 1)) return

    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: 'Добавлено в корзину',
      text: product.title,
      showConfirmButton: false,
      timer: 2600,
      timerProgressBar: true,
      customClass: {
        popup: 'herb-toast',
        title: 'herb-toast-title',
        timerProgressBar: 'herb-toast-progress'
      }
    })
  }

  const logoutUser = async () => {
    await api('/logout/', { method: 'POST' }).catch(() => null)
    setUser(null)
    localStorage.removeItem('herbarium_user')
    navigate('home')
  }

  const pageProps = {
    navigate,
    addToCart: setSelectedProduct,
    quickBuy: quickBuyProduct,
    setUser,
    user,
    cart,
    setCart,
    products,
    loading: loadingProducts
  }

  const pages = {
    home: <Home {...pageProps} />,
    catalog: <Catalog {...pageProps} />,
    delivery: <Delivery />,
    contacts: <Contacts navigate={navigate} user={user} />,
    login: <Login {...pageProps} />,
    register: <Register {...pageProps} />,
    forgot: <ForgotPassword navigate={navigate} />,
    profile: <Profile {...pageProps} />,
    admin: <AdminPanel api={api} navigate={navigate} user={user} refreshProducts={refreshProducts} />,
    cart: <Cart {...pageProps} />,
    checkout: <Checkout navigate={navigate} setCart={setCart} cart={cart} user={user} />
  }

  return (
    <>
      <Layout
        route={route}
        navigate={navigate}
        user={user}
        onLogout={logoutUser}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        theme={theme}
        toggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
      >
        {pages[route] || <Home {...pageProps} />}
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addProductFromModal} />
      </Layout>
      <CookieConsent />
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
