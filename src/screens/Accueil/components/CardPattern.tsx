import React from 'react'

/**
 * Banknote-style guilloche: fine wave lines running across the card, the way
 * security printing reads on a bank card. Kept faint so the balance stays first.
 */
export function CardPattern() {
  const waves = Array.from({ length: 14 }, (_, i) => i)
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 220"
      preserveAspectRatio="xMinYMin slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-brand"
    >
      <g fill="none" stroke="currentColor" strokeWidth={0.8} opacity={0.07}>
        {waves.map((i) => {
          const y = 18 + i * 9
          const amp = 6 + (i % 4) * 2
          return (
            <path
              key={i}
              d={`M-10 ${y} C 40 ${y - amp}, 80 ${y + amp}, 130 ${y} S 220 ${y - amp}, 270 ${y} S 360 ${y + amp}, 410 ${y}`}
            />
          )
        })}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth={0.8} opacity={0.08}>
        {[18, 30, 42, 54, 66].map((r) => (
          <circle key={r} cx={-6} cy={226} r={r * 2.2} />
        ))}
      </g>
    </svg>
  )
}

