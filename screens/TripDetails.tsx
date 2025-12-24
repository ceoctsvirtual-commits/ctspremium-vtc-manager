
import React, { useState, useEffect } from 'react';
import { ScreenName, Trip } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const TripDetails: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<AppData>(StorageService.getData());
  const [trip, setTrip] = useState<Trip | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('viewing_trip_id');
    const currentData = StorageService.getData();
    setData(currentData);
    
    if (id) {
        const found = currentData.dbTrips.find(t => String(t.id).trim() === String(id).trim());
        setTrip(found || null);
    }
  }, []);

  const handleDelete = () => {
    if (!trip) return;
    
    const isSuperAdmin = data.ownerEmail === 'ceoctsvirtual@gmail.com';
    
    if (window.confirm(isSuperAdmin ? "ADMIN MASTER: Confirmar exclusão irreversível deste registro?" : "Deseja excluir esta viagem do histórico?")) {
      StorageService.deleteTrip(trip.id);
      sessionStorage.removeItem('viewing_trip_id');
      alert("Registro excluído permanentemente!");
      onNavigate(ScreenName.HISTORY);
    }
  };

  const handleEdit = () => {
    onNavigate(ScreenName.ADD_TRIP);
  };

  if (!trip) {
      return (
          <div className="bg-background-dark text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">history_toggle_off</span>
              <h2 className="text-xl font-bold">Registro Indisponível</h2>
              <p className="text-gray-500 mt-2">Esta viagem pode ter sido excluída ou resetada no fechamento mensal.</p>
              <button onClick={() => onNavigate(ScreenName.HISTORY)} className="mt-6 px-6 py-3 bg-primary rounded-xl font-bold">Voltar ao Histórico</button>
          </div>
      );
  }

  const isSuperAdmin = data.ownerEmail === 'ceoctsvirtual@gmail.com';
  const isOwner = data.organizationType === 'COMPANY' || data.organizationType === 'GROUP';
  const tripDriver = data.dbDrivers.find(d => d.name === trip.driverName);
  const isTripFromMyCompany = tripDriver && tripDriver.companyName === data.companyName;
  const isMyTrip = trip.driverName === data.ownerName;

  const canModify = isSuperAdmin || (isOwner && isTripFromMyCompany) || isMyTrip;

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={() => onNavigate(ScreenName.HISTORY)} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 transition-colors text-white">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex flex-col items-center flex-1 pr-10">
            <h1 className="text-base font-bold leading-tight tracking-tight">Detalhes do Frete</h1>
            {isSuperAdmin && <span className="text-[9px] text-primary uppercase font-black tracking-widest">Controle Master CTS</span>}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col gap-6 p-4">
        <section>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1c2533] shadow-sm border border-gray-700">
            <div className="relative shrink-0">
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-16 ring-2 ring-primary/20" style={{ backgroundImage: `url('${trip.driverAvatar || "https://placehold.co/100x100/333/FFF?text=D"}')` }}></div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-[#1c2533]">
                <span className="material-symbols-outlined text-[14px] font-bold block">verified</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-bold leading-tight">{trip.driverName || "Motorista"}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wide">
                  {tripDriver?.companyName || "CTS Global"}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase">{trip.truck}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trajeto Logístico</h3>
            <div className="flex items-center gap-1 text-primary text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">distance</span>
              <span className="font-bold">{trip.distance} km</span>
            </div>
          </div>
          <div className="relative flex flex-col gap-2">
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10 border-l border-dashed border-gray-600 z-0"></div>
            <div className="relative z-10 flex gap-4 items-center bg-[#1c2533] p-4 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-900/30 text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">trip_origin</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origem</p>
                <p className="text-base font-bold text-white leading-tight">{trip.origin}</p>
              </div>
            </div>
            <div className="relative z-10 flex gap-4 items-center bg-[#1c2533] p-4 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-900/30 text-green-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">flag</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destino</p>
                <p className="text-base font-bold text-white leading-tight">{trip.destination}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-gradient-to-br from-primary to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-blue-900/20">
            <p className="text-blue-100 text-[10px] font-bold uppercase mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Faturamento do Frete
            </p>
            <p className="text-3xl font-black tracking-tight">R$ {trip.value}</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#1c2533] border border-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-slate-500 text-[24px] mb-1">calendar_month</span>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Lançado em</p>
            <p className="text-white text-base font-bold">{new Date(trip.date).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#1c2533] border border-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-slate-500 text-[24px] mb-1">inventory_2</span>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Carga e Peso</p>
            <p className="text-white text-base font-bold truncate">{trip.weight} Ton • {trip.cargo}</p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Comprovantes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
            <div 
              onClick={() => setZoomedImage('https://placehold.co/1200x800/101622/FFF?text=COMPROVANTE_CARGA')}
              className="group relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800 border border-gray-700 shadow-sm cursor-pointer"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://placehold.co/600x400/101622/FFF?text=Print_Viagem')" }}></div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
              </div>
            </div>
            <div 
              onClick={() => setZoomedImage('https://placehold.co/1200x800/101622/FFF?text=COMPROVANTE_ENTREGA')}
              className="group relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800 border border-gray-700 shadow-sm cursor-pointer"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: "url('https://placehold.co/600x400/101622/FFF?text=Print_Final')" }}></div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {canModify && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#101622]/95 backdrop-blur-xl border-t border-gray-800 px-4 py-4 safe-area-bottom shadow-2xl">
          <div className="max-w-md mx-auto flex gap-3">
            <button 
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-red-600/10 text-red-500 font-bold hover:bg-red-600/20 transition-all active:scale-95 border border-red-500/20"
            >
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              Excluir
            </button>
            <button 
              onClick={handleEdit}
              className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Editar
            </button>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-0 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div className="absolute top-10 right-6 z-[110]">
            <button className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <img 
            src={zoomedImage} 
            alt="Zoom" 
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300" 
          />
        </div>
      )}
    </div>
  );
};
