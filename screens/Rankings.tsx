
import React, { useState, useEffect } from 'react';
import { ScreenName, PLATFORMS_LIST, SEGMENTS_LIST, Driver, Company } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Rankings: React.FC<Props> = ({ onNavigate }) => {
  const [platform, setPlatform] = useState<string>('ETS2');
  const [segment, setSegment] = useState<string>('Truck');
  const [viewType, setViewType] = useState<'DRIVERS' | 'COMPANIES'>('DRIVERS');
  
  const [data, setData] = useState(StorageService.getData());
  const [topList, setTopList] = useState<any[]>([]);

  useEffect(() => {
    if (viewType === 'DRIVERS') {
        const sorted = [...data.dbDrivers].sort((a,b) => b.distance - a.distance);
        setTopList(sorted);
    } else {
        const companyKms: Record<string, number> = {};
        data.dbTrips.forEach(t => {
            const driver = data.dbDrivers.find(d => d.name === t.driverName);
            const cName = driver?.companyName || 'Independente';
            companyKms[cName] = (companyKms[cName] || 0) + Number(t.distance);
        });
        const sortedComp = Object.entries(companyKms).map(([name, km]) => ({ name, distance: km })).sort((a,b) => b.distance - a.distance);
        setTopList(sortedComp);
    }
  }, [viewType, data]);

  const top3 = topList.slice(0, 3);
  const others = topList.slice(3);

  return (
    <div className="bg-background-dark font-display text-white min-h-screen relative pb-24">
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 safe-area-top shadow-xl">
        <div className="flex items-center px-4 py-4 justify-between">
          <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 items-center justify-center rounded-full bg-white/5 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-black uppercase tracking-tight">Rankings Reais</h2>
          <div className="size-10"></div>
        </div>
        
        <div className="px-4 pb-4 overflow-x-auto no-scrollbar">
            <div className="flex bg-surface-dark rounded-xl p-1 border border-white/5 w-full">
                <button 
                    onClick={() => setViewType('DRIVERS')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewType === 'DRIVERS' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}
                >
                    Motoristas
                </button>
                <button 
                    onClick={() => setViewType('COMPANIES')}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewType === 'COMPANIES' ? 'bg-primary text-white shadow-lg' : 'text-gray-500'}`}
                >
                    VTCs
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-10">
        {topList.length > 0 ? (
            <>
                <div className="flex items-end justify-center mb-12 gap-4">
                  {/* Rank 2 */}
                  {top3[1] && (
                      <div className="flex flex-col items-center gap-3 order-1 w-1/3">
                        <div className="relative">
                          <div className="size-16 sm:size-20 rounded-full border-2 border-slate-500 p-1 bg-surface-card shadow-lg ring-2 ring-white/5">
                            <div className="w-full h-full rounded-full bg-center bg-cover bg-gray-800" style={{ backgroundImage: `url('${top3[1].avatar || ""}')` }}></div>
                          </div>
                          <div className="absolute -bottom-2 inset-x-0 mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-slate-900 font-black text-[10px] shadow-lg border-2 border-background-dark">2</div>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-white uppercase truncate w-24 mx-auto leading-tight">{top3[1].name}</p>
                          <p className="text-[11px] text-primary font-black mt-1">{top3[1].distance.toLocaleString()} KM</p>
                        </div>
                      </div>
                  )}

                  {/* Rank 1 */}
                  {top3[0] && (
                      <div className="flex flex-col items-center gap-3 order-2 w-1/3 -mt-8">
                        <div className="relative">
                          <div className="absolute -top-8 inset-x-0 mx-auto text-amber-500 animate-bounce">
                            <span className="material-symbols-outlined text-[32px] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] font-black">crown</span>
                          </div>
                          <div className="size-24 sm:size-28 rounded-full border-4 border-amber-500 p-1 bg-surface-card shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <div className="w-full h-full rounded-full bg-center bg-cover bg-gray-800" style={{ backgroundImage: `url('${top3[0].avatar || ""}')` }}></div>
                          </div>
                          <div className="absolute -bottom-4 inset-x-0 mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black font-black text-xs shadow-xl border-4 border-background-dark">1</div>
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-xs font-black text-white uppercase truncate w-28 mx-auto leading-tight">{top3[0].name}</p>
                          <p className="text-sm text-amber-500 font-black mt-1">{top3[0].distance.toLocaleString()} KM</p>
                        </div>
                      </div>
                  )}

                  {/* Rank 3 */}
                  {top3[2] && (
                      <div className="flex flex-col items-center gap-3 order-3 w-1/3">
                        <div className="relative">
                          <div className="size-16 sm:size-20 rounded-full border-2 border-amber-900 p-1 bg-surface-card shadow-lg ring-2 ring-white/5">
                            <div className="w-full h-full rounded-full bg-center bg-cover bg-gray-800" style={{ backgroundImage: `url('${top3[2].avatar || ""}')` }}></div>
                          </div>
                          <div className="absolute -bottom-2 inset-x-0 mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-amber-900 text-white font-black text-[10px] shadow-lg border-2 border-background-dark">3</div>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-white uppercase truncate w-24 mx-auto leading-tight">{top3[2].name}</p>
                          <p className="text-[11px] text-primary font-black mt-1">{top3[2].distance.toLocaleString()} KM</p>
                        </div>
                      </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4 px-2 opacity-50">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Posição Geral</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Distância</span>
                </div>

                <div className="flex flex-col gap-3">
                  {others.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-4 bg-surface-card rounded-2xl p-4 shadow-xl border border-white/5">
                        <div className="flex shrink-0 w-6 justify-center">
                          <span className="text-gray-500 font-black text-sm">{i + 4}</span>
                        </div>
                        <div className="size-11 rounded-full bg-gray-800 border border-white/10 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.avatar || ""}')` }}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-black uppercase truncate">{item.name}</p>
                          <p className="text-gray-500 text-[10px] font-bold uppercase truncate">{item.companyName || 'Independente'}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-primary font-black text-sm">{item.distance.toLocaleString()} KM</p>
                        </div>
                    </div>
                  ))}
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <span className="material-symbols-outlined text-7xl mb-4">leaderboard</span>
                <p className="text-sm font-black uppercase tracking-[0.3em]">Aguardando Dados</p>
            </div>
        )}
      </main>

      <BottomNav currentScreen={ScreenName.RANKINGS} onNavigate={onNavigate} />
    </div>
  );
};
