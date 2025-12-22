
import React from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const TripDetails: React.FC<Props> = ({ onNavigate }) => {
  const handleDelete = () => {
      if(confirm("Tem certeza que deseja excluir este registro de viagem?")) {
          onNavigate(ScreenName.HISTORY);
      }
  };

  const handleEdit = () => {
      // Logic to pass ID to edit would go here, for now nav to AddTrip as placeholder
      onNavigate(ScreenName.ADD_TRIP);
  };

  return (
    <div className="bg-background-dark text-white font-display min-h-screen flex flex-col pb-24">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between p-4 h-16">
          <button onClick={() => onNavigate(ScreenName.HISTORY)} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-800 transition-colors text-white">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Detalhes da Viagem</h1>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4">
        <section>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1c2533] shadow-sm border border-gray-700">
            <div className="relative shrink-0">
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-16 ring-2 ring-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCaNPucnkXVhjo_hSmdGwA0ff91ljSS6_K9O0nKxY2gQoVpWfNbb7-iNtLn4D4PIRwL-LLzCrDTcLNfSefxH4NcsuwpbzbvkpHxNXkIVG84McJH5-CNPg6XckAk4aSknfHt0BsQ3SmxriU9G07_GT5UDdXEJ97MUQFDL9P1RIrQZxp4QYNGDwojBtN2tpM3IsMkQeja7glOfteA41Fg8cXUk_dPToGqGOrcQO56N9-uEYlnGQ7AsUEKcBv0aabX0sUHpUINGyiF1RQ')" }}></div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-[#1c2533]">
                <span className="material-symbols-outlined text-[14px] font-bold block">local_shipping</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-bold leading-tight">João Silva</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wide">Motorista</span>
                <span className="text-slate-400 text-sm">Scania R450</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Rota</h3>
            <div className="flex items-center gap-1 text-primary text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">distance</span>
              <span>430 km</span>
            </div>
          </div>
          <div className="relative flex flex-col gap-2">
            <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/50 to-primary/10 border-l border-dashed border-gray-600 z-0"></div>
            <div className="relative z-10 flex gap-4 items-center bg-[#1c2533] p-4 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-900/30 text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">trip_origin</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Origem</p>
                <p className="text-base font-bold text-white leading-tight">São Paulo, SP</p>
              </div>
            </div>
            <div className="relative z-10 flex gap-4 items-center bg-[#1c2533] p-4 rounded-xl border border-gray-700 shadow-sm">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-900/30 text-green-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">flag</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Destino</p>
                <p className="text-base font-bold text-white leading-tight">Rio de Janeiro, RJ</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-gradient-to-br from-primary to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-blue-900/20">
            <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Valor do Frete
            </p>
            <p className="text-3xl font-bold tracking-tight">R$ 4.500,00</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#1c2533] border border-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-slate-500 text-[24px] mb-1">calendar_month</span>
            <p className="text-slate-400 text-xs font-medium uppercase">Data de Entrega</p>
            <p className="text-white text-lg font-bold">15/10/2023</p>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#1c2533] border border-gray-700 shadow-sm">
            <span className="material-symbols-outlined text-slate-500 text-[24px] mb-1">timer</span>
            <p className="text-slate-400 text-xs font-medium uppercase">Duração</p>
            <p className="text-white text-lg font-bold">5h 30m</p>
          </div>
        </section>

        <section className="rounded-xl bg-[#1c2533] border border-gray-700 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-700/50">
            <h3 className="font-bold text-white">Informações da Carga</h3>
          </div>
          <div className="divide-y divide-gray-700/50">
            <div className="grid grid-cols-[100px_1fr] items-center px-5 py-4 gap-4">
              <p className="text-slate-400 text-sm font-medium">Plataforma</p>
              <div className="flex justify-end sm:justify-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                  Euro Truck Sim 2
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center px-5 py-4 gap-4">
              <p className="text-slate-400 text-sm font-medium">Categoria</p>
              <p className="text-white text-sm font-semibold text-right sm:text-left">Carga Pesada</p>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center px-5 py-4 gap-4">
              <p className="text-slate-400 text-sm font-medium">Carga</p>
              <p className="text-white text-sm font-semibold text-right sm:text-left">Bobinas de Aço</p>
            </div>
            <div className="grid grid-cols-[100px_1fr] items-center px-5 py-4 gap-4">
              <p className="text-slate-400 text-sm font-medium">Peso</p>
              <p className="text-white text-sm font-semibold text-right sm:text-left">22.5 Toneladas</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white px-1">Comprovantes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800 border border-gray-700 shadow-sm cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://placehold.co/600x400/101622/FFF')" }}></div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                <p className="text-white text-xs font-medium">Print da Carga/Mapa</p>
              </div>
            </div>
            <div className="group relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800 border border-gray-700 shadow-sm cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPWgiBOnZPkjNA-Y1csRqBDlwbfG9PitTQAtk9lVmTkOBINyic-MgMT5BFX75Q1SNuYnujx9U5A0ng4CO8YT8GYS_OwzAWIa1NVKGyEgpzxS-xmKhgRF8of7KyRnYmWX1or6i3v4uXdvpU4praiM1RDRE_ZMap31ONdhClKaRAULgwVvlYvB350FR4MgSZ7cu0MDKqvN16bupcjcNFYR7gBlqra18WfwbE_bYzNbqR5lSrJE9HPcr2ibIa5cQ2lHFyZywWtZzqrYU')" }}></div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                <p className="text-white text-xs font-medium">Comprovante Final</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#101622]/90 backdrop-blur-md border-t border-gray-800 px-4 py-4 safe-area-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors"
        >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Excluir
          </button>
          <button 
            onClick={handleEdit}
            className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors"
        >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Editar Viagem
          </button>
        </div>
      </div>
    </div>
  );
};
