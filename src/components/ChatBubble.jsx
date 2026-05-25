import React, { useState } from 'react'
import { Phone, Send, X } from 'lucide-react'

export default function ChatBubble() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Здравствуйте. Я мини-помощник Herbarium. Могу подсказать по доставке, товарам и оплате.' }
  ])

  const sendMessage = () => {
    const value = text.trim()
    if (!value) return
    const lower = value.toLowerCase()
    let answer = 'Я передам вопрос менеджеру. Обычно мы отвечаем в течение рабочего дня.'
    if (lower.includes('достав')) answer = 'Доставка доступна курьером, в ПВЗ и Почтой России. Бесплатно от 3000 ₽.'
    if (lower.includes('оплат')) answer = 'Оплатить можно картой, через СБП или по счету для оптовых заказов.'
    if (lower.includes('каталог') || lower.includes('товар')) answer = 'В каталоге показаны сборы из SQLite. Можно отфильтровать по категории, форме и цене.'
    if (lower.includes('адрес') || lower.includes('карта')) answer = 'Наш ориентир: Владивосток, ул. Нейбута. Карта есть на странице контактов.'
    setMessages((current) => [...current, { role: 'user', text: value }, { role: 'bot', text: answer }])
    setText('')
  }

  return (
    <>
      {open && (
        <section className="chat-window">
          <div className="chat-head">
            <div><strong>Помощник Herbarium</strong><span>онлайн-консультация</span></div>
            <button onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}>{message.text}</div>)}
          </div>
          <div className="chat-input">
            <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Напишите вопрос" />
            <button onClick={sendMessage}><Send size={16} /></button>
          </div>
        </section>
      )}
      <button className="chat-bubble" onClick={() => setOpen((current) => !current)} aria-label="Открыть чат"><Phone size={20} /></button>
    </>
  )
}
