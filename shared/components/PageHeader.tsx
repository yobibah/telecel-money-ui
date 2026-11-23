import React from 'react';
import { Bell, Headset } from '@phosphor-icons/react';

export function PageHeader({title,children,overlap=false}:{title:React.ReactNode;children?:React.ReactNode;overlap?:boolean}) {
  return <header className={`relative isolate shrink-0 overflow-hidden bg-brand px-4 pt-5 text-white ${overlap?'pb-16':'pb-5'}`}>
    <svg aria-hidden="true" viewBox="0 0 252 252" className="pointer-events-none absolute -right-5 -top-14 h-56 w-56 opacity-[0.13]" fill="none">
      <path d="M18 16H236C245 16 252 23 252 32V72C252 81 245 88 236 88H74C61 88 52 97 52 110V146C52 155 45 162 36 162H18C8 162 0 154 0 144V34C0 24 8 16 18 16Z" fill="#FFFFFF"/>
      <path d="M18 178H178C191 178 200 169 200 156V120C200 111 207 104 216 104H234C244 104 252 112 252 122V220C252 238 238 252 220 252H18C8 252 0 244 0 234V196C0 186 8 178 18 178Z" fill="#2CA6DA"/>
    </svg>
    <div className="relative z-10 mx-auto max-w-xl">
      <div className="flex h-10 items-center justify-between gap-3">
        {typeof title==='string'?<h1 className="truncate text-[22px] font-bold">{title}</h1>:title}
        <div className="flex shrink-0 items-center gap-2">
          <button aria-label="Assistance" onClick={()=>window.dispatchEvent(new CustomEvent('telecel:navigate',{detail:'assistance'}))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Headset size={20}/></button>
          <button aria-label="Notifications" onClick={()=>window.dispatchEvent(new CustomEvent('telecel:navigate',{detail:'notifications'}))} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Bell size={20}/><span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-hot ring-2 ring-brand"/></button>
        </div>
      </div>
      {children}
    </div>
  </header>;
}
