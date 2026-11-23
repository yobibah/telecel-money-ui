import React from 'react'

/** Telecel Money brand lockup, adapted to the blue app header. */
export function TelecelLogo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const wordColor = tone === 'light' ? '#FFFFFF' : '#173B67'
  const upperColor = tone === 'light' ? '#FFFFFF' : '#173B67'
  const lowerColor = '#2CA6DA'

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Telecel Money">
      <svg
        aria-hidden="true"
        viewBox="0 0 252 252"
        className="h-9 w-9 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z"
          fill={upperColor}
        />
        <path
          d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z"
          fill={lowerColor}
        />
      </svg>
      <span className="flex flex-col items-start leading-none" style={{ color: wordColor }}>
        <span className="text-[21px] font-semibold tracking-[0.01em] lowercase">telecel</span>
        <span className="mt-0.5 text-[13px] font-bold tracking-[0.08em]">Money</span>
      </span>
    </span>
  )
}
34
