import React from 'react'
import { useI18n } from '@shared/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Wallet,
  House,
  SquaresFour,
  UserCircle,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

export type Tab = 'accueil' | 'services' | 'historique' | 'compte'

const TABS: { id: Tab; label: string; icon: PhosphorIcon }[] = [
  { id: 'accueil', label: 'Accueil', icon: House },
  { id: 'services', label: 'Services', icon: SquaresFour },
  { id: 'historique', label: 'Achats', icon: Wallet },
  { id: 'compte', label: 'Compte', icon: UserCircle },
]

const EASE = [0.23, 1, 0.32, 1] as const

/**
 * Tab bar sized for the thumb: each tab is a full-height 64px target and every
 * label stays visible. The active icon sits in a solid blue pill that slides
 * to the tab you pick, and its icon settles in with a small lift.
 */
export function BottomNav({
  active,
  onNavigate,
}: {
  active: Tab
  onNavigate?: (tab: Tab) => void
}) {
  const reduce = useReducedMotion()
  const { t } = useI18n()
  const labels: Record<Tab, string> = { accueil: t('home'), services: t('services'), historique: t('history'), compte: t('account') }
  return (
    <nav className="sticky bottom-0 z-40 w-full shrink-0 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_0_rgba(0,71,171,0.08),0_-8px_24px_-16px_rgba(0,51,124,0.25)] [transform:translateZ(0)]">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {TABS.map(({ id, icon: Icon }) => {
          const label = labels[id]
          const on = id === active
          return (
            <li key={id}>
              <motion.button
                onClick={() => onNavigate?.(id)}
                aria-current={on ? 'page' : undefined}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                transition={{ duration: 0.12, ease: EASE }}
                className="group flex h-16 w-full flex-col items-center justify-center gap-1.5"
              >
                <span className="relative flex h-8 w-14 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full transition-colors duration-150 ease-out ${
                      on ? '' : 'group-hover:bg-brand-soft/60'
                    }`}
                  />
                  {on && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0.18 }}
                      className="absolute inset-0 rounded-full bg-brand"
                    />
                  )}
                  <motion.span
                    key={on ? 'on' : 'off'}
                    initial={reduce || !on ? false : { y: 3, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: 0.22, ease: EASE, delay: 0.04 }}
                    className="relative flex"
                  >
                    <Icon
                      size={22}
                      weight={on ? 'fill' : 'regular'}
                      className={`transition-colors duration-150 ease-out ${
                        on ? 'text-white' : 'text-muted group-hover:text-ink'
                      }`}
                    />
                  </motion.span>
                </span>
                <span
                  className={`text-[12px] leading-none whitespace-nowrap transition-colors duration-150 ease-out ${
                    on ? 'font-semibold text-brand' : 'font-medium text-muted group-hover:text-ink'
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
97
