
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Login: React.FC<Props> = ({ onNavigate }) => {
  // Ler do LocalStorage ANTES da primeira renderização
  const saved = StorageService.getRememberedCredentials();
  
  const [email, setEmail] = useState(saved.email || "");
  const [password, setPassword] = useState(saved.pass || "");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [autoSyncing, setAutoSyncing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tenta o login automático se houver dados salvos ao montar a tela
    if (saved.email && saved.pass) {
        performLogin(saved.email, saved.pass, true);
    }
  }, []);

  const performLogin = async (targetEmail: string, targetPass: string, isAuto: boolean = false) => {
      if (isAuto) setAutoSyncing(true);
      else setLoading(true);
      
      setError("");
      
      try {
          const success = await StorageService.login(targetEmail, targetPass);
          if (success) {
              if (rememberMe) {
                  StorageService.saveRememberedCredentials(targetEmail, targetPass);
              }
              onNavigate(ScreenName.DASHBOARD);
          } else {
              if (!isAuto) setError("Acesso negado. Verifique se o e-mail e senha estão corretos.");
              else setAutoSyncing(false); 
          }
      } catch (err: any) {
          setError(`Falha de sincronização. Verifique sua conexão.`);
          setAutoSyncing(false);
      } finally {
          setLoading(false);
      }
  };

  const handleManualLogin = (e: React.FormEvent) => {
      e.preventDefault();
      performLogin(email, password);
  };

  if (autoSyncing) {
      return (
          <div className="flex flex-col h-screen items-center justify-center bg-background-dark p-6">
              <div className="relative mb-8">
                  <div className="size-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-4xl animate-pulse">cloud_sync</span>
                  </div>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Restaurando Sessão</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-center px-10">Conectando à Central CTS...</p>
              <button 
                  onClick={() => setAutoSyncing(false)} 
                  className="mt-12 text-xs font-bold text-gray-700 hover:text-white transition-colors uppercase tracking-widest border border-gray-800 px-8 py-3 rounded-2xl"
              >
                  Entrar Manualmente
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="relative w-full h-[320px] shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 grayscale contrast-125"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPG0bqZkuatNNbyhpaYjN4gzNFZz6J84RMAumSTk9tR24INN7bDPIYGEZTTRGlHlAwEmYCqT-s1EPP0SmkJ5nqVPShxJjrFDdWd0FLvUxGqqo4mLBQFsbqvCFqbogLAPS7sDERtybxNqTrHIOON8CpcZmk6-uKzzSppgysw06LdVoiLdWKI4QSy9ASVd6pqtoownjRPzbc60xgu7ni_GoPwLUiJtqfGW-A4Kb5m4MnVBGephS3WOxq3ElNMCjjRF7wewEZ9AWizKA')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-background-dark"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 px-4 text-center">
          <div className="bg-surface-dark border border-white/5 p-4 rounded-[2.5rem] shadow-2xl mb-5 ring-1 ring-white/10">
            <span className="material-symbols-outlined text-primary text-5xl">lock_open</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase drop-shadow-xl">Central CTS</h1>
          <p className="text-blue-400 text-[11px] font-black mt-1 uppercase tracking-[0.4em]">Infrastructure • Cloud Sync</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 pb-12 -mt-2 relative z-20">
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-5 rounded-3xl text-[10px] font-bold mb-6 flex items-center gap-4 animate-in slide-in-from-top-4">
                <span className="material-symbols-outlined text-xl">error_outline</span>
                <p className="flex-1">{error}</p>
            </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleManualLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">E-mail Administrativo</label>
            <div className="relative">
                <input 
                    className="w-full h-15 pl-14 rounded-2xl bg-surface-dark border border-white/5 text-white placeholder-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all font-bold shadow-inner"
                    placeholder="seu@email.com" 
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-5 top-4.5 text-gray-600">account_circle</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Senha de Acesso</label>
            <div className="relative">
                <input 
                    className="w-full h-15 pl-14 rounded-2xl bg-surface-dark border border-white/5 text-white placeholder-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all font-black shadow-inner"
                    placeholder="••••••••" 
                    type="password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-5 top-4.5 text-gray-600">key_visualizer</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2 py-1">
             <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${rememberMe ? 'bg-primary' : 'bg-gray-800'}`}
             >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${rememberMe ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                Manter meus dados salvos
             </span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 w-full h-16 bg-primary hover:bg-blue-600 disabled:bg-gray-900 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
          >
            {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : (
                <>
                    VALIDAR E ENTRAR
                    <span className="material-symbols-outlined">arrow_forward</span>
                </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col gap-6">
          <p className="text-xs text-gray-600 font-medium">Não possui cadastro? <button onClick={() => onNavigate(ScreenName.INTRO)} className="text-primary font-black uppercase tracking-tighter">Criar Nova VTC</button></p>
        </div>
      </div>
    </div>
  );
};
