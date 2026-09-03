import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check, type LucideIcon } from 'lucide-react'

export interface DdOption {
  value: string | number
  label: string
  Icon: LucideIcon
}

// Custom dropdown so each option can show a real Lucide SVG icon (native <select> can't).
export default function Dropdown({
  options,
  value,
  onChange,
  minWidth = 200,
  ariaLabel,
}: {
  options: DdOption[]
  value: string | number
  onChange: (value: string | number) => void
  minWidth?: number
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const sel = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  return (
    <div className="dd2" ref={ref} style={{ minWidth }}>
      <button
        type="button"
        className="dd2-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <sel.Icon className="dd2-ic" size={16} strokeWidth={2} />
        <span className="dd2-label">{sel.label}</span>
        <ChevronDown className="dd2-chev" size={16} />
      </button>

      {open && (
        <ul className="dd2-menu" role="listbox">
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={o.value === value ? 'dd2-item on' : 'dd2-item'}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <o.Icon className="dd2-ic" size={16} strokeWidth={2} />
              <span className="dd2-label">{o.label}</span>
              {o.value === value && <Check className="dd2-check" size={15} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
