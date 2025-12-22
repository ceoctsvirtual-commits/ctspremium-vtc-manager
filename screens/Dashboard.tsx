
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());

  useEffect(() => {
    // Initial load
    setData(StorageService.getData());
    
    // Subscribe to real-time updates from other tabs or actions
    const unsubscribe = StorageService.subscribe((newData) => {
        setData(newData);
    });

    return () => unsubscribe();
  }, []);

  const getRoleLabel = () => {
      if (data.organizationType === 'AUTONOMOUS') return 'Autônomo';
      if (data.organizationType === 'GROUP') return 'Líder';
      return 'Fundador';
  };

  const handleNotificationClick = () => {
      alert(`Você tem ${data.dbRequests.length} solicitações pendentes e novas atualizações do sistema.`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white min-h-screen relative pb-24 transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 justify-between safe-area-top shadow-sm dark:shadow-none">
        <div className="flex-1"></div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Gerenciamento</h2>
        <div className="flex flex-1 justify-end">
          <button 
            onClick={handleNotificationClick}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-white">notifications</span>
            {data.dbRequests.length > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-white dark:border-background-dark"></span>
            )}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col p-4">
        <div className="flex w-full flex-col gap-4 items-center bg-white dark:bg-[#1C2533] p-0 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Banner */}
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 relative">
              {data.companyBanner ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${data.companyBanner}')` }}></div>
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                      <span className="material-symbols-outlined text-6xl opacity-20">panorama</span>
                  </div>
              )}
              {/* Gradient overlay for text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          </div>

          <div className="flex gap-4 flex-col items-center -mt-16 px-6 pb-6 relative z-10">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-[5px] border-white dark:border-[#1C2533] shadow-lg bg-white dark:bg-gray-800" 
              style={{ backgroundImage: `url('${data.companyLogo || "https://lh3.googleusercontent.com/aida-public/AB6AXuAwAJIREPsmHiTzNsGjwNNTBCqUGl7rvSZmDjhCA1y7h2AH-ICESWcwY5yoDLadZ0wr18TGJa6PElG4OpMrASfLJ1ZLJK6v8sUxstQ_U2CbG_0bwKyy7UJg0QjZrvYK2VpfeuXPxfMHZTLxr0Gcyl9k4iA59vVR6fpjeJzGVisBUFy04de6sUq04T_94u7MPWTEpf5VXjm5lRQ4bni2HltgIKSoJhZ9flTY_Ec2qWwKcI9wEBx-YixUbmolPp-9PiNsFdGlPP_jun0"}')` }}
            ></div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-center mb-2 text-gray-900 dark:text-white">{data.companyName}</h1>
              
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  {data.companyTag}
                </span>
                <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
                  {getRoleLabel()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Access Button - Only for Founder/Leader */}
      <div className="px-4 pb-4">
        <button 
            onClick={() => onNavigate(ScreenName.ADMIN_PANEL)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#253045] dark:to-[#1a2332] rounded-xl shadow-lg border border-gray-700/50 group active:scale-[0.98] transition-all"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div className="text-left">
                    <p className="text-white font-bold text-sm">Painel Administrativo</p>
                    <p className="text-gray-400 text-xs">Acessar controles da organização</p>
                </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate(ScreenName.ADMIN_PANEL)} className="flex flex-col items-center gap-1 rounded-xl p-3 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors">
            <div className="rounded-full bg-blue-500/10 p-2">
              <span className="material-symbols-outlined text-blue-500 text-[20px]">group</span>
            </div>
            <p className="text-gray-500 dark:text-[#92a4c9] text-xs font-medium">Membros</p>
            <p className="text-gray-900 dark:text-white text-lg font-bold">{data.dbDrivers.length}</p>
          </button>
          
          <button onClick={() => onNavigate(ScreenName.MAP)} className="flex flex-col items-center gap-1 rounded-xl p-3 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors">
            <div className="rounded-full bg-green-500/10 p-2">
              <span className="material-symbols-outlined text-green-500 text-[20px]">local_shipping</span>
            </div>
            <p className="text-gray-500 dark:text-[#92a4c9] text-xs font-medium">Frota</p>
            <p className="text-gray-900 dark:text-white text-lg font-bold">{data.dbDrivers.length * 2}</p>
          </button>
          
          <button onClick={() => onNavigate(ScreenName.CALCULATOR)} className="flex flex-col items-center gap-1 rounded-xl p-3 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors">
            <div className="rounded-full bg-purple-500/10 p-2">
              <span className="material-symbols-outlined text-purple-500 text-[20px]">payments</span>
            </div>
            <p className="text-gray-500 dark:text-[#92a4c9] text-xs font-medium">Caixa</p>
            <p className="text-gray-900 dark:text-white text-lg font-bold">{(1.2 + (data.dbTrips.length * 0.1)).toFixed(1)}M</p>
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <button 
          onClick={() => onNavigate(ScreenName.REGISTER_DRIVER)}
          className="w-full relative flex items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-blue-700 transition-colors text-white gap-3 shadow-lg shadow-primary/25 active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">person_add</span>
          <span className="text-base font-bold tracking-wide">Cadastrar Novo Membro</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-6">
        <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight px-1 pb-2">Opções Rápidas</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate(ScreenName.MAP)} className="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors text-left group active:scale-[0.98]">
            <div className="flex justify-between w-full">
              <div className="rounded-lg bg-orange-500/10 p-2 w-fit">
                <span className="material-symbols-outlined text-orange-500">garage_home</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-base font-semibold">Gerenciar Frota</p>
              <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Manutenção e compras</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.CALCULATOR)} className="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors text-left group active:scale-[0.98]">
            <div className="flex justify-between w-full">
              <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
                <span className="material-symbols-outlined text-emerald-500">account_balance</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-base font-semibold">Financeiro</p>
              <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Extratos e pagamentos</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.REQUESTS)} className="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors text-left group active:scale-[0.98]">
            <div className="flex justify-between w-full">
              <div className="rounded-lg bg-pink-500/10 p-2 w-fit">
                <span className="material-symbols-outlined text-pink-500">pending_actions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white transition-all ${data.dbRequests.length > 0 ? 'bg-red-500' : 'bg-gray-500'}`}>
                    {data.dbRequests.length}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-base font-semibold">Solicitações</p>
              <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Aprovar membros</p>
            </div>
          </button>

          <button onClick={() => onNavigate(ScreenName.SETTINGS)} className="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#1C2533] border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-[#252f40] transition-colors text-left group active:scale-[0.98]">
            <div className="flex justify-between w-full">
              <div className="rounded-lg bg-gray-500/10 p-2 w-fit">
                <span className="material-symbols-outlined text-gray-500">settings</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-base font-semibold">Configurações</p>
              <p className="text-gray-500 dark:text-[#92a4c9] text-xs mt-1">Dados da conta</p>
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div 
          onClick={() => onNavigate(ScreenName.TRIP_DETAILS)}
          className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-4 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Comboio Oficial</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hoje às 20:00 • Servidor 1</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
        </div>
      </div>

      <BottomNav currentScreen={ScreenName.DASHBOARD} onNavigate={onNavigate} />
    </div>
  );
};
