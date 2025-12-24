
import React, { useState, useEffect } from 'react';
import { ScreenName, VehicleType } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const DriverID: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    setData(StorageService.getData());
  }, []);

  const getCategory = (v: VehicleType): string => {
      switch(v) {
          case 'CAR': return 'B';
          case 'LIGHT_TRUCK': return 'C';
          case 'BUS': return 'D';
          case 'TRUCK': return 'D';
          case 'BITRUCK': return 'D';
          case 'RODOTREM': return 'E';
          default: return 'AE';
      }
  };

  const getVehicleLabel = (v: VehicleType): string => {
      switch(v) {
          case 'CAR': return 'Automóvel';
          case 'LIGHT_TRUCK': return 'VUC';
          case 'BUS': return 'Ônibus';
          case 'TRUCK': return 'Truck';
          case 'BITRUCK': return 'Bi-Truck';
          case 'RODOTREM': return 'Rodotrem';
          default: return 'Especial';
      }
  };

  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col antialiased">
      <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-white/5 safe-area-top">
        <div className="flex items-center justify-between p-4 h-16 max-w-lg mx-auto w-full">
          <button onClick={() => onNavigate(ScreenName.PROFILE)} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <h1 className="text-sm font-black text-center flex-1 text-white uppercase tracking-widest">
            Habilitação Digital
          </h1>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 pt-4 pb-24 max-w-lg mx-auto overflow-y-auto">
        <div className="w-full relative mb-10 group px-2">
          {/* HOLOGRAM CARD - Aspect ratio 1.85:1 para um retângulo mais profissional */}
          <div className="relative w-full aspect-[1.85/1] bg-[#0f172a] rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 transition-transform ring-1 ring-white/5">
            {/* Holographic Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 8px)' 
            }}></div>
            
            <div className="absolute top-0 w-full h-8 bg-primary flex items-center justify-between px-6 z-10 shadow-lg border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-[14px] font-black">verified</span>
                <span className="text-[7px] font-black text-white tracking-[0.3em] uppercase">REPÚBLICA VIRTUAL CTS</span>
              </div>
              <div className="text-[6px] font-black text-white/50 uppercase tracking-[0.4em]">ID: {data.companyTag || 'CTS'}-{Math.floor(Math.random()*900)}</div>
            </div>

            <div className="absolute inset-0 pt-10 px-6 pb-4 flex gap-6 z-10">
              <div className="w-[32%] flex flex-col justify-center">
                {/* FOTO PERFEITAMENTE QUADRADA 1:1 */}
                <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/10">
                  <img 
                    alt="Driver Portrait" 
                    className="w-full h-full object-cover grayscale contrast-125 brightness-110" 
                    src={data.ownerPhoto || "https://i.postimg.cc/GmPhKZLG/Whats-App-Image-2025-12-22-at-10-32-42.jpg"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-[6px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">NOME DO CONDUTOR</h3>
                    <p className="text-[11px] font-black text-white leading-tight uppercase truncate drop-shadow-md">
                      {data.ownerName || "USUÁRIO CTS"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl drop-shadow-[0_0_8px_rgba(19,91,236,0.3)]">qr_code_2</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-[5px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">REGISTRO GERAL</h3>
                    <p className="text-[9px] font-bold text-slate-300 tabular-nums">
                      {data.companyTag || 'CTS'} 2025 {Math.floor(1000 + Math.random() * 9000)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[5px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">CAT.</h3>
                    <p className="text-lg font-black text-primary leading-none tracking-tighter">
                      {getCategory(data.vehicleType)}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-2">
                  <div className="flex-1">
                    <h3 className="text-[5px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">VTC ATIVA</h3>
                    <p className="text-[8px] font-black text-white uppercase truncate">
                        {data.companyName}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-[5px] text-gray-500 uppercase font-black tracking-[0.2em] mb-0.5">VALIDADE</h3>
                    <p className="text-[8px] font-black text-red-500 tabular-nums">22/12/2030</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 px-2">
          <div>
            <h3 className="text-[10px] font-black text-gray-600 mb-3 flex items-center gap-2 uppercase tracking-[0.4em]">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              Status Operacional
            </h3>
            <div className="divide-y divide-white/5 rounded-[2.5rem] bg-surface-card border border-white/5 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-8 py-5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Login Administrativo</p>
                <p className="text-slate-300 text-[10px] font-medium lowercase">{data.ownerEmail}</p>
              </div>
              <div className="flex justify-between items-center px-8 py-5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Distância Total</p>
                <p className="text-primary text-sm font-black">
                    {data.dbDrivers.find(d => d.email === data.ownerEmail)?.distance.toLocaleString() || 0} KM
                </p>
              </div>
              <div className="flex justify-between items-center px-8 py-5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Licença</p>
                <div className="flex items-center gap-2">
                   <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Regularizado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center bg-primary/5 rounded-[2.5rem] border border-primary/10">
            <p className="text-[9px] text-gray-600 mb-5 font-black uppercase tracking-[0.5em]">CERTIFICAÇÃO CTS v2.5</p>
            <div className="size-20 p-2.5 bg-white rounded-2xl shadow-xl">
              <span className="material-symbols-outlined text-6xl text-black">qr_code_2</span>
            </div>
            <p className="mt-6 text-[8px] text-gray-700 italic px-10 leading-relaxed text-center">Documento digital verificado para uso em simuladores e comboios oficiais.</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-20 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 p-4 pb-8 flex justify-center shadow-2xl">
          <button 
            onClick={() => { setDownloading(true); setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1500); }}
            className={`w-full max-w-md h-16 rounded-2xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${downloaded ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-primary text-white shadow-xl shadow-primary/30'}`}
          >
            {downloading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : (
                <>
                  <span className="material-symbols-outlined text-xl">{downloaded ? 'check_circle' : 'download'}</span>
                  {downloaded ? 'Identidade Exportada' : 'Salvar Documento'}
                </>
            )}
          </button>
      </div>
    </div>
  );
};
