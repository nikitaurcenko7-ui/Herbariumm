import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Leaf, X } from 'lucide-react'

const DESCRIPTION_SECTIONS = ['Описание', 'Состав', 'Для чего', 'Вкус', 'Способ применения', 'Противопоказания']
const DEFAULT_DESCRIPTION = 'Натуральный травяной сбор Herbarium с аккуратной фасовкой и быстрой доставкой.'

function parseDescription(description) {
  const text = (description || DEFAULT_DESCRIPTION).trim()
  const sectionRegex = new RegExp(`(?:^|\\n|\\s)(${DESCRIPTION_SECTIONS.join('|')})\\s*:?\\s*`, 'g')
  const matches = [...text.matchAll(sectionRegex)]

  if (!matches.length) return [{ title: 'Описание', content: text }]

  return matches.map((match, index) => {
    const next = matches[index + 1]
    const start = match.index + match[0].length
    const end = next ? next.index : text.length
    return { title: match[1], content: text.slice(start, end).trim() }
  }).filter((section) => section.content)
}

function ProductDescription({ description }) {
  return (
    <div className="product-description">
      {parseDescription(description).map((section) => (
        <section key={section.title} className="product-description-section">
          <h3>{section.title}</h3>
          {section.content.split(/\n+/).map((line, index) => <p key={index}>{line}</p>)}
        </section>
      ))}
    </div>
  )
}

export function ProductGrid({ products, addToCart, onBuy }) {
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} addToCart={addToCart} onBuy={onBuy} index={index} />)}</div>
}

export function ProductCard({ product, addToCart, onBuy, index = 0 }) {
  const openProduct = () => addToCart(product)
  const buyProduct = () => (onBuy || addToCart)(product)

  return (
    <article className="product-card reveal-item" style={{ '--delay': `${index * 70}ms`, '--from-x': index % 2 === 0 ? '-36px' : '36px' }}>
      <div className={`product-visual ${product.image_url ? 'has-image' : `bg-gradient-to-br ${product.tone}`}`}>
        {product.image_url ? <img src={product.image_url} alt={product.title} /> : <Leaf size={56} />}
      </div>
      <div className="product-card-body">
        <p className="eyebrow">{product.category} / {product.form}</p>
        <h3>{product.title}</h3>
        <div className="product-card-footer">
          <strong>{product.price} ₽</strong>
          <div className="product-card-actions">
            <button onClick={openProduct} className="btn-ghost small">Подробнее</button>
            <button onClick={buyProduct} className="btn-primary small">В корзину</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1)
  if (!product) return null

  const changeQty = (next) => setQty(Math.max(1, Math.min(99, next)))

  const modal = (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="product-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
        <div className={`modal-image ${product.image_url ? 'has-image' : `bg-gradient-to-br ${product.tone}`}`}>
          {product.image_url ? <img src={product.image_url} alt={product.title} /> : <Leaf size={92} />}
        </div>
        <div className="modal-body">
          <p className="eyebrow">{product.category} / {product.form}</p>
          <h2>{product.title}</h2>
          <ProductDescription description={product.description} />
          <div className="modal-purchase">
            <div className="modal-meta"><span>Цена</span><strong>{product.price} ₽</strong></div>
            <div className="qty-row">
              <span>Количество</span>
              <div className="qty-control">
                <button onClick={() => changeQty(qty - 1)}>-</button>
                <input value={qty} onChange={(event) => changeQty(Number(event.target.value) || 1)} />
                <button onClick={() => changeQty(qty + 1)}>+</button>
              </div>
            </div>
            <button className="btn-primary w-full" onClick={() => onAdd(product, qty)}>Добавить в корзину</button>
          </div>
        </div>
      </section>
    </div>
  )

  return createPortal(modal, document.body)
}
