
import React, { useState } from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Map: React.FC<Props> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'month' | 'today' | 'week'>('month');

  const handleZoom = (type: 'in' | 'out') => {
      // Mock zoom action
      alert(`Zoom ${type} acionado (simulação).`);
  };

  const handleLocation = () => {
      alert("Centralizando em sua localização atual...");
  };

  const handleNotifications = () => {
      alert("Sem novos alertas de tráfego na rota.");
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark font-display text-white">
      <div className="z-20 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-white/5 safe-area-top">
        <div onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-12 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Rotas & Frota</h2>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-green-400">shield_lock</span>
            <span className="text-[10px] uppercase tracking-wider text-green-400 font-medium">Dados Segregados</span>
          </div>
        </div>
        <div className="flex size-12 items-center justify-center">
          <button onClick={handleNotifications} className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors relative">
            <span className="material-symbols-outlined text-white">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#111722]"></span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 w-full bg-[#111722] overflow-hidden group/map">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoA1IUh74Klpn_ItyUumG2iOBZa7MoN18tan8bOtO01iLWvHTJ5Umhymy2jquWhngeQ4R8p0NssysHJPvg35bGX9P1e7iSUmKuuDZXWu8ZiSnmSH_RlDBWJ5DP1DzE2p4igzMlpWPa-z0H8suVW7si1a5Xcp-n4noUVfxOefd2yCMig6ZWHgvprN2vagmtl47TYyvLccmHITjwuNmjmunE3bXNVuW42diXY9kiWTGwNiolpnOf7h-755cHZ_urLThfysfTh2oDiAQ')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#101622] via-transparent to-[#101622]/80 pointer-events-none"></div>
        <svg className="absolute inset-0 size-full pointer-events-none z-10 opacity-80" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M 120 300 Q 150 400 280 450" fill="none" stroke="#135bec" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="3">
            <animate attributeName="stroke-dashoffset" dur="3s" from="100" repeatCount="indefinite" to="0"></animate>
          </path>
          <circle className="animate-pulse" cx="120" cy="300" fill="#135bec" r="4"></circle>
          <circle cx="280" cy="450" fill="#135bec" r="4"></circle>
          <path d="M 280 450 Q 250 550 180 600" fill="none" opacity="0.6" stroke="#135bec" strokeLinecap="round" strokeWidth="3"></path>
          <circle cx="180" cy="600" fill="#135bec" r="4"></circle>
        </svg>

        <div className="absolute right-4 top-4 flex flex-col gap-3 z-20">
          <div className="flex flex-col gap-0.5 bg-[#192233]/90 backdrop-blur rounded-lg shadow-lg border border-white/5">
            <button onClick={() => handleZoom('in')} className="flex size-10 items-center justify-center rounded-t-lg hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-white">add</span>
            </button>
            <div className="h-px w-full bg-white/10"></div>
            <button onClick={() => handleZoom('out')} className="flex size-10 items-center justify-center rounded-b-lg hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-white">remove</span>
            </button>
          </div>
          <button onClick={handleLocation} className="flex size-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30 text-white transition-transform active:scale-95">
            <span className="material-symbols-outlined">near_me</span>
          </button>
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-2 z-20 max-w-[200px]">
          <div className="bg-[#192233]/90 backdrop-blur border border-green-500/30 p-2 rounded-lg shadow-lg flex items-center gap-3">
            <div className="bg-green-500/20 p-1.5 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-green-400 text-lg">domain_verification</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Empresa ID</p>
              <p className="text-xs text-white font-bold">Logística Brasil #8392</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-30 bg-background-dark border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] pb-6 rounded-t-2xl -mt-6">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full opacity-50"></div>
        </div>
        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setFilter('month')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${
              filter === 'month' 
              ? 'bg-primary shadow-lg shadow-primary/20 text-white font-bold' 
              : 'bg-[#232f48] hover:bg-[#2c3b59] border border-white/5 text-gray-300 font-medium'
            }`}
          >
            <span className="text-xs leading-normal">Este Mês</span>
          </button>
          <button 
            onClick={() => setFilter('today')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${
              filter === 'today' 
              ? 'bg-primary shadow-lg shadow-primary/20 text-white font-bold' 
              : 'bg-[#232f48] hover:bg-[#2c3b59] border border-white/5 text-gray-300 font-medium'
            }`}
          >
            <span className="text-xs leading-normal">Hoje</span>
          </button>
          <button 
            onClick={() => setFilter('week')}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-all active:scale-95 ${
              filter === 'week' 
              ? 'bg-primary shadow-lg shadow-primary/20 text-white font-bold' 
              : 'bg-[#232f48] hover:bg-[#2c3b59] border border-white/5 text-gray-300 font-medium'
            }`}
          >
            <span className="text-xs leading-normal">Semana</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 py-2">
          <div className="flex flex-col gap-1 rounded-xl bg-[#1a2332] p-3 items-center text-center border border-white/5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#92a4c9] mb-1">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <p className="text-[10px] uppercase font-bold tracking-wide">Viagens</p>
            </div>
            <p className="text-white text-xl font-bold leading-tight">
              {filter === 'month' ? '142' : filter === 'week' ? '38' : '5'}
            </p>
            <p className="text-xs text-green-400 font-medium">+12%</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[#1a2332] p-3 items-center text-center border border-white/5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1.5 text-[#92a4c9] mb-1">
              <span className="material-symbols-outlined text-sm">route</span>
              <p className="text-[10px] uppercase font-bold tracking-wide">Km Total</p>
            </div>
            <p className="text-white text-xl font-bold leading-tight">
              {filter === 'month' ? '45k' : filter === 'week' ? '12k' : '2.1k'}
            </p>
            <p className="text-xs text-gray-500 font-medium">acumulado</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[#1a2332] p-3 items-center text-center border border-white/5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#92a4c9] mb-1">
              <span className="material-symbols-outlined text-sm">payments</span>
              <p className="text-[10px] uppercase font-bold tracking-wide">Faturamento</p>
            </div>
            <p className="text-white text-xl font-bold leading-tight">
              {filter === 'month' ? '120k' : filter === 'week' ? '35k' : '4.2k'}
            </p>
            <p className="text-xs text-green-400 font-medium">Est.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
