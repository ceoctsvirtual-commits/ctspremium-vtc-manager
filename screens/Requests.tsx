
import React, { useState, useEffect } from 'react';
import { ScreenName, Request } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Requests: React.FC<Props> = ({ onNavigate }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = StorageService.getData();
    setRequests(data.dbRequests);
    
    const unsubscribe = StorageService.subscribe((newData) => {
        setRequests(newData.dbRequests);
    });
    
    return () => { unsubscribe(); };
  }, []);

  const handleAction = async (req: Request, action: 'approved' | 'rejected') => {
      setLoading(true);
      try {
          if (action === 'approved') {
              await StorageService.approveRequest(req);
              await StorageService.addLog(
                  req.type === 'CONTRACT_PROPOSAL' ? 'Contrato Aceito' : 'Solicitação Aprovada', 
                  `${req.name} agora é um membro ativo.`, 
                  'INFO'
              );
              alert(`${req.name} foi aprovado com sucesso! Agora ele já pode logar.`);
          } else {
              await StorageService.removeRequest(req.id);
              await StorageService.addLog('Solicitação Rejeitada', `A solicitação de ${req.name} foi recusada.`, 'WARNING');
          }
      } catch (err) {
          console.error(err);
          alert("Erro ao processar no banco de dados. Tente novamente.");
      } finally {
          setLoading(false);
      }
  };

  const getBadge = (type: string) => {
      if (type === 'CONTRACT_PROPOSAL') {
          return <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase ml-2">CONTRATO B2B</span>;
      }
      return <span className="text-[10px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase ml-2">ADMISSÃO</span>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark p-4 border-b border-gray-800 safe-area-top shadow-md">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Solicitações Pendentes</h2>
      </div>

      <div className="flex-1 w-full px-4 py-4">
        <div className="flex flex-col gap-4">
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-24 text-gray-600">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inbox</span>
                    <p className="font-bold uppercase tracking-widest text-xs">Caixa de entrada vazia</p>
                </div>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="bg-surface-dark border border-gray-800 rounded-2xl p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 group">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="size-14 rounded-full bg-gray-700 bg-cover bg-center shrink-0 border border-white/5 shadow-inner" style={{ backgroundImage: `url('${req.avatar}')` }}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    <h3 className="font-black text-white truncate text-base uppercase tracking-tight">{req.name}</h3>
                                    {getBadge(req.type)}
                                </div>
                                <p className="text-xs text-gray-400 mt-1 italic">"{req.message}"</p>
                                <p className="text-[9px] text-primary mt-2 font-black uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                    Enviado em: {new Date(req.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(req, 'rejected')}
                                className="flex-1 h-12 rounded-xl border border-gray-800 text-gray-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-[0.98]"
                            >
                                Recusar
                            </button>
                            <button 
                                disabled={loading}
                                onClick={() => handleAction(req, 'approved')}
                                className={`flex-[2] h-12 rounded-xl text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${req.type === 'CONTRACT_PROPOSAL' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30' : 'bg-primary hover:bg-blue-600 shadow-primary/30'}`}
                            >
                                {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : (
                                    <>
                                      <span className="material-symbols-outlined text-sm">check_circle</span>
                                      Aprovar Agora
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
