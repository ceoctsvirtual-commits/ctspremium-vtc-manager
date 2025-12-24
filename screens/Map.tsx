
import React, { useState, useEffect } from 'react';
import { ScreenName, Trip } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Map: React.FC<Props> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'month' | 'today' | 'week'>('month');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeStats, setActiveStats] = useState({ count: 0, km: 0, revenue: 0 });

  useEffect(() => {
    const data = StorageService.getData();
    const now = new Date();
    
    const filtered = data.dbTrips.filter(t => {
      const tDate = new Date(t.date);
      if (filter === 'today') return tDate.toDateString() === now.toDateString();
      if (filter === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return tDate >= weekAgo;
      }
      return tDate.getMonth() === now.getMonth();
    });

    setTrips(filtered);

    const km = filtered.reduce((acc, t) => acc + Number(t.distance), 0);
    const rev = filtered.reduce((acc, t) => acc + (parseFloat(t.value.replace(/\./g, '').replace(',', '.')) || 0), 0);
    
    setActiveStats({ count: filtered.length, km, revenue: rev });
  }, [filter]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark font-display text-white">
      <div className="z-20 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-white/5 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-12 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Malha Logística</h2>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px] text-primary">sensors</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Monitoramento Real</span>
          </div>
        </div>
        <div className="flex size-12 items-center justify-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
            <span className="material-symbols-outlined text-white">satellite_alt</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full bg-[#111722] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale contrast-125" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoA1IUh74Klpn_ItyUumG2iOBZa7MoN18tan8bOtO01iLWvHTJ5Umhymy2jquWhngeQ4R8p0NssysHJPvg35bGX9P1e7iSUmKuuDZXWu8ZiSnmSH_RlDBWJ5DP1DzE2p4igzMlpWPa-z0H8suVW7si1a5Xcp-n4noUVfxOefd2yCMig6ZWHgvprN2vagmtl47TYyvLccmHITjwuNmjmunE3bXNVuW42diXY9kiWTGwNiolpnOf7h-755cHZ_urLThfysfTh2oDiAQ')" }}
        ></div>
        
        {/* Dynamic Trip Routes Visualization */}
        <div className="absolute inset-0 z-10 p-6 pointer-events-none">
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 overflow-hidden h-full">
                    {trips.slice(0, 15).map((t, i) => (
                        <div key={t.id} className="animate-in fade-in slide-in-from-left duration-500 flex items-center gap-3 bg-primary/5 border-l-2 border-primary p-3 rounded-r-xl" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex flex-col">
                                <span className="text-[8px] text-primary font-black uppercase">{t.driverName}</span>
                                <p className="text-[10px] font-bold text-white truncate">{t.origin} ➝ {t.destination}</p>
                            </div>
                            <span className="ml-auto text-[10px] font-black text-gray-600 uppercase">{t.distance} KM</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <span className="material-symbols-outlined text-6xl mb-4">route</span>
                    <p className="text-sm font-bold uppercase tracking-widest">Aguardando Lançamentos</p>
                </div>
            )}
        </div>

        <div className="absolute right-4 top-4 flex flex-col gap-3 z-20">
          <button className="flex size-10 items-center justify-center rounded-lg bg-surface-dark shadow-lg border border-white/5 text-white">
            <span className="material-symbols-outlined">layers</span>
          </button>
          <button className="flex size-10 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30 text-white">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      <div className="relative z-30 bg-background-dark border-t border-white/5 shadow-2xl pb-6 rounded-t-3xl -mt-6">
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
        </div>
        <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
          {['month', 'week', 'today'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-all ${filter === f ? 'bg-primary text-white font-black' : 'bg-surface-dark text-gray-500 border border-white/5'}`}
            >
                <span className="text-[10px] uppercase tracking-widest leading-none">{f === 'month' ? 'Mensal' : f === 'week' ? 'Semanal' : 'Diário'}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 py-2">
          <div className="flex flex-col gap-1 rounded-2xl bg-surface-dark p-4 items-center text-center border border-white/5 shadow-sm">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Viagens</p>
            <p className="text-white text-xl font-black">{activeStats.count}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-surface-dark p-4 items-center text-center border border-white/5 shadow-sm">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Km Total</p>
            <p className="text-white text-xl font-black">{activeStats.km.toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-surface-dark p-4 items-center text-center border border-white/5 shadow-sm">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Faturamento</p>
            <p className="text-emerald-500 text-lg font-black">R$ {activeStats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
