
import React, { useRef, useState, useEffect } from 'react';
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
  }, []);

  const handleEditClick = () => {
    onNavigate(ScreenName.EDIT_PROFILE); // Corrected navigation
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
            className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 ring-4 ring-primary/20 shadow-xl" 
            style={{ backgroundImage: `url('${data.ownerPhoto || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXQzp7dL_b1J5KOVc0X3fEorY3rJh24-h5sDoI4Y83Rg9I2Xqh6h8iqnW3GEpgq89DoJBcFOshUKB5dhulEy6UShNlC0QknfFrjN2O9kfFw1rt_ApxZKgO9iuSHkRozD_wy8IrHPHQf2IlV7NrgLfIWGkBIS4R0pXf0dDAReNXCm0IhiQe89Qe4uuTGZ8kV1TIhUspFrel7rZXWlhvf_dKId_Yyn5IUNhEB71VEJmh4xDkF4Aqd-lVTEkQywF29k_1xPA9IPuANg"}')` }}
          >
          </div>
          <button 
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-primary hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center border-2 border-background-dark"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold text-white">{data.ownerName}</h1>
          <p className="text-slate-400 text-sm">{data.ownerEmail}</p>
          <div className="mt-2 flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-primary text-[18px]">admin_panel_settings</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">CEO / Fundador</span>
          </div>
        </div>

        <div className="flex w-full justify-center gap-8 mt-6 border-y border-slate-800 py-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">12.5k</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Km Rodados</p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">5.0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Avaliação</p>
          </div>
          <div className="w-px bg-slate-800"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">142</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Entregas</p>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-6 px-4 pb-8">
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Gerenciamento</h3>
          <div className="group relative overflow-hidden rounded-xl bg-[#1a202e] shadow-sm border border-slate-800 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onNavigate(ScreenName.DASHBOARD)}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
            <div className="p-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-lg h-14 w-14 shadow-sm border border-slate-700 shrink-0" 
                  style={{ backgroundImage: `url('${data.companyLogo || "https://lh3.googleusercontent.com/aida-public/AB6AXuAwAJIREPsmHiTzNsGjwNNTBCqUGl7rvSZmDjhCA1y7h2AH-ICESWcwY5yoDLadZ0wr18TGJa6PElG4OpMrASfLJ1ZLJK6v8sUxstQ_U2CbG_0bwKyy7UJg0QjZrvYK2VpfeuXPxfMHZTLxr0Gcyl9k4iA59vVR6fpjeJzGVisBUFy04de6sUq04T_94u7MPWTEpf5VXjm5lRQ4bni2HltgIKSoJhZ9flTY_Ec2qWwKcI9wEBx-YixUbmolPp-9PiNsFdGlPP_jun0"}')` }}
                >
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">{data.companyName}</span>
                  <span className="text-primary text-sm font-medium">Painel do Proprietário</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Dados Pessoais</h3>
          <div className="flex flex-col bg-[#1a202e] rounded-xl overflow-hidden shadow-sm border border-slate-800 divide-y divide-slate-800">
             <button onClick={() => onNavigate(ScreenName.EDIT_PROFILE)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-900/30 text-indigo-400">
                  <span className="material-symbols-outlined text-[20px]">person_edit</span>
                </div>
                <span className="text-sm font-medium text-white">Editar Dados</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
            <button onClick={() => onNavigate(ScreenName.DRIVER_ID)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-900/30 text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <span className="text-sm font-medium text-white">Minha Carteira</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
            <button onClick={() => onNavigate(ScreenName.HISTORY)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900/30 text-emerald-400">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </div>
                <span className="text-sm font-medium text-white">Histórico de Viagens</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Segurança</h3>
          <div className="flex flex-col bg-[#1a202e] rounded-xl overflow-hidden shadow-sm border border-slate-800 divide-y divide-slate-800">
            <button onClick={() => onNavigate(ScreenName.CHANGE_PASSWORD)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <span className="text-sm font-medium text-white">Alterar Senha</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
            <button onClick={() => onNavigate(ScreenName.SETTINGS)} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors w-full text-left">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </div>
                <span className="text-sm font-medium text-white">Configurações do App</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        <button onClick={() => onNavigate(ScreenName.INTRO)} className="mt-4 flex items-center justify-center gap-2 p-4 w-full rounded-xl border border-red-900/30 bg-red-900/10 text-red-400 font-bold text-sm hover:bg-red-900/20 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sair da Conta
        </button>
      </main>

      <BottomNav currentScreen={ScreenName.PROFILE} onNavigate={onNavigate} />
    </div>
  );
};
