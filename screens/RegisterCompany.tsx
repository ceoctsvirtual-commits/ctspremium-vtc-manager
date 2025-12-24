
import React, { useState, useRef, useEffect } from 'react';
import { ScreenName, OrganizationType } from '../types';
import { StorageService, AppData } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const RegisterCompany: React.FC<Props> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<AppData>(StorageService.getData());
  const [regType, setRegType] = useState<OrganizationType>('COMPANY');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{msg: string, isRls: boolean} | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
        if (!formData.companyName || !formData.ownerEmail || !formData.ownerPass) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            setIsSubmitting(false);
            return;
        }

        await StorageService.createCompany({
            type: regType,
            name: formData.companyName,
            tag: formData.companyTag,
            logo: formData.companyLogo,
            banner: formData.companyBanner,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            ownerPass: formData.ownerPass,
            ownerPhoto: formData.ownerPhoto,
            description: `Registro ${getLabel()} Oficial`,
            segment: formData.segment || "Truck",
            platforms: formData.platforms || ["ETS2", "ATS"],
            isGroup: regType === 'GROUP'
        });
        
        if (rememberMe) {
            StorageService.saveRememberedCredentials(formData.ownerEmail, formData.ownerPass);
        }

        alert(`Cadastro de ${getLabel()} realizado com sucesso! Infraestrutura Virtual CTS Ativada.`);
        onNavigate(ScreenName.DASHBOARD);
    } catch (err: any) {
        console.error("Registration Failure:", err);
        const errStr = err.message.toLowerCase();
        const isRls = errStr.includes('row-level security') || 
                      errStr.includes('rls') || 
                      errStr.includes('policy') ||
                      errStr.includes('violates') ||
                      errStr.includes('permission') ||
                      errStr.includes('column') ||
                      errStr.includes('schema cache');
        setErrorDetails({ msg: err.message, isRls });
    } finally {
        setIsSubmitting(false);
    }
  };

  const getLabel = () => {
      if (regType === 'GROUP') return 'Grupo';
      if (regType === 'AUTONOMOUS') return 'Autônomo';
      return 'Empresa';
  };

  const sqlFixCommand = `
-- SCRIPT MESTRE DE RECONSTRUÇÃO CTS
-- Este código apaga e recria as tabelas do zero com as colunas corretas.

-- 1. APAGAR TABELAS CONFLITANTES
DROP TABLE IF EXISTS companies, drivers, trips, requests, roles, logs CASCADE;

-- 2. CRIAR TABELA COMPANIES
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tag TEXT NOT NULL,
    logo TEXT,
    banner TEXT,
    owner_name TEXT,
    owner_email TEXT,
    owner_photo TEXT,
    type TEXT,
    platforms TEXT[],
    segment TEXT,
    is_group BOOLEAN DEFAULT FALSE,
    description TEXT
);

-- 3. CRIAR TABELA DRIVERS (COM PASSWORD)
CREATE TABLE drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    company_id TEXT REFERENCES companies(id),
    company_name TEXT,
    avatar TEXT,
    role_id TEXT,
    status TEXT DEFAULT 'Ativo',
    distance NUMERIC DEFAULT 0,
    rank NUMERIC DEFAULT 0
);

-- 4. CRIAR DEMAIS TABELAS
CREATE TABLE trips (id TEXT PRIMARY KEY, origin TEXT, destination TEXT, distance NUMERIC, value TEXT, date TEXT, status TEXT, platform TEXT, driver_name TEXT, driver_avatar TEXT, cargo TEXT, weight TEXT, truck TEXT);
CREATE TABLE requests (id TEXT PRIMARY KEY, name TEXT, avatar TEXT, message TEXT, type TEXT, timestamp TEXT, from_id TEXT, target_id TEXT, details JSONB);
CREATE TABLE roles (id TEXT PRIMARY KEY, name TEXT, color TEXT, permissions TEXT[], company_id TEXT, is_system BOOLEAN DEFAULT FALSE);
CREATE TABLE logs (id TEXT PRIMARY KEY, action TEXT, details TEXT, timestamp TEXT, user_email TEXT, type TEXT);

-- 5. LIBERAR ACESSO TOTAL (SEM RLS)
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE logs DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE companies TO anon;
GRANT ALL ON TABLE drivers TO anon;
GRANT ALL ON TABLE trips TO anon;
GRANT ALL ON TABLE requests TO anon;
GRANT ALL ON TABLE roles TO anon;
GRANT ALL ON TABLE logs TO anon;

GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
`.trim();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 safe-area-top shadow-sm dark:shadow-none">
        <button onClick={() => onNavigate(ScreenName.INTRO)} className="text-gray-600 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" disabled={isSubmitting}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Setup de Organização
        </h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6 overflow-y-auto pb-24 safe-area-bottom">
        {errorDetails && (
            <div className={`mb-10 p-6 rounded-[2.5rem] border-2 shadow-2xl animate-in zoom-in-95 ${errorDetails.isRls ? 'bg-amber-500/10 border-amber-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="size-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shrink-0">
                        <span className="material-symbols-outlined text-3xl">database_off</span>
                    </div>
                    <div className="flex-1">
                        <p className={`font-black uppercase tracking-widest text-xs mb-1 ${errorDetails.isRls ? 'text-amber-500' : 'text-red-500'}`}>
                            {errorDetails.msg.includes('column') || errorDetails.msg.includes('password') ? 'Erro de Esquema (Tabelas Faltando)' : 'Infraestrutura Bloqueada'}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-bold">{errorDetails.msg}</p>
                    </div>
                </div>
                
                {errorDetails.isRls && (
                    <div className="mt-6 pt-6 border-t border-amber-500/20">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">construction</span> Script de Reconstrução Total:
                        </p>
                        <ol className="text-[10px] text-slate-400 space-y-3 mb-6 list-decimal pl-4 font-medium">
                            <li>Vá ao <b>SQL Editor</b> no seu Supabase.</li>
                            <li>Clique em <b>"+ New Query"</b>.</li>
                            <li>Cole o script abaixo (ele vai recriar o banco corretamente para o App).</li>
                            <li>Clique em <b>"RUN"</b>.</li>
                        </ol>
                        <div className="bg-black/80 rounded-2xl p-4 font-mono text-[9px] text-emerald-400 overflow-x-auto whitespace-pre border border-white/10 shadow-inner mb-6 select-all">
                            {sqlFixCommand}
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(sqlFixCommand);
                                alert("Script Mestre copiado! Vá ao SQL Editor, cole e clique em RUN. Isso criará as colunas 'password' e todas as outras necessárias.");
                            }}
                            className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span className="material-symbols-outlined">content_copy</span>
                            Copiar Script Mestre
                        </button>
                    </div>
                )}
            </div>
        )}

        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-sm">rocket_launch</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Global Logistics Setup</span>
          </div>
          <h2 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tight">Registro de Identidade</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium px-4">
            {regType === 'AUTONOMOUS' 
                ? 'Configure seu perfil master de motorista independente.' 
                : `Setup administrativo total para seu ${getLabel()} CTS.`}
          </p>
        </div>

        <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <span className="material-symbols-outlined text-primary">corporate_fare</span>
                <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Identidade Visual</h3>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Capa da VTC</label>
                <div 
                   onClick={() => !isSubmitting && bannerInputRef.current?.click()}
                   className={`h-40 w-full rounded-3xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all bg-white dark:bg-surface-dark overflow-hidden group hover:border-primary ${formData.companyBanner ? 'border-primary' : 'border-gray-300 dark:border-gray-700'}`}
               >
                   {formData.companyBanner ? (
                       <img src={formData.companyBanner} alt="Banner" className="w-full h-full object-cover" />
                   ) : (
                       <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                           <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                           <span className="text-[9px] font-black uppercase tracking-widest text-center">Banner (1200x400)</span>
                       </div>
                   )}
               </div>
               <input ref={bannerInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyBanner')} />
            </div>

            <div className="flex flex-col items-center mb-4 -mt-16 relative z-10">
               <div className="relative">
                  <div 
                      onClick={() => !isSubmitting && logoInputRef.current?.click()}
                      className={`h-32 w-32 rounded-[2rem] border-[6px] border-background-light dark:border-background-dark shadow-2xl flex items-center justify-center cursor-pointer transition-all bg-white dark:bg-surface-dark overflow-hidden group hover:scale-105 ${formData.companyLogo ? 'border-primary' : 'border-gray-300 dark:border-gray-700'}`}
                  >
                      {formData.companyLogo ? (
                          <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                          <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                              <span className="material-symbols-outlined text-2xl">apartment</span>
                              <span className="text-[9px] font-bold uppercase">Logo</span>
                          </div>
                      )}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-2xl shadow-lg border-2 border-background-dark">
                      <span className="material-symbols-outlined text-[18px] block">photo_camera</span>
                  </div>
               </div>
               <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} />
            </div>
            
            <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome da Organização</label>
                  <input 
                    className="w-full h-14 pl-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm"
                    placeholder="Ex: Transportadora CTS Global"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">TAG (Sigla)</label>
                  <input 
                    className="w-full h-14 pl-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none uppercase font-black shadow-sm"
                    placeholder="[TAG]" 
                    type="text"
                    maxLength={6}
                    required
                    disabled={isSubmitting}
                    value={formData.companyTag}
                    onChange={(e) => handleChange('companyTag', e.target.value)}
                  />
                </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Dados do Fundador</h3>
            </div>

            <div className="flex items-center gap-5 py-5 bg-primary/5 rounded-3xl px-5 border border-primary/10">
                <div 
                   onClick={() => !isSubmitting && ownerPhotoInputRef.current?.click()}
                   className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden transition-all bg-white dark:bg-surface-dark shrink-0 shadow-inner ${formData.ownerPhoto ? 'border-primary' : 'border-gray-400'}`}
                >
                   {formData.ownerPhoto ? (
                       <img src={formData.ownerPhoto} alt="Owner" className="w-full h-full object-cover" />
                   ) : (
                       <span className="material-symbols-outlined text-gray-400 text-3xl">add_a_photo</span>
                   )}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avatar Master</p>
                    <button type="button" disabled={isSubmitting} onClick={() => ownerPhotoInputRef.current?.click()} className="text-[10px] text-primary font-black uppercase tracking-widest border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">Upload</button>
                </div>
                <input ref={ownerPhotoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'ownerPhoto')} />
            </div>

            <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome Completo</label>
                  <input 
                    className="w-full h-14 pl-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm"
                    placeholder="Seu nome oficial"
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                  />
                </div>

                 <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">E-mail de Acesso</label>
                  <input 
                    className="w-full h-14 pl-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm"
                    placeholder="email@dominio.com"
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={formData.ownerEmail}
                    onChange={(e) => handleChange('ownerEmail', e.target.value)}
                  />
                </div>

                 <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Senha de Entrada</label>
                  <input 
                    className="w-full h-14 pl-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary outline-none font-bold shadow-sm"
                    placeholder="Mínimo 6 dígitos"
                    type="password"
                    required
                    disabled={isSubmitting}
                    value={formData.ownerPass}
                    onChange={(e) => handleChange('ownerPass', e.target.value)}
                  />
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-1 -mt-4">
             <button 
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${rememberMe ? 'bg-primary' : 'bg-gray-700'}`}
             >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${rememberMe ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                Lembrar meus dados para o login
             </span>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-16 bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
            ) : (
                <>
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    Ativar Infraestrutura
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
