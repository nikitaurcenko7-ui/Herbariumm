import React, { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { harvestSlides, scrollToSupplyForm } from '../data/siteData.js'
import { ProductGrid } from '../components/Product.jsx'
import { InfoCard } from '../components/Cards.jsx'

export default function Home({ navigate, addToCart, quickBuy, products, user }) {
  const [harvestIndex, setHarvestIndex] = useState(0)
  const slide = harvestSlides[harvestIndex]

  useEffect(() => {
    const timer = setInterval(() => setHarvestIndex((current) => (current + 1) % harvestSlides.length), 4600)
    return () => clearInterval(timer)
  }, [])

  const changeSlide = (direction) => setHarvestIndex((current) => (current + direction + harvestSlides.length) % harvestSlides.length)
  const popular = products.filter((product) => product.popular).slice(0, 3)
  const openFromHome = (product) => {
    navigate('catalog')
    window.setTimeout(() => addToCart(product), 180)
  }

  return (
    <div className="space-y-7">
      <section className="hero reveal-block">
        <div>
          <h1>Сборы нового поколения</h1>
          <p>Натуральные травяные сборы для здоровья и комфортного самочувствия. Выверенные рецептуры, аккуратная фасовка и быстрая доставка.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => navigate('catalog')} className="btn-primary">Смотреть каталог</button>
            <button onClick={() => navigate('delivery')} className="btn-ghost">Условия доставки</button>
          </div>
        </div>
      </section>

      <section className="panel reveal-block">
        <h2 className="section-title">Как мы собираем травы</h2>
        <p className="muted text-sm">Полевой цикл от плана до сортировки доказуем в документах.</p>
        <div className="harvest-slider mt-3">
          <button className="slider-arrow left" onClick={() => changeSlide(-1)} aria-label="Предыдущий слайд"><ArrowRight size={18} /></button>
          <div className="harvest-slide-layout">
            <div className="harvest-art" key={`art-${harvestIndex}`}><img src={slide.image} alt={slide.title} /></div>
            <div className="harvest-copy" key={`text-${harvestIndex}`}>
              <h3 className="text-2xl font-bold">{slide.title}</h3>
              <p className="muted mt-2 text-sm">{slide.text}</p>
            </div>
          </div>
          <button className="slider-arrow right" onClick={() => changeSlide(1)} aria-label="Следующий слайд"><ArrowRight size={18} /></button>
          <div className="slider-dots">
            {harvestSlides.map((item, index) => <button key={item.title} className={index === harvestIndex ? 'active' : ''} onClick={() => setHarvestIndex(index)} aria-label={`Слайд ${index + 1}`} />)}
          </div>
          <span className="slide-count">{harvestIndex + 1}/{harvestSlides.length}</span>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3 reveal-block">
        {['50 000+|товаров в каталоге', '24 часа|среднее время отправки заказа', '98%|клиентов возвращаются за повторной покупкой'].map((item) => {
          const [big, small] = item.split('|')
          return <div className="stat" key={big}><strong>{big}</strong><span>{small}</span></div>
        })}
      </div>

      <section className="reveal-block">
        <h2 className="section-title mb-4">Популярные товары из каталога</h2>
        <ProductGrid products={popular} addToCart={openFromHome} onBuy={quickBuy} />
      </section>

      <section className="reveal-block">
        <h2 className="section-title mb-4">Как мы работаем</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['Сбор и контроль', 'Отбираем травы по сезону, сушим в щадящем режиме и проверяем каждую партию.'],
            ['Смешивание рецептур', 'Технолог собирает формулы под конкретные задачи: сон, энергия, иммунитет и баланс.'],
            ['Упаковка и доставка', 'Фасуем, маркируем и отправляем по всей стране курьером, в ПВЗ или почтой.']
          ].map(([title, text], index) => <InfoCard key={title} number={index + 1} title={title} text={text} />)}
        </div>
      </section>

      <section className="cta reveal-block">
        <div>
          <h2>Нужна оптовая поставка для сети?</h2>
          <p>Оставьте заявку в форме ниже. Ответим в течение рабочего дня.</p>
        </div>
        <button onClick={() => user ? scrollToSupplyForm(navigate, true) : navigate('contacts')} className="btn-primary">Узнать условия</button>
      </section>
    </div>
  )
}
