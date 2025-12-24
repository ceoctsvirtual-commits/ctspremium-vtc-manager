
import React, { useState, useEffect } from 'react';
import { ScreenName, Trip, Company } from '../types';
import { BottomNav } from '../components/BottomNav';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const History: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());
  const [viewMode, setViewMode] = useState<'personal' | 'fleet'>('personal');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('');
  
  // Identifica se é o Administrador Global (Fundador)
  const isSuperAdmin = data.ownerEmail === 'ceoctsvirtual@gmail.com';
  // Identifica se é um proprietário
  const isOwner = data.organizationType === 'COMPANY' || data.organizationType === 'GROUP';

  useEffect(() => {
    const currentData = StorageService.getData();
    setData(currentData);
    // Pré-seleciona a empresa do próprio usuário no filtro
    setSelectedCompanyFilter(currentData.companyName);
    
    // Fix: Explicitly wrapping in braces to return void (Set.delete returns boolean)
    const unsubscribe = StorageService.subscribe((newData) => {
      setData(newData);
    });
    return () => { unsubscribe(); };
  }, []);

  useEffect(() => {
    let filteredTrips = [...data.dbTrips];

    if (viewMode === 'fleet') {
      if (isSuperAdmin) {
        // FUNDADOR: Pode ver tudo ou filtrar por uma empresa específica
        if (selectedCompanyFilter && selectedCompanyFilter !== "TODAS") {
          const driversOfComp = data.dbDrivers
            .filter(d => d.companyName === selectedCompanyFilter)
            .map(d => d.name);
          filteredTrips = filteredTrips.filter(t => driversOfComp.includes(t.driverName || ''));
        }
      } else if (isOwner) {
        // PROPRIETÁRIO: Vê apenas a frota da sua empresa
        const myDrivers = data.dbDrivers
          .filter(d => d.companyName === data.companyName)
          .map(d => d.name);
        filteredTrips = filteredTrips.filter(t => myDrivers.includes(t.driverName || ''));
      } else {
        // MOTORISTA: No modo frota, motoristas só vêem suas próprias viagens
        filteredTrips = filteredTrips.filter(t => t.driverName === data.ownerName);
      }
    } else {
      // MODO PESSOAL: Todos vêm apenas seus próprios príncipes/viagens
      filteredTrips = filteredTrips.filter(t => t.driverName === data.ownerName);
    }

    setTrips(filteredTrips);
  }, [viewMode, selectedCompanyFilter, data, isSuperAdmin, isOwner]);

  const handleTripClick = (tripId: string) => {
    sessionStorage.setItem('viewing_trip_id', tripId);
    onNavigate(ScreenName.TRIP_DETAILS);
  };

  return (
    <div className="bg-background-dark font-display min-h-screen flex flex-col text-white pb-24">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="flex items-center justify-center p-2 rounded-full hover:bg-gray-800 text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-tight">Registro de Viagens</h1>
          {isSuperAdmin && (
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">Fundador Global</span>
          )}
        </div>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-800 text-primary transition-colors">
          <span className="material-symbols-outlined">filter_alt</span>
        </button>
      </header>

      {/* Seletor Global para o Fundador */}
      {isSuperAdmin && viewMode === 'fleet' && (
        <div className="px-4 pt-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-surface-dark border border-primary/40 p-3 rounded-xl shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">manage_search</span>
              <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Visualizar Empresa:</label>
            </div>
            <div className="relative">
              <select 
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="w-full h-11 pl-3 pr-10 bg-background-dark border border-gray-700 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary appearance-none transition-all"
              >
                <option value="TODAS">🌎 TODAS AS EMPRESAS (GLOBAL)</option>
                <option disabled>──────────</option>
                {data.dbCompanies.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.tag})</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-500 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 bg-background-dark">
        <div className="flex p-1 bg-surface-dark rounded-xl relative border border-gray-800">
          <div className={`w-1/2 h-full absolute left-0 top-0 bg-primary rounded-lg transition-transform duration-300 ${viewMode === 'fleet' ? 'translate-x-full' : ''}`}></div>
          <button 
            onClick={() => setViewMode('personal')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold z-10 transition-colors ${viewMode === 'personal' ? 'text-white' : 'text-gray-500'}`}
          >
            Meus Príncipes
          </button>
          <button 
            onClick={() => setViewMode('fleet')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold z-10 transition-colors ${viewMode === 'fleet' ? 'text-white' : 'text-gray-500'}`}
          >
            {isSuperAdmin ? 'Auditoria Global' : 'Frota da Empresa'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 px-4 overflow-y-auto no-scrollbar pb-10">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined text-6xl mb-2">no_crash</span>
            <p className="text-sm font-bold">Nenhum registro encontrado</p>
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} onClick={() => handleTripClick(trip.id)} className="group relative overflow-hidden bg-surface-dark rounded-2xl border border-gray-800 p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98]">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${trip.platform === 'ATS' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
              <div className="flex justify-between items-start mb-3 pl-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-1">
                    <span className="bg-[#1f293a] px-1.5 py-0.5 rounded text-gray-300">{trip.platform}</span>
                    <span>{new Date(trip.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {trip.origin} <span className="text-gray-500 font-normal">➝</span> {trip.destination}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-primary">R$ {trip.value}</span>
                  <div className="flex items-center gap-1">
                    <span className={`size-2 rounded-full ${trip.status === 'Aprovado' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                    <span className={`text-[10px] font-bold uppercase ${trip.status === 'Aprovado' ? 'text-emerald-500' : 'text-yellow-500'}`}>{trip.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pl-2 pt-2 border-t border-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                    {trip.driverAvatar ? <img src={trip.driverAvatar} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-sm">person</span>}
                  </div>
                  <p className="text-xs text-gray-400 font-bold">{trip.driverName}</p>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{trip.distance} KM</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => onNavigate(ScreenName.ADD_TRIP)}
          className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-110 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      <BottomNav currentScreen={ScreenName.HISTORY} onNavigate={onNavigate} />
    </div>
  );
};
