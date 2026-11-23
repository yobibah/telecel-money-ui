import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Language = 'fr' | 'en'
type Dictionary = Record<string, string>
const dictionaries: Record<Language, Dictionary> = {
  fr: {
    account:'Compte', security:'Sécurité', pin:'Code PIN', changed:'Modifié il y a 3 mois',
    fingerprint:'Connexion par empreinte', enabled:'Activée sur cet appareil', disabled:'Désactivée',
    payments:'Paiements', paymentSettings:'Paramètres de paiement', paymentHint:'Confirmation, marchands favoris',
    limits:'Limites et frais', preferences:'Préférences', language:'Langue', notifications:'Notifications',
    transactionAlerts:'Transactions et offres', off:'Coupées', support:'Assistance', help:'Aide et commentaires',
    share:'Partager l’application', about:'À propos', logout:'Se déconnecter', edit:'Modifier',
    recentServices:'Services récents', recentTransactions:'Dernières transactions', recentSubtitle:'Vos envois, retraits et dépôts récents',
    seeAll:'Tout voir', discover:'À découvrir', swipe:'Faites défiler', scanner:'Scanner', withdraw:'Retrait',
    recharge:'Recharger', receiveQr:'Mon QR code de réception', scanInstruction:'Présentez ce code à la personne qui souhaite vous envoyer de l’argent.',
    close:'Fermer', cameraAccess:'Autorisez l’accès à la caméra pour scanner un QR code.',
    scanTitle:'Scanner un QR code', scanHint:'Placez le QR code dans le cadre.', scanResult:'Code détecté',
    scanUnsupported:'Le scan caméra n’est pas disponible sur cet appareil. Utilisez un navigateur compatible.',
    scanAgain:'Scanner à nouveau', french:'Français', english:'English',
    home:'Accueil', services:'Services', history:'Historique'
  },
  en: {
    account:'Account', security:'Security', pin:'PIN code', changed:'Changed 3 months ago',
    fingerprint:'Fingerprint login', enabled:'Enabled on this device', disabled:'Disabled',
    payments:'Payments', paymentSettings:'Payment settings', paymentHint:'Confirmation, favorite merchants',
    limits:'Limits and fees', preferences:'Preferences', language:'Language', notifications:'Notifications',
    transactionAlerts:'Transactions and offers', off:'Off', support:'Support', help:'Help and feedback',
    share:'Share the app', about:'About', logout:'Log out', edit:'Edit',
    recentServices:'Recent services', recentTransactions:'Recent transactions', recentSubtitle:'Your recent transfers, withdrawals and deposits',
    seeAll:'See all', discover:'Discover', swipe:'Swipe to explore', scanner:'Scan', withdraw:'Withdraw',
    recharge:'Top up', receiveQr:'My receive QR code', scanInstruction:'Show this code to the person sending you money.',
    close:'Close', cameraAccess:'Allow camera access to scan a QR code.',
    scanTitle:'Scan a QR code', scanHint:'Place the QR code inside the frame.', scanResult:'Code detected',
    scanUnsupported:'Camera scanning is not available on this device. Use a compatible browser.',
    scanAgain:'Scan again', french:'French', english:'English', moore:'Mooré',
    home:'Home', services:'Services', history:'History'
  },
}
const I18nContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: string) => string } | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try { const saved = localStorage.getItem('telecel-language'); return saved === 'en' ? 'en' : 'fr' } catch { return 'fr' }
  })
  const setLanguage = (next: Language) => {
    setLanguageState(next)
    try { localStorage.setItem('telecel-language', next) } catch {}
  }
  const value = useMemo(() => ({ language, setLanguage, t: (key: string) => dictionaries[language][key] ?? dictionaries.fr[key] ?? key }), [language])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
57
