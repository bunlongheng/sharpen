// Official-style TypeScript and JavaScript square logos as inline SVG (self-contained).
interface LogoProps {
  size?: number
  className?: string
  strokeWidth?: number // accepted for icon-slot compatibility; unused
}

export function TsLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#3178c6" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="#ffffff"
      >
        TS
      </text>
    </svg>
  )
}

export function ReactLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="2.05" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="3.85" />
        <ellipse cx="12" cy="12" rx="10" ry="3.85" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.85" transform="rotate(120 12 12)" />
      </g>
    </svg>
  )
}

export function JsLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#f7df1e" />
      <text
        x="12"
        y="17.4"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#000000"
      >
        JS
      </text>
    </svg>
  )
}

export function PyLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#3776ab" />
      <rect x="0" y="12" width="24" height="12" rx="4" fill="#ffd43b" />
      <rect x="0" y="9" width="24" height="6" fill="#3776ab" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#ffffff"
        stroke="#1d3a57"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        Py
      </text>
    </svg>
  )
}

export function RustLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#dea584" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#1f2937"
      >
        Rs
      </text>
    </svg>
  )
}

export function PhpLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#777bb4" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#ffffff"
      >
        php
      </text>
    </svg>
  )
}

export function CLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#283593" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="12"
        fill="#ffffff"
      >
        C
      </text>
    </svg>
  )
}

export function CppLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#00599c" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="9.5"
        fill="#ffffff"
      >
        C++
      </text>
    </svg>
  )
}

export function CsLogo({ size = 24, className }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#239120" />
      <text
        x="12"
        y="17.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill="#ffffff"
      >
        C#
      </text>
    </svg>
  )
}
