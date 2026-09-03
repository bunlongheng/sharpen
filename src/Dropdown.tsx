import { useEffect, useRef, useState, type ComponentType } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Any icon-like component - covers Lucide icons and our custom SVG logos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconType = ComponentType<any>

export interface DdOption {
  value: string | number
  label: string
  Icon: IconType
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
  const [active, setActive] = useState(-1) // keyboard-highlighted option index
  const ref = useRef<HTMLDivElement>(null)
  const sel = options.find((o) => o.value === value) ?? options[0]

  function pick(v: string | number) {
    onChange(v)
    setOpen(false)
    setActive(-1)
  }

  // Full keyboard support: arrows move, Enter/Space select, Home/End jump.
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      setActive(options.findIndex((o) => o.value === value))
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(options.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0) pick(options[active].value)
    }
  }

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
    <div className="dd2" ref={ref} style={{ minWidth }} onKeyDown={onKeyDown}>
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
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`dd2-item${o.value === value ? ' on' : ''}${i === active ? ' kb' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(o.value)}
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
