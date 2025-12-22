
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Login: React.FC<Props> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Carregar os dados mais recentes do banco de dados local
    // Se o usuário editou no Registro, aparecerá aqui. Se não, aparece o padrão.
    const data = StorageService.getData();
    setEmail(data.ownerEmail);
    setPassword(data.ownerPass);
  }, []);

  const handleForgotPassword = () => {
    alert("Um link de redefinição de senha foi enviado para o seu e-mail.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="relative w-full h-[280px] shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPG0bqZkuatNNbyhpaYjN4gzNFZz6J84RMAumSTk9tR24INN7bDPIYGEZTTRGlHlAwEmYCqT-s1EPP0SmkJ5nqVPShxJjrFDdWd0FLvUxGqqo4mLBQFsbqvCFqbogLAPS7sDERtybxNqTrHIOON8CpcZmk6-uKzzSppgysw06LdVoiLdWKI4QSy9ASVd6pqtoownjRPzbc60xgu7ni_GoPwLUiJtqfGW-A4Kb5m4MnVBGephS3WOxq3ElNMCjjRF7wewEZ9AWizKA')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-background-dark"></div>
          <div className="absolute inset-0 bg-background-dark/60"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 px-4">
          <div className="bg-surface-dark border border-border-dark p-3 rounded-2xl shadow-xl shadow-primary/20 mb-4 backdrop-blur-sm bg-opacity-80">
            <span className="material-symbols-outlined text-primary text-4xl">local_shipping</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">VTC Manager</h1>
          <p className="text-gray-200 text-sm font-medium mt-1 drop-shadow-sm opacity-90">Gestão Profissional de Frotas</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 pb-8 -mt-2 relative z-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold leading-tight mb-2">Bem-vindo, Fundador</h2>
          <p className="text-gray-400 text-sm">Suas credenciais administrativas já estão configuradas.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onNavigate(ScreenName.DASHBOARD); }}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">E-mail</label>
            <div className="relative flex items-center">
              <input 
                className="w-full h-14 pl-4 pr-12 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="usuario@exemplo.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-4 text-[#92a4c9] pointer-events-none flex items-center">
                <span className="material-symbols-outlined">mail</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <div className="relative flex items-center">
              <input 
                className="w-full h-14 pl-4 pr-12 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-4 text-[#92a4c9] hover:text-white transition-colors flex items-center focus:outline-none">
                <span className="material-symbols-outlined">visibility_off</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" defaultChecked className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-border-dark bg-surface-dark checked:border-primary checked:bg-primary transition-all" />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </span>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Lembrar-me sempre</span>
            </label>
            <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm font-medium text-primary hover:text-blue-400 transition-colors"
            >
                Esqueci a senha
            </button>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <span>Acessar como ADM</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-dark text-center">
          <p className="text-sm text-gray-400">
            Deseja alterar os dados? 
            <button onClick={() => onNavigate(ScreenName.REGISTER_COMPANY)} className="text-primary font-bold hover:underline ml-1">Editar Empresa</button>
          </p>
        </div>
      </div>
    </div>
  );
};
