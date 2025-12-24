
import React, { useState, useEffect, useRef } from 'react';
import { ScreenName, Company, Driver, Role, SystemLog, MonthlyBackup, Permission } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

type AdminTab = 'OVERVIEW' | 'COMPANIES' | 'ROLES' | 'DRIVERS' | 'BACKUPS' | 'LOGS';

export const AdminPanel: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [backups, setBackups] = useState<MonthlyBackup[]>([]);

  // --- Role Modal ---
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#135bec');
  const [newRolePerms, setNewRolePerms] = useState<Permission[]>([]);

  // --- Driver Assign Modal ---
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const availablePermissions: { id: Permission; label: string; desc: string }[] = [
    { id: 'GLOBAL_ADMIN', label: 'Admin Global', desc: 'Acesso total ao sistema master' },
    { id: 'MANAGE_COMPANIES', label: 'Gerenciar VTCs', desc: 'Criar, editar e excluir empresas' },
    { id: 'MANAGE_MODERATORS', label: 'Gerenciar Cargos', desc: 'Controle de hierarquia do sistema' },
    { id: 'MANAGE_ALL_DRIVERS', label: 'Gerenciar Membros', desc: 'Controle de qualquer usuário' },
    { id: 'VIEW_ALL_LOGS', label: 'Ver Auditoria', desc: 'Visualizar logs de ações do sistema' },
    { id: 'OWNER_ACCESS', label: 'Proprietário', desc: 'Permissões de dono de transportadora' },
    { id: 'APPROVE_COMPANY_TRIPS', label: 'Aprovar Viagens', desc: 'Validar fretes lançados' },
    { id: 'DRIVER_ACCESS', label: 'Motorista', desc: 'Funções básicas de condutor' },
    { id: 'LOG_TRIPS', label: 'Lançar Viagens', desc: 'Permissão para usar o formulário' },
  ];

  const refreshData = () => {
    const data = StorageService.getData();
    setCompanies(data.dbCompanies);
    setDrivers(data.dbDrivers);
    setRoles(data.dbRoles);
    setLogs(data.dbLogs);
    setBackups(data.dbBackups);
  };

  useEffect(() => {
    refreshData();
    // Fix: Explicitly wrapping in braces to return void (Set.delete returns boolean)
    const unsubscribe = StorageService.subscribe(refreshData);
    return () => { unsubscribe(); };
  }, []);

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoleId) {
        StorageService.updateRole(editingRoleId, { name: newRoleName, color: newRoleColor, permissions: newRolePerms });
    } else {
        StorageService.addRole({ name: newRoleName, color: newRoleColor, permissions: newRolePerms });
    }
    setShowRoleModal(false);
    setEditingRoleId(null);
    setNewRoleName('');
    setNewRolePerms([]);
  };

  const handleAssignRole = (roleId: string) => {
      if (selectedDriver) {
          StorageService.assignRole(selectedDriver.id, roleId);
          setShowDriverModal(false);
          setSelectedDriver(null);
      }
  };

  const togglePermission = (perm: Permission) => {
    if (newRolePerms.includes(perm)) {
      setNewRolePerms(newRolePerms.filter(p => p !== perm));
    } else {
      setNewRolePerms([...newRolePerms, perm]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
      <header className="sticky top-0 z-20 flex items-center bg-background-dark/95 backdrop-blur-md p-4 border-b border-gray-800 safe-area-top">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-bold">Painel Global</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Gestão Master CTS PREMIUM</p>
        </div>
      </header>

      <nav className="flex overflow-x-auto no-scrollbar border-b border-gray-800 bg-surface-dark/30 shrink-0">
          {[
              { id: 'OVERVIEW', icon: 'dashboard', label: 'Resumo' },
              { id: 'ROLES', icon: 'shield_person', label: 'Cargos' },
              { id: 'DRIVERS', icon: 'group', label: 'Membros' },
              { id: 'LOGS', icon: 'list_alt', label: 'Auditoria' },
          ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary font-bold bg-primary/5' : 'border-transparent text-gray-500'}`}
              >
                  <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest">{tab.label}</span>
              </button>
          ))}
      </nav>

      <main className="flex-1 p-4 overflow-y-auto pb-24">
        
        {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-dark p-5 rounded-2xl border border-gray-800 shadow-xl">
                        <span className="material-symbols-outlined text-primary mb-2">domain</span>
                        <p className="text-2xl font-black">{companies.length}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Empresas</p>
                    </div>
                    <div className="bg-surface-dark p-5 rounded-2xl border border-gray-800 shadow-xl">
                        <span className="material-symbols-outlined text-emerald-500 mb-2">group</span>
                        <p className="text-2xl font-black">{drivers.length}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Motoristas</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/40 to-primary/20 p-6 rounded-3xl border border-primary/30">
                    <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Sessão Master Fundador</h3>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                        Controle total habilitado. Você pode delegar funções criando moderadores com cargos específicos abaixo.
                    </p>
                </div>
            </div>
        )}

        {activeTab === 'ROLES' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cargos do Sistema</h3>
                    <button 
                        onClick={() => { setShowRoleModal(true); setEditingRoleId(null); setNewRoleName(''); setNewRolePerms([]); }}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                        Novo Cargo
                    </button>
                </div>
                <div className="grid gap-3">
                    {roles.map(role => (
                        <div key={role.id} className="bg-surface-dark rounded-2xl p-4 border border-gray-800 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: role.color }}>
                                        <span className="material-symbols-outlined text-white">shield</span>
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest">{role.name}</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingRoleId(role.id); setNewRoleName(role.name); setNewRoleColor(role.color); setNewRolePerms(role.permissions); setShowRoleModal(true); }} className="text-blue-500"><span className="material-symbols-outlined">edit</span></button>
                                    {!role.isSystem && <button onClick={() => StorageService.deleteRole(role.id)} className="text-red-500"><span className="material-symbols-outlined">delete</span></button>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {role.permissions.map(p => (
                                    <span key={p} className="text-[8px] font-black uppercase bg-gray-800 text-gray-500 px-2 py-1 rounded border border-white/5">{p}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'DRIVERS' && (
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Gestão de Membros</h3>
                <div className="grid gap-3">
                    {drivers.map(driver => (
                        <div key={driver.id} className="bg-surface-dark p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-700 overflow-hidden border border-white/10 shrink-0">
                                <img src={driver.avatar || "https://placehold.co/100x100/333/FFF?text=D"} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm uppercase">{driver.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase" style={{ backgroundColor: roles.find(r => r.id === driver.roleId)?.color + '20', color: roles.find(r => r.id === driver.roleId)?.color }}>
                                        {roles.find(r => r.id === driver.roleId)?.name || 'Sem Cargo'}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedDriver(driver); setShowDriverModal(true); }} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl text-primary transition-colors">
                                <span className="material-symbols-outlined">military_tech</span>
                            </button>
                        </div>
                    ))}
                    {drivers.length === 0 && <p className="text-center py-10 text-gray-500 italic text-sm">Nenhum motorista registrado ainda.</p>}
                </div>
            </div>
        )}

        {activeTab === 'LOGS' && (
             <div className="space-y-3">
                {logs.map(log => (
                    <div key={log.id} className="p-4 bg-surface-dark rounded-xl border-l-4 border-gray-800" style={{ borderLeftColor: log.type === 'DANGER' ? '#ef4444' : log.type === 'WARNING' ? '#f59e0b' : '#135bec' }}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black uppercase text-white tracking-widest">{log.action}</span>
                            <span className="text-[9px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{log.details}"</p>
                        <p className="text-[8px] text-gray-600 mt-2 font-black uppercase">Operador: {log.user}</p>
                    </div>
                ))}
             </div>
        )}
      </main>

      {/* Role Assign Modal */}
      {showDriverModal && selectedDriver && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
              <div className="w-full max-w-sm bg-surface-card rounded-3xl border border-gray-800 p-6">
                  <h3 className="text-lg font-black uppercase mb-4">Mudar Cargo: {selectedDriver.name}</h3>
                  <div className="grid gap-2 mb-6">
                      {roles.map(role => (
                          <button key={role.id} onClick={() => handleAssignRole(role.id)} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-surface-dark hover:border-primary transition-all">
                              <span className="font-bold text-sm uppercase tracking-widest">{role.name}</span>
                              <div className="size-4 rounded-full" style={{ backgroundColor: role.color }}></div>
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowDriverModal(false)} className="w-full py-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
              </div>
          </div>
      )}

      {/* Create/Edit Role Modal */}
      {showRoleModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-surface-card rounded-3xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                  <header className="p-6 border-b border-gray-800 flex justify-between items-center">
                      <h3 className="font-black uppercase tracking-widest">{editingRoleId ? 'Editar Funções' : 'Novo Cargo Global'}</h3>
                      <button onClick={() => setShowRoleModal(false)} className="material-symbols-outlined text-gray-500">close</button>
                  </header>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Nome do Cargo</label>
                          <input className="w-full h-12 px-4 rounded-xl bg-background-dark border border-gray-800 text-white font-bold outline-none" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Ex: Moderador de Auditoria" />
                      </div>
                      <div className="space-y-4">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Permissões de Acesso</label>
                          <div className="grid gap-2">
                              {availablePermissions.map(ap => (
                                  <button key={ap.id} onClick={() => togglePermission(ap.id)} className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${newRolePerms.includes(ap.id) ? 'bg-primary/20 border-primary' : 'bg-gray-800/50 border-transparent opacity-60'}`}>
                                      <span className="material-symbols-outlined text-primary">{newRolePerms.includes(ap.id) ? 'check_circle' : 'circle'}</span>
                                      <div>
                                          <p className="text-xs font-black uppercase tracking-tight">{ap.label}</p>
                                          <p className="text-[9px] text-gray-500 mt-0.5">{ap.desc}</p>
                                      </div>
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
                  <footer className="p-6 border-t border-gray-800">
                      <button onClick={handleRoleSubmit} className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">Salvar Cargo</button>
                  </footer>
              </div>
          </div>
      )}
    </div>
  );
};
