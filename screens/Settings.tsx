
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Settings: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());

  useEffect(() => {
    setData(StorageService.getData());
  }, []);

  const updateSetting = (key: keyof AppData['settings'], value: any) => {
    const updatedSettings = { ...data.settings, [key]: value };
    const newData = StorageService.saveData({ settings: updatedSettings });
    if (newData) setData(newData);
    
    // Apply visual side-effects immediately
    if (key === 'theme') {
        if (value === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }
  };

  const toggleNotifications = () => {
    updateSetting('notifications', !data.settings.notifications);
  };

  const toggleTheme = () => {
    const newTheme = data.settings.theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', newTheme);
  };

  const cycleLanguage = () => {
    const langs: ('pt-BR' | 'en-US' | 'es-ES')[] = ['pt-BR', 'en-US', 'es-ES'];
    const currentIndex = langs.indexOf(data.settings.language);
    const nextIndex = (currentIndex + 1) % langs.length;
    updateSetting('language', langs[nextIndex]);
  };

  const getLanguageLabel = (code: string) => {
      switch(code) {
          case 'pt-BR': return 'Português (BR)';
          case 'en-US': return 'English (US)';
          case 'es-ES': return 'Español';
          default: return code;
      }
  };

  const handleAbout = () => {
    alert("CTSPREMIUM VTC Manager\n\nVersão: 2.5.0\nDescrição: O CTSPREMIUM VTC Manager é a solução definitiva para gestão de frotas virtuais. Desenvolvido para oferecer controle total sobre motoristas, finanças e logística em plataformas como ETS2 e ATS.\n\n© 2023 CTS Virtual Systems.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-gray-600 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Configurações</h2>
      </div>

      <div className="flex-1 w-full px-4 py-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Geral</h3>
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-6 shadow-sm">
            <button 
                onClick={() => onNavigate(ScreenName.REGISTER_COMPANY)} 
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-200 dark:border-gray-800"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">business</span>
                    <span className="text-sm font-medium">Dados da Empresa</span>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
            
            <button 
                onClick={toggleNotifications} 
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-200 dark:border-gray-800"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">notifications</span>
                    <span className="text-sm font-medium">Notificações</span>
                </div>
                <div className="flex items-center">
                    <span className={`text-xs mr-2 font-bold ${data.settings.notifications ? 'text-green-500' : 'text-red-500'}`}>
                        {data.settings.notifications ? 'Ligado' : 'Desligado'}
                    </span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${data.settings.notifications ? 'bg-green-500/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${data.settings.notifications ? 'left-4.5 bg-green-500' : 'left-0.5'}`}></div>
                    </div>
                </div>
            </button>
            
             <button 
                onClick={toggleTheme}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">palette</span>
                    <span className="text-sm font-medium">Aparência</span>
                </div>
                <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2 capitalize">
                        {data.settings.theme === 'dark' ? 'Escuro' : 'Claro'}
                    </span>
                    <span className="material-symbols-outlined text-gray-500">
                        {data.settings.theme === 'dark' ? 'dark_mode' : 'light_mode'}
                    </span>
                </div>
            </button>
        </div>

        <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">Sistema</h3>
         <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <button 
                onClick={cycleLanguage}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-200 dark:border-gray-800"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">language</span>
                    <span className="text-sm font-medium">Idioma</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{getLanguageLabel(data.settings.language)}</span>
                    <span className="material-symbols-outlined text-gray-500">sync_alt</span>
                </div>
            </button>
            
            <button 
                onClick={handleAbout}
                className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400">info</span>
                    <span className="text-sm font-medium">Sobre o App</span>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
        </div>

        <div className="mt-8 text-center opacity-50">
            <p className="text-xs text-gray-500">CTSPREMIUM VTC Manager</p>
            <p className="text-[10px] text-gray-400">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};
