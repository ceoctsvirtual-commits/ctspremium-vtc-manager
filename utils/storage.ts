
import { Company, Driver, Role, SystemLog, Trip, Request } from '../types';

export interface AppSettings {
  notifications: boolean;
  theme: 'dark' | 'light';
  language: 'pt-BR' | 'en-US' | 'es-ES';
}

export interface AppData {
  // Current User Session Data
  companyName: string;
  companyTag: string;
  companyLogo: string | null;
  companyBanner: string | null;
  organizationType: 'COMPANY' | 'GROUP' | 'AUTONOMOUS';
  segment: string;
  platforms: string[];
  isGroup: boolean;
  groupName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPass: string;
  ownerPhoto: string | null;
  settings: AppSettings;
  
  // Global "Database" Tables
  dbCompanies: Company[];
  dbDrivers: Driver[];
  dbRoles: Role[];
  dbLogs: SystemLog[];
  dbTrips: Trip[];
  dbRequests: Request[];
}

const STORAGE_KEY = 'vtc_manager_db_v5'; // Version bumped
const SYNC_CHANNEL = 'vtc_global_sync_channel';

// Setup Broadcast Channel for Real-time Sync (Tab-to-Tab)
const channel = new BroadcastChannel(SYNC_CHANNEL);
const listeners = new Set<(data: AppData) => void>();

channel.onmessage = (event) => {
    if (event.data === 'update') {
        const newData = StorageService.getData();
        listeners.forEach(listener => listener(newData));
    }
};

// --- MOCK GLOBAL DATA FOR SIMULATION ---
const MOCK_COMPANIES: Company[] = [
  { id: '1', type: 'COMPANY', name: "TransGlobal VTC", tag: "TGL", logo: null, banner: null, ownerName: "CEO CTS Virtual", ownerEmail: "ceo@tgl.com", description: "Maior VTC do Brasil", segment: "Truck", platforms: ["ETS2", "ATS"], isGroup: false },
  { id: '2', type: 'GROUP', name: "Logística Brasil Group", tag: "LBR", logo: null, banner: null, ownerName: "Roberto Carlos", ownerEmail: "roberto@lbr.com", description: "Focada em cargas pesadas", segment: "Misto", platforms: ["ETS2"], isGroup: true },
  { id: '3', type: 'AUTONOMOUS', name: "Euro King (Autônomo)", tag: "EUK", logo: null, banner: null, ownerName: "Ana Julia", ownerEmail: "ana@euk.com", description: "Reis da Europa", segment: "Truck", platforms: ["ETS2"], isGroup: false },
];

const MOCK_DRIVERS: Driver[] = [
  { id: '101', name: 'João Silva', email: 'joao@tgl.com', companyId: '1', companyName: 'TransGlobal VTC', avatar: '', role: 'Motorista', status: 'Ativo', distance: 15000, rank: 1 },
  { id: '102', name: 'Pedro Santos', email: 'pedro@lbr.com', companyId: '2', companyName: 'Logística Brasil', avatar: '', role: 'Iniciante', status: 'Ativo', distance: 500, rank: 5 },
  { id: '103', name: 'Marcos Paulo', email: 'marcos@tgl.com', companyId: '1', companyName: 'TransGlobal VTC', avatar: '', role: 'Elite', status: 'Ativo', distance: 32000, rank: 2 },
  { id: '104', name: 'Julia Roberts', email: 'julia@lbr.com', companyId: '2', companyName: 'Logística Brasil', avatar: '', role: 'Gerente', status: 'Ativo', distance: 45000, rank: 3 },
];

const MOCK_ROLES: Role[] = [
  { id: 'r1', name: 'Super Admin', color: '#ef4444', permissions: ['all'], companyId: undefined },
  { id: 'r2', name: 'Moderador Global', color: '#f59e0b', permissions: ['manage_drivers'], companyId: undefined },
  { id: 'r3', name: 'Gerente de Frota', color: '#3b82f6', permissions: ['manage_fleet'], companyId: '1' },
];

const MOCK_REQUESTS: Request[] = [
    { id: 'req1', name: 'Felipe Santos', avatar: 'https://placehold.co/100x100/333/FFF?text=F', message: 'Solicitou entrada na empresa', type: 'ENTRY', timestamp: new Date().toISOString() },
];

const GLOBAL_CITIES = ['Berlin', 'Paris', 'London', 'Madrid', 'Lisbon', 'Rome', 'Warsaw', 'Amsterdam'];
const GLOBAL_CARGO = ['Eletrônicos', 'Combustível', 'Maquinário', 'Alimentos', 'Madeira', 'Aço'];

const DEFAULT_DATA: AppData = {
  companyName: "TransGlobal VTC",
  companyTag: "TGL",
  companyLogo: null,
  companyBanner: null,
  organizationType: 'COMPANY',
  segment: "Truck",
  platforms: ["ETS2", "ATS"],
  isGroup: false,
  groupName: "",
  ownerName: "CEO CTS Virtual",
  ownerEmail: "ceoctsvirtual@gmail.com",
  ownerPass: "admin123456",
  ownerPhoto: null,
  settings: {
    notifications: true,
    theme: 'dark',
    language: 'pt-BR'
  },
  dbCompanies: MOCK_COMPANIES,
  dbDrivers: MOCK_DRIVERS,
  dbRoles: MOCK_ROLES,
  dbLogs: [
    { id: 'l1', action: 'Sistema Iniciado', details: 'Conexão Global Estabelecida.', timestamp: new Date().toISOString(), user: 'System', type: 'INFO' }
  ],
  dbTrips: [],
  dbRequests: MOCK_REQUESTS
};

// Simulation State
let simulationInterval: any = null;

export const StorageService = {
  subscribe: (listener: (data: AppData) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify: () => {
    const data = StorageService.getData();
    listeners.forEach(listener => listener(data));
    channel.postMessage('update'); 
  },

  getData: (): AppData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { 
          ...DEFAULT_DATA, 
          ...parsed,
          dbCompanies: parsed.dbCompanies || DEFAULT_DATA.dbCompanies,
          dbDrivers: parsed.dbDrivers || DEFAULT_DATA.dbDrivers,
          dbRoles: parsed.dbRoles || DEFAULT_DATA.dbRoles,
          dbLogs: parsed.dbLogs || DEFAULT_DATA.dbLogs,
          dbTrips: parsed.dbTrips || DEFAULT_DATA.dbTrips,
          dbRequests: parsed.dbRequests || DEFAULT_DATA.dbRequests,
        };
      }
    } catch (e) {
      console.error("Erro ao carregar dados", e);
    }
    return DEFAULT_DATA;
  },

  saveData: (data: Partial<AppData>) => {
    try {
      const current = StorageService.getData();
      const newData = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      StorageService.notify();
      return newData;
    } catch (e) {
      console.error("Erro ao salvar dados", e);
      return null;
    }
  },

  // --- SIMULATION ENGINE ---
  startSimulation: () => {
    if (simulationInterval) return;
    
    console.log("Starting Global VTC Network Simulation...");
    
    // Run simulation events every 8 seconds
    simulationInterval = setInterval(() => {
        const data = StorageService.getData();
        const randomAction = Math.random();

        // 60% chance: New Global Trip logged
        if (randomAction < 0.6) {
            const randomDriver = data.dbDrivers[Math.floor(Math.random() * data.dbDrivers.length)];
            const origin = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
            const dest = GLOBAL_CITIES[Math.floor(Math.random() * GLOBAL_CITIES.length)];
            
            if (origin !== dest) {
                const newTrip: Trip = {
                    id: Date.now().toString(),
                    origin: origin,
                    destination: dest,
                    distance: (Math.random() * 2000 + 100).toFixed(0),
                    value: (Math.random() * 5000 + 500).toFixed(2),
                    weight: (Math.random() * 25 + 5).toFixed(1),
                    cargo: GLOBAL_CARGO[Math.floor(Math.random() * GLOBAL_CARGO.length)],
                    platform: Math.random() > 0.5 ? 'ETS2' : 'ATS',
                    status: 'Aprovado',
                    date: new Date().toISOString(),
                    truck: 'Simulated Truck',
                    driverName: randomDriver.name,
                    driverAvatar: randomDriver.avatar
                };

                // Add to Global Fleet History
                const updatedTrips = [newTrip, ...data.dbTrips].slice(0, 50); // Keep last 50
                StorageService.saveData({ dbTrips: updatedTrips });
                
                // Update driver stats
                const updatedDrivers = data.dbDrivers.map(d => {
                    if (d.id === randomDriver.id) {
                        return { ...d, distance: d.distance + parseInt(newTrip.distance) };
                    }
                    return d;
                }).sort((a, b) => b.distance - a.distance); // Re-rank based on new distance
                
                StorageService.saveData({ dbDrivers: updatedDrivers });
            }
        } 
        // 20% chance: New System Log
        else if (randomAction < 0.8) {
             StorageService.addLog('Atualização de Frota', 'Sincronização global concluída com sucesso.', 'INFO');
        }
        // 5% chance: New Entry Request (Simulating growth)
        else if (randomAction > 0.95 && data.dbRequests.length < 5) {
            const names = ['Carlos D.', 'Amanda W.', 'Steve Rogers', 'Lara Croft'];
            const name = names[Math.floor(Math.random() * names.length)];
            StorageService.addRequest({
                name: name,
                avatar: `https://placehold.co/100x100/333/FFF?text=${name.charAt(0)}`,
                message: 'Gostaria de participar da empresa.',
                type: 'ENTRY',
                timestamp: new Date().toISOString()
            });
            StorageService.addLog('Nova Solicitação', `${name} solicitou entrada.`, 'WARNING');
        }

    }, 8000); 
  },

  // --- Global DB Methods ---

  addLog: (action: string, details: string, type: 'INFO' | 'WARNING' | 'DANGER' = 'INFO') => {
    const data = StorageService.getData();
    const newLog: SystemLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: data.ownerName,
      type
    };
    StorageService.saveData({ dbLogs: [newLog, ...data.dbLogs].slice(0, 50) });
  },

  createCompany: (companyData: Omit<Company, 'id'>) => {
    const data = StorageService.getData();
    const newCompany: Company = {
      id: Date.now().toString(),
      ...companyData
    };
    StorageService.saveData({ dbCompanies: [...data.dbCompanies, newCompany] });
    StorageService.addLog('Empresa Criada', `Nova organização ${companyData.name} registrada.`, 'INFO');
    return newCompany;
  },

  updateCompany: (id: string, updates: Partial<Company>) => {
    const data = StorageService.getData();
    const newCompanies = data.dbCompanies.map(c => c.id === id ? { ...c, ...updates } : c);
    StorageService.saveData({ dbCompanies: newCompanies });
    StorageService.addLog('Empresa Editada', `Dados da empresa ID ${id} atualizados.`, 'INFO');
    return newCompanies;
  },

  deleteCompany: (id: string) => {
    const data = StorageService.getData();
    const company = data.dbCompanies.find(c => c.id === id);
    const newCompanies = data.dbCompanies.filter(c => c.id !== id);
    const newDrivers = data.dbDrivers.filter(d => d.companyId !== id);
    
    StorageService.saveData({ dbCompanies: newCompanies, dbDrivers: newDrivers });
    StorageService.addLog('Empresa Excluída', `Empresa ${company?.name} removida.`, 'DANGER');
    return newCompanies;
  },

  updateDriver: (id: string, updates: Partial<Driver>) => {
      const data = StorageService.getData();
      const newDrivers = data.dbDrivers.map(d => d.id === id ? { ...d, ...updates } : d);
      StorageService.saveData({ dbDrivers: newDrivers });
      StorageService.addLog('Motorista Editado', `Dados do motorista ID ${id} atualizados.`, 'INFO');
      return newDrivers;
  },

  deleteDriver: (id: string) => {
    const data = StorageService.getData();
    const driver = data.dbDrivers.find(d => d.id === id);
    const newDrivers = data.dbDrivers.filter(d => d.id !== id);
    StorageService.saveData({ dbDrivers: newDrivers });
    StorageService.addLog('Motorista Removido', `Motorista ${driver?.name} removido.`, 'WARNING');
    return newDrivers;
  },

  updateDriverRole: (driverId: string, roleName: string) => {
    const data = StorageService.getData();
    const driver = data.dbDrivers.find(d => d.id === driverId);
    if (!driver) return;

    const newDrivers = data.dbDrivers.map(d => 
        d.id === driverId ? { ...d, role: roleName } : d
    );
    
    StorageService.saveData({ dbDrivers: newDrivers });
    StorageService.addLog('Cargo Alterado', `Motorista ${driver.name} agora é ${roleName}.`, 'INFO');
    return newDrivers;
  },

  addRole: (name: string, color: string, companyId?: string) => {
    const data = StorageService.getData();
    const newRole: Role = {
      id: Date.now().toString(),
      name,
      color,
      permissions: [],
      companyId: companyId
    };
    StorageService.saveData({ dbRoles: [...data.dbRoles, newRole] });
    StorageService.addLog('Cargo Criado', `Novo cargo ${name} adicionado.`, 'INFO');
    return [...data.dbRoles, newRole];
  },

  deleteRole: (id: string) => {
     const data = StorageService.getData();
     const newRoles = data.dbRoles.filter(r => r.id !== id);
     StorageService.saveData({ dbRoles: newRoles });
     StorageService.addLog('Cargo Removido', `Cargo ID ${id} removido.`, 'WARNING');
     return newRoles;
  },

  addTrip: (tripData: Omit<Trip, 'id'>) => {
      const data = StorageService.getData();
      const newTrip: Trip = {
          id: Date.now().toString(),
          ...tripData
      };
      StorageService.saveData({ dbTrips: [newTrip, ...data.dbTrips] });
      StorageService.addLog('Nova Viagem', `Viagem de ${tripData.origin} para ${tripData.destination} registrada.`, 'INFO');
      return newTrip;
  },

  removeRequest: (id: string) => {
      const data = StorageService.getData();
      const newRequests = data.dbRequests.filter(r => r.id !== id);
      StorageService.saveData({ dbRequests: newRequests });
      return newRequests;
  },

  addRequest: (request: Omit<Request, 'id'>) => {
      const data = StorageService.getData();
      const newReq: Request = {
          id: Date.now().toString(),
          ...request
      };
      StorageService.saveData({ dbRequests: [newReq, ...data.dbRequests] });
      // Don't log if it's the simulation, already logged there
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
};
