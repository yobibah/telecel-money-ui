import {
  ArrowCounterClockwise,
  ArrowLineDown,
  ArrowLineUp,
  ArrowsLeftRight,
  Bank,
  ChartLineUp,
  ClockCounterClockwise,
  DeviceMobile,
  DotsThree,
  GlobeHemisphereWest,
  HourglassMedium,
  Scan,
  Storefront,
  Wallet,
  WifiHigh,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'

export type Service = {
  id: string
  label: string
  icon?: PhosphorIcon
  /** Short partner monogram when there is no icon. */
  mark?: string
  style?: 'soft' | 'solid'
  /** Colour family of the tile: transfers blue, bills amber, money green, telecom teal, tools slate. */
  tone?: ServiceTone
}

export type ServiceTone = 'transfer' | 'bill' | 'money' | 'telco' | 'utility'

export type ServiceGroup = { id: string; title: string; services: Service[] }

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'telecel',
    title: 'Services Telecel Faso',
    services: [
      { id: 'salaire', label: 'Compte Salaire', icon: Wallet, tone: 'money' },
      { id: 'recharger', label: 'Recharger', icon: DeviceMobile, tone: 'telco' },
      { id: 'postpaye', label: 'Telecel Postpayé', mark: 'TF', style: 'solid' },
      { id: 'forfaits', label: 'Forfaits Internet', icon: WifiHigh, tone: 'telco' },
    ],
  },
  {
    id: 'facturiers',
    title: 'Facturiers',
    services: [
      { id: 'onea', label: 'ONEA', mark: 'ONEA', tone: 'bill' },
      { id: 'sonabel', label: 'SONABEL', mark: 'SBL', tone: 'bill' },
      { id: 'dgi', label: 'DGI', mark: 'DGI', tone: 'bill' },
      { id: 'alioth', label: 'ALIOTH', mark: 'ALT', tone: 'bill' },
      { id: 'agri', label: 'Agrivoucher', mark: 'AGV', tone: 'bill' },
      { id: 'canal', label: 'CANAL+', mark: 'C+', style: 'solid' },
      { id: 'recharge-ligne', label: 'Recharge en ligne', icon: WifiHigh, tone: 'telco' },
    ],
  },
  {
    id: 'finances',
    title: 'Service des finances',
    services: [
      { id: 'banques', label: 'Banques', icon: Bank, tone: 'money' },
      { id: 'finance', label: 'Finance', icon: ChartLineUp, tone: 'money' },
    ],
  },
  {
    id: 'nos-services',
    title: 'Nos Services',
    services: [
      { id: 'depot', label: 'Dépôt', icon: ArrowLineDown },
      { id: 'retrait', label: 'Retrait', icon: ArrowLineUp },
      { id: 'transfert', label: "Transfert d'argent", icon: ArrowsLeftRight },
      { id: 'international', label: 'Transfert international', icon: GlobeHemisphereWest },
      { id: 'en-cours', label: 'Transaction en cours', icon: HourglassMedium, tone: 'utility' },
      { id: 'correction', label: 'Correction de transaction', icon: ArrowCounterClockwise, tone: 'utility' },
      { id: 'marchand', label: 'Paiement marchand', icon: Storefront, tone: 'bill' },
    ],
  },
  {
    id: 'autres',
    title: 'Autres Services',
    services: [{ id: 'historique', label: 'Historique', icon: ClockCounterClockwise, tone: 'utility' }],
  },
]

export const RECENT_SERVICES: Service[] = [
  { id: 'international', label: 'Transfert international', icon: GlobeHemisphereWest },
  { id: 'depot', label: 'Dépôt', icon: ArrowLineDown },
  { id: 'salaire', label: 'Compte Salaire', icon: Wallet, tone: 'money' },
  { id: 'banques', label: 'Banques', icon: Bank, tone: 'money' },
  { id: 'finance', label: 'Finance', icon: ChartLineUp, tone: 'money' },
  { id: 'transfert', label: "Transfert d'argent", icon: ArrowsLeftRight },
  { id: 'marchand', label: 'Paiement marchand', icon: Scan, tone: 'bill' },
  { id: 'recharger', label: 'Recharger', icon: DeviceMobile, tone: 'telco' },
  { id: 'sonabel', label: 'SONABEL', mark: 'SBL', tone: 'bill' },
  { id: 'forfaits', label: 'Forfaits Internet', icon: WifiHigh, tone: 'telco' },
  { id: 'onea', label: 'ONEA', mark: 'ONEA', tone: 'bill' },
  { id: 'retrait', label: 'Retrait', icon: ArrowLineUp },
  { id: 'canal', label: 'CANAL+', mark: 'C+', style: 'solid' },
  { id: 'plus', label: 'Plus', icon: DotsThree, style: 'solid' },
]
103
