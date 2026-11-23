import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export const args = { numero: '70 12 34 56' }
export const argTypes = { numero: { control: 'text' } }
type Props = Partial<typeof args> & { onBack?: () => void; onVerified?: () => void }

export default function VerificationOTP({ numero, onBack, onVerified }: Props) {
  const [code, setCode] = useState(['','','','','',''])
  const [seconds, setSeconds] = useState(34)
  const [resent, setResent] = useState(false)
  const refs = useRef<Array<HTMLInputElement | null>>([])
  useEffect(() => { if (seconds <= 0) return; const timer = setTimeout(() => setSeconds(s => s - 1), 1000); return () => clearTimeout(timer) }, [seconds])
  const update = (index: number, value: string) => {
    const digit = value.replace(/\D/g,'').slice(-1)
    const next = [...code]; next[index] = digit; setCode(next)
    if (digit && index < 5) refs.current[index + 1]?.focus()
    if (digit && next.every(Boolean)) window.setTimeout(() => onVerified?.(), 450)
  }
  return <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(18px,env(safe-area-inset-top))] text-[#123B68]">
    <svg aria-hidden="true" viewBox="0 0 252 252" className="pointer-events-none absolute -right-7 -top-12 h-60 w-60 opacity-[0.12]" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z" fill="#0755B5"/><path d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z" fill="#2CA6DA"/></svg>
    <svg aria-hidden="true" viewBox="0 0 252 252" className="pointer-events-none absolute -bottom-20 -left-24 h-56 w-56 rotate-180 opacity-[0.07]" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z" fill="#0755B5"/><path d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z" fill="#0755B5"/></svg>
    <header className="relative z-10 flex items-center justify-between">
      <button onClick={onBack} aria-label="Retour" className="flex h-11 w-11 items-center justify-center rounded-full text-[#173B67] hover:bg-[#EFF9FE]"><ArrowLeft className="h-5 w-5"/></button>
      <TelecelLogo/>
      <span className="h-11 w-11"/>
    </header>
    <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center pb-10">
      <h1 className="text-[28px] font-bold tracking-tight text-[#123B68]">Vérification</h1>
      <p className="mt-3 text-[14px] text-[#6B8298]">Entrez le code envoyé au <span className="font-semibold text-[#173B67]">+226 {numero}</span>.</p>
      <div className="mt-9 grid grid-cols-6 gap-2.5">
        {code.map((digit, i) => <input key={i} ref={el => {refs.current[i] = el}} value={digit} onChange={e => update(i,e.target.value)} onKeyDown={e => {if(e.key === 'Backspace' && !code[i] && i > 0) refs.current[i-1]?.focus()}} type="text" inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={1} aria-label={`Chiffre ${i+1}`} className={`h-[58px] min-w-0 rounded-xl border bg-white text-center text-[23px] font-bold text-[#173B67] outline-none transition-all shadow-[0_2px_7px_rgba(22,91,139,.04)] ${digit ? 'border-[#2CA6DA] bg-[#F3FBFF] ring-2 ring-[#2CA6DA]/10' : 'border-[#9ABBD2] focus:border-[#2CA6DA] focus:ring-2 focus:ring-[#2CA6DA]/15'}`}/>)}
      </div>
      <div className="mt-5 min-h-5 text-[12px]">
        {seconds > 0 ? <span className="text-[#71879A]">Renvoyer le code dans <strong className="text-[#168BC4]">00:{String(seconds).padStart(2,'0')}</strong></span> : <button onClick={() => {setSeconds(34);setCode(['','','','','','']);setResent(true);refs.current[0]?.focus()}} className="font-semibold text-[#168BC4]"><RefreshCw className="mr-1 inline h-3.5 w-3.5"/> Renvoyer le code</button>}
        {resent && <span className="ml-2 text-emerald-600">Code renvoyé</span>}
      </div>
      <motion.button whileTap={{scale:.985}} disabled={!code.every(Boolean)} onClick={onVerified} className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2CA6DA] text-[15px] font-bold text-white shadow-[0_6px_16px_rgba(44,166,218,.18)] disabled:bg-[#B9DFF0] disabled:shadow-none">Vérifier</motion.button>
    </main>
    <div className="relative z-10 mx-auto mt-4 h-1 w-32 rounded-full bg-[#173B67]/75"/>
  </div>
}

function TelecelLogo() { return <div className="flex items-center gap-1.5 text-[19px] font-black tracking-tight text-[#17649A]">telecel<span className="text-[#2CA6DA]">●</span></div> }

