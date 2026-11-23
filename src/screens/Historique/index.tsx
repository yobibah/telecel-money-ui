import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowsLeftRight,
  CheckCircle,
  DeviceMobile,
  Plus,
  PaperPlaneTilt,
  WifiHigh,
  ChatCircleDots,
  PhoneCall,
  ArrowsClockwise,
  ArrowLeft,
  CaretRight,
  CaretDown,
  CalendarBlank,
  MoonStars,
  X,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { PageHeader } from '@shared/components/PageHeader'
import { SubPageHeader } from '@shared/components/SubPageHeader'
import { TelecelLogo } from '@shared/components/TelecelLogo'

export const args = {
  state: 'empty',
}
export const argTypes = {
  state: { control: 'radio', options: ['default', 'empty'] },
}

type Props = Partial<typeof args> & { onNavigate?: (tab: Tab) => void }

type CreditOperation = {
  id: string
  title: string
  subtitle: string
  amount: number
  time: string
  kind: 'sent' | 'received' | 'recharge' | 'deposit' | 'transfer' | 'withdrawal'
}

const INITIAL_OPERATIONS: CreditOperation[] = [
  { id: 'c1', title: 'Transfert', subtitle: 'À Awa Ouédraogo · 70 12 34 56', amount: -500, time: 'Aujourd’hui, 10:42', kind: 'transfer' },
  { id: 'c2', title: 'Dépôt', subtitle: 'Dépôt sur votre compte Telecel Money', amount: 2000, time: 'Aujourd’hui, 08:15', kind: 'deposit' },
  { id: 'c3', title: 'Retrait', subtitle: 'Retrait auprès d’un point partenaire', amount: -1000, time: 'Hier, 18:30', kind: 'withdrawal' },
  { id: 'c4', title: 'Dépôt', subtitle: 'Dépôt effectué sur votre compte', amount: 1000, time: 'Hier, 14:12', kind: 'deposit' },
  { id: 'c5', title: 'Transfert', subtitle: 'À Moussa Traoré · 65 21 43 87', amount: -300, time: '18 nov. 2026, 17:25', kind: 'transfer' },
  { id: 'c6', title: 'Retrait', subtitle: 'Retrait auprès d’un point partenaire', amount: -500, time: '18 nov. 2026, 09:10', kind: 'withdrawal' },
]

export default function MonArgent({ onNavigate }: Props) {
  const [operations, setOperations] = useState(INITIAL_OPERATIONS)
  const [showSend, setShowSend] = useState(false)
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('500')
  const [success, setSuccess] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [activeGroup, setActiveGroup] = useState<'internet' | 'credit' | 'international' | 'fidelite' | 'carte' | null>(null)
  const [internetType, setInternetType] = useState('Tous')
  const [selectedOffer, setSelectedOffer] = useState<{ volume: string; price: string; valid: string; type: string } | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [servicePhone, setServicePhone] = useState('')
  const [serviceAmount, setServiceAmount] = useState('500')
  const [serviceQuery, setServiceQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null)
  const [serviceCountry, setServiceCountry] = useState('Côte d’Ivoire')
  const [serviceOption, setServiceOption] = useState('')
  const [serviceDone, setServiceDone] = useState(false)
  const reduce = useReducedMotion()
  const demoContacts = [{name:'Awa Ouédraogo',phone:'70 12 34 56'},{name:'Issa Sawadogo',phone:'76 45 23 10'},{name:'Mariam Kaboré',phone:'70 45 67 89'},{name:'Moussa Traoré',phone:'65 21 43 87'}]
  const openService = (label: string) => { setSelectedService(label); setServicePhone(''); setServiceAmount('500'); setServiceQuery(''); setSelectedContact(null); setServiceOption(''); setServiceDone(false) }
  const choosePhoneContact = async () => {
    const contactsApi = (navigator as any).contacts
    if (contactsApi?.select) {
      try { const picked = await contactsApi.select(['name','tel'], {multiple:false}); if (picked?.[0]) { const name = Array.isArray(picked[0].name) ? picked[0].name[0] : 'Contact'; const phoneValue = Array.isArray(picked[0].tel) ? picked[0].tel[0] : ''; setSelectedContact({name,phone:phoneValue}); setServicePhone(phoneValue) } } catch { /* Le sélecteur natif peut être indisponible ou annulé. */ }
    } else { setServiceQuery(' ') }
  }
  const submitService = () => {
    if (!selectedService) return
    const needsContact = ['Transfert de crédit','Envoyer du crédit','Transfert international'].includes(selectedService)
    if (needsContact && servicePhone.trim().length < 8) return
    if (['Recharger','Acheter un pass','Forfaits SMS','Forfaits appels','Transfert de crédit','Envoyer du crédit','Transfert international'].includes(selectedService) && (!Number.isFinite(Number(serviceAmount)) || Number(serviceAmount) <= 0)) return
    if (selectedService === 'Transfert de crédit' || selectedService === 'Envoyer du crédit' || selectedService === 'Transfert international') {
      const value = Number(serviceAmount)
      setOperations(items => [{id:String(Date.now()),title:selectedService,subtitle:`À ${selectedContact?.name || servicePhone}${selectedService === 'Transfert international' ? ` · ${serviceCountry}` : ''}`,amount:-value,time:'À l’instant',kind:'transfer'},...items])
    }
    setServiceDone(true)
  }
  const creditBalance = useMemo(
    () => 2750 + operations.reduce((sum, item) => sum + item.amount, 0) - 2500,
    [operations],
  )

  const sendCredit = () => {
    const value = Number(amount)
    if (phone.trim().length < 8 || !Number.isFinite(value) || value <= 0 || value > creditBalance) return
    setOperations((items) => [
      { id: String(Date.now()), title: 'Transfert', subtitle: `À ${phone}`, amount: -value, time: 'À l’instant', kind: 'transfer' },
      ...items,
    ])
    setSuccess(true)
    setPhone('')
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {activeGroup ? (
          <SubPageHeader
            title={selectedService || (selectedOffer ? 'Détails du forfait' : activeGroup === 'internet' ? 'Internet' : activeGroup === 'credit' ? 'Crédit & services' : activeGroup === 'international' ? 'International' : activeGroup === 'carte' ? 'Carte virtuelle' : 'Services pratiques')}
            onBack={() => {
              if (selectedService) setSelectedService(null)
              else if (selectedOffer) setSelectedOffer(null)
              else setActiveGroup(null)
            }}
          />
        ) : (
          <PageHeader title={<TelecelLogo />}>
            <div className="pt-3 pb-1">
              <h1 className="text-[23px] font-bold text-white">Achats</h1>
            </div>
          </PageHeader>
        )}
        <div className="mx-auto max-w-xl px-4 pb-7 pt-4">
          {!activeGroup && <section className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_5px_16px_-12px_rgba(0,51,124,0.28)] ring-1 ring-brand-line/50">
            <MoneyPattern />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft"><img src="https://cdn-icons-png.flaticon.com/512/2534/2534215.png" alt="" className="h-5 w-5 object-contain" /></span>
                  Solde prépayé
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand">
                  {showBalance ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-[28px] font-extrabold leading-none tracking-tight tabular-nums">{showBalance ? Math.max(0, creditBalance).toLocaleString('fr-FR') : '••••••'}</p>
                <span className="pb-0.5 text-[14px] font-semibold text-ink/75">FCFA</span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted">Crédit disponible sur votre numéro Telecel</p>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-brand-line/60 pt-3"><div><p className="text-[10px] text-muted">Crédit</p><p className="mt-1 text-[14px] font-bold">{showBalance ? '51 F' : '•••'}</p></div><div><p className="text-[10px] text-muted">Internet</p><p className="mt-1 text-[14px] font-bold">{showBalance ? '0 Mo' : '•••'}</p></div><div><p className="text-[10px] text-muted">SMS</p><p className="mt-1 text-[14px] font-bold">{showBalance ? '0 SMS' : '•••'}</p></div></div>
            </div>
          </section>}

          {selectedService ? (
            <section className="space-y-4">
              {serviceDone ? <div className="rounded-[22px] border border-[#D9F0E2] bg-[#F2FBF5] px-5 py-8 text-center"><CheckCircle size={54} weight="duotone" className="mx-auto text-[#159653]"/><h2 className="mt-3 text-[18px] font-bold text-ink">Demande enregistrée</h2><p className="mt-1 text-[12px] text-muted">Cette opération est simulée dans la maquette. Aucun paiement ni transfert réel n’a été effectué.</p><button onClick={()=>setSelectedService(null)} className="mt-5 w-full rounded-xl bg-brand py-3 text-[13px] font-bold text-white">Terminer</button></div> : <>
                <div className="rounded-[20px] bg-[#F2F8FD] p-4"><p className="text-[13px] font-bold text-ink">{selectedService === 'Transfert international' ? 'Envoyez de l’argent à l’étranger' : selectedService === 'Transfert de crédit' || selectedService === 'Envoyer du crédit' ? 'Choisissez un destinataire' : `Configurer : ${selectedService}`}</p><p className="mt-1 text-[11px] leading-relaxed text-muted">{selectedService === 'Transfert international' ? 'Sélectionnez le pays et renseignez le bénéficiaire.' : 'Renseignez les informations propres à ce service pour continuer.'}</p></div>
                {['Transfert de crédit','Envoyer du crédit','Transfert international'].includes(selectedService) && <div className="space-y-2"><label className="block text-[12px] font-semibold text-ink">Numéro du bénéficiaire</label><div className="flex gap-2"><input value={servicePhone} onChange={e=>{setServicePhone(e.target.value);setSelectedContact(null)}} placeholder="Ex. 70 12 34 56" inputMode="tel" className="min-w-0 flex-1 rounded-xl border border-[#DCE5F0] px-3 py-3 text-[13px] outline-none focus:border-brand"/><button onClick={choosePhoneContact} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-soft px-3 text-[11px] font-bold text-brand"><DeviceMobile size={17}/> Contacts</button></div>{selectedContact && <p className="text-[11px] font-semibold text-[#159653]">{selectedContact.name} sélectionné</p>}{serviceQuery !== '' && <div className="rounded-xl border border-brand-line bg-white p-2"><p className="px-2 pb-2 text-[10px] font-semibold uppercase text-muted">Contacts disponibles</p>{demoContacts.filter(c=>`${c.name} ${c.phone}`.toLowerCase().includes(serviceQuery.trim().toLowerCase()) || serviceQuery.trim()==='').map(c=><button key={c.phone} onClick={()=>{setSelectedContact(c);setServicePhone(c.phone);setServiceQuery('')}} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-brand-soft"><span className="text-[12px] font-semibold text-ink">{c.name}</span><span className="text-[11px] text-muted">{c.phone}</span></button>)}</div>}<input value={serviceQuery.trim()===''?'':serviceQuery} onChange={e=>setServiceQuery(e.target.value)} placeholder="Rechercher un contact par nom ou numéro" className="w-full rounded-xl border border-[#DCE5F0] px-3 py-2.5 text-[11px] outline-none focus:border-brand"/></div>}
                {selectedService === 'Transfert international' && <div><label className="mb-2 block text-[12px] font-semibold text-ink">Pays de destination</label><select value={serviceCountry} onChange={e=>setServiceCountry(e.target.value)} className="w-full rounded-xl border border-[#DCE5F0] bg-white px-3 py-3 text-[13px] text-ink"><option>Côte d’Ivoire</option><option>Mali</option><option>Togo</option><option>Bénin</option><option>Sénégal</option><option>Niger</option><option>Ghana</option><option>France</option></select></div>}
                {['Recharger','Postpayé','Services mobiles','Gestion des mégas','Clé de connexion','eSIM'].includes(selectedService) && <div><label className="mb-2 block text-[12px] font-semibold text-ink">{selectedService==='Postpayé'?'Numéro de compte ou de ligne':selectedService==='eSIM'?'Adresse e-mail de réception':'Numéro Telecel'}</label><input value={servicePhone} onChange={e=>setServicePhone(e.target.value)} placeholder={selectedService==='eSIM'?'nom@exemple.com':'Ex. 70 12 34 56'} className="w-full rounded-xl border border-[#DCE5F0] px-3 py-3 text-[13px] outline-none focus:border-brand"/></div>}
                {['Acheter un pass','Forfaits SMS','Forfaits appels','Free Roaming'].includes(selectedService) && <div><label className="mb-2 block text-[12px] font-semibold text-ink">Choisir une formule</label><div className="grid grid-cols-2 gap-2">{(selectedService==='Forfaits SMS'?['100 SMS · 100 F','500 SMS · 300 F']:selectedService==='Forfaits appels'?['30 min · 250 F','1 h · 500 F']:selectedService==='Free Roaming'?['Pass Afrique','Pass International']:['Pass Jour','Pass Semaine','Pass Mois']).map(option=><button key={option} onClick={()=>setServiceOption(option)} className={`rounded-xl border p-3 text-[11px] font-semibold ${serviceOption===option?'border-brand bg-brand-soft text-brand':'border-brand-line bg-white text-ink'}`}>{option}</button>)}</div></div>}
                {['Recharger','Acheter un pass','Forfaits SMS','Forfaits appels','Transfert de crédit','Envoyer du crédit','Transfert international','Postpayé'].includes(selectedService) && <div><label className="mb-2 block text-[12px] font-semibold text-ink">Montant (FCFA)</label><input value={serviceAmount} onChange={e=>setServiceAmount(e.target.value)} inputMode="numeric" className="w-full rounded-xl border border-[#DCE5F0] px-3 py-3 text-[13px] outline-none focus:border-brand"/><div className="mt-2 flex gap-2">{['500','1000','2000','5000'].map(v=><button key={v} onClick={()=>setServiceAmount(v)} className={`flex-1 rounded-lg py-2 text-[10px] font-bold ${serviceAmount===v?'bg-brand text-white':'bg-brand-soft text-brand'}`}>{Number(v).toLocaleString('fr-FR')} F</button>)}</div></div>}
                {selectedService==='Bonus de réception' || selectedService==='Bip Telecel' || selectedService==='Conserver mon numéro' ? <div className="rounded-xl border border-brand-line p-4"><p className="text-[12px] font-semibold text-ink">{selectedService==='Bonus de réception'?'Consultez les conditions et avantages du bonus de réception.':selectedService==='Bip Telecel'?'Activez le service Bip Telecel sur votre ligne.':'Consultez les démarches pour conserver votre numéro.'}</p><p className="mt-1 text-[10px] text-muted">Les modalités seront confirmées par Telecel Faso.</p></div> : null}
                <button onClick={submitService} disabled={(['Transfert de crédit','Envoyer du crédit','Transfert international'].includes(selectedService)&&servicePhone.trim().length<8)||(['Recharger','Acheter un pass','Forfaits SMS','Forfaits appels','Transfert de crédit','Envoyer du crédit','Transfert international','Postpayé'].includes(selectedService)&&Number(serviceAmount)<=0)||(['Acheter un pass','Forfaits SMS','Forfaits appels','Free Roaming'].includes(selectedService)&&!serviceOption)} className="w-full rounded-xl bg-brand py-3.5 text-[13px] font-bold text-white disabled:opacity-40">{selectedService==='Transfert international'?'Continuer le transfert':selectedService==='Transfert de crédit'||selectedService==='Envoyer du crédit'?'Confirmer le transfert':'Continuer'}</button><p className="text-center text-[10px] text-muted">Prototype de démonstration · aucune transaction réelle</p>
              </>}</section>
          ) : activeGroup === null ? (
            <>
              <section className="mt-5 space-y-3"><h2 className="text-[16px] font-bold text-ink">Mes services</h2><div className="grid grid-cols-3 gap-3">
                <button onClick={()=>setActiveGroup('internet')} className="flex h-[142px] min-w-0 flex-col items-center justify-start gap-2 rounded-[18px] bg-transparent px-1.5 py-2 text-center transition active:scale-[0.98] [&>span:nth-of-type(3)]:hidden"><span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-brand-line/70 bg-[#F2F8FD]"><img src="https://cdn-icons-png.flaticon.com/512/7175/7175450.png" alt="" className="h-[54px] w-[54px] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(43%) saturate(1536%) hue-rotate(177deg) brightness(92%) contrast(92%)' }}/></span><span className="block text-[14px] font-bold text-ink">Internet</span><span className="block text-[10px] text-muted">Forfaits & pass</span></button>
                <button onClick={()=>setActiveGroup('credit')} className="flex h-[142px] min-w-0 flex-col items-center justify-start gap-2 rounded-[18px] bg-transparent px-1.5 py-2 text-center transition active:scale-[0.98] [&>span:nth-of-type(3)]:hidden"><span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-brand-line/70 bg-[#F2F8FD]"><img src="https://cdn-icons-png.flaticon.com/512/17653/17653501.png" alt="" className="h-[54px] w-[54px] object-contain"/></span><span className="block text-[14px] font-bold text-ink">Crédit & services</span><span className="block text-[10px] text-muted">Recharge, SMS, appels…</span></button>
                <button onClick={()=>setActiveGroup('international')} className="hidden flex h-[142px] min-w-0 flex-col items-center justify-start gap-2 rounded-[18px] bg-transparent px-1.5 py-2 text-center transition active:scale-[0.98] [&>span:nth-of-type(3)]:hidden"><span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-brand-line/70 bg-[#F2F8FD]"><img src="https://cdn-icons-png.flaticon.com/512/1083/1083618.png" alt="" className="h-[54px] w-[54px] object-contain"/></span><span className="block text-[14px] font-bold text-ink">International</span><span className="block text-[10px] text-muted">Roaming & appels internationaux</span></button>
                <button onClick={()=>setActiveGroup('carte')} className="flex h-[142px] min-w-0 flex-col items-center justify-start gap-2 rounded-[18px] bg-transparent px-1.5 py-2 text-center transition active:scale-[0.98] [&>span:nth-of-type(3)]:hidden"><span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-brand-line/70 bg-[#F2F8FD]"><img src="https://cdn-icons-png.flaticon.com/512/6963/6963703.png" alt="" className="h-[54px] w-[54px] object-contain"/></span><span className="flex min-h-[32px] items-center justify-center text-[12px] font-bold leading-tight text-ink">Carte virtuelle</span></button>
                <button onClick={()=>setActiveGroup('fidelite')} className="hidden flex h-[142px] min-w-0 flex-col items-center justify-start gap-2 rounded-[18px] bg-transparent px-1.5 py-2 text-center transition active:scale-[0.98] [&>span:nth-of-type(3)]:hidden"><span className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[18px] border border-brand-line/70 bg-[#F2F8FD]"><img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" alt="" className="h-[54px] w-[54px] object-contain"/></span><span className="block text-[14px] font-bold text-ink">Services pratiques</span><span className="block text-[10px] text-muted">Bip, recharge à distance…</span></button>
              </div></section>
              <section className="mt-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-[16px] font-bold text-ink">6 dernières opérations</h2><button className="flex items-center gap-1 text-[12px] font-medium text-muted" onClick={()=>onNavigate?.('historique')}>Voir tout <CaretRight size={15} className="text-brand"/></button></div><div className="overflow-hidden rounded-[20px] ring-1 ring-brand-line/60 bg-white px-3">{operations.slice(0,6).map((item,index)=>{const incoming=item.amount>0;const Icon=item.kind==='deposit'?Plus:item.kind==='transfer'?PaperPlaneTilt:item.kind==='withdrawal'?ArrowUpRight:item.kind==='sent'?ArrowUpRight:item.kind==='received'?ArrowDownLeft:DeviceMobile;const iconStyle=item.kind==='deposit'?'bg-[#F0FAF4] text-[#159653]':item.kind==='transfer'?'bg-[#F2F7FD] text-[#1769AA]':item.kind==='withdrawal'?'bg-[#FFF5ED] text-[#D97706]':incoming?'bg-[#F0FAF4] text-[#159653]':'bg-[#F2F7FD] text-[#173B67]';return <div key={item.id} className={`flex items-center gap-3 py-3.5 ${index?'border-t border-[#E1EAF3]':''}`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}><Icon size={20} weight="bold"/></span><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-ink">{item.title}</p><p className="mt-0.5 truncate text-[10px] text-muted">{item.subtitle}</p><p className="mt-1 text-[10px] text-[#91A0B2]">{item.time}</p></div><p className={`shrink-0 text-[13px] font-bold tabular-nums ${incoming?'text-[#62CB91]':'text-ink'}`}>{item.amount>0?'+':'−'}{Math.abs(item.amount).toLocaleString('fr-FR')} F</p><CaretRight size={17} className="text-[#91A0B2]"/></div>})}</div></section>
            </>
          ) : <section className="space-y-4">
            {activeGroup==='carte' ? <div className="space-y-4"><div className="rounded-[22px] bg-gradient-to-br from-[#173B67] via-[#20588C] to-[#2CA6DA] p-5 text-white shadow-lg"><div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-white/75">TELECEL MONEY</p><p className="mt-1 text-[17px] font-bold">Carte virtuelle</p></div><span className="rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold">VISA</span></div><div className="mt-9 flex items-center gap-2"><span className="h-7 w-9 rounded-md border border-white/50 bg-gradient-to-br from-[#F6E5B8] to-[#D6B66E]"/><span className="text-[11px] text-white/75">Carte de démonstration</span></div><p className="mt-4 text-[18px] font-semibold tracking-[0.18em]">•••• •••• •••• 4826</p><div className="mt-4 flex items-end justify-between"><div><p className="text-[9px] uppercase text-white/65">Titulaire</p><p className="mt-1 text-[11px] font-semibold">VOTRE NOM</p></div><div><p className="text-[9px] uppercase text-white/65">Expire</p><p className="mt-1 text-[11px] font-semibold">••/••</p></div></div></div><div className="rounded-2xl border border-brand-line/70 bg-white p-4"><h3 className="text-[14px] font-bold text-ink">Votre carte virtuelle</h3><p className="mt-1 text-[12px] leading-relaxed text-muted">Une carte dématérialisée pour effectuer vos paiements sur les sites et applications compatibles.</p><button className="mt-4 w-full rounded-xl bg-brand py-3.5 text-[13px] font-bold text-white" onClick={()=>setSuccess(true)}>Demander une carte virtuelle</button><p className="mt-3 text-center text-[10px] text-muted">Fonctionnalité présentée en démonstration · aucune carte réelle n’est créée.</p></div></div> : activeGroup==='internet' ? (selectedOffer ? <div className="space-y-4"><div className="rounded-2xl border border-brand-line/60 bg-white p-5"><span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold text-brand">Forfait {selectedOffer.type}</span><p className="mt-4 text-[34px] font-extrabold tracking-tight text-ink">{selectedOffer.volume}</p><p className="mt-1 text-[24px] font-bold text-brand">{selectedOffer.price}</p><div className="mt-4 flex items-center justify-between border-t border-brand-line/60 pt-3 text-[12px]"><span className="text-muted">Validité</span><strong className="text-ink">{selectedOffer.valid}</strong></div>{selectedOffer.type === 'Nuit' && <p className="mt-3 rounded-xl bg-brand-soft p-3 text-[12px] text-muted">Utilisable de 00h00 à 07h00.</p>}</div><div className="rounded-2xl bg-[#F5F9FC] p-4"><h3 className="text-[14px] font-bold text-ink">Comment souscrire ?</h3><p className="mt-1 text-[12px] leading-relaxed text-muted">Composez le code USSD ci-dessous depuis votre numéro Telecel pour accéder au menu de souscription.</p><p className="mt-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-center text-[20px] font-extrabold tracking-wide text-brand">{selectedOffer.type === 'Jour' ? '*160*1*1#' : selectedOffer.type === 'Mois' ? '*160*1*3#' : selectedOffer.type === 'Nuit' ? '*160*1*4#' : '*808*5*1*1*5#'}</p><a href={selectedOffer.type === 'Jour' ? 'tel:*160*1*1%23' : selectedOffer.type === 'Mois' ? 'tel:*160*1*3%23' : selectedOffer.type === 'Nuit' ? 'tel:*160*1*4%23' : 'tel:*808*5*1*1*5%23'} className="mt-3 flex h-12 items-center justify-center rounded-xl bg-brand text-[13px] font-bold text-white">Composer le code de souscription</a></div><button onClick={() => setSelectedOffer(null)} className="w-full py-2 text-[12px] font-semibold text-muted">Retour aux forfaits</button></div> : <><p className="text-[12px] text-muted">Choisissez une catégorie pour découvrir les forfaits disponibles.</p>{[
              {name:'Promotions du jour',key:'Promotion',icon:'https://cdn-icons-png.flaticon.com/512/7175/7175450.png',offers:[{volume:'2 Go',price:'525 F',valid:'00h–07h · 30 jours',type:'Nuit'},{volume:'2 Go',price:'1 050 F',valid:'Tous les jours · 30 jours',type:'Via Money'}]},
              {name:'Forfaits Jour',key:'Jour',icon:'https://cdn-icons-png.flaticon.com/512/7175/7175450.png',offers:[{volume:'50 Mo',price:'105 F',valid:'2 jours',type:'Jour'},{volume:'125 Mo',price:'210 F',valid:'2 jours',type:'Jour'},{volume:'250 Mo',price:'315 F',valid:'2 jours',type:'Jour'}]},
              {name:'Forfaits Mois',key:'Mois',icon:'https://cdn-icons-png.flaticon.com/512/7175/7175450.png',offers:[{volume:'1 Go',price:'1 050 F',valid:'30 jours',type:'Mois'},{volume:'2 Go',price:'1 575 F',valid:'30 jours',type:'Mois'},{volume:'4 Go',price:'3 150 F',valid:'30 jours',type:'Mois'},{volume:'5,5 Go',price:'4 200 F',valid:'30 jours',type:'Mois'},{volume:'7,5 Go',price:'5 250 F',valid:'30 jours',type:'Mois'},{volume:'15 Go',price:'10 000 F',valid:'30 jours',type:'Mois'}]},
              {name:'Forfaits Nuit',key:'Nuit',icon:'https://cdn-icons-png.flaticon.com/512/7175/7175450.png',offers:[{volume:'2 Go',price:'525 F',valid:'00h–07h · 30 jours',type:'Nuit'},{volume:'4 Go',price:'1 050 F',valid:'00h–07h · 30 jours',type:'Nuit'}]},
              {name:'Forfaits Via Money',key:'Via Money',icon:'https://cdn-icons-png.flaticon.com/512/7175/7175450.png',offers:[{volume:'2 Go',price:'1 050 F',valid:'Tous les jours · 30 jours',type:'Via Money'},{volume:'3 Go',price:'1 050 F',valid:'Mercredi & vendredi',type:'Via Money'}]},
            ].map((group,index)=><details key={group.key} open={index===0} className={`group overflow-hidden rounded-[18px] border ${group.key==='Promotion'?'border-[#F1DDAF] bg-[#FFFCF5]':'border-brand-line/70 bg-white'}`}><summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${group.key==='Promotion'?'bg-[#FFF0C9]':'bg-[#F2F8FD]'}`}><img style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(43%) saturate(1536%) hue-rotate(177deg) brightness(92%) contrast(92%)' }} src={group.icon} alt="" className="h-9 w-9 object-contain"/></span><span className="min-w-0 flex-1"><span className="block text-[14px] font-bold text-ink">{group.name}</span><span className="mt-0.5 block text-[10px] text-muted">{group.offers.length} offres disponibles</span></span><CaretDown size={19} className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"/></summary><div className="space-y-2 border-t border-brand-line/50 px-3 py-3">{group.offers.map((offer,offerIndex)=><div key={`${group.key}-${offerIndex}`} className="flex items-center gap-3 rounded-xl border border-brand-line/50 bg-white p-3"><div className="min-w-0 flex-1"><p className="text-[14px] font-extrabold text-ink">{offer.volume}</p><p className="mt-0.5 text-[10px] text-muted">{offer.valid}</p></div><div className="text-right"><p className="text-[13px] font-extrabold text-brand">{offer.price}</p><button onClick={()=>setSelectedOffer(offer)} className="mt-1 text-[10px] font-bold text-brand underline underline-offset-2">Voir l'offre</button></div></div>)}</div></details>)}<p className="text-[10px] leading-relaxed text-[#91A0B2]">Offres et tarifs publiés par Telecel Faso.</p></>) : <><p className="text-[12px] text-muted">Gérez votre crédit et vos services mobiles.</p><div className={`grid ${activeGroup === 'credit' ? 'grid-cols-4' : 'grid-cols-2'} gap-3`}>{[
              {label:'Recharger',image:'https://cdn-icons-png.flaticon.com/512/17653/17653501.png'},{label:'Acheter un pass',image:'https://cdn-icons-png.flaticon.com/512/10018/10018094.png'},{label:'Forfaits SMS',image:'https://cdn-icons-png.flaticon.com/512/11326/11326177.png'},{label:'Forfaits appels',image:'https://cdn-icons-png.flaticon.com/512/10153/10153571.png'},{label:'Transfert de crédit',image:'https://cdn-icons-png.flaticon.com/512/10018/10018094.png'},{label:'Envoyer du crédit',image:'https://cdn-icons-png.flaticon.com/512/10018/10018094.png'},{label:'eSIM',image:'https://cdn-icons-png.flaticon.com/512/1041/1041888.png'},{label:'Free Roaming',image:'https://cdn-icons-png.flaticon.com/512/1041/1041916.png'},{label:'Services mobiles',image:'https://cdn-icons-png.flaticon.com/512/724/724664.png'},{label:'Postpayé',image:'https://cdn-icons-png.flaticon.com/512/2830/2830284.png'},{label:'Gestion des mégas',image:'https://cdn-icons-png.flaticon.com/512/1041/1041911.png'},{label:'Clé de connexion',image:'https://cdn-icons-png.flaticon.com/512/1041/1041912.png'},{label:'Transfert international',image:'https://cdn-icons-png.flaticon.com/512/2830/2830284.png'},{label:'Recharge à distance',image:'https://cdn-icons-png.flaticon.com/512/1041/1041888.png'},{label:'Bip Telecel',image:'https://cdn-icons-png.flaticon.com/512/724/724664.png'},{label:'Bonus de réception',image:'https://cdn-icons-png.flaticon.com/512/2583/2583344.png'},{label:'Conserver mon numéro',image:'https://cdn-icons-png.flaticon.com/512/1083/1083618.png'},
            ].filter(item=>(activeGroup==='credit' && ['Recharger','Acheter un pass','Forfaits SMS','Forfaits appels','Transfert de crédit','Envoyer du crédit','eSIM','Free Roaming','Services mobiles','Postpayé','Gestion des mégas','Clé de connexion','Transfert international'].includes(item.label)) || (activeGroup==='international' && ['Free Roaming','Forfaits appels','Forfaits SMS','Transfert international'].includes(item.label)) || (activeGroup==='fidelite' && ['Recharge à distance','Bip Telecel','Bonus de réception','Conserver mon numéro'].includes(item.label))).map(item=><button key={item.label} onClick={()=>openService(item.label)} className="flex min-w-0 flex-col items-center gap-2 bg-transparent px-0.5 py-1 text-center transition active:scale-[0.97]"><span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[16px] border border-brand-line/70 bg-[#F2F8FD]"><img src={item.image} alt="" className="h-[52px] w-[52px] object-contain"/></span><span className="line-clamp-2 min-h-[26px] w-full text-[10px] font-semibold leading-[13px] text-ink">{item.label}</span></button>)}</div></>}
          </section>}

          <section className="hidden">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-ink">Dernières opérations</h2>
                <p className="mt-0.5 text-[12px] text-muted">Suivez vos mouvements de crédit</p>
              </div>
              <button className="text-[12px] font-semibold text-brand" onClick={() => onNavigate?.('historique')}>Tout voir</button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E8EEF6] bg-white px-3">
              {operations.length === 0 ? (
                <div className="py-10 text-center text-[13px] text-muted">Aucune opération pour le moment.</div>
              ) : operations.map((item, index) => {
                const incoming = item.amount > 0
                const Icon = item.kind === 'sent' ? ArrowUpRight : item.kind === 'received' ? ArrowDownLeft : DeviceMobile
                return (
                  <div key={item.id} className={`flex items-center gap-3 py-3.5 ${index ? 'border-t border-[#EEF2F7]' : ''}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3FB] text-[#173B67]`}>
                      <Icon size={20} weight="bold" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-ink">{item.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">{item.subtitle}</p>
                      <p className="mt-1 text-[11px] text-muted">{item.time}</p>
                    </div>
                    <p className={`shrink-0 text-[14px] font-bold tabular-nums ${incoming ? 'text-[#159653]' : 'text-ink'}`}>
                      {incoming ? '+' : '−'}{Math.abs(item.amount).toLocaleString('fr-FR')} <span className="text-[10px]">F</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="mt-5 flex flex-col gap-2 text-[10px] text-[#91A0B2]"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#2CA6DA]"/> Transactions et achats en mode démonstration.</span><a href="https://www.flaticon.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">Icônes : Flaticon</a></div>
        </div>
      </main>
      <BottomNav active="historique" onNavigate={onNavigate} />

      <AnimatePresence>
        {showSend && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-[#071A33]/45 p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSend(false)}>
            <motion.div className="w-full max-w-md rounded-t-[28px] bg-white p-5 pb-8 shadow-2xl sm:rounded-[28px]" initial={reduce ? { opacity: 0 } : { y: 36 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.22 }} onClick={(e) => e.stopPropagation()}>
              <div className="mb-5 flex items-center justify-between">
                <div><h3 className="text-[18px] font-bold text-ink">Envoyer du crédit</h3><p className="mt-1 text-[12px] text-muted">Transférez du crédit à un proche</p></div>
                <button onClick={() => setShowSend(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F5F9] text-muted"><X size={18} /></button>
              </div>
              {success ? (
                <div className="py-7 text-center">
                  <CheckCircle size={52} weight="duotone" className="mx-auto text-[#159653]" />
                  <h4 className="mt-3 text-[18px] font-bold text-ink">Envoi effectué !</h4>
                  <p className="mt-1 text-[13px] text-muted">Votre opération a été ajoutée à vos mouvements.</p>
                  <button onClick={() => setShowSend(false)} className="mt-6 w-full rounded-xl bg-brand py-3.5 text-[14px] font-bold text-ink">Terminer</button>
                </div>
              ) : (
                <>
                  <label className="mb-2 block text-[12px] font-semibold text-ink">Numéro du bénéficiaire</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex. 70 12 34 56" inputMode="tel" className="mb-4 w-full rounded-xl border border-[#DCE5F0] bg-white px-4 py-3.5 text-[14px] text-ink outline-none focus:border-brand" />
                  <label className="mb-2 block text-[12px] font-semibold text-ink">Montant du crédit (FCFA)</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500" inputMode="numeric" className="w-full rounded-xl border border-[#DCE5F0] bg-white px-4 py-3.5 text-[14px] text-ink outline-none focus:border-brand" />
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-soft px-3 py-3 text-[12px]"><span className="text-muted">Solde disponible</span><strong className="text-brand">{Math.max(0, creditBalance).toLocaleString('fr-FR')} F</strong></div>
                  <button onClick={sendCredit} disabled={phone.trim().length < 8 || Number(amount) <= 0 || Number(amount) > creditBalance} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[14px] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40"><PaperPlaneTilt size={17} weight="bold" /> Confirmer l’envoi</button>
                  <p className="mt-3 text-center text-[10px] text-muted">Prototype de démonstration · aucune transaction réelle</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function QuickAction({ icon: Icon, label, onClick }: { icon: PhosphorIcon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[94px] flex-col items-center justify-center gap-2 rounded-2xl border border-[#E8EEF6] bg-white px-2 py-3 text-center shadow-[0_4px_16px_-14px_rgba(15,42,77,0.25)] transition active:scale-[0.97]">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={22} weight="bold" /></span>
      <span className="text-[11px] font-semibold leading-tight text-ink">{label}</span>
    </button>
  )
}

function MoneyPattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-y-0 right-0 h-full w-[54%] text-ink/[0.09]" preserveAspectRatio="xMaxYMid slice">
      <defs><pattern id="money-tab-pattern" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 3 L31 17 L17 31 L3 17 Z" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="17" cy="17" r="3" fill="currentColor" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#money-tab-pattern)" />
    </svg>
  )
}

