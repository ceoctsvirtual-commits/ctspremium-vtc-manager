
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Profile: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());

  useEffect(() => {
    setData(StorageService.getData());
    // Fix: Explicitly wrapping in braces to return void (Set.delete returns boolean)
    const unsubscribe = StorageService.subscribe((newData) => {
      setData(newData);
    });
    return () => { unsubscribe(); };
  }, []);

  const isSuperAdmin = data.ownerEmail === 'ceoctsvirtual@gmail.com';

  const handleEditClick = () => {
    onNavigate(ScreenName.EDIT_PROFILE);
  };

  const handleLogout = () => {
    if(confirm('Deseja realmente encerrar a sessão?')) {
      StorageService.logout();
      onNavigate(ScreenName.INTRO);
    }
  };

  return (
    <div className="bg-background-dark font-display text-white min-h-screen relative pb-24 flex flex-col">
      <header className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 justify-between border-b border-slate-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Meu Perfil</h2>
      </header>

      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="relative group">
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 ring-4 ring-primary/20 shadow-xl overflow-hidden" 
            style={{ backgroundImage: `url('${data.ownerPhoto || "https://placehold.co/150x150/333/FFF?text=Foto"}')` }}
          >
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold text-white">{data.ownerName}</h1>
          <p className="text-slate-400 text-sm">{data.ownerEmail}</p>
          <div className="mt-2 flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-primary text-[18px]">{isSuperAdmin ? 'verified_user' : 'admin_panel_settings'}</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">
              {isSuperAdmin ? 'Administrador Fundador' : 'Proprietário de VTC'}
            </span>
          </div>
        </div>

        <div className="flex w-full justify-center gap-8 mt-6 border-y border-slate-800 py-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{(data.dbTrips.filter(t => t.driverName === data.ownerName).reduce((acc, t) => acc + Number(t.distance), 0)).toLocaleString()}k</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Km Totais</p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">5.0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Reputação</p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{data.dbTrips.filter(t => t.driverName === data.ownerName).length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Entregas</p>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-6 px-4 pb-8">
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Organização Ativa</h3>
          <div className="group relative overflow-hidden rounded-xl bg-[#1a202e] shadow-sm border border-slate-800 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onNavigate(ScreenName.DASHBOARD)}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
            <div className="p-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-lg h-14 w-14 shadow-sm border border-slate-700 shrink-0 bg-gray-800" 
                  style={{ backgroundImage: `url('${data.companyLogo || "https://placehold.co/100x100/333/FFF?text=Logo"}')` }}
                >
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">{data.companyName}</span>
                  <span className="text-primary text-sm font-medium">Tag: {data.companyTag} • {data.segment}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Segurança e Ações</h3>
          <div className="flex flex-col bg-[#1a202e] rounded-xl overflow-hidden shadow-sm border border-slate-800 divide-y divide-slate-800">
            <button onClick={handleEditClick} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/50 text-slate-300">
                  <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white uppercase tracking-tight">Editar Dados Cadastrais</span>
                  <span className="text-[10px] text-slate-500 font-medium">Atualize seu perfil e veículo</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-[20px]">chevron_right</span>
            </button>
            <button onClick={() => onNavigate(ScreenName.DRIVER_ID)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/50 text-slate-300">
                  <span className="material-symbols-outlined text-[24px]">badge</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white uppercase tracking-tight">Habilitação Digital</span>
                  <span className="text-[10px] text-slate-500 font-medium">Identidade virtual do motorista</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-[20px]">chevron_right</span>
            </button>
            <button onClick={() => onNavigate(ScreenName.CHANGE_PASSWORD)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/50 text-slate-300">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white uppercase tracking-tight">Segurança da Conta</span>
                  <span className="text-[10px] text-slate-500 font-medium">Alterar senha e privacidade</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 p-4 w-full rounded-xl border border-red-900/30 bg-red-900/10 text-red-400 font-bold text-sm hover:bg-red-900/20 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Finalizar Sessão
        </button>
      </main>

      <BottomNav currentScreen={ScreenName.PROFILE} onNavigate={onNavigate} />
    </div>
  );
};
