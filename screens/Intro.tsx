
import React, { useState } from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Intro: React.FC<Props> = ({ onNavigate }) => {
  const [showRegisterSelect, setShowRegisterSelect] = useState(false);

  const handleRegisterClick = () => {
    setShowRegisterSelect(true);
  };

  const handleCategorySelect = (type: 'COMPANY' | 'GROUP' | 'AUTONOMOUS' | 'DRIVER') => {
    sessionStorage.setItem('registrationType', type);
    setShowRegisterSelect(false);
    if (type === 'DRIVER') {
        onNavigate(ScreenName.REGISTER_DRIVER);
    } else {
        onNavigate(ScreenName.REGISTER_COMPANY);
    }
  };

  // URL da logo oficial fornecida pelo usuário
  const OFFICIAL_LOGO = "https://i.postimg.cc/GmPhKZLG/Whats-App-Image-2025-12-22-at-10-32-42.jpg";

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-background-dark font-display">
      <div className="absolute top-0 left-0 w-full h-[60%] z-0">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtndFHcVbqiF2AvCeL4RCdU9fR5dutWvkh1ZRU1hxjeOA0LI8sD7sFsAiIFKIPA5BAwlPJA6feJfaMAi9YaMEK_c9wmYkeg5g_cowT_j90bzigjitJyXDoLqjtAD8XZK50heZyPQmWNrpDr1BAyBYucfiLkE1BcrVmTmf0QfWRyBorLw0PXTnAuiosHrq9Fyz9q4pDMrf2idnqr4jWrWKkfURETo3QCuaMN3_d9SMLZHouDO3v42KJN70bUNXUrNRmCnnjWdLqQ10')" }}
        >
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#101622]/0 via-[#101622]/60 to-[#101622]"></div>
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full px-6 pt-12 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full overflow-hidden shadow-2xl shadow-black/50 border border-white/20 bg-white/5 backdrop-blur-sm p-0.5">
            <img src={OFFICIAL_LOGO} alt="Legalizadora CTS" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white font-black text-xl leading-none tracking-tight">CTSPREMIUM</h2>
            <p className="text-blue-400 text-[10px] font-black tracking-[0.15em] uppercase mt-1">Global Systems</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-dark/80 backdrop-blur-md border border-white/5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-gray-300">Online</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-end w-full px-6 pb-10 pt-20 grow bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-sm">
            Sua Transportadora Virtual, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Nível Global.</span>
          </h1>
          <p className="text-gray-400 text-base font-normal leading-relaxed max-w-sm">
            Gerencie motoristas, frotas e finanças em tempo real. Conecte-se ao ecossistema global de simuladores.
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 max-w-md mx-auto">
          <button 
            onClick={() => onNavigate(ScreenName.LOGIN)}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_-5px_rgba(19,91,236,0.5)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="material-symbols-outlined mr-2 text-white">login</span>
            <span className="relative text-white text-lg font-bold tracking-wide">Acessar Sistema</span>
          </button>
          
          <button 
            onClick={handleRegisterClick}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-surface-dark/50 hover:bg-surface-dark border border-white/10 active:scale-[0.98] transition-all duration-200 backdrop-blur-sm text-white text-lg font-semibold tracking-wide"
          >
            Criar Nova Conta
          </button>
        </div>

        <div className="mt-8 flex justify-center items-center gap-4 opacity-40">
          <p className="text-xs text-white font-medium">v2.5.0</p>
          <div className="h-1 w-1 rounded-full bg-white"></div>
          <p className="text-xs text-white font-medium">iOS Release</p>
        </div>
      </div>

      {showRegisterSelect && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface-card rounded-2xl border border-gray-700 p-6 shadow-2xl slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Criar Conta</h3>
                    <p className="text-xs text-gray-400">Selecione sua categoria de atuação</p>
                </div>
                <button onClick={() => setShowRegisterSelect(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div className="space-y-3">
                <button 
                    onClick={() => handleCategorySelect('COMPANY')}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-700 bg-surface-dark/50 hover:border-primary hover:bg-primary/10 transition-all group"
                >
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">domain</span>
                    </div>
                    <div className="ml-4 text-left flex-1">
                        <p className="text-base font-bold text-white">Empresário</p>
                        <p className="text-xs text-gray-400">Dono de Transportadora Virtual</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-500 group-hover:text-primary">chevron_right</span>
                </button>

                <button 
                    onClick={() => handleCategorySelect('GROUP')}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-700 bg-surface-dark/50 hover:border-purple-500 hover:bg-purple-500/10 transition-all group"
                >
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">diversity_3</span>
                    </div>
                    <div className="ml-4 text-left flex-1">
                        <p className="text-base font-bold text-white">Líder de Grupo</p>
                        <p className="text-xs text-gray-400">Gestão de Grupos/Combos</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-500 group-hover:text-purple-500">chevron_right</span>
                </button>

                <button 
                    onClick={() => handleCategorySelect('AUTONOMOUS')}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-700 bg-surface-dark/50 hover:border-amber-500 hover:bg-amber-500/10 transition-all group"
                >
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">person_pin</span>
                    </div>
                    <div className="ml-4 text-left flex-1">
                        <p className="text-base font-bold text-white">Autônomo</p>
                        <p className="text-xs text-gray-400">Motorista Independente (Owner)</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-500 group-hover:text-amber-500">chevron_right</span>
                </button>

                <button 
                    onClick={() => handleCategorySelect('DRIVER')}
                    className="w-full flex items-center p-4 rounded-xl border border-gray-700 bg-surface-dark/50 hover:border-green-500 hover:bg-green-500/10 transition-all group"
                >
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">directions_car</span>
                    </div>
                    <div className="ml-4 text-left flex-1">
                        <p className="text-base font-bold text-white">Motorista</p>
                        <p className="text-xs text-gray-400">Funcionário de Empresa</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-500 group-hover:text-green-500">chevron_right</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
