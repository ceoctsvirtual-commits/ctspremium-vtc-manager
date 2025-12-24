
import React, { useState, useEffect } from 'react';
import { ScreenName } from './types';
import { Intro } from './screens/Intro';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { Profile } from './screens/Profile';
import { EditProfile } from './screens/EditProfile';
import { History } from './screens/History';
import { Rankings } from './screens/Rankings';
import { Map } from './screens/Map';
import { DriverID } from './screens/DriverID';
import { Calculator } from './screens/Calculator';
import { TripDetails } from './screens/TripDetails';
import { RegisterCompany } from './screens/RegisterCompany';
import { RegisterDriver } from './screens/RegisterDriver';
import { Requests } from './screens/Requests';
import { Settings } from './screens/Settings';
import { AddTrip } from './screens/AddTrip';
import { ChangePassword } from './screens/ChangePassword';
import { AdminPanel } from './screens/AdminPanel';
import { StorageService, AppData } from './utils/storage';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.INTRO);
  const [loading, setLoading] = useState(true);
  const [syncMessage, setSyncMessage] = useState("Iniciando Sistemas...");
  const [appData, setAppData] = useState<AppData>(StorageService.getData());

  useEffect(() => {
    const initApp = async () => {
        setLoading(true);
        setSyncMessage("Conectando ao Supabase...");
        
        // Ativa Realtime para sincronia global instantânea
        StorageService.initRealtime();

        // Carrega dados iniciais do banco
        await StorageService.fetchRemoteData();
        let data = StorageService.getData();
        setAppData(data);
        
        // Aplica o tema
        if (data.settings && data.settings.theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }

        // Se já tem um e-mail de sessão ativa, vai direto pro Dashboard
        if (data.currentUserEmail) {
            setCurrentScreen(ScreenName.DASHBOARD);
        } else {
            // Se não tem sessão ativa, verifica se tem credenciais "Lembradas"
            setSyncMessage("Sincronizando Identidade...");
            const saved = StorageService.getRememberedCredentials();
            if (saved.email && saved.pass) {
                const success = await StorageService.login(saved.email, saved.pass);
                if (success) {
                    setCurrentScreen(ScreenName.DASHBOARD);
                }
            }
        }
        
        setLoading(false);
    };

    const unsubscribe = StorageService.subscribe((newData) => {
        setAppData(newData);
    });

    initApp();
    return () => unsubscribe();
  }, []);

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
          <div className="flex h-screen items-center justify-center bg-background-dark">
              <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="size-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img src={OFFICIAL_LOGO} className="w-16 h-16 object-cover rounded-full" alt="Logo" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-white font-black text-xl tracking-tight">CTSPREMIUM</p>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">{syncMessage}</p>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="antialiased min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-300">
      {appData.lastDbError && (
          <div className="fixed top-0 left-0 w-full z-[100] bg-red-600 text-white text-[10px] font-bold py-2 px-4 flex items-center justify-between shadow-lg animate-in slide-in-from-top">
              <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">database_off</span>
                  <span>ERRO DE BANCO: {appData.lastDbError}</span>
              </div>
              <button onClick={() => StorageService.setError(null)} className="material-symbols-outlined text-sm">close</button>
          </div>
      )}
      {renderScreen()}
    </div>
  );
};

export default App;
