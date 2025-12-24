
import React, { useState, useRef, useEffect } from 'react';
import { ScreenName, PLATFORMS_LIST, SEGMENTS_LIST, Company } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const RegisterDriver: React.FC<Props> = ({ onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Company Selection Logic
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  
  // Driver Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
      const data = StorageService.getData();
      const hiringOrgs = data.dbCompanies.filter(c => c.type === 'COMPANY' || c.type === 'GROUP');
      setCompanies(hiringOrgs);
  }, []);

  useEffect(() => {
      if (selectedCompanyId) {
          const comp = companies.find(c => c.id === selectedCompanyId);
          if (comp) {
              setAvailablePlatforms(comp.platforms);
              setSelectedPlatform(''); 
          }
      } else {
          setAvailablePlatforms([]);
      }
  }, [selectedCompanyId, companies]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await StorageService.fileToBase64(e.target.files[0]);
      setDriverPhoto(base64);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedCompanyId) {
          alert('Por favor, selecione uma empresa.');
          return;
      }
      if (!selectedPlatform) {
          alert('Por favor, selecione sua plataforma de atuação.');
          return;
      }

      const comp = companies.find(c => c.id === selectedCompanyId);
      const data = StorageService.getData();
      const existing = data.dbDrivers.find(d => d.email === email);
      if (existing) {
          alert('Este e-mail já está cadastrado em uma empresa.');
          return;
      }

      // Envia detalhes para que o approver tenha tudo que precisa
      StorageService.addRequest({
          name: name,
          avatar: driverPhoto || 'https://placehold.co/100x100/333/FFF?text=D',
          message: `Cadastro novo na empresa ${comp?.name} para plataforma ${selectedPlatform}`,
          type: 'ENTRY',
          timestamp: new Date().toISOString(),
          details: { 
              email, 
              password, 
              companyId: selectedCompanyId, 
              companyName: comp?.name,
              platform: selectedPlatform 
          }
      });

      alert('Cadastro enviado! Aguarde a aprovação da empresa para acessar o sistema.');
      onNavigate(ScreenName.INTRO); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 safe-area-top shadow-sm">
        <button onClick={() => onNavigate(ScreenName.INTRO)} className="text-gray-600 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Sou Motorista</h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6 overflow-y-auto pb-24 safe-area-bottom">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold leading-tight mb-2">Ficha de Cadastro</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Preencha seus dados e escolha sua empresa.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div className="flex flex-col items-center mb-2">
             <div 
                 onClick={() => photoInputRef.current?.click()}
                 className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors bg-white dark:bg-surface-dark overflow-hidden ${driverPhoto ? 'border-primary' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
             >
                 {driverPhoto ? (
                     <img src={driverPhoto} alt="Motorista" className="w-full h-full object-cover" />
                 ) : (
                     <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                         <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                         <span className="text-[10px] mt-1">Foto</span>
                     </div>
                 )}
             </div>
             <input ref={photoInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
             <p className="text-xs text-gray-500 mt-2">Sua foto de perfil</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Seus Dados Pessoais</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Nome Completo" 
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Seu melhor e-mail" 
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
             <input 
              className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Crie uma senha" 
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vínculo Empresarial</label>
            <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 mb-2">
                <p className="text-xs text-yellow-600 dark:text-yellow-500">
                    <span className="font-bold">Atenção:</span> Você só pode se cadastrar em uma única empresa.
                </p>
            </div>
            
            <div className="relative">
                <select 
                    className="w-full h-14 pl-4 pr-10 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    required
                >
                    <option value="">Selecione a empresa...</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.type === 'GROUP' ? '[GRUPO] ' : ''} {c.name} ({c.tag})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <span className="material-symbols-outlined">domain</span>
                </div>
            </div>
          </div>

          {selectedCompanyId && (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sua Plataforma Principal</label>
                <div className="flex flex-wrap gap-2">
                    {availablePlatforms.length > 0 ? availablePlatforms.map(platform => (
                        <button
                            key={platform}
                            type="button"
                            onClick={() => setSelectedPlatform(platform)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedPlatform === platform ? 'bg-primary/20 border-primary text-primary' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-border-dark text-gray-500'}`}
                        >
                            {platform}
                        </button>
                    )) : (
                        <p className="text-xs text-gray-500">Esta empresa não configurou plataformas ainda.</p>
                    )}
                </div>
            </div>
          )}

          <button 
            type="submit"
            className="mt-4 w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">send</span>
            Enviar Solicitação
          </button>
        </form>
      </div>
    </div>
  );
};
