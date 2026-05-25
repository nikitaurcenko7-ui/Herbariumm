import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FaqAccordion({ items }) {
  const [active, setActive] = useState(0)
  return (
    <div className="panel faq-panel">
      <h3 className="font-bold">Частые вопросы</h3>
      <div className="faq-list">
        {items.map(([question, answer], index) => (
          <button key={question} className={`faq-item ${active === index ? 'active' : ''}`} onClick={() => setActive(active === index ? -1 : index)}>
            <span className="faq-question"><ChevronDown size={18} />{question}</span>
            <span className="faq-answer">{answer}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function InfoCard({ number, title, text }) {
  return <div className="panel"><span className="badge">{number}</span><h3 className="mt-3 font-bold">{title}</h3><p className="muted mt-2 text-sm">{text}</p></div>
}

export function InfoTile({ icon: Icon, title, text }) {
  return <div className="panel"><Icon className="mb-4 text-accent" /><h3 className="font-bold">{title}</h3><p className="muted mt-2 text-sm">{text}</p></div>
}

export function ContactCard({ label, title, text }) {
  return <div className="panel"><p className="eyebrow">{label}</p><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="muted mt-2 text-sm">{text}</p></div>
}
