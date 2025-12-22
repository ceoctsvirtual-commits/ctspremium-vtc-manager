
import React, { useState, useEffect } from 'react';
import { ScreenName, Trip } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const History: React.FC<Props> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'personal' | 'fleet'>('personal');
  const [trips, setTrips] = useState<Trip[]>([]);
  
  useEffect(() => {
      const data = StorageService.getData();
      setTrips(data.dbTrips);
      
      const unsubscribe = StorageService.subscribe((newData) => {
          setTrips(newData.dbTrips);
      });
      return () => unsubscribe();
  }, []);

  const toggleFilter = () => {
      setViewMode(prev => prev === 'personal' ? 'fleet' : 'personal');
  };

  return (
    <div className="bg-background-dark font-display min-h-screen flex flex-col text-white pb-24">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-800 text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Histórico de Viagens</h1>
        <button 
            onClick={toggleFilter}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-800 text-primary transition-colors"
        >
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      <div className="px-4 py-4 bg-background-dark">
        <div className="flex p-1 bg-surface-dark rounded-xl relative">
          <div className={`w-1/2 h-full absolute left-0 top-0 bg-primary rounded-lg transition-transform duration-300 ${viewMode === 'fleet' ? 'translate-x-full' : ''}`}></div>
          <label className="flex-1 text-center cursor-pointer z-10">
            <input 
              checked={viewMode === 'personal'} 
              onChange={() => setViewMode('personal')}
              className="peer sr-only" 
              name="view_mode" 
              type="radio" 
              value="personal"
            />
            <div className="py-2 px-4 rounded-lg text-sm font-medium text-gray-400 peer-checked:text-white transition-all">
              Minhas Viagens
            </div>
          </label>
          <label className="flex-1 text-center cursor-pointer z-10">
            <input 
              checked={viewMode === 'fleet'}
              onChange={() => setViewMode('fleet')}
              className="peer sr-only" 
              name="view_mode" 
              type="radio" 
              value="fleet"
            />
            <div className="py-2 px-4 rounded-lg text-sm font-medium text-gray-400 peer-checked:text-white transition-all">
              Viagens da Frota
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2 mb-2">
        <div className="flex-shrink-0 min-w-[140px] bg-surface-dark rounded-xl p-3 border border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
            <span className="text-xs font-medium text-gray-400">Faturamento</span>
          </div>
          <p className="text-lg font-bold text-white">{viewMode === 'personal' ? 'R$ 1.2M' : 'R$ 45.8M'}</p>
        </div>
        <div className="flex-shrink-0 min-w-[140px] bg-surface-dark rounded-xl p-3 border border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-full bg-orange-500/10 text-orange-500">
              <span className="material-symbols-outlined text-lg">distance</span>
            </div>
            <span className="text-xs font-medium text-gray-400">Distância</span>
          </div>
          <p className="text-lg font-bold text-white">{viewMode === 'personal' ? '45.000 km' : '892.000 km'}</p>
        </div>
        <div className="flex-shrink-0 min-w-[140px] bg-surface-dark rounded-xl p-3 border border-gray-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-500">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <span className="text-xs font-medium text-gray-400">Viagens</span>
          </div>
          <p className="text-lg font-bold text-white">{viewMode === 'personal' ? trips.length : '1,204'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {viewMode === 'personal' && (
            <>
                {trips.length === 0 && <p className="text-center text-gray-500 py-10">Nenhuma viagem registrada.</p>}
                {trips.map(trip => (
                    <div key={trip.id} onClick={() => onNavigate(ScreenName.TRIP_DETAILS)} className="group relative overflow-hidden bg-surface-dark rounded-2xl border border-gray-800 p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${trip.platform === 'ATS' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <div className="flex justify-between items-start mb-3 pl-2">
                            <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-1">
                                <span className="bg-[#1f293a] px-1.5 rounded text-[10px] font-bold tracking-wider text-gray-300">{trip.platform}</span>
                                <span>{new Date(trip.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-base font-bold text-white leading-tight">
                                {trip.origin} <span className="text-gray-400 font-normal">➝</span> {trip.destination}
                            </h3>
                            </div>
                            <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-primary">R$ {trip.value}</span>
                            <div className="flex items-center gap-1">
                                <span className={`size-2 rounded-full ${trip.status === 'Aprovado' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                                <span className={`text-xs font-medium ${trip.status === 'Aprovado' ? 'text-emerald-500' : 'text-yellow-500'}`}>{trip.status}</span>
                            </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="size-10 rounded-lg bg-[#1f293a] flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-lg">local_shipping</span>
                            </div>
                            <div className="flex flex-col justify-center">
                            <p className="text-xs text-gray-400">Carga: {trip.cargo}</p>
                            <p className="text-xs text-gray-400">{trip.distance} km • {trip.weight} tons</p>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )}
        
        {viewMode === 'fleet' && (
            /* Mock data for Fleet mode view */
             <div className="text-center p-8">
                 <p className="text-gray-500">Exemplo de visualização da frota (Mock)</p>
             </div>
        )}
      </div>

      <div className="absolute bottom-24 right-6 z-40">
        <button 
          onClick={() => onNavigate(ScreenName.ADD_TRIP)}
          className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      <BottomNav currentScreen={ScreenName.HISTORY} onNavigate={onNavigate} />
    </div>
  );
};
