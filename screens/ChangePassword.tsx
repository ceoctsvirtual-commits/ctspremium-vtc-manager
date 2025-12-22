import React from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const ChangePassword: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.PROFILE)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Alterar Senha</h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6">
        <form className="flex flex-col gap-5" onSubmit={(e) => { 
            e.preventDefault(); 
            alert('Senha alterada com sucesso!');
            onNavigate(ScreenName.PROFILE); 
        }}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Senha Atual</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

           <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Nova Senha</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

           <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Confirmar Nova Senha</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="mt-4 w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Salvar Nova Senha
          </button>
        </form>
      </div>
    </div>
  );
};