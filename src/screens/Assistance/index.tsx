import React, { useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChatCircleDots, CheckCircle, Headset, PaperPlaneTilt, PhoneCall, WhatsappLogo, X } from '@phosphor-icons/react'
import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { PageHeader } from '@shared/components/PageHeader'
import { TelecelLogo } from '@shared/components/TelecelLogo'

type Props = { onNavigate?: (tab: Tab) => void }
type Message = { from: 'agent' | 'user'; text: string; time: string }

const WHATSAPP_URL = 'https://wa.me/22678920000?text=Bonjour%2C%20j%E2%80%99ai%20besoin%20d%E2%80%99assistance%20sur%20Telecel%20Money.'

export default function Assistance({ onNavigate }: Props) {
  const [chatOpen, setChatOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { from: 'agent', text: 'Bonjour et bienvenue sur l’assistance Telecel Money. Comment pouvons-nous vous aider ?', time: 'Maintenant' },
  ])
  const sendMessage = () => {
    const value = draft.trim()
    if (!value) return
    setMessages((current) => [...current, { from: 'user', text: value, time: 'À l’instant' }, { from: 'agent', text: 'Votre message a bien été ajouté à cette conversation de démonstration. Pour une prise en charge par un conseiller, contactez-nous sur WhatsApp ou au 888.', time: 'À l’instant' }])
    setDraft('')
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-[#F7F9FC]">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageHeader title={<TelecelLogo />}>
          <div className="pt-3 pb-1"><h1 className="text-[23px] font-bold">Assistance</h1><p className="mt-1 text-[12px] text-white/75">Nous sommes là pour vous accompagner.</p></div>
        </PageHeader>
        <div className="mx-auto max-w-xl space-y-4 px-4 pt-5 pb-8">
          <div className="rounded-2xl bg-gradient-to-br from-[#173B67] to-[#236BA5] p-4 text-white shadow-[0_8px_24px_-16px_rgba(23,59,103,0.65)]">
            <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Headset size={25} weight="duotone"/></span><div><p className="text-[15px] font-bold">Besoin d’un coup de main ?</p><p className="mt-0.5 text-[11px] text-white/75">Choisissez le canal qui vous convient.</p></div></div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/80"><span className="h-2 w-2 rounded-full bg-[#68D99A]"/> Assistance Telecel Faso</div>
          </div>

          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[#D9EEE2] bg-white p-4 shadow-[0_4px_16px_-13px_rgba(23,59,103,0.4)] transition-transform active:scale-[0.99]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F8EE] text-[#1DAA62]"><WhatsappLogo size={27} weight="fill"/></span>
            <span className="min-w-0 flex-1"><strong className="block text-[14px] font-bold text-[#173B67]">WhatsApp</strong><span className="mt-1 block text-[11px] text-[#7B8DA2]">Échangez directement avec notre équipe.</span><span className="mt-1 block text-[10px] font-semibold text-[#159653]">+226 78 92 00 00</span></span>
            <ArrowUpRight size={19} className="text-[#159653]"/>
          </a>

          <button onClick={() => setChatOpen(true)} className="flex w-full items-center gap-3 rounded-2xl border border-[#DCE8F5] bg-white p-4 text-left shadow-[0_4px_16px_-13px_rgba(23,59,103,0.4)] transition-transform active:scale-[0.99]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#1766B5]"><ChatCircleDots size={27} weight="duotone"/></span>
            <span className="min-w-0 flex-1"><strong className="block text-[14px] font-bold text-[#173B67]">Chat en ligne</strong><span className="mt-1 block text-[11px] text-[#7B8DA2]">Ouvrez une conversation depuis l’application.</span><span className="mt-1 block text-[10px] font-semibold text-[#1766B5]">Démarrer une discussion</span></span>
            <ArrowUpRight size={19} className="text-[#1766B5]"/>
          </button>

          <a href="tel:888" className="flex items-center gap-3 rounded-2xl border border-[#F0E5D7] bg-white p-4 shadow-[0_4px_16px_-13px_rgba(23,59,103,0.4)] transition-transform active:scale-[0.99]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3E5] text-[#D98724]"><PhoneCall size={26} weight="duotone"/></span>
            <span className="min-w-0 flex-1"><strong className="block text-[14px] font-bold text-[#173B67]">Service client par appel</strong><span className="mt-1 block text-[11px] text-[#7B8DA2]">Appelez gratuitement depuis votre numéro Telecel.</span><span className="mt-1 block text-[10px] font-semibold text-[#C17A24]">Composer le 888</span></span>
            <ArrowUpRight size={19} className="text-[#C17A24]"/>
          </a>

          <a href="https://www.telecelfaso.bf/assistance/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[12px] font-semibold text-[#1766B5] ring-1 ring-[#E5ECF3]">Consulter le centre d’aide Telecel <ArrowUpRight size={16}/></a>
        </div>
      </main>
      <BottomNav active="accueil" onNavigate={onNavigate}/>

      {chatOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071B33]/35 p-0 sm:p-4" onClick={() => setChatOpen(false)}>
        <section role="dialog" aria-modal="true" aria-label="Chat assistance" onClick={(event) => event.stopPropagation()} className="flex h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-t-[26px] bg-white shadow-2xl sm:rounded-[26px]">
          <header className="flex items-center gap-3 bg-[#173B67] px-4 py-4 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"><Headset size={22}/></span><div className="min-w-0 flex-1"><h2 className="text-[14px] font-bold">Assistance Telecel</h2><p className="mt-0.5 text-[10px] text-white/70">Chat de démonstration</p></div><button onClick={() => setChatOpen(false)} aria-label="Fermer le chat" className="rounded-full p-2 hover:bg-white/10"><X size={19}/></button></header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F5F8FC] p-4">{messages.map((message, index) => <div key={index} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${message.from === 'user' ? 'rounded-br-md bg-[#1766B5] text-white' : 'rounded-bl-md border border-[#E7EDF4] bg-white text-[#405873]'}`}><p className="text-[12px] leading-relaxed">{message.text}</p><span className={`mt-1 block text-right text-[9px] ${message.from === 'user' ? 'text-white/65' : 'text-[#9AA8B7]'}`}>{message.time}</span></div></div>)}</div>
          <form onSubmit={(event) => { event.preventDefault(); sendMessage() }} className="flex items-center gap-2 border-t border-[#E8EEF4] p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Écrivez votre message..." className="h-11 min-w-0 flex-1 rounded-xl bg-[#F2F5F9] px-3 text-[12px] text-[#173B67] outline-none focus:ring-2 focus:ring-[#2CA6DA]/30"/><button type="submit" disabled={!draft.trim()} aria-label="Envoyer le message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1766B5] text-white disabled:opacity-40"><PaperPlaneTilt size={19} weight="fill"/></button></form>
          <p className="px-4 pb-3 text-center text-[9px] text-[#9AA8B7]">Pour une réponse réelle d’un conseiller, utilisez WhatsApp ou appelez le 888.</p>
        </section>
      </div>}
    </div>
  )
}

