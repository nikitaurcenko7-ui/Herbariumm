import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const selectRef = useRef(null)
  const selectOption = (option) => {
    onChange(option)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const close = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={selectRef} className={`custom-select ${open ? 'open' : ''}`}>
      <button type="button" onClick={() => setOpen((current) => !current)}>
        <span>{value}</span>
        <ChevronDown size={18} />
      </button>
      {open && (
        <div className="custom-options">
          {options.map((option) => {
            if (typeof option === 'string') {
              return (
                <button type="button" key={option} className={option === value ? 'selected' : ''} onClick={() => selectOption(option)}>
                  {option}
                </button>
              )
            }

            return (
              <div className="custom-option-group" key={option.label}>
                <button type="button" className={`custom-option-heading ${option.label === value ? 'selected' : ''}`} onClick={() => selectOption(option.label)}>
                  {option.label}
                </button>
                {option.options.map((child) => (
                  <button type="button" key={child} className={`custom-option-child ${child === value ? 'selected' : ''}`} onClick={() => selectOption(child)}>
                    {child}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
