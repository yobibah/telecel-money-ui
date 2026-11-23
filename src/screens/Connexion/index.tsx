import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Headset, Lock } from 'lucide-react';
const HERO = 'https://giants-live.com/app/uploads/2022/01/iron-biby.jpg';
const EASE = [0.23, 1, 0.32, 1] as const;
export const args = {
  state: 'default',
  numero: ''
};
export const argTypes = {
  state: {
    control: 'select',
    options: ['default', 'error', 'loading']
  },
  numero: {
    control: 'text'
  }
};
type Props = Partial<typeof args> & {
  onLogin?: (numero: string) => void;
};
export default function Connexion(props: Props) {
  const {
    state,
    numero,
    onLogin
  } = {
    ...args,
    ...props
  };
  const [num, setNum] = useState(formatNumero(numero));
  const reduce = useReducedMotion();
  const loading = state === 'loading';
  const error = state === 'error';
  return <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white text-[#123B68]">
    <section className="relative min-h-0 flex-[1.15] overflow-hidden bg-[#EAF4FF]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_10%,#CFE3FA_0%,transparent_48%),linear-gradient(145deg,#FFFFFF_0%,#EAF4FF_75%)]"><img src={HERO} alt="Iron Biby, athlète burkinabè" className="h-full w-full object-cover object-center" /></div>
      <svg aria-hidden="true" viewBox="0 0 252 252" className="pointer-events-none absolute -right-5 -top-14 z-[1] h-56 w-56 opacity-25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z" fill="#FFFFFF"/><path d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z" fill="#2CA6DA"/></svg>
      <svg aria-hidden="true" viewBox="0 0 252 252" className="pointer-events-none absolute -bottom-24 -left-20 z-[1] h-52 w-52 rotate-180 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z" fill="#FFFFFF"/><path d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z" fill="#2CA6DA"/></svg>
      \n      
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent" />
      
      <div className="absolute bottom-6 left-5 right-5 z-10">
        
        
      </div>
    </section>

    <motion.main initial={reduce ? false : {
      y: 22,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      duration: .35,
      ease: EASE
    }} className="relative z-20 -mt-4 shrink-0 rounded-t-[28px] border-t border-[#D9EFFB] bg-white px-5 pt-6 pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-10px_32px_rgba(22,91,139,.08)]">
      <div className="mx-auto w-full max-w-md">
        <h2 className="text-[22px] font-extrabold tracking-tight text-[#123B68]">Se connecter ou s'inscrire</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#66809A]">Entrez votre numéro pour accéder à votre compte Telecel Money.</p>
        <form onSubmit={e => {
          e.preventDefault();
          if (!loading && num.replace(/\D/g, '').length === 8) onLogin?.(num.replace(/\D/g, ''));
        }} className="mt-5">
          <label htmlFor="numero" className="sr-only">Numéro de téléphone</label>
          <div className={`flex h-[62px] items-center rounded-2xl border bg-[#F8FCFF] px-3 transition-all ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-[#CFE3FA] focus-within:border-[#2C86D5] focus-within:ring-2 focus-within:ring-[#2C86D5]/15'}`}>
            <button type="button" className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-2 text-[14px] font-semibold text-[#173B67]"><BurkinaFlag /><ChevronDown className="h-4 w-4 text-[#5B86A8]" /></button>
            <span className="mx-2 h-8 w-px bg-[#D8EAF5]" />
            <div className="min-w-0 flex-1"><span className="block text-[10px] font-medium text-[#7D94A9]">Numéro de téléphone</span><div className="flex items-center"><span className="mr-1.5 text-[15px] font-semibold text-[#426987]">+226</span><input id="numero" type="tel" inputMode="numeric" autoComplete="tel-national" value={num} onChange={e => setNum(formatNumero(e.target.value))} placeholder="79 00 00 00" disabled={loading} className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold tracking-wide text-[#123B68] outline-none placeholder:text-[#A7BBCB]" /></div></div>
          </div>
          <AnimatePresence>{error && <motion.p initial={{
              opacity: 0,
              y: -4
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} className="mt-2 text-[12px] text-red-500">Veuillez vérifier votre numéro de téléphone.</motion.p>}</AnimatePresence>
          <p className="mt-4 text-[11px] leading-relaxed text-[#7B91A5]">En continuant, vous acceptez nos <a href="#" className="font-semibold text-[#17669A] underline underline-offset-2">Conditions d'utilisation</a>.</p>
          <motion.button whileTap={reduce ? undefined : {
            scale: .985
          }} type="submit" disabled={loading || num.replace(/\D/g, '').length !== 8} className="mt-5 flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#0755B5] text-[16px] font-extrabold text-white shadow-[0_7px_18px_rgba(7,85,181,.28)] transition-opacity disabled:opacity-40">{loading ? 'Vérification…' : <>Suivant <ArrowRight className="h-5 w-5" /></>}</motion.button>
        </form>
        
        
      </div>
    </motion.main>
  </div>;
}
function formatNumero(value: string) {
  return value.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(?=\d)/g, '$1 ');
}
function TelecelLogo() {
  return <div className="flex items-center gap-1.5 text-[19px] font-black tracking-tight text-[#17649A]">telecel<span className="text-[#2CA6DA]">●</span></div>;
}
function BurkinaFlag() {
  return <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-[3px]"><rect width="30" height="10" fill="#EF2B2D" /><rect y="10" width="30" height="10" fill="#009E49" /><path d="m15 5.6 1.06 3.26h3.44l-2.78 2.02 1.06 3.26L15 12.12l-2.78 2.02 1.06-3.26-2.78-2.02h3.44Z" fill="#FCD116" /></svg>;
}
