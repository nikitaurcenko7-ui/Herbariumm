import React from 'react'
import { MapPin } from 'lucide-react'
import { ContactCard } from '../components/Cards.jsx'
import { scrollToSupplyForm } from '../data/siteData.js'

export default function Contacts({ navigate, user }) {
  return (
    <div>
      <h1 className="page-title">Контакты Herbarium</h1>
      <p className="muted mt-2 max-w-2xl text-sm">Здесь собраны быстрые способы связи, адрес для самовывоза во Владивостоке и короткая подсказка для оптовых заказов.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <ContactCard label="Телефон" title="+7 (800) 700-12-30" text="Ответим на вопросы по каталогу, наличию сборов и срокам доставки." />
        <ContactCard label="Email" title="help@herbarium.ru" text="Для счетов, документов и подробных заявок по ассортименту." />
        <ContactCard label="Адрес" title="Владивосток, ул. Нейбута" text="Точная точка на карте поможет сориентироваться перед самовывозом." />
        <div className="panel">
          <p className="eyebrow">Оптовая заявка</p>
          <h3 className="mt-2 text-xl font-bold">Заполните форму</h3>
          <p className="muted mt-2 text-sm">Напишите объем, фасовку и комментарий к поставке, а менеджер подготовит предложение.</p>
          <button onClick={() => user ? scrollToSupplyForm(navigate, true) : navigate('register')} className="btn-primary mt-4">Перейти к форме</button>
        </div>
      </div>
      <div className="panel mt-3 overflow-hidden p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-bold">Как нас найти</h3>
          <span className="muted text-xs">Нейбута, Владивосток</span>
        </div>
        <div className="map">
          <iframe title="Herbarium на карте" src="https://www.openstreetmap.org/export/embed.html?bbox=131.905%2C43.105%2C131.935%2C43.125&layer=mapnik&marker=43.115%2C131.92" loading="lazy" />
          <a href="https://www.openstreetmap.org/search?query=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BA%20%D0%9D%D0%B5%D0%B9%D0%B1%D1%83%D1%82%D0%B0" target="_blank" rel="noreferrer">Открыть карту</a>
        </div>
      </div>
    </div>
  )
}
