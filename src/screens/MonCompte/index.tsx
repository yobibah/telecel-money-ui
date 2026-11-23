import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  CaretRight,
  ChatCircleText,
  Fingerprint,
  Gauge,
  Info,
  LockKey,
  ShareNetwork,
  SignOut,
  Translate,
  BellRinging,
  CreditCard,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { PageHeader } from '@shared/components/PageHeader'
import { useI18n, type Language } from '@shared/i18n'

export const args = {
  name: 'BA',
  phone: '(+226) 50******3257',
  language: 'Français',
}

export const argTypes = {
  name: { control: 'text' },
  phone: { control: 'text' },
  language: { control: 'radio', options: ['Français', 'English'] },
}

type Props = Partial<typeof args> & {
  onNavigate?: (tab: Tab) => void
  onLogout?: () => void
  onOpenBilan?: () => void
}

export default function MonCompte(props: Props) {
  const { name, phone, onNavigate, onLogout, onOpenBilan } = { ...args, ...props }
  const { language, setLanguage, t } = useI18n()
  const languageNames: Record<Language, string> = { fr: 'Français', en: 'English' }
  const [biometrie, setBiometrie] = useState(true)
  const [notifs, setNotifs] = useState(true)

  const sections: Section[] = [
    {
      title: t('security'),
      rows: [
        { icon: LockKey, label: t('pin'), hint: t('changed') },
        {
          icon: Fingerprint,
          label: t('fingerprint'),
          hint: biometrie ? t('enabled') : t('disabled'),
          toggle: { on: biometrie, set: setBiometrie },
        },
      ],
    },
    {
      title: t('payments'),
      rows: [
        { icon: CreditCard, label: t('paymentSettings'), hint: t('paymentHint') },
        { icon: Gauge, label: t('limits'), hint: 'Plafond 2 000 000 FCFA / mois' },
      ],
    },
    {
      title: t('preferences'),
      rows: [
        { icon: Translate, label: t('language'), value: languageNames[language], options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }], onChange: (value: string) => setLanguage(value as Language) },
        {
          icon: BellRinging,
          label: t('notifications'),
          hint: notifs ? t('transactionAlerts') : t('off'),
          toggle: { on: notifs, set: setNotifs },
        },
      ],
    },
    {
      title: t('support'),
      rows: [
        { icon: ChatCircleText, label: t('help') },
        { icon: ShareNetwork, label: t('share') },
        { icon: Info, label: t('about'), value: 'v3.4.1' },
      ],
    },
  ]

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageHeader title={t('account')} />
        <div className="mx-auto max-w-xl px-4 pt-5 pb-6">
          <button className="mb-6 flex w-full items-center gap-3.5 rounded-2xl bg-white p-3.5 text-left ring-1 ring-brand-line/50 transition-colors duration-150 ease-out hover:bg-brand-soft/50">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-[16px] font-bold text-white">
              {initials(name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[17px] font-semibold text-ink">{name}</span>
              <span className="block text-[13px] text-muted tabular-nums">{phone}</span>
            </span>
            <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-brand">
              {t('edit')}
              <CaretRight size={14} weight="bold" />
            </span>
          </button>

          <button onClick={onOpenBilan} className="mb-5 flex min-h-[58px] w-full items-center gap-2.5 rounded-xl border border-[#DCE8F8] bg-[#F7FAFF] px-3 py-2 text-left transition active:scale-[0.99]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#0B55C8]"><Gauge size={17} weight="duotone"/></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-bold text-[#0A1F44]">Mon bilan et santé du compte</span><span className="mt-0.5 block text-[9px] text-[#64748B]">Bon · Aucune alerte ce mois-ci</span></span><span className="shrink-0 rounded-md bg-[#EAF1FF] px-2 py-1 text-[10px] font-extrabold text-[#0B55C8]">78/100</span><CaretRight size={15} className="shrink-0 text-[#0B55C8]"/></button>

          {sections.map((s) => (
            <section key={s.title} className="mb-5">
              <h2 className="px-1 pb-2 text-[13px] font-semibold text-muted">{s.title}</h2>
              <ul className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand-line/50">
                {s.rows.map((r, j) => (
                  <li key={r.label} className={j > 0 ? 'border-t border-brand-line/50' : ''}>
                    <SettingRow row={r} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-hot transition-colors duration-150 ease-out hover:bg-hot/10"
          >
            <SignOut size={20} weight="bold" />
            {t('logout')}
          </button>
        </div>
      </main>
      <BottomNav active="compte" onNavigate={onNavigate} />
    </div>
  )
}

function SettingRow({ row }: { row: Row }) {
  const { icon: Icon, label, hint, value, toggle } = row
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon size={22} weight="duotone" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">{label}</span>
        {hint && <span className="block truncate text-[12.5px] text-muted">{hint}</span>}
      </span>
      {row.options ? <select aria-label={label} value={row.options.find((option) => option.label === value)?.value ?? 'fr'} onChange={(event) => row.onChange?.(event.target.value)} className="max-w-[118px] rounded-lg border border-brand-line bg-white px-2 py-2 text-[12px] font-semibold text-brand outline-none"><option value="fr">Français</option><option value="en">English</option></select> : value && <span className="shrink-0 text-[13px] font-medium text-muted">{value}</span>}
      {toggle ? (
        <Switch on={toggle.on} />
      ) : (
        <CaretRight size={16} weight="bold" className="shrink-0 text-muted" />
      )}
    </>
  )
  const cls =
    'flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-150 ease-out hover:bg-brand-soft/50'
  return toggle ? (
    <button role="switch" aria-checked={toggle.on} onClick={() => toggle.set(!toggle.on)} className={cls}>
      {content}
    </button>
  ) : row.options ? (
    <div className={cls}>{content}</div>
  ) : (
    <button className={cls}>{content}</button>
  )
}

function Switch({ on }: { on: boolean }) {
  const reduce = useReducedMotion()
  return (
    <span
      className={`relative flex h-[26px] w-[44px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 ease-out ${
        on ? 'justify-end bg-brand' : 'justify-start bg-brand-line'
      }`}
    >
      <motion.span
        layout={!reduce}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="h-5 w-5 rounded-full bg-white shadow-sm"
      />
    </span>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || name.slice(0, 2).toUpperCase()
}

type Row = {
  icon: PhosphorIcon
  label: string
  hint?: string
  value?: string
  toggle?: { on: boolean; set: (v: boolean) => void }
  options?: { value: string; label: string }[]
  onChange?: (value: string) => void
}

type Section = { title: string; rows: Row[] }

