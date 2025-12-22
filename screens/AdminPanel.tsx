
import React, { useState, useEffect, useRef } from 'react';
import { ScreenName, Company, Driver, Role, SystemLog, SEGMENTS_LIST } from '../types';
import { StorageService } from '../utils/storage';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

type AdminTab = 'OVERVIEW' | 'COMPANIES' | 'DRIVERS' | 'ROLES' | 'LOGS';

export const AdminPanel: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  // --- Create/Edit Role States ---
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#3b82f6');
  const [targetCompanyId, setTargetCompanyId] = useState<string>('GLOBAL');

  // --- Assign Role States ---
  const [assignDriverId, setAssignDriverId] = useState('');
  const [assignRoleName, setAssignRoleName] = useState('');

  // --- Create/Edit Company States ---
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const [newCompName, setNewCompName] = useState('');
  const [newCompTag, setNewCompTag] = useState('');
  const [newCompOwner, setNewCompOwner] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompDesc, setNewCompDesc] = useState('');
  const [newCompSegment, setNewCompSegment] = useState('Truck');
  const [newCompLogo, setNewCompLogo] = useState<string | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- Edit Driver States (New) ---
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  
  const [drvName, setDrvName] = useState('');
  const [drvEmail, setDrvEmail] = useState('');
  const [drvCompanyId, setDrvCompanyId] = useState('');
  const [drvStatus, setDrvStatus] = useState<'Ativo' | 'Inativo' | 'Pendente'>('Ativo');
  const [drvRole, setDrvRole] = useState('');

  const refreshData = () => {
    const data = StorageService.getData();
    setCompanies(data.dbCompanies);
    setDrivers(data.dbDrivers);
    setRoles(data.dbRoles);
    setLogs(data.dbLogs);
  };

  useEffect(() => {
    refreshData();
    // Subscribe to real-time changes
    const unsubscribe = StorageService.subscribe(() => {
        refreshData();
    });
    return () => unsubscribe();
  }, []);

  // --- Helper: Image Upload ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const base64 = await StorageService.fileToBase64(e.target.files[0]);
            setNewCompLogo(base64);
        } catch (err) {
            alert('Erro ao carregar imagem');
        }
    }
  };

  // --- Company Actions ---
  const openCreateCompanyModal = () => {
    setEditingCompanyId(null);
    setNewCompName('');
    setNewCompTag('');
    setNewCompOwner('');
    setNewCompEmail('');
    setNewCompDesc('');
    setNewCompSegment('Truck');
    setNewCompLogo(null);
    setShowCompanyModal(true);
  };

  const openEditCompanyModal = (company: Company) => {
    setEditingCompanyId(company.id);
    setNewCompName(company.name);
    setNewCompTag(company.tag);
    setNewCompOwner(company.ownerName);
    setNewCompEmail(company.ownerEmail);
    setNewCompDesc(company.description || '');
    setNewCompSegment(company.segment);
    setNewCompLogo(company.logo);
    setShowCompanyModal(true);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompanyId) {
        StorageService.updateCompany(editingCompanyId, {
            name: newCompName,
            tag: newCompTag.toUpperCase(),
            ownerName: newCompOwner,
            ownerEmail: newCompEmail,
            description: newCompDesc,
            segment: newCompSegment,
            logo: newCompLogo
        });
        alert('Empresa atualizada com sucesso!');
    } else {
        StorageService.createCompany({
            type: 'COMPANY',
            name: newCompName,
            tag: newCompTag.toUpperCase(),
            ownerName: newCompOwner,
            ownerEmail: newCompEmail,
            description: newCompDesc,
            segment: newCompSegment,
            platforms: ['ETS2'],
            isGroup: false,
            logo: newCompLogo,
            banner: null
        });
        alert('Empresa criada com sucesso!');
    }
    setShowCompanyModal(false);
    refreshData();
  };

  const handleDeleteCompany = (id: string) => {
    if (window.confirm('ATENÇÃO: Excluir esta empresa removerá todos os seus motoristas e dados. Continuar?')) {
      const newList = StorageService.deleteCompany(id);
      setCompanies(newList); // Force update state immediately
      refreshData();
    }
  };

  // --- Driver Actions ---
  const handleDeleteDriver = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este motorista do sistema?')) {
      const newList = StorageService.deleteDriver(id);
      setDrivers(newList); // Force update state immediately
      refreshData();
    }
  };

  const openEditDriverModal = (driver: Driver) => {
    setEditingDriverId(driver.id);
    setDrvName(driver.name);
    setDrvEmail(driver.email);
    setDrvCompanyId(driver.companyId);
    setDrvStatus(driver.status);
    setDrvRole(driver.role);
    setShowDriverModal(true);
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingDriverId) {
          // Find company name for the ID
          const comp = companies.find(c => c.id === drvCompanyId);
          const compName = comp ? comp.name : 'Desconhecida';

          StorageService.updateDriver(editingDriverId, {
              name: drvName,
              email: drvEmail,
              companyId: drvCompanyId,
              companyName: compName,
              status: drvStatus,
              role: drvRole
          });
          alert('Motorista atualizado!');
          setShowDriverModal(false);
          refreshData();
      }
  };

  // --- Role Actions ---
  const handleAddRole = () => {
    if (!newRoleName) return;
    const companyId = targetCompanyId === 'GLOBAL' ? undefined : targetCompanyId;
    
    StorageService.addRole(newRoleName, newRoleColor, companyId);
    
    setNewRoleName('');
    alert('Cargo criado com sucesso!');
  };

  const handleDeleteRole = (id: string) => {
    if(window.confirm('Excluir este cargo?')) {
        StorageService.deleteRole(id);
        refreshData();
    }
  };

  const handleAssignRole = () => {
      if (!assignDriverId || !assignRoleName) {
          alert('Selecione um motorista e um cargo.');
          return;
      }
      StorageService.updateDriverRole(assignDriverId, assignRoleName);
      alert('Cargo atribuído com sucesso!');
      setAssignDriverId('');
      setAssignRoleName('');
      refreshData();
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Ativo': return 'text-green-500 bg-green-500/10';
          case 'Inativo': return 'text-red-500 bg-red-500/10';
          default: return 'text-yellow-500 bg-yellow-500/10';
      }
  };

  const getCompanyName = (id?: string) => {
      if (!id) return 'Sistema Global';
      const comp = companies.find(c => c.id === id);
      return comp ? comp.name : 'Desconhecida';
  };

  const getTypeBadge = (type: string) => {
      switch(type) {
          case 'GROUP': return <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold ml-1">Grupo</span>;
          case 'AUTONOMOUS': return <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold ml-1">Autônomo</span>;
          default: return <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-bold ml-1">Empresa</span>;
      }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-white dark:bg-background-dark p-4 border-b border-gray-200 dark:border-gray-800 safe-area-top shadow-sm">
        <button onClick={() => onNavigate(ScreenName.DASHBOARD)} className="text-gray-600 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h2 className="text-lg font-bold leading-tight">Super Admin</h2>
          <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Painel Global</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark/50">
          {[
              { id: 'OVERVIEW', icon: 'dashboard', label: 'Visão Geral' },
              { id: 'COMPANIES', icon: 'domain', label: 'Empresas' },
              { id: 'DRIVERS', icon: 'group', label: 'Motoristas' },
              { id: 'ROLES', icon: 'badge', label: 'Cargos' },
              { id: 'LOGS', icon: 'terminal', label: 'Logs' },
          ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'border-primary text-primary font-bold bg-primary/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  <span className="text-xs uppercase tracking-wide">{tab.label}</span>
              </button>
          ))}
      </div>

      <div className="flex-1 w-full p-4 overflow-y-auto pb-24">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Empresas</p>
                        <p className="text-3xl font-bold text-blue-500">{companies.length}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Motoristas</p>
                        <p className="text-3xl font-bold text-green-500">{drivers.length}</p>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#253045] dark:to-[#1a2332] p-6 rounded-xl border border-gray-700 text-white">
                    <h3 className="text-lg font-bold mb-2">Bem-vindo, Administrador</h3>
                    <p className="text-sm text-gray-300 opacity-80">
                        Você tem permissão total para editar qualquer empresa, gerenciar todos os motoristas e visualizar logs do sistema.
                    </p>
                </div>

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-2">Ações Rápidas</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setActiveTab('COMPANIES'); openCreateCompanyModal(); }} className="p-3 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:border-primary transition-colors">
                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><span className="material-symbols-outlined">add_business</span></div>
                        <span className="text-sm font-semibold">Nova Empresa</span>
                    </button>
                    <button onClick={() => onNavigate(ScreenName.REGISTER_DRIVER)} className="p-3 bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-3 hover:border-primary transition-colors">
                        <div className="p-2 bg-green-500/10 rounded-full text-green-500"><span className="material-symbols-outlined">person_add</span></div>
                        <span className="text-sm font-semibold">Novo Motorista</span>
                    </button>
                </div>
            </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'COMPANIES' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold uppercase text-gray-500">Empresas Registradas</h3>
                    <button 
                        onClick={openCreateCompanyModal}
                        className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">add</span> Criar Nova
                    </button>
                </div>
                
                {showCompanyModal && (
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg mb-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="material-symbols-outlined text-primary">{editingCompanyId ? 'edit' : 'domain_add'}</span>
                            {editingCompanyId ? 'Editar Empresa' : 'Registrar Nova Empresa'}
                        </h3>
                        <form onSubmit={handleCompanySubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div 
                                    onClick={() => logoInputRef.current?.click()}
                                    className="size-20 rounded-full bg-gray-100 dark:bg-black/40 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden"
                                >
                                    {newCompLogo ? (
                                        <img src={newCompLogo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-400">add_photo_alternate</span>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-500">Logo da Empresa</span>
                                <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Nome da Empresa" required className="input-field" value={newCompName} onChange={e => setNewCompName(e.target.value)} />
                                <input type="text" placeholder="TAG (Sigla)" required maxLength={6} className="input-field uppercase" value={newCompTag} onChange={e => setNewCompTag(e.target.value)} />
                            </div>
                            <input type="text" placeholder="Nome do Dono (Owner)" required className="input-field" value={newCompOwner} onChange={e => setNewCompOwner(e.target.value)} />
                            <input type="email" placeholder="E-mail do Dono (Login)" required className="input-field" value={newCompEmail} onChange={e => setNewCompEmail(e.target.value)} />
                            <textarea placeholder="Descrição / Informações Adicionais" className="input-field h-20 pt-2" value={newCompDesc} onChange={e => setNewCompDesc(e.target.value)} />
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Segmento</label>
                                <div className="flex gap-2">
                                    {SEGMENTS_LIST.map(s => (
                                        <button key={s} type="button" onClick={() => setNewCompSegment(s)} className={`px-3 py-1 rounded text-xs border ${newCompSegment === s ? 'bg-primary border-primary text-white' : 'border-gray-600 text-gray-400'}`}>{s}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button type="button" onClick={() => setShowCompanyModal(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-600">
                                    {editingCompanyId ? 'Salvar Alterações' : 'Criar Empresa'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-3">
                    {companies.map(company => (
                        <div key={company.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 shrink-0 overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{company.tag.substring(0,2)}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate flex items-center">
                                        {company.name} 
                                        <span className="text-xs text-primary bg-primary/10 px-1.5 rounded ml-1">{company.tag}</span>
                                        {getTypeBadge(company.type)}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">Dono: {company.ownerName}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{company.ownerEmail}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditCompanyModal(company)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-gray-100 dark:bg-gray-800 rounded-lg" title="Editar">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button onClick={() => handleDeleteCompany(company.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-800 rounded-lg" title="Excluir">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                            {company.description && (
                                <div className="text-xs text-gray-500 bg-gray-50 dark:bg-black/20 p-2 rounded border border-gray-200 dark:border-gray-800/50 mt-1">
                                    {company.description}
                                </div>
                            )}
                        </div>
                    ))}
                    {companies.length === 0 && (
                        <div className="text-center p-6 text-gray-500">Nenhuma empresa encontrada.</div>
                    )}
                </div>
            </div>
        )}

        {/* DRIVERS TAB */}
        {activeTab === 'DRIVERS' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold uppercase text-gray-500">Todos os Motoristas</h3>
                    <button 
                        onClick={() => onNavigate(ScreenName.REGISTER_DRIVER)}
                        className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-sm">add</span> Adicionar
                    </button>
                </div>

                {/* EDIT DRIVER MODAL */}
                {showDriverModal && (
                    <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg mb-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="material-symbols-outlined text-primary">edit_note</span>
                            Editar Motorista
                        </h3>
                        <form onSubmit={handleDriverSubmit} className="flex flex-col gap-3">
                            <input type="text" placeholder="Nome Completo" required className="input-field" value={drvName} onChange={e => setDrvName(e.target.value)} />
                            <input type="email" placeholder="E-mail" required className="input-field" value={drvEmail} onChange={e => setDrvEmail(e.target.value)} />
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">Empresa</label>
                                <select className="input-field" value={drvCompanyId} onChange={e => setDrvCompanyId(e.target.value)}>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">Status</label>
                                    <select className="input-field" value={drvStatus} onChange={e => setDrvStatus(e.target.value as any)}>
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                        <option value="Pendente">Pendente</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-500">Cargo</label>
                                    <select className="input-field" value={drvRole} onChange={e => setDrvRole(e.target.value)}>
                                        <option value="Motorista">Motorista</option>
                                        <option value="Iniciante">Iniciante</option>
                                        <option value="Elite">Elite</option>
                                        <option value="Instrutor">Instrutor</option>
                                        <option value="Gerente">Gerente</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button type="button" onClick={() => setShowDriverModal(false)} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-blue-600">
                                    Salvar Dados
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {drivers.map((driver, idx) => (
                        <div key={driver.id} className={`p-4 flex items-center justify-between ${idx !== drivers.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                                    {driver.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{driver.name}</p>
                                    <p className="text-xs text-gray-500">{driver.companyName} • <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(driver.status)}`}>{driver.status}</span></p>
                                    <p className="text-[10px] text-primary">{driver.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditDriverModal(driver)} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500" title="Editar">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => handleDeleteDriver(driver.id)} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500" title="Excluir">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {drivers.length === 0 && (
                        <div className="text-center p-6 text-gray-500">Nenhum motorista encontrado.</div>
                    )}
                </div>
            </div>
        )}

        {/* ROLES TAB */}
        {activeTab === 'ROLES' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Create Role */}
                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">security</span>
                        1. Criar Definição de Cargo
                    </h3>
                    <div className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            placeholder="Nome do Cargo (ex: Moderador)" 
                            className="input-field"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-500 font-bold ml-1">Contexto do Cargo</label>
                            <div className="relative">
                                <select 
                                    className="input-field appearance-none"
                                    value={targetCompanyId}
                                    onChange={(e) => setTargetCompanyId(e.target.value)}
                                >
                                    <option value="GLOBAL">🌐 Sistema Global (Admin)</option>
                                    <option disabled>──────────</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>🏢 {c.name} ({c.tag})</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center justify-between border border-gray-200 dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-black/20">
                            <span className="text-xs text-gray-500">Cor da Tag</span>
                            <input 
                                type="color" 
                                value={newRoleColor}
                                onChange={(e) => setNewRoleColor(e.target.value)}
                                className="h-8 w-14 rounded cursor-pointer bg-transparent border-none"
                            />
                        </div>

                        <button 
                            onClick={handleAddRole} 
                            className="w-full h-10 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors mt-2"
                        >
                            Criar Definição
                        </button>
                    </div>
                </div>

                {/* Assign Role to Person */}
                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm border-l-4 border-l-emerald-500">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500">assignment_ind</span>
                        2. Atribuir Cargo a Membro
                    </h3>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs text-gray-500 font-bold ml-1">Selecione o Motorista</label>
                            <div className="relative">
                                <select 
                                    className="input-field appearance-none"
                                    value={assignDriverId}
                                    onChange={(e) => setAssignDriverId(e.target.value)}
                                >
                                    <option value="">-- Escolha um Motorista --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.companyName})</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 font-bold ml-1">Selecione o Cargo (Role)</label>
                            <div className="relative">
                                <select 
                                    className="input-field appearance-none"
                                    value={assignRoleName}
                                    onChange={(e) => setAssignRoleName(e.target.value)}
                                >
                                    <option value="">-- Escolha um Cargo --</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.name}>{r.name} ({r.companyId ? 'Local' : 'Global'})</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleAssignRole} 
                            className="w-full h-10 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors mt-2"
                        >
                            Atribuir e Salvar
                        </button>
                    </div>
                </div>

                {/* List Roles */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1">Definições de Cargos Existentes</h3>
                    <div className="space-y-2">
                        {roles.map(role => (
                            <div key={role.id} className="flex items-center justify-between bg-white dark:bg-surface-dark p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="size-4 rounded-full shadow-sm" style={{ backgroundColor: role.color }}></div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{role.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">
                                            {role.companyId ? `Local: ${getCompanyName(role.companyId)}` : 'Global / Sistema'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteRole(role.id)} className="text-gray-400 hover:text-red-500">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'LOGS' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold uppercase text-gray-500">Logs do Sistema</h3>
                    <span className="text-xs text-gray-400">{logs.length} Registros</span>
                </div>

                <div className="bg-black/20 rounded-xl overflow-hidden font-mono text-xs border border-white/5">
                    {logs.map((log) => (
                        <div key={log.id} className="p-3 border-b border-white/5 flex gap-3 hover:bg-white/5 transition-colors">
                            <div className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${
                                log.type === 'DANGER' ? 'bg-red-500' : 
                                log.type === 'WARNING' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                                <div className="flex justify-between text-gray-400 mb-0.5">
                                    <span className="font-bold text-gray-300">{log.action}</span>
                                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-gray-500">{log.details}</p>
                                <p className="text-gray-600 mt-1 italic">User: {log.user}</p>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="p-8 text-center text-gray-500">Nenhum log registrado ainda.</div>
                    )}
                </div>
             </div>
        )}

      </div>
      
      {/* Helper styles injected */}
      <style>{`
        .input-field {
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border-radius: 8px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            color: #111827;
            outline: none;
        }
        .dark .input-field {
            background-color: #101622;
            border-color: #374151;
            color: white;
        }
        .dark .input-field:focus {
            border-color: #135bec;
        }
      `}</style>
    </div>
  );
};
