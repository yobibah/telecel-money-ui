import React,{useEffect,useState} from 'react';
import Connexion from './screens/Connexion';
import VerificationOTP from './screens/VerificationOTP';
import Accueil from './screens/Accueil';
import MesServices from './screens/MesServices';
import Historique from './screens/Historique';
import MonCompte from './screens/MonCompte';
import Notifications from './screens/Notifications';
import Assistance from './screens/Assistance';
import MonBilan from './screens/MonBilan';
import Alertes from './screens/Alertes';
import Parametres from './screens/Parametres';
import {I18nProvider} from '../shared/i18n';

const CONNEXION='connexion',OTP='otp',ACCUEIL='accueil',SERVICES='services',HISTORIQUE='historique',COMPTE='compte',NOTIFICATIONS='notifications',ASSISTANCE='assistance',BILAN='bilan',ALERTES='alertes',PARAMETRES='parametres';
type Props={solde?:string;balanceHidden?:boolean;start?:string};
function TelecelMoneyApp({solde='0,00',balanceHidden=false,start}:Props){
 const queryScreen=()=>new URLSearchParams(window.location.search).get('screen')||CONNEXION;
 const [screen,setScreen]=useState(start||queryScreen);
 const [loginPhone,setLoginPhone]=useState('');
 useEffect(()=>{if(start)setScreen(start)},[start]);
 useEffect(()=>{
  const handle=(event:Event)=>{const destination=(event as CustomEvent<string>).detail;setScreen(destination==='notifications'?NOTIFICATIONS:destination==='alertes'?ALERTES:destination==='parametres'?PARAMETRES:ASSISTANCE)};
  const openSettings=()=>setScreen(PARAMETRES),openAlerts=()=>setScreen(ALERTES);
  window.addEventListener('telecel:navigate',handle);
  window.addEventListener('telecel:open-settings',openSettings);
  window.addEventListener('telecel:open-alerts',openAlerts);
  return()=>{window.removeEventListener('telecel:navigate',handle);window.removeEventListener('telecel:open-settings',openSettings);window.removeEventListener('telecel:open-alerts',openAlerts)};
 },[]);
 const onNavigate=(tab:string)=>setScreen(tab==='services'?SERVICES:tab==='historique'?HISTORIQUE:tab==='compte'?COMPTE:ACCUEIL);
 if(screen===CONNEXION)return <Connexion onLogin={phone=>{setLoginPhone(phone);setScreen(OTP)}}/>;
 if(screen===OTP)return <VerificationOTP numero={loginPhone} onBack={()=>setScreen(CONNEXION)} onVerified={()=>setScreen(ACCUEIL)}/>;
 if(screen===SERVICES)return <MesServices onNavigate={onNavigate}/>;
 if(screen===HISTORIQUE)return <Historique onNavigate={onNavigate}/>;
 if(screen===COMPTE)return <MonCompte onNavigate={onNavigate} onOpenBilan={()=>setScreen(BILAN)}/>;
 if(screen===BILAN)return <MonBilan onNavigate={onNavigate} onBack={()=>setScreen(COMPTE)}/>;
 if(screen===NOTIFICATIONS)return <Notifications onNavigate={onNavigate}/>;
 if(screen===ASSISTANCE)return <Assistance onNavigate={onNavigate}/>;
 if(screen===ALERTES)return <Alertes onNavigate={onNavigate} onBack={()=>setScreen(PARAMETRES)}/>;
 if(screen===PARAMETRES)return <Parametres onNavigate={onNavigate} onOpenBilan={()=>setScreen(BILAN)} onOpenAlertes={()=>setScreen(ALERTES)} onBack={()=>setScreen(COMPTE)}/>;
 return <Accueil solde={solde} balanceHidden={balanceHidden} onNavigate={onNavigate}/>;
}
export default function TelecelMoney(props:Props){return <I18nProvider><TelecelMoneyApp {...props}/></I18nProvider>}
