import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
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
// Follows the WAI-ARIA "select-only combobox" pattern: focus stays on the trigger and
// aria-activedescendant tells assistive tech which option the keyboard is on.
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
  const id = useId()
  const sel = options.find((o) => o.value === value) ?? options[0]
  const optionId = useCallback((i: number) => `${id}-opt-${i}`, [id])

  function openMenu() {
    setOpen(true)
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    )
  }

  function close() {
    setOpen(false)
    setActive(-1)
  }

  function pick(v: string | number) {
    onChange(v)
    close()
  }

  // Full keyboard support: arrows move, Enter/Space select, Home/End jump, Escape/Tab close.
  function onKeyDown(e: KeyboardEvent) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      openMenu()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      close()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0) pick(options[active].value)
    }
  }

  // Focus leaving the widget (Tab, click elsewhere) closes it.
  function onBlur(e: FocusEvent) {
    if (!ref.current?.contains(e.relatedTarget as Node | null)) close()
  }

  // keep the keyboard-highlighted option scrolled into view (menus longer than the viewport)
  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' })
  }, [open, active, optionId])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
    }
  }, [])

  return (
    <div className="dd2" ref={ref} style={{ minWidth }} onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        type="button"
        className="dd2-btn"
        onClick={() => (open ? close() : openMenu())}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={ariaLabel}
      >
        <sel.Icon className="dd2-ic" size={16} strokeWidth={2} />
        <span className="dd2-label">{sel.label}</span>
        <ChevronDown className="dd2-chev" size={16} />
      </button>

      {open && (
        <ul className="dd2-menu" role="listbox" id={`${id}-list`} aria-label={ariaLabel}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={o.value === value}
              className={`dd2-item${o.value === value ? ' on' : ''}${i === active ? ' kb' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()} /* keep focus on the trigger */
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
