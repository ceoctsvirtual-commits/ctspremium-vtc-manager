
import React, { useState, useEffect } from 'react';
import { ScreenName } from './types.ts';
import { Intro } from './screens/Intro.tsx';
import { Login } from './screens/Login.tsx';
import { Dashboard } from './screens/Dashboard.tsx';
import { Profile } from './screens/Profile.tsx';
import { EditProfile } from './screens/EditProfile.tsx';
import { History } from './screens/History.tsx';
import { Rankings } from './screens/Rankings.tsx';
import { Map } from './screens/Map.tsx';
import { DriverID } from './screens/DriverID.tsx';
import { Calculator } from './screens/Calculator.tsx';
import { TripDetails } from './screens/TripDetails.tsx';
import { RegisterCompany } from './screens/RegisterCompany.tsx';
import { RegisterDriver } from './screens/RegisterDriver.tsx';
import { Requests } from './screens/Requests.tsx';
import { Settings } from './screens/Settings.tsx';
import { AddTrip } from './screens/AddTrip.tsx';
import { ChangePassword } from './screens/ChangePassword.tsx';
import { AdminPanel } from './screens/AdminPanel.tsx';
import { StorageService, AppData } from './utils/storage.ts';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.INTRO);
  const [loading, setLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [syncMessage, setSyncMessage] = useState("Iniciando...");
  const [appData, setAppData] = useState<AppData>(StorageService.getData());

  useEffect(() => {
    let skipTimer: number;

    const initApp = async () => {
        setLoading(true);
        setShowSkip(false);
        setSyncMessage("Sincronizando Banco...");
        
        // Garantia: Se em 3 segundos o banco não responder, mostra o botão de pular
        skipTimer = window.setTimeout(() => {
            setShowSkip(true);
            setSyncMessage("Conexão Lenta...");
        }, 3000);

        try {
            // Tenta carregar dados do banco mas não trava se falhar
            await StorageService.fetchRemoteData();
            const data = StorageService.getData();
            setAppData(data);
            
            // Aplica tema
            if (data.settings?.theme === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }

            // Decide para onde ir baseado no login salvo
            if (data.currentUserEmail) {
                setCurrentScreen(ScreenName.DASHBOARD);
            } else {
                const saved = StorageService.getRememberedCredentials();
                if (saved.email && saved.pass) {
                    setSyncMessage("Validando Acesso...");
                    const success = await StorageService.login(saved.email, saved.pass);
                    if (success) setCurrentScreen(ScreenName.DASHBOARD);
                }
            }
        } catch (err) {
            console.error("Erro no boot:", err);
            setSyncMessage("Modo Offline");
        } finally {
            clearTimeout(skipTimer);
            // Pequeno delay para suavizar a transição
            setTimeout(() => setLoading(false), 500);
        }
    };

    const unsubscribe = StorageService.subscribe((newData) => {
        setAppData(newData);
    });

    initApp();
    return () => {
        unsubscribe();
        clearTimeout(skipTimer);
    };
  }, []);

  const handleSkip = () => {
      setLoading(false);
      if (appData.currentUserEmail) {
          setCurrentScreen(ScreenName.DASHBOARD);
      } else {
          setCurrentScreen(ScreenName.INTRO);
      }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.INTRO: return <Intro onNavigate={setCurrentScreen} />;
      case ScreenName.LOGIN: return <Login onNavigate={setCurrentScreen} />;
      case ScreenName.REGISTER_COMPANY: return <RegisterCompany onNavigate={setCurrentScreen} />;
      case ScreenName.DASHBOARD: return <Dashboard onNavigate={setCurrentScreen} />;
      case ScreenName.REGISTER_DRIVER: return <RegisterDriver onNavigate={setCurrentScreen} />;
      case ScreenName.REQUESTS: return <Requests onNavigate={setCurrentScreen} />;
      case ScreenName.SETTINGS: return <Settings onNavigate={setCurrentScreen} />;
      case ScreenName.PROFILE: return <Profile onNavigate={setCurrentScreen} />;
      case ScreenName.EDIT_PROFILE: return <EditProfile onNavigate={setCurrentScreen} />;
      case ScreenName.CHANGE_PASSWORD: return <ChangePassword onNavigate={setCurrentScreen} />;
      case ScreenName.HISTORY: return <History onNavigate={setCurrentScreen} />;
      case ScreenName.ADD_TRIP: return <AddTrip onNavigate={setCurrentScreen} />;
      case ScreenName.RANKINGS: return <Rankings onNavigate={setCurrentScreen} />;
      case ScreenName.MAP: return <Map onNavigate={setCurrentScreen} />;
      case ScreenName.DRIVER_ID: return <DriverID onNavigate={setCurrentScreen} />;
      case ScreenName.CALCULATOR: return <Calculator onNavigate={setCurrentScreen} />;
      case ScreenName.TRIP_DETAILS: return <TripDetails onNavigate={setCurrentScreen} />;
      case ScreenName.ADMIN_PANEL: return <AdminPanel onNavigate={setCurrentScreen} />;
      default: return <Intro onNavigate={setCurrentScreen} />;
    }
  };

  const OFFICIAL_LOGO = "https://i.postimg.cc/GmPhKZLG/Whats-App-Image-2025-12-22-at-10-32-42.jpg";

  if (loading) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background-dark p-10 animate-in fade-in duration-500">
              <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="size-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img src={OFFICIAL_LOGO} className="w-16 h-16 object-cover rounded-full shadow-2xl" alt="Logo" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-black text-2xl tracking-tighter uppercase">CTSPREMIUM</p>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[9px] mt-2 animate-pulse">{syncMessage}</p>
                  </div>
                  
                  {showSkip && (
                      <button 
                        onClick={handleSkip}
                        className="mt-6 px-8 py-3 bg-surface-card border border-white/5 rounded-2xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all active:scale-95 animate-in fade-in"
                      >
                        Pular e Entrar no App
                      </button>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="antialiased min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
      {appData.lastDbError && (
          <div className="fixed top-0 left-0 w-full z-[100] bg-amber-600 text-white text-[9px] font-black py-2.5 px-4 flex items-center justify-between shadow-2xl uppercase tracking-widest">
              <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">cloud_off</span>
                  <span>Sincronização Limitada</span>
              </div>
              <button onClick={() => StorageService.setError(null)} className="material-symbols-outlined text-sm">close</button>
          </div>
      )}
      {renderScreen()}
    </div>
  );
};

export default App;
