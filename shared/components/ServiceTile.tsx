import React from 'react'
import { CaretUp } from '@phosphor-icons/react'
import type { Service, ServiceTone } from '@shared/data/services'

export function ServiceTile({
  service,
  variant = 'plain',
  illustrated = false,
}: {
  service: Service
  variant?: 'plain' | 'card'
  illustrated?: boolean
}) {
  const Icon = service.icon
  const solid = service.style === 'solid'
  const flaticonImages: Record<string, string> = {
    international: 'https://cdn-icons-png.flaticon.com/512/4440/4440662.png',
    depot: 'https://cdn-icons-png.flaticon.com/512/17565/17565687.png',
    salaire: 'https://cdn-icons-png.flaticon.com/512/11338/11338126.png',
    banques: 'https://cdn-icons-png.flaticon.com/512/12115/12115719.png',
    finance: 'https://cdn-icons-png.flaticon.com/512/2953/2953535.png',
  }
  const tone = TONES[service.tone ?? 'transfer']
  return (
    <button
      className={`group relative flex flex-col items-center gap-2 text-center ${
        variant === 'card'
          ? 'rounded-2xl bg-white px-1 pt-3 pb-2.5 ring-1 ring-brand-line/50 transition-colors duration-150 ease-out hover:bg-brand-soft'
          : 'px-1 py-1'
      }`}
    >
      <span
        className={`relative flex h-[56px] w-[56px] items-center justify-center rounded-[19px] transition-all duration-150 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md group-active:scale-95 ${
          illustrated
            ? 'bg-gradient-to-br from-[#EAF3FF] via-[#DCEBFF] to-[#F5F9FF] text-[#0759B8] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]'
            : solid ? 'bg-brand text-white' : tone
        }`}
      >
        {illustrated && flaticonImages[service.id] ? (
          <img src={flaticonImages[service.id]} alt={service.label} loading="lazy" className="h-10 w-10 object-contain drop-shadow-[0_3px_3px_rgba(18,74,145,0.12)]" />
        ) : Icon ? (
          <Icon size={26} weight="duotone" />
        ) : (
          <span className="text-[12px] font-bold tracking-tight">{service.mark}</span>
        )}
      </span>
      <span className="line-clamp-2 text-[12px] leading-tight font-medium text-ink">
        {service.label}
      </span>
    </button>
  )
}

/** The fourth slot of a row when there are more services than fit: “Plus” with a count, or “Moins” once open. */
export function MoreTile({
  hiddenCount,
  open = false,
  variant = 'plain',
  onClick,
}: {
  hiddenCount: number
  open?: boolean
  variant?: 'plain' | 'card'
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      className={`group relative flex flex-col items-center gap-2 text-center ${
        variant === 'card'
          ? 'rounded-2xl bg-white px-1 pt-3 pb-2.5 ring-1 ring-brand-line/50 transition-colors duration-150 ease-out hover:bg-brand-soft'
          : 'px-1 py-1'
      }`}
    >
      <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-white text-brand shadow-sm ring-1 ring-brand-line/60 transition-transform duration-150 ease-out group-active:scale-95">
        {open ? <CaretUp size={24} weight="bold" /> : <img src="https://cdn-icons-png.flaticon.com/512/2467/2467816.png" alt="Plus" className="h-10 w-10 object-contain" />}
      </span>
      <span className="text-[12px] leading-tight font-medium whitespace-nowrap text-ink">
        {open ? 'Moins' : 'Plus'}
      </span>
    </button>
  )
}

/** One palette across the app: every service tile is Telecel blue on its soft tint. */
const TONES: Record<ServiceTone, string> = {
  transfer: 'bg-brand-soft text-brand',
  bill: 'bg-brand-soft text-brand',
  money: 'bg-brand-soft text-brand',
  telco: 'bg-brand-soft text-brand',
  utility: 'bg-brand-soft text-brand',
}
94
