import React, { useRef, useState } from 'react';
import { ScreenName } from '../types';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const EditProfile: React.FC<Props> = ({ onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBGXQzp7dL_b1J5KOVc0X3fEorY3rJh24-h5sDoI4Y83Rg9I2Xqh6h8iqnW3GEpgq89DoJBcFOshUKB5dhulEy6UShNlC0QknfFrjN2O9kfFw1rt_ApxZKgO9iuSHkRozD_wy8IrHPHQf2IlV7NrgLfIWGkBIS4R0pXf0dDAReNXCm0IhiQe89Qe4uuTGZ8kV1TIhUspFrel7rZXWlhvf_dKId_Yyn5IUNhEB71VEJmh4xDkF4Aqd-lVTEkQywF29k_1xPA9IPuANg');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.PROFILE)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Editar Perfil</h2>
      </div>

      <div className="flex-1 w-full max-w-[480px] mx-auto px-6 py-6">
        <form className="flex flex-col gap-6" onSubmit={(e) => { 
            e.preventDefault(); 
            alert('Perfil atualizado!');
            onNavigate(ScreenName.PROFILE); 
        }}>
          
          <div className="flex flex-col items-center">
             <div className="relative">
                <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 ring-4 ring-gray-800" 
                    style={{ backgroundImage: `url('${avatar}')` }}
                ></div>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary hover:bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-background-dark"
                >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
             </div>
             <p className="mt-3 text-sm text-gray-400">Toque no ícone para alterar a foto</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Nome de Exibição</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              defaultValue="Carlos Mendes"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">E-mail</label>
            <input 
              className="w-full h-14 pl-4 rounded-lg bg-surface-dark border border-border-dark text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              defaultValue="carlos.mendes@email.com"
              type="email"
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500">O e-mail não pode ser alterado.</p>
          </div>

          <button 
            type="submit"
            className="mt-4 w-full h-14 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};