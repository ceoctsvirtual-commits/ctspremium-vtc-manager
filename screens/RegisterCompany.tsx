
import React, { useState, useRef, useEffect } from 'react';
import { ScreenName, PLATFORMS_LIST, SEGMENTS_LIST, OrganizationType } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const RegisterCompany: React.FC<Props> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<AppData>(StorageService.getData());
  const [regType, setRegType] = useState<OrganizationType>('COMPANY');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const ownerPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = StorageService.getData();
    setFormData(data);
    const storedType = sessionStorage.getItem('registrationType') as OrganizationType;
    if (storedType) {
        setRegType(storedType);
        setFormData(prev => ({ ...prev, organizationType: storedType }));
    }
  }, []);

  const handleChange = (field: keyof AppData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: string) => {
    const current = formData.platforms;
    if (current.includes(platform)) {
      handleChange('platforms', current.filter(p => p !== platform));
    } else {
      handleChange('platforms', [...current, platform]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'companyLogo' | 'companyBanner' | 'ownerPhoto') => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await StorageService.fileToBase64(e.target.files[0]);
        handleChange(field, base64);
      } catch (err) {
        alert("Erro ao processar imagem.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveData(formData);
    // Automatically register the company/group/autonomous entry into the dbCompanies table
    if (formData.companyName) {
        // Check if exists to avoid dups in this mock
        const existing = formData.dbCompanies.find(c => c.name === formData.companyName);
        if (!existing) {
            StorageService.createCompany({
                type: regType,
                name: formData.companyName,
                tag: formData.companyTag,
                logo: formData.companyLogo,
                banner: formData.companyBanner,
                ownerName: formData.ownerName,
                ownerEmail: formData.ownerEmail,
                description: `Registro ${getLabel()} Oficial`,
                segment: formData.segment,
                platforms: formData.platforms,
                isGroup: regType === 'GROUP'
            });
        }
    }
    
    alert(`Cadastro de ${getLabel()} realizado com sucesso! Você será redirecionado para o sistema.`);
    onNavigate(ScreenName.DASHBOARD);
  };

  const getLabel = () => {
      if (regType === 'GROUP') return 'Grupo';
      if (regType === 'AUTONOMOUS') return 'Autônomo';
      return 'Empresa';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 safe-area-top shadow-sm dark:shadow-none">
        <button onClick={() => onNavigate(ScreenName.INTRO)} className="text-gray-600 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Cadastro de {getLabel()}
        </h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6 overflow-y-auto pb-24 safe-area-bottom">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold leading-tight mb-2">Configure sua Organização</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {regType === 'AUTONOMOUS' 
                ? 'Preencha os dados da sua operação autônoma.' 
                : `Primeiro, os dados do ${getLabel()}, depois os seus.`}
          </p>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          
          {/* Dados da Organização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="material-symbols-outlined text-primary">domain</span>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dados do {getLabel()}</h3>
            </div>

            {/* Banner Upload */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Banner de Capa</label>
                <div 
                   onClick={() => bannerInputRef.current?.click()}
                   className={`h-48 w-full rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors bg-white dark:bg-surface-dark overflow-hidden ${formData.companyBanner ? 'border-primary' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
                   style={{ 
                       backgroundImage: formData.companyBanner ? `url('${formData.companyBanner}')` : 'none',
                       backgroundSize: 'cover',
                       backgroundPosition: 'center'
                   }}
               >
                   {!formData.companyBanner && (
                       <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                           <span className="material-symbols-outlined text-4xl mb-1">panorama</span>
                           <span className="text-[10px] mt-1">Toque para adicionar banner</span>
                       </div>
                   )}
               </div>
               <input ref={bannerInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyBanner')} />
            </div>

            {/* Logo Upload */}
            <div className="flex flex-col items-center mb-2 -mt-16 relative z-10">
               <div 
                   onClick={() => logoInputRef.current?.click()}
                   className={`h-28 w-28 rounded-full border-[5px] border-background-light dark:border-background-dark shadow-lg flex items-center justify-center cursor-pointer transition-colors bg-white dark:bg-surface-dark overflow-hidden ${formData.companyLogo ? 'border-primary' : ''}`}
               >
                   {formData.companyLogo ? (
                       <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                   ) : (
                       <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                           <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                           <span className="text-[10px] mt-1">Logo</span>
                       </div>
                   )}
               </div>
               <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} />
               <p className="text-[10px] text-gray-500 mt-1">Logo Principal</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome {regType === 'AUTONOMOUS' ? 'Fantasia' : `do ${getLabel()}`}</label>
              <input 
                className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder={regType === 'AUTONOMOUS' ? "Ex: QRA Bolinha Transportes" : `Ex: TransGlobal ${getLabel()}`}
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">TAG (Sigla)</label>
              <input 
                className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none uppercase"
                placeholder="[TAG]" 
                type="text"
                maxLength={6}
                required
                value={formData.companyTag}
                onChange={(e) => handleChange('companyTag', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Segmento de Atuação</label>
                <div className="flex gap-2">
                    {SEGMENTS_LIST.map(segment => (
                        <button
                            key={segment}
                            type="button"
                            onClick={() => handleChange('segment', segment)}
                            className={`flex-1 h-10 rounded-lg text-sm font-bold border transition-all ${formData.segment === segment ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-border-dark text-gray-500 hover:border-gray-400'}`}
                        >
                            {segment}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Plataformas Suportadas</label>
                <div className="flex flex-wrap gap-2">
                    {PLATFORMS_LIST.map(platform => (
                        <button
                            key={platform}
                            type="button"
                            onClick={() => togglePlatform(platform)}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.platforms.includes(platform) ? 'bg-primary/20 border-primary text-primary' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-border-dark text-gray-500'}`}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {/* Dados do Proprietário */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 pt-4">
                <span className="material-symbols-outlined text-primary">person</span>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {regType === 'AUTONOMOUS' ? 'Seus Dados' : 'Dados do Fundador'}
                </h3>
            </div>

            {/* Owner Photo Field - Added */}
            <div className="flex items-center gap-4 py-2">
                <div 
                   onClick={() => ownerPhotoInputRef.current?.click()}
                   className="h-20 w-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden bg-white dark:bg-surface-dark"
                >
                   {formData.ownerPhoto ? (
                       <img src={formData.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                   ) : (
                       <span className="material-symbols-outlined text-gray-400">person_add</span>
                   )}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Foto de Perfil</p>
                    <p className="text-xs text-gray-500">Adicione sua foto pessoal</p>
                    <button type="button" onClick={() => ownerPhotoInputRef.current?.click()} className="text-xs text-primary font-bold mt-1">Carregar Imagem</button>
                </div>
                <input ref={ownerPhotoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'ownerPhoto')} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Seu Nome Completo</label>
              <input 
                className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="Seu nome"
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
              />
            </div>

             <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail de Login</label>
              <input 
                className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="email@exemplo.com"
                type="email"
                required
                value={formData.ownerEmail}
                onChange={(e) => handleChange('ownerEmail', e.target.value)}
              />
            </div>

             <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha de Acesso</label>
              <input 
                className="w-full h-14 pl-4 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                type="password"
                required
                value={formData.ownerPass}
                onChange={(e) => handleChange('ownerPass', e.target.value)}
              />
            </div>

          </div>

          <button 
            type="submit"
            className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Finalizar e Acessar Sistema
          </button>
        </form>
      </div>
    </div>
  );
};
