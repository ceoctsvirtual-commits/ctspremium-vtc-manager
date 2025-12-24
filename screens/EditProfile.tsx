
import React, { useRef, useState, useEffect } from 'react';
import { ScreenName, VehicleType, PLATFORMS_LIST, SEGMENTS_LIST } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const EditProfile: React.FC<Props> = ({ onNavigate }) => {
  const ownerPhotoRef = useRef<HTMLInputElement>(null);
  const companyLogoRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<AppData>(StorageService.getData());
  
  const [name, setName] = useState(data.ownerName);
  const [email, setEmail] = useState(data.ownerEmail);
  const [companyName, setCompanyName] = useState(data.companyName);
  const [tag, setTag] = useState(data.companyTag);
  const [photo, setPhoto] = useState(data.ownerPhoto || '');
  const [companyLogo, setCompanyLogo] = useState(data.companyLogo || '');
  const [platforms, setPlatforms] = useState<string[]>(data.platforms || []);
  const [segment, setSegment] = useState(data.segment || 'Truck');
  const [vehicle, setVehicle] = useState<VehicleType>(data.vehicleType || 'TRUCK');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'owner' | 'company') => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await StorageService.fileToBase64(e.target.files[0]);
        if (target === 'owner') setPhoto(base64);
        else setCompanyLogo(base64);
      } catch (err) {
        alert("Erro ao processar imagem.");
      }
    }
  };

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    StorageService.saveData({
        ownerName: name,
        ownerEmail: email,
        companyName: companyName,
        companyTag: tag,
        ownerPhoto: photo,
        companyLogo: companyLogo,
        platforms: platforms,
        segment: segment,
        vehicleType: vehicle
    });
    
    StorageService.addLog('Perfil Atualizado', 'Os dados cadastrais e da empresa foram alterados com sucesso.', 'INFO');
    alert('Seu perfil e dados da VTC foram atualizados!');
    onNavigate(ScreenName.PROFILE);
  };

  const vehicles: { value: VehicleType; label: string; icon: string }[] = [
    { value: 'CAR', label: 'Carro / Utilitário Leve (Cat. B)', icon: 'directions_car' },
    { value: 'LIGHT_TRUCK', label: 'Caminhão Pequeno / VUC (Cat. C)', icon: 'local_shipping' },
    { value: 'TRUCK', label: 'Caminhão Toco/Truck (Cat. D)', icon: 'local_shipping' },
    { value: 'BITRUCK', label: 'Caminhão Bi-Truck (Cat. D)', icon: 'local_shipping' },
    { value: 'RODOTREM', label: 'Carreta/Rodotrem (Cat. E)', icon: 'conveyor_belt' },
    { value: 'BUS', label: 'Ônibus Rodoviário (Cat. D)', icon: 'directions_bus' },
    { value: 'MINIBUS', label: 'Micro-Ônibus (Cat. D)', icon: 'airport_shuttle' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.PROFILE)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Editar Cadastro</h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6 overflow-y-auto pb-10">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          
          {/* Section: Personal Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] px-1">Dados Pessoais</h3>
            <div className="flex flex-col items-center">
               <div className="relative group">
                  <div 
                      onClick={() => ownerPhotoRef.current?.click()}
                      className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 ring-4 ring-primary/20 bg-gray-800 overflow-hidden shadow-2xl cursor-pointer" 
                      style={{ backgroundImage: `url('${photo || "https://placehold.co/150x150/333/FFF?text=Foto"}')` }}
                  ></div>
                  <button 
                      type="button"
                      onClick={() => ownerPhotoRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-primary hover:bg-blue-600 text-white p-2 rounded-xl shadow-xl border-2 border-background-dark transition-all active:scale-90"
                  >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                  <input ref={ownerPhotoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'owner')} />
               </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nome Completo</label>
                    <input 
                        className="w-full h-14 pl-4 rounded-xl bg-surface-dark border border-gray-700 text-white font-bold outline-none focus:border-primary transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">E-mail Administrativo</label>
                    <input 
                        className="w-full h-14 pl-4 rounded-xl bg-surface-dark border border-gray-700 text-white font-bold outline-none focus:border-primary transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                </div>
            </div>
          </div>

          <div className="h-px bg-gray-800"></div>

          {/* Section: Corporate Identity */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] px-1">Identidade Corporativa</h3>
            
            <div className="flex items-center gap-6 p-4 bg-surface-dark/50 rounded-2xl border border-gray-800">
               <div className="relative shrink-0">
                  <div 
                      onClick={() => companyLogoRef.current?.click()}
                      className="bg-center bg-no-repeat bg-cover rounded-2xl h-20 w-20 ring-2 ring-white/5 bg-gray-900 overflow-hidden shadow-xl cursor-pointer" 
                      style={{ backgroundImage: `url('${companyLogo || "https://placehold.co/150x150/333/FFF?text=Logo"}')` }}
                  ></div>
                  <button 
                      type="button"
                      onClick={() => companyLogoRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-lg shadow-lg border border-background-dark transition-all"
                  >
                      <span className="material-symbols-outlined text-[16px]">edit_square</span>
                  </button>
                  <input ref={companyLogoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'company')} />
               </div>
               <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo da VTC</p>
                  <p className="text-[9px] text-gray-600 italic">Formatos: PNG, JPG, WEBP. Recomendado 400x400px.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nome da Transportadora</label>
                    <input 
                        className="w-full h-14 pl-4 rounded-xl bg-surface-dark border border-gray-700 text-white font-bold outline-none focus:border-primary transition-all"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        type="text"
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">TAG (Sigla)</label>
                    <input 
                        className="w-full h-14 pl-4 rounded-xl bg-surface-dark border border-gray-700 text-white font-black outline-none focus:border-primary transition-all uppercase"
                        value={tag}
                        onChange={(e) => setTag(e.target.value.toUpperCase())}
                        type="text"
                        maxLength={6}
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Segmento de Atuação</label>
                <div className="flex gap-2">
                    {SEGMENTS_LIST.map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSegment(s)}
                            className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${segment === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-dark border-gray-800 text-gray-500'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Plataformas Disponíveis</label>
                <div className="flex flex-wrap gap-2 p-3 bg-surface-dark/30 rounded-2xl border border-gray-800/50">
                    {PLATFORMS_LIST.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => togglePlatform(p)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${platforms.includes(p) ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-dark border-gray-800 text-gray-600'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="h-px bg-gray-800"></div>

          {/* Section: Fleet Config */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] px-1">Configuração de Frota</h3>
            <div className="grid grid-cols-1 gap-3">
                {vehicles.map(v => (
                    <button
                        key={v.value}
                        type="button"
                        onClick={() => setVehicle(v.value)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${vehicle === v.value ? 'bg-primary/10 border-primary text-white' : 'bg-surface-dark border-gray-700 text-gray-500 opacity-60'}`}
                    >
                        <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black uppercase tracking-tight leading-none">{v.label}</span>
                        </div>
                        {vehicle === v.value && <span className="material-symbols-outlined ml-auto text-primary text-[20px]">check_circle</span>}
                    </button>
                ))}
            </div>
          </div>

          <button 
            type="submit"
            className="mt-6 w-full h-16 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">save</span>
            Atualizar Setup CTS
          </button>
        </form>
      </div>
    </div>
  );
};
