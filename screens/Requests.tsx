
import React, { useState, useEffect } from 'react';
import { ScreenName, Request } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

export const Requests: React.FC<Props> = ({ onNavigate }) => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    // Initial load
    const data = StorageService.getData();
    setRequests(data.dbRequests);
    
    // Subscribe
    const unsubscribe = StorageService.subscribe((newData) => {
        setRequests(newData.dbRequests);
    });
    
    return () => unsubscribe();
  }, []);

  const handleAction = (id: string, action: 'approved' | 'rejected', name: string) => {
      // Remove from list via StorageService
      StorageService.removeRequest(id);
      
      // Feedback
      if (action === 'approved') {
          StorageService.addLog('Solicitação Aprovada', `Motorista ${name} aprovado na empresa.`, 'INFO');
          // In a real app, this would also add the driver to dbDrivers
          alert(`Motorista ${name} APROVADO com sucesso!`);
      } else {
          StorageService.addLog('Solicitação Rejeitada', `Solicitação de ${name} recusada.`, 'WARNING');
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <div className="sticky top-0 z-20 flex items-center bg-background-dark p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full active:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Solicitações</h2>
      </div>

      <div className="flex-1 w-full px-4 py-4">
        <div className="flex flex-col gap-4">
            {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p>Nenhuma solicitação pendente.</p>
                </div>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="bg-surface-dark border border-gray-800 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url('${req.avatar}')` }}></div>
                            <div>
                                <h3 className="font-bold text-white">{req.name}</h3>
                                <p className="text-xs text-gray-400">{req.message}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{new Date(req.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleAction(req.id, 'rejected', req.name)}
                                className="flex-1 h-10 rounded-lg border border-gray-600 text-gray-300 font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors"
                            >
                                Rejeitar
                            </button>
                            <button 
                                onClick={() => handleAction(req.id, 'approved', req.name)}
                                className="flex-1 h-10 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover active:bg-blue-700 transition-colors shadow-lg shadow-primary/20"
                            >
                                Aprovar
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
