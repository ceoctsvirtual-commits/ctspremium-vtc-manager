
import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../types';
import { StorageService, LOGISTICS_DB } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const AddTrip: React.FC<Props> = ({ onNavigate }) => {
  const data = StorageService.getData();
  const companyPlatforms = data.platforms.length > 0 ? data.platforms : ["ETS2", "ATS"];
  
  const [selectedPlatform, setSelectedPlatform] = useState(companyPlatforms[0]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState<number>(0);
  const [value, setValue] = useState("");
  const [weight, setWeight] = useState("");
  const [cargo, setCargo] = useState("");
  const [imageName, setImageName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredOrigins = LOGISTICS_DB.CITIES
    .filter(c => c.toLowerCase().includes(origin.toLowerCase()) && origin.length > 0)
    .slice(0, 4);
    
  const filteredDestinations = LOGISTICS_DB.CITIES
    .filter(c => c.toLowerCase().includes(destination.toLowerCase()) && destination.length > 0)
    .slice(0, 4);

  useEffect(() => {
    if (origin.length > 2 && destination.length > 2) {
      const calculatedKm = StorageService.calculateDistance(origin, destination);
      setDistance(calculatedKm);
      
      const suggestedVal = (calculatedKm * 2.0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      setValue(suggestedVal);
    }
  }, [origin, destination]);

  const handleCargoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCargo(val);
    const foundWeight = StorageService.getCargoWeight(val);
    if (foundWeight) setWeight(foundWeight.toString());
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = (Number(val) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    setValue(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await StorageService.addTrip({
              origin, 
              destination, 
              distance: Number(distance), 
              value, 
              weight,
              cargo: cargo || 'Carga Geral',
              platform: selectedPlatform,
              date: new Date().toISOString(),
              status: 'Análise',
              truck: 'Scania S730 Highline',
              driverName: data.ownerName,
              driverAvatar: data.ownerPhoto || ''
          });
          alert('Viagem registrada com sucesso!');
          onNavigate(ScreenName.HISTORY); 
      } catch (err) {
          console.error(err);
          alert('Erro ao registrar viagem no banco de dados.');
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.HISTORY)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-base font-bold tracking-tight">Lançamento de Frete</h2>
          <span className="text-[9px] text-primary uppercase font-bold tracking-widest">Motor Logístico V2 (R$ 2,00/km)</span>
        </div>
      </div>

      <div className="flex-1 w-full px-4 py-6 overflow-y-auto pb-24">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plataforma do Frete</label>
                <div className="flex flex-wrap gap-2">
                    {companyPlatforms.map(platform => (
                        <button
                            key={platform}
                            type="button"
                            onClick={() => setSelectedPlatform(platform)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${selectedPlatform === platform ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-dark border-gray-800 text-gray-500'}`}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 relative">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Origem</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-xl bg-surface-dark border border-gray-800 text-sm font-bold text-white outline-none focus:border-primary transition-all" 
                        placeholder="Ex: São Paulo" 
                        required 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                    {filteredOrigins.length > 0 && origin !== filteredOrigins[0] && (
                        <div className="absolute top-full left-0 w-full bg-[#1c2533] border border-gray-700 rounded-lg mt-1 z-30 shadow-2xl overflow-hidden">
                            {filteredOrigins.map(c => (
                                <button key={c} type="button" onClick={() => setOrigin(c)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-primary/20 transition-colors border-b border-gray-700 last:border-0">{c}</button>
                            ))}
                        </div>
                    )}
                </div>
                 <div className="flex flex-col gap-2 relative">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destino</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-xl bg-surface-dark border border-gray-800 text-sm font-bold text-white outline-none focus:border-primary transition-all" 
                        placeholder="Ex: Paris" 
                        required 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    {filteredDestinations.length > 0 && destination !== filteredDestinations[0] && (
                        <div className="absolute top-full left-0 w-full bg-[#1c2533] border border-gray-700 rounded-lg mt-1 z-30 shadow-2xl overflow-hidden">
                            {filteredDestinations.map(c => (
                                <button key={c} type="button" onClick={() => setDestination(c)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-primary/20 transition-colors border-b border-gray-700 last:border-0">{c}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tipo de Carga</label>
                <input 
                    className="w-full h-12 pl-4 rounded-xl bg-surface-dark border border-gray-800 text-sm font-bold text-white outline-none focus:border-primary transition-all" 
                    placeholder="Ex: Eletrônicos" 
                    required 
                    value={cargo}
                    onChange={handleCargoChange}
                    list="cargo-list"
                />
                <datalist id="cargo-list">
                    {Object.keys(LOGISTICS_DB.CARGO_WEIGHTS).map(c => <option key={c} value={c} />)}
                </datalist>
            </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Peso (Toneladas)</label>
                    <input 
                        className="w-full h-12 pl-4 rounded-xl bg-surface-dark border border-gray-800 text-sm font-bold text-white outline-none focus:border-primary transition-all" 
                        type="number" 
                        required 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Km Total</label>
                    <div className="relative">
                        <input 
                            className="w-full h-12 pl-4 rounded-xl bg-primary/10 border border-primary/30 text-primary font-black outline-none transition-all" 
                            type="number" 
                            readOnly
                            value={distance}
                        />
                        <span className="absolute right-4 top-3.5 text-[8px] font-black text-primary bg-primary/20 px-1 rounded">AUTO</span>
                    </div>
                </div>
            </div>

             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Faturamento Estimado</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400 font-black text-sm">R$</span>
                    <input 
                        className="w-full h-12 pl-12 rounded-xl bg-surface-dark border border-gray-800 text-base font-black text-white outline-none focus:border-primary transition-all" 
                        type="text" 
                        required 
                        value={value}
                        onChange={handleValueChange}
                    />
                </div>
                <p className="text-[9px] text-gray-600 italic px-1 font-bold">Baseado em R$ 2,00 por Km rodado.</p>
            </div>

             <div className="flex flex-col gap-2 mt-4">
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${imageName ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-gray-800 bg-surface-dark text-gray-500 hover:border-primary hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined text-3xl mb-1">{imageName ? 'task_alt' : 'add_a_photo'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{imageName ? 'Imagem Carregada' : 'Adicionar Comprovante'}</span>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setImageName(e.target.files?.[0].name || "")} accept="image/*" />
            </div>

             <button 
                type="submit"
                className="mt-6 w-full h-14 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Registrar Frete
            </button>
        </form>
      </div>
    </div>
  );
};
