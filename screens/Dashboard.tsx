
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

const SYSTEM_LOGO = "https://i.postimg.cc/GmPhKZLG/Whats-App-Image-2025-12-22-at-10-32-42.jpg";

export const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());
  const [dbStatus, setDbStatus] = useState<'online' | 'error' | 'syncing'>('online');

  useEffect(() => {
    setData(StorageService.getData());
    const unsubscribe = StorageService.subscribe((newData) => {
        setData(newData);
        if (newData.lastDbError) setDbStatus('error');
        else setDbStatus('online');
    });
    
    // Auto sync on mount
    setDbStatus('syncing');
    StorageService.fetchRemoteData().then(() => setDbStatus('online'));
    
    return () => { unsubscribe(); };
  }, []);

  const isSuperAdmin = data.currentUserEmail === 'ceoctsvirtual@gmail.com';

  const getRoleLabel = () => {
      if (isSuperAdmin) return 'Fundador Master';
      const me = data.dbDrivers.find(d => d.email === data.currentUserEmail);
      if (me) {
          const role = data.dbRoles.find(r => r.id === me.roleId);
          return role?.name || 'Membro';
      }
      return 'Proprietário';
  };

  const hasAdminAccess = StorageService.hasPermission('GLOBAL_ADMIN');
  
  const myCompanyDrivers = isSuperAdmin 
    ? data.dbDrivers 
    : data.dbDrivers.filter(d => d.companyName === data.companyName);
    
  const activeMembers = myCompanyDrivers.length;
  
  const myCompanyTrips = isSuperAdmin
    ? data.dbTrips
    : data.dbTrips.filter(t => {
        const driver = data.dbDrivers.find(d => d.name === t.driverName);
        return driver?.companyName === data.companyName;
      });

  const totalKm = myCompanyTrips.reduce((acc, t) => acc + Number(t.distance), 0);
  const totalRevenue = myCompanyTrips.reduce((acc, t) => acc + (parseFloat(t.value.replace(/\./g, '').replace(',', '.')) || 0), 0);

  return (
    <div className="bg-background-dark font-display text-white min-h-screen relative pb-24 transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-white/5 justify-between safe-area-top shadow-xl">
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : dbStatus === 'syncing' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{dbStatus}</span>
            </div>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">CTSPREMIUM</h2>
        <div className="flex flex-1 justify-end">
          <button 
            onClick={() => onNavigate(ScreenName.REQUESTS)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
          >
            <span className="material-symbols-outlined text-white">notifications</span>
            {data.dbRequests.length > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background-dark"></span>
            )}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col p-4">
        <div className="flex w-full flex-col gap-4 items-center bg-surface-card p-0 rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden">
          <div className="w-full h-44 bg-gray-900 relative">
              {data.companyBanner ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${data.companyBanner}')` }}></div>
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-950">
                      <img src={SYSTEM_LOGO} className="w-full h-full object-cover opacity-10" alt="CTS" />
                      <span className="absolute material-symbols-outlined text-5xl opacity-20">apartment</span>
                  </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
          </div>

          <div className="flex gap-4 flex-col items-center -mt-16 px-6 pb-8 relative z-10">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-[2.5rem] h-32 w-32 border-[6px] border-surface-card shadow-2xl bg-gray-800 ring-1 ring-white/10" 
              style={{ backgroundImage: `url('${data.companyLogo || SYSTEM_LOGO}')` }}
            ></div>
            <div className="flex flex-col items-center justify-center mt-2">
              <h1 className="text-2xl font-black leading-tight tracking-tight text-center mb-2 text-white uppercase">{data.companyName}</h1>
              
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-1.5 text-[10px] font-black text-primary border border-primary/30 uppercase tracking-[0.2em]">
                  {data.companyTag}
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-4 py-1.5 text-[10px] font-black text-amber-500 border border-amber-500/20 uppercase tracking-[0.2em]">
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasAdminAccess && (
        <div className="px-4 pb-4">
          <button 
              onClick={() => onNavigate(ScreenName.ADMIN_PANEL)}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-indigo-950 via-gray-900 to-indigo-900 rounded-3xl shadow-2xl border border-indigo-500/30 group transition-all active:scale-[0.98]"
          >
              <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary rounded-2xl text-white flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/20">
                      <span className="material-symbols-outlined text-2xl">shield_person</span>
                  </div>
                  <div className="text-left">
                      <p className="text-white font-black text-sm uppercase tracking-tight">Painel de Fundador</p>
                      <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Controle Master Global</p>
                  </div>
              </div>
              <span className="material-symbols-outlined text-indigo-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </div>
      )}

      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-3xl p-5 bg-surface-card border border-white/5 shadow-xl">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Membros</p>
            <p className="text-white text-2xl font-black">{activeMembers}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-3xl p-5 bg-surface-card border border-white/5 shadow-xl">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Distância</p>
            <p className="text-white text-2xl font-black">{totalKm.toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-3xl p-5 bg-surface-card border border-white/5 shadow-xl">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Receita</p>
            <p className="text-emerald-500 text-lg font-black">R$ {totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <button 
          onClick={() => onNavigate(ScreenName.ADD_TRIP)}
          className="w-full relative flex items-center justify-center overflow-hidden rounded-2xl h-16 bg-primary text-white gap-3 shadow-[0_10px_30px_rgba(19,91,236,0.3)] transition-all active:scale-95 font-black uppercase tracking-[0.2em] group"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          <span className="material-symbols-outlined text-[24px] relative z-10">add_circle</span>
          <span className="relative z-10">Lançar Viagem</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-12">
        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] px-2 pb-2">Ecossistema Logístico</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate(ScreenName.MAP)} className="flex flex-col gap-4 rounded-3xl p-6 bg-surface-card border border-white/5 shadow-xl hover:bg-gray-800 transition-colors text-left group">
            <div className="flex justify-between w-full">
              <div className="rounded-2xl bg-orange-500/10 p-3 w-fit border border-orange-500/20 text-orange-500">
                <span className="material-symbols-outlined">map</span>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-white text-sm font-black uppercase tracking-tight">Monitoramento</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">Frota Ativa</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.CALCULATOR)} className="flex flex-col gap-4 rounded-3xl p-6 bg-surface-card border border-white/5 shadow-xl hover:bg-gray-800 transition-colors text-left group">
            <div className="flex justify-between w-full">
              <div className="rounded-2xl bg-emerald-500/10 p-3 w-fit border border-emerald-500/20 text-emerald-500">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-white text-sm font-black uppercase tracking-tight">Financeiro</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">Divisão B2B</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.HISTORY)} className="flex flex-col gap-4 rounded-3xl p-6 bg-surface-card border border-white/5 shadow-xl hover:bg-gray-800 transition-colors text-left group">
            <div className="flex justify-between w-full">
              <div className="rounded-2xl bg-blue-500/10 p-3 w-fit border border-blue-500/20 text-blue-500">
                <span className="material-symbols-outlined">history</span>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-white text-sm font-black uppercase tracking-tight">Arquivo</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">Histórico</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.RANKINGS)} className="flex flex-col gap-4 rounded-3xl p-6 bg-surface-card border border-white/5 shadow-xl hover:bg-gray-800 transition-colors text-left group">
            <div className="flex justify-between w-full">
              <div className="rounded-2xl bg-pink-500/10 p-3 w-fit border border-pink-500/20 text-pink-500">
                <span className="material-symbols-outlined">emoji_events</span>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-white text-sm font-black uppercase tracking-tight">Prestigio</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase mt-1">Top Drivers</p>
            </div>
          </button>
        </div>
      </div>

      <BottomNav currentScreen={ScreenName.DASHBOARD} onNavigate={onNavigate} />
    </div>
  );
};
