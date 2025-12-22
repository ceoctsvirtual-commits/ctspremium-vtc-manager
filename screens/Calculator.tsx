
import React, { useState } from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Calculator: React.FC<Props> = ({ onNavigate }) => {
  const [split, setSplit] = useState(60);
  const freightValue = 10000;

  const myShare = (freightValue * split) / 100;
  const partnerShare = freightValue - myShare;

  const handleReset = () => {
      setSplit(60);
  };

  const handleSave = () => {
      alert("Cálculo salvo no histórico com sucesso!");
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-dark shadow-2xl overflow-hidden font-display text-white">
      <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-800">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors text-white group">
          <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-center flex-1">Calculadora B2B</h1>
        <button 
            onClick={handleReset}
            className="flex items-center justify-center px-2 py-1 text-sm font-semibold text-gray-400 hover:text-primary transition-colors"
        >
          Resetar
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <section className="p-5 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Dados do Contrato</h2>
            <div className="relative group">
              <label className="block text-xs font-medium text-gray-400 mb-2 ml-1">Valor Total do Frete</label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">attach_money</span>
                </div>
                <input className="block w-full rounded-xl border-gray-700 bg-surface-dark py-4 pl-12 pr-4 text-2xl font-bold text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm" value="10.000,00" readOnly />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-sm font-medium text-gray-400">USD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-medium text-gray-400 ml-1">Regra de Divisão</label>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{split}%</span>
                <span className="text-gray-400 text-xs">/</span>
                <span className="text-gray-400 font-medium">{100 - split}%</span>
              </div>
            </div>
            
            <div className="relative h-12 flex items-center select-none touch-none">
              <div className="absolute w-full h-3 bg-surface-dark border border-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-l-full" style={{ width: `${split}%` }}></div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={split} 
                onChange={(e) => setSplit(Number(e.target.value))}
                className="absolute w-full h-12 opacity-0 cursor-pointer z-20"
              />
              <div 
                className="absolute w-8 h-8 bg-white rounded-full shadow-lg border-2 border-primary cursor-grab flex items-center justify-center z-10 pointer-events-none"
                style={{ left: `calc(${split}% - 16px)` }}
              >
                <span className="material-symbols-outlined text-primary text-sm font-bold">drag_handle</span>
              </div>
              <div className="absolute top-5 w-full flex justify-between px-1 mt-1">
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Minha Empresa</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Parceiro</span>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gray-800"></div>

        <section className="p-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Detalhamento Financeiro</h2>
            <span className="material-symbols-outlined text-gray-400 text-lg">bar_chart</span>
          </div>
          
          <div className="w-full h-14 flex rounded-xl overflow-hidden ring-1 ring-gray-700 shadow-lg">
            <div className="bg-primary/20 flex flex-col items-center justify-center relative border-r border-primary/30 transition-all duration-300" style={{ width: `${split}%` }}>
              <span className="text-xs font-medium text-blue-300">Você recebe</span>
              <span className="text-lg font-bold text-blue-400">{split}%</span>
              <div className="absolute bottom-0 w-full h-1 bg-primary"></div>
            </div>
            <div className="bg-surface-dark flex flex-col items-center justify-center relative transition-all duration-300" style={{ width: `${100 - split}%` }}>
              <span className="text-xs font-medium text-gray-400">Repassar</span>
              <span className="text-lg font-bold text-gray-400">{100 - split}%</span>
              <div className="absolute bottom-0 w-full h-1 bg-slate-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-dark border border-primary/50 rounded-2xl p-4 flex flex-col gap-1 shadow-lg shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-4xl text-primary">account_balance_wallet</span>
              </div>
              <p className="text-xs font-medium text-gray-400">Receita Líquida</p>
              <p className="text-xl font-bold text-white tracking-tight">$ {myShare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-[10px] text-primary font-medium">Minha Parte</span>
              </div>
            </div>
            <div className="bg-surface-dark border border-gray-700 rounded-2xl p-4 flex flex-col gap-1 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-4xl text-slate-400">handshake</span>
              </div>
              <p className="text-xs font-medium text-gray-400">Valor do Repasse</p>
              <p className="text-xl font-bold text-slate-300 tracking-tight">$ {partnerShare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="flex h-2 w-2 rounded-full bg-slate-500"></span>
                <span className="text-[10px] text-slate-500 font-medium">Parceiro</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-5">
          <div className="bg-gradient-to-br from-surface-dark to-[#161e2e] border border-gray-700 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1">Sugestão de Fluxo</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Emita a nota fiscal no valor total de <strong className="text-white">$ 10.000,00</strong>. Após o recebimento, realize uma transferência de <strong className="text-white">$ {partnerShare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para a conta da empresa parceira.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="absolute bottom-0 left-0 w-full p-5 bg-background-dark/80 backdrop-blur-xl border-t border-gray-700 z-40">
        <button 
            onClick={handleSave}
            className="w-full h-14 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          Salvar Cálculo no Histórico
        </button>
      </div>
    </div>
  );
};
