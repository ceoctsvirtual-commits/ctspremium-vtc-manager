
import React, { useState } from 'react';
import { ScreenName, PLATFORMS_LIST, SEGMENTS_LIST } from '../types';
import { BottomNav } from '../components/BottomNav';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Rankings: React.FC<Props> = ({ onNavigate }) => {
  const [platform, setPlatform] = useState<string>('ETS2');
  const [segment, setSegment] = useState<string>('Truck');
  const [viewType, setViewType] = useState<'DRIVERS' | 'COMPANIES' | 'GROUPS' | 'AUTONOMOUS'>('DRIVERS');

  return (
    <div className="bg-background-dark font-display text-white min-h-screen relative pb-24">
      <header className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-gray-800 safe-area-top">
        <div className="flex items-center px-4 py-3 justify-between">
          <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Rankings</h2>
          <button className="text-primary font-bold text-sm tracking-[0.015em] shrink-0 hover:text-primary/80 transition-colors">
            Ajuda
          </button>
        </div>
        
        {/* Toggle View Type - Scrollable for more options */}
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex bg-surface-dark rounded-lg p-1 border border-border-dark w-max sm:w-full">
                <button 
                    onClick={() => setViewType('DRIVERS')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${viewType === 'DRIVERS' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
                >
                    Motoristas
                </button>
                <button 
                    onClick={() => setViewType('COMPANIES')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${viewType === 'COMPANIES' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
                >
                    Empresas
                </button>
                 <button 
                    onClick={() => setViewType('GROUPS')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${viewType === 'GROUPS' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
                >
                    Grupos
                </button>
                 <button 
                    onClick={() => setViewType('AUTONOMOUS')}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${viewType === 'AUTONOMOUS' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
                >
                    Autônomos
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-2 flex flex-col gap-2">
             <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {PLATFORMS_LIST.map(p => (
                    <button 
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${platform === p ? 'bg-[#1f293a] text-blue-400 border-blue-400' : 'bg-transparent text-gray-400 border-gray-700'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>
             <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {SEGMENTS_LIST.map(s => (
                    <button 
                        key={s}
                        onClick={() => setSegment(s)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap ${segment === s ? 'bg-surface-dark text-white border-gray-500' : 'bg-transparent text-gray-500 border-transparent'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6">
        <div className="flex items-end justify-center mb-8 gap-3 sm:gap-6">
          {/* Rank 2 */}
          <div className="flex flex-col items-center gap-2 order-1 w-1/3">
            <div className="relative">
              <div className="size-16 sm:size-20 rounded-full border-2 border-slate-600 p-1 bg-surface-card shadow-lg">
                <div className="w-full h-full rounded-full bg-center bg-cover" style={{ backgroundImage: viewType === 'COMPANIES' ? "url('https://placehold.co/100x100/333/FFF?text=VTC2')" : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAztX2VRqhj5XtmDOp85q7il7RHTAh17z0HsoCrDs6hGuz7I8cKnPVTtWZBlmntQ1xBRWXhl6jlFjl-irez5RjNwqqy_gwmViyfAlMlqAwobaNPEC_ipXjm57EYElzkvPM2VBRvutMWcskAihrWRFmzrMIlVQjKiNHuecw6tfCUwtjrPrxRsyFjkzbgFrUxwBkdK6zDPsAZsGNB-dK67uS5DLpezBXSOWLfKZ0QRWjmZrtMI2NHSVBsufBOkaaUsR8kVimlTNOCu4g')" }}></div>
              </div>
              <div className="absolute -bottom-2 inset-x-0 mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate-600 text-slate-900 font-bold text-xs shadow-md">2</div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold leading-tight truncate w-24 mx-auto">{viewType === 'COMPANIES' ? 'Rodovia Sul' : 'Maria S.'}</p>
              <p className="text-[10px] text-primary font-bold">14.2M km</p>
            </div>
          </div>
          {/* Rank 1 */}
          <div className="flex flex-col items-center gap-2 order-2 w-1/3 -mt-6">
            <div className="relative">
              <div className="absolute -top-6 inset-x-0 mx-auto text-yellow-500 animate-bounce">
                <span className="material-symbols-outlined text-[28px] drop-shadow-md">crown</span>
              </div>
              <div className="size-20 sm:size-24 rounded-full border-4 border-yellow-500 p-1 bg-surface-card shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <div className="w-full h-full rounded-full bg-center bg-cover" style={{ backgroundImage: viewType === 'COMPANIES' ? "url('https://placehold.co/100x100/333/FFF?text=VTC1')" : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5FfikLgSm1hf-uV_KZAr2KxpmFFwnVwJ-C84IXGMWAsGlt7fPOu-xbH8lrUlgiVk3azvGyW8suREkn_qvBquCe5ElBS6jgzWwnpgVsCMKS1ff-0A86HW7OPwfzZmNcr_ngaoevBD1Ddd5hjbQ6w1ok8-_Jr2_TVvYsPafAmgkaJUzggMj0XkdkLdQRZIXFxXkJTf_RK5O8TiPuYYNkUS3pvPDc9phcn6lPWvzs0gYfLVvECDJ95m0m2udWSdvyRLufVgiwlvK_NI')" }}></div>
              </div>
              <div className="absolute -bottom-3 inset-x-0 mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500 text-black font-extrabold text-sm shadow-md border-2 border-background-dark">1</div>
            </div>
            <div className="text-center mt-1">
              <p className="text-base font-bold leading-tight truncate w-28 mx-auto">{viewType === 'COMPANIES' ? 'TransGlobal' : 'João Silva'}</p>
              {viewType === 'DRIVERS' && <p className="text-xs text-slate-400 truncate w-24 mx-auto">TransGlobal</p>}
              <p className="text-xs text-primary font-bold mt-0.5">15.4M km</p>
            </div>
          </div>
          {/* Rank 3 */}
          <div className="flex flex-col items-center gap-2 order-3 w-1/3">
            <div className="relative">
              <div className="size-16 sm:size-20 rounded-full border-2 border-orange-900 p-1 bg-surface-card shadow-lg">
                <div className="w-full h-full rounded-full bg-center bg-cover" style={{ backgroundImage: viewType === 'COMPANIES' ? "url('https://placehold.co/100x100/333/FFF?text=VTC3')" : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAH0PwvI4_Wnw7dS70uHYYnITt_Kqbi4PfsquXTVFyn-GQuPyWztphg1aP2kHaa85WnJIXhirG6QdM7vhkGfZgle_tp0_T_aT4zJx4PjBcfEWFbKu6JurhZQPNTsou0lVQvJApMD1aP-e0tMdrzc-Zs37d0lfLFPefV8cBdFZZICSO8Q7H7vFqguYM8YkT7nFtj-FFJnEF0T9ARm50VDpDGs2EwOLxcjk-ESqBim7Z0GgYdTynj6pLq71cQoNpCpQ3_JgUhwB5qUdg')" }}></div>
              </div>
              <div className="absolute -bottom-2 inset-x-0 mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-orange-900 text-white font-bold text-xs shadow-md">3</div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold leading-tight truncate w-24 mx-auto">{viewType === 'COMPANIES' ? 'Logística BR' : 'Pedro H.'}</p>
              <p className="text-xs text-primary font-bold">12.9M km</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classificação</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Distância</span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-surface-card rounded-xl p-3 shadow-sm border border-slate-800">
            <div className="flex shrink-0 w-6 justify-center">
              <span className="text-slate-400 font-bold text-sm">4</span>
            </div>
            <div className="relative shrink-0">
              <div className="size-10 rounded-full bg-slate-700 bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ3icJegJ7w6g38oUAvGbKQBV20M9trjIZIgLzaTzgNbSnjsuTXwfa0bvdrdpz9996bBf47csiKgT8DAFCto5-MyMHGWVBo63hVSieqSgFKiB6Beb1BYmOXbuThZFPEY4VEY6BDpuowu1AkP-Kbl2HzEbN0TlRrsbG6Xnb5wHRRtPnkKzUeJeLo5LdDQmaItpav_4hDOaWFYO0IygFVE8Vi9tamOhqa9VySwy0AUxbwwA7RDGGzflSxABbg6A9fn6_gXCm832WDZI')" }}></div>
              <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-[2px] border border-surface-card">
                 {/* Icon based on platform */}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{viewType === 'COMPANIES' ? 'Expresso Oriente' : 'Lucas Ferreira'}</p>
              <p className="text-slate-400 text-xs truncate">{viewType === 'COMPANIES' ? 'Grupo Oriente' : 'Logística Express'}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-primary font-bold text-sm">11.8M km</p>
            </div>
          </div>
        </div>
      </main>

      {/* User Rank (Only show if Driver View) */}
      {viewType === 'DRIVERS' && (
      <div className="fixed bottom-20 left-0 w-full z-40 p-4">
        <div className="relative bg-[#1a2333] border-t-2 border-primary rounded-xl p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex items-center gap-3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
          <div className="flex shrink-0 w-6 justify-center relative z-10">
            <span className="text-white font-bold text-sm">42</span>
          </div>
          <div className="relative shrink-0 z-10">
            <div className="size-10 rounded-full border border-primary/50 bg-slate-700 bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA3Wpg9EA6txww1Y93hjjy9ULHgqGgjTqiyNa3wJAcn2ZQ2xLW58BpvOLkDvw-hRwn2ljqOrag5pdiraw4q11_C4bgJ_FVFFoNjUudu_H3VmPsad2N9A5xXSJkvssvGmEedkrr0iHO64aJNYubvn7NtGHgO41_bBBlqYB_vGFxq3SuWRzS81rLHzxENBX_9sR9bmcxuDBY1gA2oJFcaysg7yOhk2CpHo3uX1lur4NXEPRO5ZRnz3I-v6dzQJtxe5SmWVuRJKGTG7cg')" }}></div>
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-white text-sm font-bold truncate">Você</p>
            <p className="text-slate-400 text-xs truncate">Rumo ao Topo!</p>
          </div>
          <div className="shrink-0 text-right relative z-10">
            <p className="text-primary font-bold text-sm">3.4M km</p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
              <span>12</span>
            </div>
          </div>
        </div>
      </div>
      )}

      <BottomNav currentScreen={ScreenName.RANKINGS} onNavigate={onNavigate} />
    </div>
  );
};
