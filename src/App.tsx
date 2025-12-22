
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
import { StorageService } from './utils/storage';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.INTRO);

  useEffect(() => {
    // Apply theme on initial load based on saved preferences
    const data = StorageService.getData();
    if (data.settings && data.settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }

    // Start Real-Time Network Simulation
    StorageService.startSimulation();

  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.INTRO:
        return <Intro onNavigate={setCurrentScreen} />;
      case ScreenName.LOGIN:
        return <Login onNavigate={setCurrentScreen} />;
      case ScreenName.REGISTER_COMPANY:
        return <RegisterCompany onNavigate={setCurrentScreen} />;
      case ScreenName.DASHBOARD:
        return <Dashboard onNavigate={setCurrentScreen} />;
      case ScreenName.REGISTER_DRIVER:
        return <RegisterDriver onNavigate={setCurrentScreen} />;
      case ScreenName.REQUESTS:
        return <Requests onNavigate={setCurrentScreen} />;
      case ScreenName.SETTINGS:
        return <Settings onNavigate={setCurrentScreen} />;
      case ScreenName.PROFILE:
        return <Profile onNavigate={setCurrentScreen} />;
      case ScreenName.EDIT_PROFILE:
        return <EditProfile onNavigate={setCurrentScreen} />;
      case ScreenName.CHANGE_PASSWORD:
        return <ChangePassword onNavigate={setCurrentScreen} />;
      case ScreenName.HISTORY:
        return <History onNavigate={setCurrentScreen} />;
      case ScreenName.ADD_TRIP:
        return <AddTrip onNavigate={setCurrentScreen} />;
      case ScreenName.RANKINGS:
        return <Rankings onNavigate={setCurrentScreen} />;
      case ScreenName.MAP:
        return <Map onNavigate={setCurrentScreen} />;
      case ScreenName.DRIVER_ID:
        return <DriverID onNavigate={setCurrentScreen} />;
      case ScreenName.CALCULATOR:
        return <Calculator onNavigate={setCurrentScreen} />;
      case ScreenName.TRIP_DETAILS:
        return <TripDetails onNavigate={setCurrentScreen} />;
      case ScreenName.ADMIN_PANEL:
        return <AdminPanel onNavigate={setCurrentScreen} />;
      default:
        return <Intro onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="antialiased min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-300">
      {renderScreen()}
    </div>
  );
};

export default App;
