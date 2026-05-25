import React from 'react'
import { CheckCircle2, Clock3, CreditCard, PackageCheck, Phone, Truck } from 'lucide-react'
import { FaqAccordion, InfoTile } from '../components/Cards.jsx'
import cdekLogo from '../assets/cdek.png'
import boxberryLogo from '../assets/boxberry.png'
import russianPostLogo from '../assets/russian-post.png'

export default function Delivery() {
  const faqs = [
    ['Можно ли изменить адрес доставки после оформления заказа?', 'Да, если заказ еще не передан в доставку. Напишите в поддержку номер заказа и новый адрес.'],
    ['Сколько стоит доставка в мой город?', 'Стоимость рассчитывается после выбора города и службы доставки. Для заказов от 3000 ₽ доставка бесплатная.'],
    ['Как я узнаю, что заказ отправлен?', 'После отправки мы пришлем трек-номер в личный кабинет и на email, указанный при оформлении.'],
    ['Можно ли оформить доставку в выходные?', 'Да, для курьерской доставки это зависит от города. ПВЗ и Почта России работают по расписанию отделений.']
  ]

  return (
    <div>
      <h1 className="page-title text-center">Доставка и связь</h1>
      <p className="muted mx-auto mt-2 max-w-xl text-center text-sm">Бережно доставляем травяные сборы по всей России. Всегда на связи и готовы помочь с заказом.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <InfoTile icon={Truck} title="Курьер и ПВЗ" text="Доставка курьером по крупным городам за 1-2 дня. В регионы отправляем через пункты выдачи и почту." />
        <InfoTile icon={CreditCard} title="Способы оплаты" text="Банковские карты, СБП и наложенный платеж. Для оптовых клиентов доступна оплата по счету." />
        <InfoTile icon={Phone} title="Контакты" text="Email: help@herbarium.ru. Телефон: +7 (800) 700-12-30." />
        <InfoTile icon={PackageCheck} title="Стоимость доставки" text="Москва и СПБ от 299 ₽, регионы от 349 ₽, Почта России от 400 ₽. Бесплатно от 3000 ₽." />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1.8fr]">
        <InfoTile icon={Clock3} title="Сроки доставки" text="Москва и СПБ 1-2 дня, регионы 3-7 дней, Почта России 5-14 дней. Сроки указаны ориентировочно." />
        <div className="panel">
          <CheckCircle2 className="mb-3 text-accent" />
          <h3 className="font-bold">Отслеживание заказа</h3>
          <p className="muted mt-2 text-sm">Введите трек-номер, чтобы узнать текущий статус доставки.</p>
          <input className="mt-3" placeholder="Введите трек-номер" />
          <button className="btn-primary mt-2 w-full">Проверить</button>
        </div>
        <div className="panel">
          <h3 className="text-center font-bold">Наши партнеры по доставке</h3>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ['СДЭК', cdekLogo],
              ['Boxberry', boxberryLogo],
              ['Почта России', russianPostLogo]
            ].map(([partner, logo]) => <div className="partner partner-logo" key={partner}><img src={logo} alt={partner} /><span>{partner}</span></div>)}
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1.7fr_1fr]">
        <FaqAccordion items={faqs} />
        <div className="panel">
          <h3 className="font-bold">Поддержка</h3>
          <p className="muted mt-3 text-sm">Мы на связи и готовы помочь с доставкой, оплатой и статусом заказа.</p>
          <p className="muted mt-3 text-sm">Время работы: Пн-Пт 9:00-18:00 (МСК)</p>
          <p className="muted mt-3 text-sm">Каналы связи: email, телефон и мини-чат помощника.</p>
        </div>
      </div>
    </div>
  )
}
