import React from 'react'

const SIZE = 25

/** A stand-in receive QR, drawn from the account number so each account gets its own. */
export function PersonalQr({ seed, className }: { seed: string; className?: string }) {
  const cells = buildModules(seed)
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={className} shapeRendering="crispEdges" role="img" aria-label="QR code personnel">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} className="fill-brand-dark" />
      ))}
      {[
        [0, 0],
        [SIZE - 7, 0],
        [0, SIZE - 7],
      ].map(([x, y]) => (
        <g key={`f-${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.6} fill="none" strokeWidth={1} className="stroke-brand-dark" />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} className="fill-brand" />
        </g>
      ))}
      {/* Telecel mark in the quiet centre */}
      <rect x={9} y={9} width={7} height={7} rx={1.8} className="fill-white" />
      <rect x={9.8} y={9.8} width={5.4} height={5.4} rx={1.4} className="fill-brand" />
      <text x={12.5} y={14.1} textAnchor="middle" fontSize={4.4} fontWeight={700} fill="white" fontFamily="Inter, sans-serif">
        t
      </text>
    </svg>
  )
}

function buildModules(seed: string): [number, number][] {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const next = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const out: [number, number][] = []
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const inFinder =
        (x < 8 && y < 8) || (x >= SIZE - 8 && y < 8) || (x < 8 && y >= SIZE - 8)
      const inCentre = x >= 8 && x <= 16 && y >= 8 && y <= 16
      if (inFinder || inCentre) continue
      if (next() < 0.48) out.push([x, y])
    }
  }
  return out
}

