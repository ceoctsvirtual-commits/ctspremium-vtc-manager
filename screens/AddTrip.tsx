
import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const AddTrip: React.FC<Props> = ({ onNavigate }) => {
  // Mock company platforms - in a real app this comes from user context
  const companyPlatforms = ["ETS2", "ATS", "WTDS", "JOB'S"]; 
  const [selectedPlatform, setSelectedPlatform] = useState("ETS2");
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [value, setValue] = useState("");
  const [weight, setWeight] = useState("");
  const [cargo, setCargo] = useState("");
  const [imageName, setImageName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill distance when origin/destination change
  useEffect(() => {
    if (origin.length > 2 && destination.length > 2) {
      // Simulate API delay
      const timer = setTimeout(() => {
        const mockDist = Math.floor(Math.random() * 2000) + 150;
        setDistance(mockDist.toString());
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [origin, destination]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic currency mask logic
    let val = e.target.value.replace(/\D/g, '');
    val = (Number(val) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    setValue(val);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      StorageService.addTrip({
          origin,
          destination,
          distance,
          value,
          weight,
          cargo: cargo || 'Carga Geral',
          platform: selectedPlatform,
          date: new Date().toISOString(),
          status: 'Análise',
          truck: 'Volvo FH'
      });
      
      alert('Viagem registrada e enviada para o sistema global!');
      onNavigate(ScreenName.HISTORY); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.HISTORY)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Registrar Viagem</h2>
      </div>

      <div className="flex-1 w-full px-4 py-6 overflow-y-auto pb-24">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-gray-300">Empresa Responsável</label>
               <div className="w-full h-12 pl-4 rounded-lg bg-surface-dark/50 border border-gray-700 text-gray-400 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-base">domain</span>
                  TransLogística Virtual
               </div>
            </div>

            {/* Platform Selector */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Plataforma</label>
                <div className="flex flex-wrap gap-2">
                    {companyPlatforms.map(platform => (
                        <button
                            key={platform}
                            type="button"
                            onClick={() => setSelectedPlatform(platform)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${selectedPlatform === platform ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-dark border-gray-700 text-gray-400'}`}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Origem</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                        placeholder="Cidade" 
                        required 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Destino</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                        placeholder="Cidade" 
                        required 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Carga</label>
                <input 
                    className="w-full h-12 pl-4 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                    placeholder="Nome da carga" 
                    required 
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                />
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Peso (Ton)</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                        type="number" 
                        placeholder="0" 
                        required 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Distância (Km)</label>
                    <div className="relative">
                        <input 
                            className="w-full h-12 pl-4 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                            type="number" 
                            placeholder="0" 
                            required 
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                         {origin && destination && !distance && (
                            <div className="absolute right-3 top-3">
                                <span className="block size-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                            </div>
                         )}
                    </div>
                </div>
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Valor do Frete</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">R$</span>
                    <input 
                        className="w-full h-12 pl-10 rounded-lg bg-surface-dark border border-gray-700 text-white outline-none focus:border-primary" 
                        type="text" 
                        placeholder="0,00" 
                        required 
                        value={value}
                        onChange={handleValueChange}
                    />
                </div>
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Comprovante</label>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                <div 
                    onClick={handleFileClick}
                    className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer ${imageName ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gray-700 bg-surface-dark text-gray-500 hover:border-primary hover:text-primary'}`}
                >
                    {imageName ? (
                        <>
                            <span className="material-symbols-outlined text-3xl mb-1">check_circle</span>
                            <span className="text-sm font-bold">{imageName}</span>
                            <span className="text-xs opacity-70 mt-1">Toque para alterar</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-3xl mb-1">cloud_upload</span>
                            <span className="text-sm">Toque para enviar print</span>
                        </>
                    )}
                </div>
            </div>

             <button 
                type="submit"
                className="mt-4 w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Confirmar Viagem
            </button>
        </form>
      </div>
    </div>
  );
};
