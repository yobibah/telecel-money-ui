import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  QrCode,
  Search,
  Headset,
  Smartphone,
  ArrowUpFromLine,
  Megaphone,
  ArrowDownLeft,
  ArrowUpRight,
  X,
  Contact,
} from 'lucide-react'

import { BottomNav, type Tab } from '@shared/components/BottomNav'
import { MoreTile, ServiceTile } from '@shared/components/ServiceTile'
import { TelecelLogo } from '@shared/components/TelecelLogo'
import { PageHeader } from '@shared/components/PageHeader'
import { RECENT_SERVICES } from '@shared/data/services'
import { useI18n } from '@shared/i18n'

import { CardPattern } from './components/CardPattern'

const EASE = [0.23, 1, 0.32, 1] as const

/** Recent services without the old hard-coded “Plus” tile; the grid shows 5 plus “Voir plus”, 2 rows of 3. */
const RECENT = RECENT_SERVICES.filter((s) => s.id !== 'plus')
const VISIBLE = 5

export const args = {
  solde: '0,00',
  forfait: '0,4 FCFA',
  balanceHidden: false,
  nom: 'Aminata Ouédraogo',
  numero: '+226 70 12 34 56',
  welcome: 'Bienvenue sur Telecel Money',
}

export const argTypes = {
  solde: { control: 'text' },
  forfait: { control: 'text' },
  balanceHidden: { control: 'boolean' },
  nom: { control: 'text' },
  welcome: { control: 'text' },
}

type Props = Partial<typeof args> & { onNavigate?: (tab: Tab) => void; onOpenBilan?: () => void }

export default function Accueil(props: Props) {
  const { solde, forfait, balanceHidden, nom, numero, welcome, onNavigate, onOpenBilan } = { ...args, ...props }
  const [hidden, setHidden] = useState(balanceHidden)
  const [showReceiveQr, setShowReceiveQr] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const [scanError, setScanError] = useState('')
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferRecipient, setTransferRecipient] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [contactError, setContactError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const { t } = useI18n()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!showScanner) return
    let stream: MediaStream | undefined
    let timer: ReturnType<typeof setInterval> | undefined
    let active = true
    const startScanner = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('scanUnsupported'))
        const Detector = (window as any).BarcodeDetector
        if (!Detector) throw new Error(t('scanUnsupported'))
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        if (!active || !videoRef.current) { stream.getTracks().forEach((track) => track.stop()); return }
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        const detector = new Detector({ formats: ['qr_code'] })
        timer = setInterval(async () => {
          if (!active || !videoRef.current) return
          try {
            const codes = await detector.detect(videoRef.current)
            if (codes?.length && active) {
              setScanResult(codes[0].rawValue || '')
              setShowScanner(false)
            }
          } catch {}
        }, 350)
      } catch (error) {
        setScanError(error instanceof Error ? error.message : t('scanUnsupported'))
      }
    }
    void startScanner()
    return () => {
      active = false
      if (timer) clearInterval(timer)
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [showScanner, t])

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageHeader title={<TelecelLogo />} overlap />

        {/* Balance card overlapping the band */}
        <section className="-mt-12 px-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-white p-4 shadow-[0_8px_24px_-12px_rgba(0,51,124,0.35)]"
          >
            <CardPattern />
            <div className="relative flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[13px] text-muted">
                  <span className="truncate">{nom}</span>
                  <button
                    aria-label={hidden ? 'Afficher le solde' : 'Masquer le solde'}
                    onClick={() => setHidden((h) => !h)}
                    className="shrink-0 rounded p-0.5 text-brand"
                  >
                    {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="relative mt-1 h-8 text-[28px] leading-8 font-bold tracking-tight text-ink tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={hidden ? 'hidden' : 'shown'}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="inline-block"
                    >
                      {hidden ? '••••' : solde}
                      <span className="ml-1.5 text-[14px] font-semibold text-muted">FCFA</span>
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>

              <motion.button
                aria-label="Afficher mon QR code pour recevoir"
                whileTap={reduce ? undefined : { scale: 0.95 }}
                transition={{ duration: 0.12, ease: EASE }}
                onClick={() => setShowReceiveQr(true)}
                className="flex shrink-0 items-center justify-center rounded-2xl bg-white p-1 transition-colors duration-150 ease-out"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/714/714390.png" alt="QR code" className="h-14 w-14 object-contain" />
              </motion.button>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2">
              <ActionButton index={0} icon={<img src="https://cdn-icons-png.flaticon.com/512/9685/9685226.png" alt="" className="h-10 w-10 object-contain" />} label={t('scanner')} tone="scan" onClick={() => { setScanResult(''); setScanError(''); setShowScanner(true) }} />
              <ActionButton index={1} icon={<img src="https://cdn-icons-png.flaticon.com/512/12305/12305751.png" alt="" className="h-10 w-10 object-contain" />} label={t('withdraw')} tone="withdraw" />
              <ActionButton index={2} icon={<img src="https://cdn-icons-png.flaticon.com/512/17653/17653501.png" alt="" className="h-10 w-10 object-contain" />} label={t('recharge')} tone="recharge" />
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-3 max-w-xl px-4"><button onClick={onOpenBilan} className="relative flex min-h-[54px] w-full items-center gap-3 overflow-hidden rounded-2xl border border-[#E5EDF7] bg-white px-3.5 py-2.5 text-left shadow-[0_5px_16px_-10px_rgba(10,55,110,0.32)] transition active:scale-[0.99]" style={{ backgroundImage: "radial-gradient(circle at 94% 50%, rgba(11,85,200,0.10) 1.2px, transparent 1.5px), radial-gradient(circle at 94% 50%, transparent 0 18px, rgba(11,85,200,0.06) 18.5px 20px, transparent 20.5px)" , backgroundSize: "10px 10px, 54px 54px", backgroundPosition: "right center, right center", backgroundRepeat: "repeat, no-repeat" }}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"><img src="https://cdn-icons-png.flaticon.com/512/5980/5980340.png" alt="" className="h-7 w-7 object-contain"/></span><span className="min-w-0 flex-1 text-[12px] font-bold text-[#0A1F44]">Mon bilan</span><span className="flex shrink-0 items-center gap-2"><span className="h-1.5 w-16 overflow-hidden rounded-full bg-[#DCE8F8]"><span className="block h-full w-[78%] rounded-full bg-[#0B55C8]"/></span><span className="text-[11px] font-bold tabular-nums text-[#0B55C8]">78 %</span></span></button></section>

        {/* Recent services */}
        <section className="mx-auto mt-6 max-w-xl px-4">
          <h2 className="text-[17px] font-semibold text-ink">{t('recentServices')}</h2>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {RECENT.slice(0, VISIBLE).map((s) => (
              <ServiceTile key={s.id} service={s} variant="card" illustrated />
            ))}
            <MoreTile
              variant="card"
              hiddenCount={RECENT.length - VISIBLE}
              onClick={() => onNavigate?.('services')}
            />
          </div>
        </section>

        {/* Accès rapide au transfert */}
        <section className="mx-auto mt-5 max-w-xl px-4">
          <button
            type="button"
            onClick={() => { setTransferRecipient(''); setTransferAmount(''); setContactError(''); setShowTransfer(true) }}
            className="group flex w-full items-center gap-3 rounded-2xl border border-[#CFE3FA] bg-gradient-to-r from-[#EAF4FF] via-white to-[#F4F9FF] p-3.5 text-left shadow-[0_5px_16px_-12px_rgba(0,65,140,0.45)] transition-all hover:border-[#9CC9F2] hover:shadow-[0_8px_20px_-12px_rgba(0,65,140,0.5)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#D9EBFF] text-[#0755B5]">
              <img src="https://cdn-icons-png.flaticon.com/512/3141/3141951.png" alt="Transfert d’argent" className="h-9 w-9 object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold text-[#173B67]">Transférer de l’argent</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-[#60758D]">Envoyez de l’argent à vos proches en quelques instants.</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#0755B5] px-3 py-2 text-[11px] font-semibold text-white">
              Envoyer <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </section>

        {/* Dernières transactions */}
        <section className="mx-auto mt-6 max-w-xl px-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-semibold text-ink">{t('recentTransactions')}</h2>
              <p className="mt-0.5 text-[12px] text-muted">{t('recentSubtitle')}</p>
            </div>
            <button onClick={() => onNavigate?.('historique')} className="flex items-center gap-1 text-[12px] font-semibold text-brand">{t('seeAll')} <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E8EEF6] bg-white px-3">
            {[
              { title: 'Envoi', subtitle: 'À Awa Ouédraogo · 70 12 34 56', amount: '−5 000 F', time: 'Aujourd’hui, 10:42', incoming: false, kind: 'send' },
              { title: 'Retrait', subtitle: 'Retrait auprès d’un point partenaire', amount: '−10 000 F', time: 'Aujourd’hui, 08:15', incoming: false, kind: 'withdraw' },
              { title: 'Dépôt', subtitle: 'Dépôt sur votre compte Telecel Money', amount: '+15 000 F', time: 'Hier, 18:30', incoming: true, kind: 'deposit' },
            ].map((item, index) => {
              const Icon = item.kind === 'send' ? ArrowUpRight : item.kind === 'withdraw' ? ArrowUpFromLine : ArrowDownLeft
              return <div key={item.title} className={`flex items-center gap-3 py-3.5 ${index ? 'border-t border-[#EEF2F7]' : ''}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.incoming ? 'bg-[#EAF7F0] text-[#159653]' : 'bg-brand-soft text-brand'}`}><Icon className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-ink">{item.title}</p><p className="mt-0.5 truncate text-[11px] text-muted">{item.subtitle}</p><p className="mt-1 text-[11px] text-muted">{item.time}</p></div>
                <p className={`shrink-0 text-[14px] font-bold tabular-nums ${item.incoming ? 'text-[#159653]' : 'text-ink'}`}>{item.amount}</p>
              </div>
            })}
          </div>
        </section>

        {/* Welcome strip */}
        <section className="mx-auto mt-4 max-w-xl px-4">
          <p className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 text-[14px] text-ink ring-1 ring-brand-line/50">
            <Megaphone className="h-[18px] w-[18px] shrink-0 text-brand" />
            <span className="truncate">{welcome}</span>
          </p>
        </section>

        {/* Cartes promotionnelles défilables */}
        <section className="mx-auto mt-4 mb-6 max-w-xl">
          <div className="mb-3 flex items-center justify-between px-4">
            <h2 className="text-[17px] font-semibold text-ink">{t('discover')}</h2>
            <span className="text-[11px] font-medium text-muted">{t('swipe')}</span>
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <article className="relative h-[168px] min-w-[86%] snap-center overflow-hidden rounded-2xl bg-[#0755B5] text-white shadow-[0_8px_22px_-12px_rgba(0,51,124,0.45)]">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85" alt="Paiement avec un téléphone" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B83]/95 via-[#0755B5]/75 to-transparent" />
              <div className="relative flex h-full max-w-[75%] flex-col justify-center p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">Offre spéciale</span>
                <h3 className="mt-1 text-[19px] leading-tight font-bold">Payez malin avec Telecel Money</h3>
                <p className="mt-1.5 text-[11px] leading-snug text-white/85">Des paiements simples, rapides et sécurisés au quotidien.</p>
                <button className="mt-3 w-fit rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0755B5]">Découvrir</button>
              </div>
            </article>
            <article className="relative h-[168px] min-w-[86%] snap-center overflow-hidden rounded-2xl bg-[#0755B5] text-white shadow-[0_8px_22px_-12px_rgba(0,51,124,0.45)]">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9?auto=format&fit=crop&w=1000&q=85" alt="Smartphone et services mobiles" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B83]/95 via-[#0755B5]/75 to-transparent" />
              <div className="relative flex h-full max-w-[75%] flex-col justify-center p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">Restez connecté</span>
                <h3 className="mt-1 text-[19px] leading-tight font-bold">Rechargez votre crédit en quelques secondes</h3>
                <p className="mt-1.5 text-[11px] leading-snug text-white/85">Achetez du crédit et profitez de vos proches.</p>
                <button className="mt-3 w-fit rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0755B5]">Recharger</button>
              </div>
            </article>
            <article className="relative h-[168px] min-w-[86%] snap-center overflow-hidden rounded-2xl bg-[#0755B5] text-white shadow-[0_8px_22px_-12px_rgba(0,51,124,0.45)]">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85" alt="Achats et paiement" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B83]/95 via-[#0755B5]/75 to-transparent" />
              <div className="relative flex h-full max-w-[75%] flex-col justify-center p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">Au quotidien</span>
                <h3 className="mt-1 text-[19px] leading-tight font-bold">Vos transferts à portée de main</h3>
                <p className="mt-1.5 text-[11px] leading-snug text-white/85">Envoyez de l'argent simplement avec Telecel Money.</p>
                <button className="mt-3 w-fit rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0755B5]">En savoir plus</button>
              </div>
            </article>
          </div>
        </section>

      </main>
      {showTransfer && <TransferSheet recipient={transferRecipient} setRecipient={setTransferRecipient} amount={transferAmount} setAmount={setTransferAmount} contactError={contactError} setContactError={setContactError} onClose={() => setShowTransfer(false)} />}
      {showReceiveQr && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#071B33]/65 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t('receiveQr')}><div className="w-full max-w-md rounded-[28px] bg-white p-5 pb-7 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-bold text-ink">{t('receiveQr')}</h2><button onClick={() => setShowReceiveQr(false)} className="rounded-full bg-[#F1F5FA] px-3 py-2 text-[12px] font-semibold text-brand">{t('close')}</button></div><p className="mb-4 text-center text-[13px] leading-relaxed text-muted">{t('scanInstruction')}</p><div className="mx-auto flex max-w-[280px] flex-col items-center rounded-3xl border border-brand-line/70 bg-white p-4"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=18&data=${encodeURIComponent(`TELECEL-MONEY|${numero}`)}`} alt="QR code de réception de démonstration" className="aspect-square w-full object-contain"/><p className="mt-3 text-[14px] font-bold text-ink">{nom}</p><p className="text-[12px] text-muted">{numero}</p></div><div className="mt-4 rounded-xl bg-[#FFF7E8] px-3 py-2 text-[11px] leading-relaxed text-[#91621A]">QR de démonstration : la réception réelle nécessite une intégration au service Telecel Money.</div></div></div>}
      {showScanner && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#071B33]/70 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t('scanTitle')}><div className="w-full max-w-md rounded-[28px] bg-white p-5 pb-7 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-bold text-ink">{t('scanTitle')}</h2><button onClick={() => setShowScanner(false)} className="rounded-full bg-[#F1F5FA] px-3 py-2 text-[12px] font-semibold text-brand">{t('close')}</button></div><p className="mb-3 text-[13px] text-muted">{t('scanHint')}</p><div className="relative overflow-hidden rounded-2xl bg-[#071B33]"><video ref={videoRef} muted playsInline className="aspect-[4/5] max-h-[52vh] w-full object-cover"/><div className="pointer-events-none absolute inset-[14%] rounded-3xl border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.22)]"/></div>{scanError && <p className="mt-3 rounded-xl bg-[#FFF3F1] p-3 text-[12px] text-[#B33B2E]">{scanError}</p>}<p className="mt-3 text-center text-[12px] text-muted">{t('cameraAccess')}</p></div></div>}
      {scanResult && <div className="fixed inset-0 z-[95] flex items-center justify-center bg-[#071B33]/65 p-5"><div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF7F0] text-[#159653]"><QrCode className="h-6 w-6"/></div><h2 className="text-[18px] font-bold text-ink">{t('scanResult')}</h2><p className="my-3 break-all rounded-xl bg-[#F3F6FA] p-3 text-[13px] text-ink">{scanResult}</p><button onClick={() => setScanResult('')} className="w-full rounded-xl bg-brand py-3 text-[13px] font-bold text-white">{t('close')}</button></div></div>}
      <BottomNav active="accueil" onNavigate={onNavigate} />
    </div>
  )
}

/** Woven Faso Dan Fani–style band: diamonds between zigzag rows, on the card's right edge. */
function FasoMotif() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-[45%] text-white/[0.12]"
      preserveAspectRatio="xMaxYMid slice"
    >
      <defs>
        <pattern id="faso-motif" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M16 4 L26 16 L16 28 L6 16 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 11 L21 16 L16 21 L11 16 Z" fill="currentColor" />
          <path d="M0 0 L4 4 L8 0 M24 0 L28 4 L32 0 M0 32 L4 28 L8 32 M24 32 L28 28 L32 32" fill="none" stroke="currentColor" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#faso-motif)" />
    </svg>
  )
}

function TransferSheet({ recipient, setRecipient, amount, setAmount, contactError, setContactError, onClose }: { recipient: string; setRecipient: (value: string) => void; amount: string; setAmount: (value: string) => void; contactError: string; setContactError: (value: string) => void; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const dragControls = useDragControls()
  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-[#071B33]/40 backdrop-blur-[1px]" role="dialog" aria-modal="true" aria-labelledby="transfer-title" onClick={onClose}>
      <motion.div drag="y" dragControls={dragControls} dragListener={false} dragConstraints={{ top: -150, bottom: 0 }} dragElastic={0.12} onDragEnd={(_, info) => { if (info.offset.y < -55) setExpanded(true); if (info.offset.y > 75) { if (expanded) setExpanded(false); else onClose() } }} animate={{ y: expanded ? -150 : 0 }} transition={{ type: 'spring', stiffness: 360, damping: 34 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-[28px] bg-white px-5 pb-8 pt-3 shadow-2xl touch-pan-y">
        <div onPointerDown={(e) => dragControls.start(e)} className="mx-auto mb-4 flex h-7 w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing" aria-label="Glisser pour agrandir ou fermer"><span className="h-1.5 w-12 rounded-full bg-[#C7D3E0]" /></div>
        <div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-wide text-[#5480AD]">Telecel Money</p><h2 id="transfer-title" className="mt-1 text-[19px] font-bold text-ink">Transférer de l’argent</h2></div><button type="button" aria-label="Fermer" onClick={onClose} className="rounded-full bg-[#F1F5FA] p-2.5 text-[#53677D]"><X className="h-5 w-5" /></button></div>
        <label className="mb-2 block text-[13px] font-semibold text-ink" htmlFor="transfer-recipient">Destinataire</label>
        <div className="flex gap-2"><input id="transfer-recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Nom ou numéro de téléphone" className="min-w-0 flex-1 rounded-xl border border-[#DCE5EF] bg-white px-3.5 py-3 text-[13px] text-ink outline-none placeholder:text-[#9AA9B8] focus:border-[#2C86D5] focus:ring-2 focus:ring-[#2C86D5]/15"/><button type="button" onClick={async () => { setContactError(''); try { const api = (navigator as any).contacts; if (!api?.select) { setContactError('La sélection des contacts n’est pas disponible sur ce navigateur. Saisissez le numéro manuellement.'); return } const selected = await api.select(['name', 'tel'], { multiple: false }); if (selected?.length) setRecipient(selected[0].tel?.[0] || selected[0].name?.[0] || '') } catch { setContactError('Impossible d’accéder aux contacts. Vous pouvez saisir le numéro manuellement.') } }} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#CFE3FA] bg-[#EFF6FF] px-3 text-[12px] font-semibold text-[#0755B5]"><Contact className="h-4 w-4"/> Contacts</button></div>
        {contactError && <p className="mt-2 text-[11px] leading-snug text-[#B45309]">{contactError}</p>}
        <label className="mb-2 mt-5 block text-[13px] font-semibold text-ink" htmlFor="transfer-amount">Montant à envoyer</label>
        <div className="flex items-center rounded-xl border border-[#DCE5EF] px-3.5 focus-within:border-[#2C86D5] focus-within:ring-2 focus-within:ring-[#2C86D5]/15"><input id="transfer-amount" type="number" min="1" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex. 5 000" className="w-full bg-transparent py-3 text-[18px] font-bold text-ink outline-none placeholder:text-[#AAB6C3]"/><span className="text-[13px] font-semibold text-muted">FCFA</span></div>
        <button type="button" disabled={!recipient.trim() || !amount || Number(amount) <= 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0755B5] py-3.5 text-[14px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(7,85,181,0.65)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"><img src="https://cdn-icons-png.flaticon.com/512/3141/3141951.png" alt="" className="h-5 w-5 object-contain"/> Continuer</button>
        <p className="mt-3 text-center text-[10px] text-muted">Glissez vers le haut pour agrandir · vers le bas pour réduire ou fermer.</p>
      </motion.div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  index,
  tone,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  index: number
  tone: 'scan' | 'withdraw' | 'recharge'
  onClick?: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.22, ease: EASE, delay: reduce ? 0 : 0.12 + index * 0.045 },
      }}
      whileTap={reduce ? undefined : { scale: 0.96, transition: { duration: 0.12, ease: EASE } }}
      onClick={onClick}
      className="group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl bg-white px-1.5 py-2 text-brand ring-1 ring-brand-line/60 shadow-[0_4px_14px_-10px_rgba(0,51,124,0.35)] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-10px_rgba(0,51,124,0.4)]"
    >
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-[15px] shadow-inner transition-transform duration-150 group-hover:scale-105 ${tone === 'scan' ? 'bg-gradient-to-br from-[#D9E9FF] to-[#EEF5FF] text-[#1262C5]' : tone === 'withdraw' ? 'bg-gradient-to-br from-[#DCEBFF] to-[#C5DCFF] text-[#0755B5]' : 'bg-gradient-to-br from-[#B9D9FF] to-[#E8F3FF] text-[#0873D1]'}`}>
        {icon}
      </span>
      <span className="text-[12px] font-semibold whitespace-nowrap text-ink">{label}</span>
    </motion.button>
  )
}

