
import React, { useState } from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const DriverID: React.FC<Props> = ({ onNavigate }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Habilitação Digital VTC',
                text: 'Confira minha habilitação virtual do sistema CTS PREMIUM.',
                url: window.location.href,
            });
        } catch (error) {
            console.log('Error sharing', error);
        }
    } else {
        alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col antialiased">
      <header className="sticky top-0 z-20 bg-background-dark/90 backdrop-blur-md border-b border-gray-800 safe-area-top">
        <div className="flex items-center justify-between p-4 h-16 max-w-lg mx-auto w-full">
          <button onClick={() => onNavigate(ScreenName.PROFILE)} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <h1 className="text-base font-bold text-center flex-1 text-white uppercase tracking-wide">
            Habilitação Digital
          </h1>
          <button onClick={handleShare} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 text-primary transition-colors">
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-4 pt-6 pb-24 max-w-lg mx-auto">
        <div className="w-full relative mb-8 group perspective-1000">
          <div className="relative w-full aspect-[1.586/1] bg-surface-card rounded-xl shadow-xl overflow-hidden border border-gray-700 ring-1 ring-white/5 transition-transform">
            <div className="absolute inset-0 pointer-events-none z-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(19, 91, 236, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(19, 91, 236, 0.1) 0%, transparent 50%), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 10px)' 
            }}></div>
            
            <div className="absolute top-0 w-full h-10 bg-primary flex items-center justify-between px-4 z-10 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-[18px]">local_shipping</span>
                <span className="text-[10px] font-bold text-white tracking-widest uppercase opacity-90">República Virtual</span>
              </div>
              <span className="text-[10px] font-bold text-white/80 uppercase">Válida em todo território simulado</span>
            </div>

            <div className="absolute inset-0 pt-12 px-4 pb-4 flex gap-4 z-10">
              <div className="w-[32%] flex flex-col gap-2 h-full">
                <div className="relative w-full aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden border border-gray-600 shadow-inner">
                  <img alt="Portrait" className="w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0gdu6f8Dx-7boDv3YEhhdpxA8Bg4r4JITo9bWUyo1Keivx-hcgdZYSXA5-uV0oeshqBQLS34K7Urq43FSqIfenCzvalRkmRjcgmIAbwV1mWtcsuJFaPaq65_cyw75bqVOu3IP_MQ7Bj9Q57XMigg4WXZnJmfgJzZ22jgvrrUsACSFCLYyxrLZihYKeEUuGDXLxn9ecp32KwOJSLwrfwdYKA-LQmKHS-RCwtK_lLpyPKKmpsdPaCGk67piz0HqDMl_JidB1Pn2Yg"/>
                  <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[10px] text-gray-400 uppercase font-medium tracking-wide leading-none mb-1">Nome do Condutor</h3>
                    <p className="text-sm sm:text-base font-bold text-white leading-tight break-words">JOÃO DA SILVA<br/>SANTOS JUNIOR</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-gray-800/50 rounded p-1 border border-gray-700">
                    <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <h3 className="text-[9px] text-gray-400 uppercase font-medium leading-none mb-0.5">Nº Registro</h3>
                    <p className="text-xs font-semibold text-slate-200 tabular-nums">001987654321</p>
                  </div>
                  <div>
                    <h3 className="text-[9px] text-gray-400 uppercase font-medium leading-none mb-0.5">Validade</h3>
                    <p className="text-xs font-semibold text-red-400 tabular-nums">15/07/2028</p>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-dashed border-gray-700 pt-2">
                  <div>
                    <h3 className="text-[9px] text-gray-400 uppercase font-medium leading-none mb-1">Empresa</h3>
                    <p className="text-xs font-semibold text-slate-300">VTC Logistics Global</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-[9px] text-gray-400 uppercase font-medium leading-none mb-0.5">Cat. Hab.</h3>
                    <p className="text-2xl font-black text-white leading-none tracking-tighter">AE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/40 blur-xl rounded-[50%] z-[-1]"></div>
        </div>

        <div className="w-full space-y-6">
          <div className="px-2">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">info</span>
              Detalhes do Condutor
            </h3>
            <div className="divide-y divide-gray-800 rounded-lg bg-surface-card border border-gray-800 overflow-hidden shadow-sm">
              <div className="flex justify-between gap-x-6 px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">event</span>
                  <p className="text-slate-400 text-sm font-normal">Primeira Habilitação</p>
                </div>
                <p className="text-slate-200 text-sm font-medium text-right tabular-nums">22/05/2019</p>
              </div>
              <div className="flex justify-between gap-x-6 px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">stars</span>
                  <p className="text-slate-400 text-sm font-normal">Pontuação</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="block size-2 rounded-full bg-green-500"></span>
                  <p className="text-slate-200 text-sm font-medium text-right">0 Pontos (Regular)</p>
                </div>
              </div>
              <div className="flex justify-between gap-x-6 px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-xl">workspace_premium</span>
                  <p className="text-slate-400 text-sm font-normal">Observações</p>
                </div>
                <p className="text-slate-200 text-sm font-medium text-right">EAR</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs text-slate-400 mb-2">Utilize o QR Code para validar este documento no sistema.</p>
            <div className="size-12 opacity-30 text-white">
              <span className="material-symbols-outlined text-5xl">qr_code</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-20">
        <div className="absolute bottom-full left-0 w-full h-8 bg-gradient-to-t from-background-dark to-transparent pointer-events-none"></div>
        <div className="bg-background-dark border-t border-gray-800 p-4 pb-8 flex justify-center w-full">
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className={`flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 font-bold leading-normal tracking-wide shadow-lg transition-all transform active:scale-[0.98] ${
                downloaded 
                ? 'bg-green-600 text-white shadow-green-500/20' 
                : 'bg-primary hover:bg-blue-600 active:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {downloading ? (
                 <span className="animate-spin material-symbols-outlined mr-3 text-2xl">progress_activity</span>
            ) : downloaded ? (
                <>
                  <span className="material-symbols-outlined mr-3 text-2xl">check</span>
                  <span className="truncate">Salvo na Galeria!</span>
                </>
            ) : (
                <>
                  <span className="material-symbols-outlined mr-3 text-2xl">download</span>
                  <span className="truncate">Salvar na Galeria</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
