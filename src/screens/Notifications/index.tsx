import React, { useMemo, useState } from 'react'
import { Bell, Check, CheckCircle, Funnel, Gift, ShieldCheck, Wallet, WifiHigh, X } from '@phosphor-icons/react'
import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { PageHeader } from '@shared/components/PageHeader'
import { TelecelLogo } from '@shared/components/TelecelLogo'

type Props = { onNavigate?: (tab: Tab) => void }
type NotificationItem = { id: number; title: string; body: string; time: string; category: 'transactions' | 'promotions' | 'securite'; unread: boolean; icon: React.ElementType; tone: string }

const initialNotifications: NotificationItem[] = [
  { id: 1, title: 'Transfert effectué', body: 'Votre transfert de 5 000 FCFA vers Awa Ouédraogo a été effectué avec succès.', time: 'Aujourd’hui · 10:42', category: 'transactions', unread: true, icon: Wallet, tone: 'bg-[#EAF3FF] text-[#1766B5]' },
  { id: 2, title: 'Protégez votre compte', body: 'Ne communiquez jamais votre code secret ou votre code OTP, même à un conseiller.', time: 'Aujourd’hui · 08:30', category: 'securite', unread: true, icon: ShieldCheck, tone: 'bg-[#EAF8F0] text-[#159653]' },
  { id: 3, title: 'Une offre vous attend !', body: 'Découvrez les promotions et forfaits disponibles avec Telecel Money.', time: 'Hier · 16:15', category: 'promotions', unread: false, icon: Gift, tone: 'bg-[#FFF4E7] text-[#D98724]' },
  { id: 4, title: 'Forfait Internet activé', body: 'Votre souscription Internet a été prise en compte.', time: 'Hier · 09:12', category: 'transactions', unread: false, icon: WifiHigh, tone: 'bg-[#EAF3FF] text-[#1766B5]' },
]

export default function Notifications({ onNavigate }: Props) {
  const [items, setItems] = useState(initialNotifications)
  const [filter, setFilter] = useState<'tout' | NotificationItem['category']>('tout')
  const [selected, setSelected] = useState<number | null>(null)
  const unreadCount = items.filter((item) => item.unread).length
  const visible = useMemo(() => filter === 'tout' ? items : items.filter((item) => item.category === filter), [filter, items])
  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, unread: false })))
  const openItem = (id: number) => {
    setSelected((current) => current === id ? null : id)
    setItems((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item))
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-[#F7F9FC]">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageHeader title={<TelecelLogo />}>
          <div className="flex items-end justify-between pt-3 pb-1">
            <div><h1 className="text-[23px] font-bold">Notifications</h1><p className="mt-1 text-[12px] text-white/75">{unreadCount ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` : 'Vous êtes à jour'}</p></div>
            <span className="mb-1 flex h-10 min-w-10 items-center justify-center rounded-full bg-white/15 px-3 text-[14px] font-bold">{unreadCount}</span>
          </div>
        </PageHeader>
        <div className="mx-auto max-w-xl space-y-4 px-4 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#173B67]">Votre activité</h2>
            <button onClick={markAllRead} disabled={!unreadCount} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1766B5] disabled:opacity-40"><CheckCircle size={16}/> Tout marquer comme lu</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {([{id:'tout',label:'Tout'},{id:'transactions',label:'Transactions'},{id:'promotions',label:'Promotions'},{id:'securite',label:'Sécurité'}] as const).map((item) => <button key={item.id} onClick={() => setFilter(item.id)} className={`shrink-0 rounded-full border px-3.5 py-2 text-[11px] font-semibold transition-colors ${filter === item.id ? 'border-[#173B67] bg-[#173B67] text-white' : 'border-[#E2EAF2] bg-white text-[#536B84]'}`}>{item.label}</button>)}
          </div>
          <div className="space-y-2.5">
            {visible.map((item) => {
              const Icon = item.icon
              return <button key={item.id} onClick={() => openItem(item.id)} className={`w-full rounded-2xl border p-3.5 text-left transition-colors ${item.unread ? 'border-[#CFE3FA] bg-white shadow-[0_4px_16px_-13px_rgba(23,59,103,0.4)]' : 'border-[#E9EEF4] bg-white'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${item.tone}`}><Icon size={22} weight="duotone"/></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2"><strong className="text-[13px] font-bold text-[#173B67]">{item.title}</strong>{item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#2CA6DA]"/>}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-[#6F8298]">{item.body}</span>
                    <span className="mt-2 flex items-center justify-between text-[10px] text-[#9AA8B7]"><span>{item.time}</span>{selected === item.id ? <span className="flex items-center gap-1 text-[#159653]"><Check size={13}/> Lu</span> : null}</span>
                  </span>
                </div>
              </button>
            })}
            {visible.length === 0 && <div className="rounded-2xl border border-dashed border-[#DCE5EF] bg-white px-5 py-10 text-center"><Bell size={28} className="mx-auto text-[#A9B8C8]"/><p className="mt-2 text-[13px] font-semibold text-[#536B84]">Aucune notification</p><p className="mt-1 text-[11px] text-[#93A1B2]">Cette catégorie est vide pour le moment.</p></div>}
          </div>
          <p className="pt-2 text-center text-[10px] text-[#9AA8B7]">Les notifications importantes de votre compte apparaîtront ici.</p>
        </div>
      </main>
      <BottomNav active="accueil" onNavigate={onNavigate}/>
    </div>
  )
}

