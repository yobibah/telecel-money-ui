import React, { useMemo, useState } from 'react'
import { MagnifyingGlass, X, ArrowLeft, FunnelSimple, LinkSimple, ArrowsLeftRight, Bank, Wallet, CheckCircle, CaretRight, Eye, EyeSlash, LockKey, Plus, Minus, ClockCounterClockwise } from '@phosphor-icons/react'

import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { PageHeader } from '@shared/components/PageHeader'
import { SubPageHeader } from '@shared/components/SubPageHeader'
import { TelecelLogo } from '@shared/components/TelecelLogo'

type Props = { onNavigate?: (tab: Tab) => void }
type Item = { label: string; image?: string; icon?: 'vault' | 'credit'; detail?: string }

const ICONS = {
  electricity: 'https://upload.wikimedia.org/wikipedia/fr/d/d6/Sonabel_logo.svg',
  water: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxVN1J-uc70DphR-2VRuOlQ5MRcqg_MMVVfD6nbVzqNw&s=10',
  bank: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
  ticket: 'https://cdn-icons-png.flaticon.com/512/7655/7655772.png',
  salary: 'https://cdn-icons-png.flaticon.com/512/8386/8386446.png',
  education: 'https://cdn-icons-png.flaticon.com/512/13282/1328242.png',
  finance: 'https://cdn-icons-png.flaticon.com/512/10305/10305834.png',
}

const BRAND_LOGOS = {
  canalbox: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUYdlxcI7MCh5nCMzQ9A4dIvXVsPck72K0xufZ1woKXg&s=10',
  canalplus: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPAPWUYGX7NkrAQ9jSiAhn4qT8YqOVu8GeaWjRC1U0BQ&s=10',
}

const categories = [
  { id: 'facturiers', title: 'Facturiers', description: 'Payez vos factures et abonnements', image: 'https://cdn-icons-png.flaticon.com/512/12638/12638837.png', count: '4 services' },
  { id: 'finances', title: 'Services financiers', description: 'Banques, impôts, écoles et salaires', image: ICONS.bank, count: '4 catégories' },
  { id: 'promotions', title: 'Promotions', description: 'Événements, billetterie et offres', image: ICONS.ticket, count: '2 rubriques' },
  { id: 'coffre', title: 'Coffre-fort', description: 'Mettez votre argent de côté en sécurité', image: 'https://cdn-icons-png.flaticon.com/512/11280/11280591.png', count: 'Épargne' },
  { id: 'nano-credit', title: 'Nano crédit', description: 'Accédez à un petit crédit rapidement', image: 'https://cdn-icons-png.flaticon.com/512/9869/9869878.png', count: 'Crédit' },
]

const details: Record<string, { title: string; subtitle: string; items: Item[] }> = {
  facturiers: {
    title: 'Facturiers',
    subtitle: 'Choisissez le service à régler.',
    items: [
      { label: 'SONABEL', image: ICONS.electricity, detail: 'CashPower · Cashout' },
      { label: 'ONEA', image: ICONS.water, detail: 'Facture d’eau' },
      { label: 'Canalbox', image: BRAND_LOGOS.canalbox, detail: 'Internet & abonnements' },
      { label: 'CANAL+', image: BRAND_LOGOS.canalplus, detail: 'Abonnement TV' },
    ],
  },
  finances: {
    title: 'Services financiers',
    subtitle: 'Sélectionnez le type de paiement ou de transfert.',
    items: [
      { label: 'Banques', image: ICONS.bank, detail: 'Wendkuni Bank' },
      { label: 'Impôts & taxes', image: 'https://esintax.bf/img/logo/logodgi2.png', detail: 'Paiements administratifs' },
      { label: 'Écoles & universités', image: 'https://cdn-icons-png.flaticon.com/512/2997/2997322.png', detail: 'Frais de scolarité' },
      { label: 'Salaires', image: ICONS.salary, detail: 'Versements & paiements' },
    ],
  },
  promotions: {
    title: 'Promotions',
    subtitle: 'Découvrez les offres et expériences disponibles.',
    items: [
      { label: 'Événements et billetterie', image: ICONS.ticket, detail: 'Concerts, spectacles et matchs' },
      { label: 'Offres spéciales', image: ICONS.finance, detail: 'Offres proposées par nos partenaires' },
    ],
  },
  coffre: {
    title: 'Coffre-fort',
    subtitle: 'Mettez de l’argent de côté en toute simplicité.',
    items: [
      { label: 'Mon coffre-fort', icon: 'vault', detail: 'Épargner et sécuriser votre argent' },
    ],
  },
  'nano-credit': {
    title: 'Nano crédit',
    subtitle: 'Un petit financement accessible depuis votre téléphone.',
    items: [
      { label: 'Demander un nano crédit', icon: 'credit', detail: 'Faire une demande de crédit' },
    ],
  },
}

const banks = [
  { name: 'Wendkuni Bank', icon: 'https://wendkunibank.bf/wp-content/uploads/LOGO-WBI.jpg' },
]

export default function MesServices({ onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('tout')
  const [bankView, setBankView] = useState(false)
  const [isBankLinked, setIsBankLinked] = useState(false)
  const [bankAction, setBankAction] = useState<'link' | 'bank-to-wallet' | 'wallet-to-bank' | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [bankPin, setBankPin] = useState('')
  const [bankFeedback, setBankFeedback] = useState('')
  const [vaultBalance, setVaultBalance] = useState(25000)
  const [vaultVisible, setVaultVisible] = useState(false)
  const [vaultAction, setVaultAction] = useState<'deposit' | 'withdraw' | null>(null)
  const [vaultAmount, setVaultAmount] = useState('')
  const [vaultPin, setVaultPin] = useState('')
  const [vaultFeedback, setVaultFeedback] = useState('')
  const vaultDragStart = React.useRef<number | null>(null)
  const [vaultHistory, setVaultHistory] = useState([
    { label: 'Dépôt', date: 'Aujourd’hui · 10:42', amount: 10000, type: 'in' as const },
    { label: 'Retrait', date: 'Hier · 16:18', amount: 5000, type: 'out' as const },
    { label: 'Dépôt', date: '18 nov. · 09:30', amount: 20000, type: 'in' as const },
  ])
  const [nanoAmount, setNanoAmount] = useState('10000')
  const [nanoFeedback, setNanoFeedback] = useState('')
  const active = activeCategory ? details[activeCategory] : null
  const filteredCategories = useMemo(
    () => categories.filter((category) => {
      const matchesQuery = !query.trim() || `${category.title} ${category.description}`.toLowerCase().includes(query.trim().toLowerCase())
      const matchesFilter = categoryFilter === 'tout' || category.id === categoryFilter
      return matchesQuery && matchesFilter
    }),
    [query, categoryFilter],
  )
  const filtered = useMemo(
    () => active?.items.filter((item) =>
      !query.trim() || `${item.label} ${item.detail ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
    ) ?? [],
    [active, query],
  )

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {active ? (
          <SubPageHeader
            title={bankView
              ? bankAction === 'bank-to-wallet' ? 'Banque vers Wallet'
                : bankAction === 'wallet-to-bank' ? 'Wallet vers Banque'
                : 'Wendkuni Bank'
              : activeCategory === 'coffre' ? 'Coffre-fort'
                : activeCategory === 'nano-credit' ? 'Nano crédit'
                : active.title}
            onBack={() => {
              if (bankView && (bankAction === 'bank-to-wallet' || bankAction === 'wallet-to-bank')) {
                setBankAction(null); setBankFeedback(''); return
              }
              if (bankView) {
                setBankView(false); setBankAction(null); setBankFeedback(''); return
              }
              if (activeCategory === 'coffre' && vaultAction) {
                setVaultAction(null); setVaultAmount(''); setVaultPin(''); setVaultFeedback(''); return
              }
              setActiveCategory(null); setQuery(''); setVaultAction(null); setVaultFeedback(''); setNanoFeedback('')
            }}
          />
        ) : (
          <PageHeader title={<TelecelLogo />}>
            <div className="pt-3 pb-1">
              <h1 className="text-[23px] font-bold">Mes services</h1>
            </div>
          </PageHeader>
        )}

        <div className="mx-auto max-w-xl space-y-4 px-4 pt-4 pb-7">
          {active ? (
            bankView ? (
              <section className="space-y-5">
                <div className="flex items-center gap-3 rounded-2xl border border-[#E7ECF2] bg-white p-4">
                  <img src={banks[0].icon} alt="Wendkuni Bank" className="h-12 w-16 object-contain" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-bold text-[#173B67]">Wendkuni Bank</h2>
                    <p className="mt-1 text-[11px] text-[#7A8CA1]">{isBankLinked ? 'Compte bancaire lié' : 'Connectez votre compte à Telecel Money'}</p>
                  </div>
                  {isBankLinked && <CheckCircle size={22} weight="fill" className="text-emerald-500" />}
                </div>

                {bankFeedback && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[12px] font-medium text-emerald-700">{bankFeedback}</div>
                )}

                {!isBankLinked || bankAction === 'link' ? (
                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault()
                      if (accountNumber.trim().length < 5 || bankPin.trim().length < 4) {
                        setBankFeedback('Veuillez vérifier le numéro de compte et le code secret.')
                        return
                      }
                      setIsBankLinked(true)
                      setBankAction(null)
                      setBankFeedback('Votre compte Wendkuni Bank est maintenant lié à Telecel Money.')
                      setAccountNumber('')
                      setBankPin('')
                    }}
                  >
                    <div>
                      <h3 className="text-[16px] font-bold text-[#173B67]">Lier mon compte bancaire</h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#8291A3]">Renseignez les informations de votre compte Wendkuni Bank pour l’associer à votre portefeuille.</p>
                    </div>
                    <label className="block space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#405873]">Numéro de compte</span>
                      <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Ex. 0123456789" className="h-12 w-full rounded-xl border border-[#E2EAF2] px-3 text-[13px] outline-none focus:border-[#2CA6DA]" />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#405873]">Code secret bancaire</span>
                      <input type="password" value={bankPin} onChange={(e) => setBankPin(e.target.value)} placeholder="••••••" className="h-12 w-full rounded-xl border border-[#E2EAF2] px-3 text-[13px] outline-none focus:border-[#2CA6DA]" />
                    </label>
                    <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#173B67] text-[13px] font-bold text-white">
                      <LinkSimple size={17} /> Lier mon compte
                    </button>
                    <p className="text-center text-[10px] leading-relaxed text-[#98A5B4]">Prototype : la liaison bancaire est simulée et ne transmet aucune donnée à la banque.</p>
                  </form>
                ) : bankAction === 'bank-to-wallet' || bankAction === 'wallet-to-bank' ? (
                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault()
                      const amount = Number(transferAmount)
                      if (!Number.isFinite(amount) || amount <= 0) {
                        setBankFeedback('Saisissez un montant valide.')
                        return
                      }
                      setBankFeedback(bankAction === 'bank-to-wallet'
                        ? `Demande de transfert de ${amount.toLocaleString('fr-FR')} FCFA de Wendkuni Bank vers votre wallet enregistrée (simulation).`
                        : `Demande de transfert de ${amount.toLocaleString('fr-FR')} FCFA de votre wallet vers Wendkuni Bank enregistrée (simulation).`)
                      setTransferAmount('')
                      setBankAction(null)
                    }}
                  >
                    <div>
                      <h3 className="text-[16px] font-bold text-[#173B67]">{bankAction === 'bank-to-wallet' ? 'Banque vers Wallet' : 'Wallet vers Banque'}</h3>
                      <p className="mt-1 text-[12px] text-[#8291A3]">{bankAction === 'bank-to-wallet' ? 'Recevez de l’argent depuis votre compte bancaire dans votre wallet.' : 'Envoyez de l’argent de votre wallet vers votre compte bancaire.'}</p>
                    </div>
                    <div className="rounded-xl bg-[#F4F8FB] p-3 text-[12px] text-[#536B84]">
                      {bankAction === 'bank-to-wallet' ? 'Compte source : Wendkuni Bank' : 'Compte bénéficiaire : Wendkuni Bank'}
                    </div>
                    <label className="block space-y-1.5">
                      <span className="text-[12px] font-semibold text-[#405873]">Montant (FCFA)</span>
                      <input type="number" min="1" inputMode="numeric" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Ex. 10 000" className="h-12 w-full rounded-xl border border-[#E2EAF2] px-3 text-[13px] outline-none focus:border-[#2CA6DA]" />
                    </label>
                    <button type="submit" className="h-12 w-full rounded-xl bg-[#173B67] text-[13px] font-bold text-white">Continuer</button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-[15px] font-bold text-[#173B67]">Opérations bancaires</h3>
                    <button onClick={() => { setBankAction('bank-to-wallet'); setBankFeedback('') }} className="flex w-full items-center gap-3 rounded-2xl border border-[#E5ECF3] p-4 text-left transition-colors hover:bg-[#F7FAFC]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5FB] text-[#258DBB]"><Bank size={23} /></span>
                      <span className="min-w-0 flex-1"><strong className="block text-[13px] text-[#173B67]">Bank to Wallet</strong><small className="text-[11px] text-[#8291A3]">Transférer de la banque vers Telecel Money</small></span>
                      <CaretRight size={18} className="text-[#8291A3]" />
                    </button>
                    <button onClick={() => { setBankAction('wallet-to-bank'); setBankFeedback('') }} className="flex w-full items-center gap-3 rounded-2xl border border-[#E5ECF3] p-4 text-left transition-colors hover:bg-[#F7FAFC]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5FB] text-[#258DBB]"><Wallet size={23} /></span>
                      <span className="min-w-0 flex-1"><strong className="block text-[13px] text-[#173B67]">Wallet to Bank</strong><small className="text-[11px] text-[#8291A3]">Transférer de Telecel Money vers la banque</small></span>
                      <CaretRight size={18} className="text-[#8291A3]" />
                    </button>
                    <button onClick={() => { setIsBankLinked(false); setBankAction('link'); setBankFeedback('') }} className="w-full py-2 text-[11px] font-semibold text-[#D05A5A]">Délier ce compte</button>
                  </div>
                )}
              </section>
            ) : activeCategory === 'coffre' ? (
              <section className="space-y-5">
                {vaultAction ? (
                  <div className="fixed inset-0 z-50 flex items-end bg-[#10243D]/35 backdrop-blur-[2px]" onClick={() => { setVaultAction(null); setVaultAmount(''); setVaultPin(''); setVaultFeedback('') }}>
                  <form className="max-h-[88dvh] w-full space-y-4 overflow-y-auto rounded-t-[28px] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(10,40,80,0.18)] animate-in slide-in-from-bottom duration-300" onClick={(event) => event.stopPropagation()} onTouchStart={(event) => { vaultDragStart.current = event.touches[0]?.clientY ?? null }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientY ?? 0; if (vaultDragStart.current !== null && end - vaultDragStart.current > 70) { setVaultAction(null); setVaultAmount(''); setVaultPin(''); setVaultFeedback('') }; vaultDragStart.current = null }} onSubmit={(event) => {
                    event.preventDefault()
                    const amount = Number(vaultAmount)
                    if (!Number.isFinite(amount) || amount <= 0) { setVaultFeedback('Saisissez un montant valide.'); return }
                    if (vaultAction === 'withdraw' && vaultPin.trim().length < 4) { setVaultFeedback('Saisissez votre code secret à 4 chiffres.'); return }
                    if (vaultAction === 'withdraw' && amount > vaultBalance) { setVaultFeedback('Solde insuffisant dans votre coffre-fort.'); return }
                    setVaultBalance((balance) => vaultAction === 'deposit' ? balance + amount : balance - amount)
                    setVaultHistory((history) => [{ label: vaultAction === 'deposit' ? 'Dépôt' : 'Retrait', date: 'À l’instant', amount, type: vaultAction === 'deposit' ? 'in' as const : 'out' as const }, ...history])
                    setVaultFeedback(vaultAction === 'deposit' ? 'Dépôt effectué avec succès (simulation).' : 'Retrait confirmé avec votre code secret (simulation).')
                    setVaultAmount(''); setVaultPin(''); setVaultAction(null)
                  }}>
                    <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-[#D9E2EC]" aria-hidden="true" />
                    <div className="rounded-2xl bg-[#F1F7FF] p-4"><p className="text-[12px] font-semibold text-[#0755B5]">{vaultAction === 'deposit' ? 'Alimenter mon coffre' : 'Retirer de mon coffre'}</p><p className="mt-1 text-[11px] text-[#7890AA]">Solde disponible : {vaultVisible ? `${vaultBalance.toLocaleString('fr-FR')} FCFA` : '•••••• FCFA'}</p></div>
                    <label className="block space-y-2"><span className="text-[12px] font-semibold text-[#405873]">Montant (FCFA)</span><input type="number" min="1" inputMode="numeric" value={vaultAmount} onChange={(e) => setVaultAmount(e.target.value)} placeholder="Ex. 5 000" className="h-12 w-full rounded-xl border border-[#E2EAF2] px-3 text-[14px] outline-none focus:border-[#2CA6DA]" /></label>
                    {vaultAction === 'withdraw' && <label className="block space-y-2"><span className="text-[12px] font-semibold text-[#405873]">Code secret</span><span className="relative block"><input type="password" inputMode="numeric" maxLength={6} value={vaultPin} onChange={(e) => setVaultPin(e.target.value.replace(/\\D/g, ''))} placeholder="••••" className="h-12 w-full rounded-xl border border-[#E2EAF2] px-3 pr-10 text-[14px] tracking-[0.35em] outline-none focus:border-[#2CA6DA]" /><LockKey size={18} className="absolute right-3 top-3.5 text-[#8A9AAF]" /></span></label>}
                    {vaultFeedback && <p className="rounded-xl bg-[#FFF7E8] p-3 text-[12px] text-[#9A6814]">{vaultFeedback}</p>}
                    <button type="submit" className="h-12 w-full rounded-xl bg-[#0755B5] text-[13px] font-bold text-white">Confirmer {vaultAction === 'deposit' ? 'le dépôt' : 'le retrait'}</button>
                    <button type="button" onClick={() => { setVaultAction(null); setVaultFeedback('') }} className="w-full py-2 text-[12px] font-semibold text-[#6D8095]">Annuler</button>
                  </form>
                  </div>
                ) : <>
                  <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#06499F] via-[#0755B5] to-[#2C86D5] p-5 text-white shadow-xl shadow-blue-200/60"><div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[22px] border-white/[0.07]" /><div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-7 h-40 w-40 rounded-full border border-white/15" /><div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rotate-[-28deg] rounded-[38px] border-[18px] border-[#75B9F5]/10" /><svg aria-hidden="true" viewBox="0 0 180 100" className="pointer-events-none absolute bottom-0 right-0 h-28 w-48 text-white/[0.09]"><path d="M180 0C130 0 130 48 80 48S30 100 0 100M180 28c-38 0-38 36-76 36S66 100 30 100" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="145" cy="76" r="3" fill="currentColor"/><circle cx="160" cy="88" r="2" fill="currentColor"/></svg><div className="relative z-10"><div className="flex items-center justify-between"><span className="text-[12px] font-semibold tracking-wide text-white/85">Mon épargne</span><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner"><img src="https://cdn-icons-png.flaticon.com/512/11280/11280591.png" alt="" className="h-8 w-8 object-contain brightness-0 invert" /></span></div><div className="mt-6 flex items-center gap-3"><p className="text-[27px] font-bold tracking-wide">{vaultVisible ? `${vaultBalance.toLocaleString('fr-FR')} FCFA` : '•••••••• FCFA'}</p><button type="button" aria-label={vaultVisible ? 'Masquer le solde' : 'Afficher le solde'} onClick={() => setVaultVisible((visible) => !visible)} className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20">{vaultVisible ? <EyeSlash size={19} /> : <Eye size={19} />}</button></div><p className="mt-2 text-[11px] text-white/75">Solde de votre coffre-fort</p></div></div>
                  {vaultFeedback && <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[12px] font-medium text-emerald-700">{vaultFeedback}</p>}
                  <div className="grid grid-cols-2 gap-3"><button onClick={() => { setVaultAction('deposit'); setVaultFeedback('') }} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0755B5] text-[13px] font-bold text-white"><Plus size={18} /> Dépôt</button><button onClick={() => { setVaultAction('withdraw'); setVaultFeedback('') }} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D9E6F4] bg-white text-[13px] font-bold text-[#0755B5]"><Minus size={18} /> Retrait</button></div>
                  <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#173B67]">Mini historique</h2><ClockCounterClockwise size={19} className="text-[#7E91A7]" /></div><div className="divide-y divide-[#EDF1F6] rounded-2xl border border-[#E8EEF5] bg-white px-3">{vaultHistory.map((entry, index) => <div key={`${entry.label}-${entry.date}-${index}`} className="flex items-center gap-3 py-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${entry.type === 'in' ? 'bg-[#EAF8F2] text-[#159765]' : 'bg-[#FFF2EB] text-[#D97745]'}`}>{entry.type === 'in' ? <Plus size={17} /> : <Minus size={17} />}</span><span className="min-w-0 flex-1"><strong className="block text-[12px] text-[#173B67]">{entry.label}</strong><small className="text-[10px] text-[#91A0B0]">{entry.date}</small></span><strong className={`text-[12px] ${entry.type === 'in' ? 'text-[#159765]' : 'text-[#D97745]'}`}>{entry.type === 'in' ? '+' : '−'}{entry.amount.toLocaleString('fr-FR')} F</strong></div>)}</div></div>
                  <p className="text-center text-[10px] text-[#98A5B4]">Prototype : les opérations sont simulées.</p>
                </>}
              </section>
            ) : activeCategory === 'nano-credit' ? (
              <section className="space-y-5">
                <div className="rounded-3xl bg-gradient-to-br from-[#EAF8F2] to-[#F5FBF8] p-5"><div className="flex items-center gap-3"><img src="https://cdn-icons-png.flaticon.com/512/9869/9869878.png" alt="" className="h-14 w-14 rounded-2xl bg-white p-2 object-contain" /><div><h2 className="text-[17px] font-bold text-[#173B67]">Un coup de pouce rapide</h2><p className="mt-1 text-[11px] text-[#6F8790]">Faites une demande de nano crédit.</p></div></div></div>
                <div className="space-y-2"><h3 className="text-[15px] font-bold text-[#173B67]">Simuler une demande</h3><p className="text-[12px] text-[#8291A3]">Choisissez le montant souhaité pour commencer.</p></div>
                <div className="grid grid-cols-2 gap-3">{['5000','10000','15000','25000'].map((amount) => <button key={amount} onClick={() => setNanoAmount(amount)} className={`rounded-xl border p-3 text-[13px] font-bold ${nanoAmount === amount ? 'border-[#159765] bg-[#EAF8F2] text-[#137D55]' : 'border-[#E3EAF2] bg-white text-[#405873]'}`}>{Number(amount).toLocaleString('fr-FR')} FCFA</button>)}</div>
                <div className="rounded-2xl border border-[#E8EEF5] p-4"><div className="flex justify-between text-[12px]"><span className="text-[#8291A3]">Montant demandé</span><strong className="text-[#173B67]">{Number(nanoAmount).toLocaleString('fr-FR')} FCFA</strong></div><div className="mt-3 flex justify-between text-[12px]"><span className="text-[#8291A3]">Durée indicative</span><strong className="text-[#173B67]">À confirmer</strong></div></div>
                {nanoFeedback && <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[12px] font-medium text-emerald-700">{nanoFeedback}</p>}
                <button onClick={() => setNanoFeedback(`Votre demande de ${Number(nanoAmount).toLocaleString('fr-FR')} FCFA a été enregistrée (simulation).`)} className="h-12 w-full rounded-xl bg-[#159765] text-[13px] font-bold text-white">Faire une demande</button>
                <p className="text-center text-[10px] leading-relaxed text-[#98A5B4]">La demande est simulée. Les conditions, frais et l’éligibilité devront être confirmés par Telecel Money.</p>
              </section>
            ) : (
            <>
              <label className="flex h-11 items-center gap-3 rounded-xl border border-[#E3EAF2] bg-white px-3.5 shadow-sm focus-within:border-[#2CA6DA]">
                <MagnifyingGlass size={19} className="text-[#173B67]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Rechercher dans ${active.title.toLowerCase()}`}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#173B67] outline-none placeholder:text-[#8B9AAF]"
                />
                {query && <button onClick={() => setQuery('')} aria-label="Effacer"><X size={17} /></button>}
              </label>

              <div className="py-1">
                <div className="mb-4">
                  <h2 className="text-[15px] font-bold text-[#173B67]">{active.title}</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {filtered.map((item) => (
                    <button key={item.label} className="flex min-h-[112px] flex-col items-center justify-center gap-2 p-2 text-center transition-transform active:scale-[0.97]">
                      {item.image && <img src={item.image} alt="" loading="lazy" className="h-12 w-12 object-contain" />}
                      <span className="block text-[12px] font-semibold leading-tight text-[#173B67]">{item.label}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="py-8 text-center text-[13px] text-[#8493A5]">Aucun résultat.</p>}
                </div>

                {activeCategory === 'finances' && !query && (
                  <div className="mt-4 border-t border-[#EDF1F6] pt-3">
                    <p className="mb-2 text-[12px] font-semibold text-[#173B67]">Banque partenaire</p>
                    <div className="grid grid-cols-3 gap-3">
                      {banks.map((bank, index) => (
                        <button key={bank.name} onClick={() => { setBankView(true); setBankAction(isBankLinked ? null : 'link'); setBankFeedback('') }} className="flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-2xl border border-[#E7ECF2] bg-white p-3 text-center shadow-[0_3px_12px_-10px_rgba(23,59,103,0.25)] transition-colors hover:border-[#2CA6DA]">
                          <span className="flex h-12 w-full items-center justify-center rounded-xl bg-white">
                            <img src={bank.icon} alt={bank.name} loading="lazy" className="h-11 max-w-full object-contain" />
                          </span>
                          <span className="text-[11px] font-semibold leading-tight text-[#405873]">{bank.name}</span>
                          <span className="text-[10px] font-semibold text-[#258DBB]">{isBankLinked ? 'Compte lié · Gérer' : 'Lier mon compte'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-center text-[9px] text-[#93A1B2]">Icônes : Flaticon</p>
            </>
            )
          ) : (
            <>
              <label className="flex h-12 items-center gap-3 rounded-xl border border-[#E3EAF2] bg-white px-3.5 shadow-sm focus-within:border-[#2CA6DA]">
                <MagnifyingGlass size={20} className="text-[#173B67]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un service..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#173B67] outline-none placeholder:text-[#8B9AAF]"
                />
                {query && <button onClick={() => setQuery('')} aria-label="Effacer la recherche" className="text-[#71849A]"><X size={17} /></button>}
              </label>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#173B67]">
                  <FunnelSimple size={16} weight="bold" />
                  <span>Filtrer par catégorie</span>
                </div>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {[
                    { id: 'tout', label: 'Tout' },
                    { id: 'facturiers', label: 'Facturiers' },
                    { id: 'finances', label: 'Services financiers' },
                    { id: 'promotions', label: 'Promotions' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setCategoryFilter(filter.id)}
                      className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-colors ${categoryFilter === filter.id ? 'border-[#173B67] bg-[#173B67] text-white' : 'border-[#E2EAF2] bg-white text-[#536B84]'}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => { setActiveCategory(category.id); setQuery('') }}
                    className="flex min-h-[124px] flex-col items-center justify-center gap-3 p-2 text-center transition-transform active:scale-[0.97]"
                  >
                    <img src={category.image} alt="" className="h-14 w-14 object-contain" />
                    <span className="block text-[14px] font-bold leading-tight text-[#173B67]">{category.title}</span>
                  </button>
                ))}
                {filteredCategories.length === 0 && (
                  <p className="col-span-3 py-8 text-center text-[13px] text-[#8493A5]">Aucun service ne correspond à votre recherche.</p>
                )}
              </div>
              <p className="px-1 text-center text-[9px] text-[#93A1B2]">Icônes : Flaticon</p>
            </>
          )}
        </div>
      </main>
      <BottomNav active="services" onNavigate={onNavigate} />
    </div>
  )
}

