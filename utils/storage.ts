
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Company, Driver, Role, SystemLog, Trip, Request, MonthlyBackup, Permission, VehicleType } from '../types';

export interface AppSettings {
  notifications: boolean;
  theme: 'dark' | 'light';
  language: 'pt-BR' | 'en-US' | 'es-ES';
}

export interface AppData {
  currentUserEmail: string;
  companyName: string;
  companyTag: string;
  companyLogo: string | null;
  companyBanner: string | null;
  organizationType: 'COMPANY' | 'GROUP' | 'AUTONOMOUS';
  segment: string;
  platforms: string[];
  isGroup: boolean;
  ownerName: string;
  ownerEmail: string;
  ownerPass: string;
  ownerPhoto: string | null;
  vehicleType: VehicleType;
  settings: AppSettings;
  lastResetMonth: number;
  dbCompanies: Company[];
  dbDrivers: Driver[];
  dbRoles: Role[];
  dbLogs: SystemLog[];
  dbTrips: Trip[];
  dbRequests: Request[];
  dbBackups: MonthlyBackup[];
  lastDbError: string | null;
  isRlsError?: boolean;
}

const SUPABASE_URL = 'https://ohuabtiakwwrovvtwiqp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__y6v6Yr5nPaW1MWdqFe6pA_jB35FHx1';
const SYSTEM_LOGO = "https://i.postimg.cc/GmPhKZLG/Whats-App-Image-2025-12-22-at-10-32-42.jpg";

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const savedEmail = localStorage.getItem('vtc_remember_email') || "";
const savedPass = localStorage.getItem('vtc_remember_pass') || "";

const INITIAL_DATA: AppData = {
  currentUserEmail: localStorage.getItem('vtc_user_email') || "",
  companyName: "Legalizadora CTS",
  companyTag: "CTS",
  companyLogo: SYSTEM_LOGO,
  companyBanner: null,
  organizationType: 'COMPANY',
  segment: "Truck",
  platforms: ["ETS2", "ATS"],
  isGroup: false,
  ownerName: "Usuário",
  ownerEmail: savedEmail,
  ownerPass: savedPass,
  ownerPhoto: null,
  vehicleType: 'TRUCK',
  lastResetMonth: new Date().getMonth(),
  settings: { notifications: true, theme: 'dark', language: 'pt-BR' },
  dbCompanies: [],
  dbDrivers: [],
  dbRoles: [],
  dbLogs: [],
  dbTrips: [],
  dbRequests: [],
  dbBackups: [],
  lastDbError: null
};

let internalData: AppData = { ...INITIAL_DATA };
const listeners = new Set<(data: AppData) => void>();

export const StorageService = {
  subscribe: (listener: (data: AppData) => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  notify: () => {
    listeners.forEach(listener => listener({ ...internalData }));
  },

  getData: (): AppData => ({ ...internalData }),

  setError: (error: string | null, code?: string) => {
    internalData.lastDbError = error;
    StorageService.notify();
  },

  saveRememberedCredentials: (email: string, pass: string) => {
    localStorage.setItem('vtc_remember_email', email.toLowerCase().trim());
    localStorage.setItem('vtc_remember_pass', pass);
  },

  getRememberedCredentials: () => {
    return {
      email: localStorage.getItem('vtc_remember_email') || "",
      pass: localStorage.getItem('vtc_remember_pass') || ""
    };
  },

  clearRememberedCredentials: () => {
    localStorage.removeItem('vtc_remember_email');
    localStorage.removeItem('vtc_remember_pass');
  },

  initRealtime: () => {
    const channel = supabase.channel('db_sync');
    
    channel
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log("Supabase Realtime Trigger:", payload.table);
        StorageService.fetchRemoteData(); // Atualiza tudo para todos os 50+ usuários
      })
      .subscribe((status) => {
        console.log("Status Conexão Realtime:", status);
      });
  },

  fetchRemoteData: async () => {
    try {
      const [resComp, resDriv, resTrip, resReq, resRole, resLogs] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('drivers').select('*'),
        supabase.from('trips').select('*').order('date', { ascending: false }),
        supabase.from('requests').select('*'),
        supabase.from('roles').select('*'),
        supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(50)
      ]);

      if (resComp.data) {
        internalData.dbCompanies = resComp.data.map(c => ({
          id: c.id,
          name: c.name,
          tag: c.tag,
          logo: c.logo,
          banner: c.banner,
          ownerName: c.owner_name,
          ownerEmail: c.owner_email,
          ownerPhoto: c.owner_photo || null,
          type: c.type,
          platforms: c.platforms || [],
          segment: c.segment,
          isGroup: !!c.is_group
        }));
      }

      if (resDriv.data) {
        internalData.dbDrivers = resDriv.data.map(d => ({
          id: d.id,
          name: d.name,
          email: d.email,
          companyId: d.company_id,
          companyName: d.company_name,
          avatar: d.avatar,
          roleId: d.role_id,
          status: d.status,
          distance: Number(d.distance || 0),
          rank: Number(d.rank || 0)
        }));
      }

      const loggedEmail = localStorage.getItem('vtc_user_email') || localStorage.getItem('vtc_remember_email');
      if (loggedEmail) {
          const emailLower = loggedEmail.toLowerCase().trim();
          const userDriver = internalData.dbDrivers.find(d => d.email.toLowerCase() === emailLower);
          
          if (userDriver) {
              internalData.currentUserEmail = emailLower;
              internalData.ownerName = userDriver.name;
              internalData.ownerPhoto = userDriver.avatar;
              
              const userCompany = internalData.dbCompanies.find(c => c.ownerEmail.toLowerCase() === emailLower);
              if (userCompany) {
                  internalData.companyName = userCompany.name;
                  internalData.companyTag = userCompany.tag;
                  internalData.companyLogo = userCompany.logo || SYSTEM_LOGO;
                  internalData.companyBanner = userCompany.banner;
              }
          }
      }

      if (resTrip.data) {
        internalData.dbTrips = resTrip.data.map(t => ({
          id: t.id,
          origin: t.origin,
          destination: t.destination,
          distance: Number(t.distance || 0),
          value: t.value,
          date: t.date,
          status: t.status,
          platform: t.platform,
          driverName: t.driver_name,
          driverAvatar: t.driver_avatar,
          cargo: t.cargo,
          weight: t.weight,
          truck: t.truck
        }));
      }

      if (resReq.data) {
          internalData.dbRequests = resReq.data;
      }

      if (resRole.data) {
          internalData.dbRoles = resRole.data;
      }

      if (resLogs.data) {
          internalData.dbLogs = resLogs.data.map(l => ({
              id: l.id,
              action: l.action,
              details: l.details,
              timestamp: l.timestamp,
              user: l.user_email,
              type: l.type
          }));
      }

      StorageService.setError(null);
      StorageService.notify();
    } catch (e: any) {
      console.warn("Sincronização offline.");
    }
  },

  login: async (email: string, pass: string): Promise<boolean> => {
      const emailLower = email.toLowerCase().trim();
      try {
          const { data: user, error } = await supabase
            .from('drivers')
            .select('*')
            .eq('email', emailLower)
            .eq('password', pass)
            .maybeSingle();

          if (error) {
              StorageService.setError(`Erro Supabase: ${error.message}`, error.code);
              return false;
          }

          if (user) {
              localStorage.setItem('vtc_user_email', emailLower);
              const { data: company } = await supabase.from('companies').select('*').eq('owner_email', emailLower).maybeSingle();
              
              internalData.currentUserEmail = emailLower;
              internalData.ownerName = user.name;
              internalData.ownerPhoto = user.avatar;
              internalData.ownerPass = pass;
              internalData.companyName = company?.name || user.company_name;
              internalData.companyTag = company?.tag || "";
              internalData.companyLogo = company?.logo || SYSTEM_LOGO;
              
              await StorageService.fetchRemoteData();
              return true;
          }
      } catch (e: any) {
          StorageService.setError(`Falha crítica de conexão.`);
      }
      return false;
  },

  logout: () => {
    localStorage.removeItem('vtc_user_email');
    StorageService.clearRememberedCredentials();
    internalData = { ...INITIAL_DATA, currentUserEmail: "" };
    StorageService.notify();
  },

  // Fix: Added addLog method to record system actions
  addLog: async (action: string, details: string, type: 'INFO' | 'WARNING' | 'DANGER') => {
      const { error } = await supabase.from('logs').insert([{
          id: 'LOG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          action,
          details,
          type,
          timestamp: new Date().toISOString(),
          user_email: internalData.currentUserEmail || 'System'
      }]);
      if (error) console.error("Log error:", error);
      await StorageService.fetchRemoteData();
  },

  addTrip: async (tripData: Omit<Trip, 'id'>) => {
      const newTripId = 'TRP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const { error } = await supabase.from('trips').insert([{
          ...tripData,
          id: newTripId,
          distance: Number(tripData.distance)
      }]);
      if (error) throw error;
      
      const driver = internalData.dbDrivers.find(d => d.name === tripData.driverName);
      if (driver) {
          await supabase.from('drivers').update({ 
            distance: Number(driver.distance) + Number(tripData.distance) 
          }).eq('id', driver.id);
      }
      
      await StorageService.fetchRemoteData();
      return { ...tripData, id: newTripId };
  },

  // Fix: Added deleteTrip method
  deleteTrip: async (tripId: string) => {
    const { error } = await supabase.from('trips').delete().eq('id', tripId);
    if (error) throw error;
    await StorageService.fetchRemoteData();
  },

  // Fix: Added createCompany method
  createCompany: async (companyData: any) => {
      const companyId = 'CMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const driverId = 'DRV-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      const { error: companyError } = await supabase.from('companies').insert([{
          id: companyId,
          name: companyData.name,
          tag: companyData.tag,
          logo: companyData.logo,
          banner: companyData.banner,
          owner_name: companyData.ownerName,
          owner_email: companyData.ownerEmail.toLowerCase().trim(),
          owner_photo: companyData.ownerPhoto,
          type: companyData.type,
          platforms: companyData.platforms,
          segment: companyData.segment,
          is_group: companyData.isGroup,
          description: companyData.description
      }]);

      if (companyError) throw companyError;

      const { error: driverError } = await supabase.from('drivers').insert([{
          id: driverId,
          name: companyData.ownerName,
          email: companyData.ownerEmail.toLowerCase().trim(),
          password: companyData.ownerPass,
          company_id: companyId,
          company_name: companyData.name,
          avatar: companyData.ownerPhoto,
          role_id: 'role-owner',
          status: 'Ativo',
          distance: 0,
          rank: 0
      }]);

      if (driverError) throw driverError;

      await StorageService.fetchRemoteData();
      return { id: companyId };
  },

  // Fix: Added addRequest method
  addRequest: async (requestData: Omit<Request, 'id'>) => {
      const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const { error } = await supabase.from('requests').insert([{
          ...requestData,
          id
      }]);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  // Fix: Added removeRequest method
  removeRequest: async (id: string) => {
      const { error } = await supabase.from('requests').delete().eq('id', id);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  // Fix: Added approveRequest method
  approveRequest: async (req: Request) => {
      if (req.type === 'ENTRY' && req.details) {
          const driverId = 'DRV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
          const { error: driverError } = await supabase.from('drivers').insert([{
              id: driverId,
              name: req.name,
              email: req.details.email.toLowerCase().trim(),
              password: req.details.password,
              company_id: req.details.companyId,
              company_name: req.details.companyName,
              avatar: req.avatar,
              role_id: 'role-driver',
              status: 'Ativo',
              distance: 0,
              rank: 0
          }]);
          if (driverError) throw driverError;
      }
      await StorageService.removeRequest(req.id);
  },

  // Fix: Added sendContractProposal method
  sendContractProposal: async (target: Company, split: number) => {
      await StorageService.addRequest({
          name: internalData.companyName,
          avatar: internalData.companyLogo || '',
          message: `Proposta de Contrato B2B: Divisão de ${split}%/${100-split}%`,
          type: 'CONTRACT_PROPOSAL',
          timestamp: new Date().toISOString(),
          targetId: target.id,
          fromId: internalData.currentUserEmail,
          details: { split, fromCompany: internalData.companyName }
      });
  },

  // Fix: Added addRole method
  addRole: async (roleData: Omit<Role, 'id'>) => {
      const id = 'ROL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const { error } = await supabase.from('roles').insert([{
          ...roleData,
          id
      }]);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  // Fix: Added updateRole method
  updateRole: async (id: string, updates: Partial<Role>) => {
      const { error } = await supabase.from('roles').update(updates).eq('id', id);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  // Fix: Added deleteRole method
  deleteRole: async (id: string) => {
      const { error } = await supabase.from('roles').delete().eq('id', id);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  // Fix: Added assignRole method
  assignRole: async (driverId: string, roleId: string) => {
      const { error } = await supabase.from('drivers').update({ role_id: roleId }).eq('id', driverId);
      if (error) throw error;
      await StorageService.fetchRemoteData();
  },

  saveData: (updates: Partial<AppData>): AppData => {
    internalData = { ...internalData, ...updates };
    const sync = async () => {
      if (updates.ownerName || updates.ownerPhoto) {
        await supabase.from('drivers').update({
          name: updates.ownerName || internalData.ownerName,
          avatar: updates.ownerPhoto || internalData.ownerPhoto
        }).eq('email', internalData.currentUserEmail);
      }
      await StorageService.fetchRemoteData();
    };
    sync();
    StorageService.notify();
    return internalData;
  },

  hasPermission: (permission: Permission): boolean => {
      if (!internalData.currentUserEmail) return false;
      const emailLower = internalData.currentUserEmail.toLowerCase().trim();
      if (emailLower === 'ceoctsvirtual@gmail.com') return true;
      const driver = internalData.dbDrivers.find(d => d.email.toLowerCase() === emailLower);
      if (!driver) return false;
      const role = internalData.dbRoles.find(r => r.id === driver.roleId);
      if (role && role.permissions.includes(permission)) return true;
      return driver.roleId === 'role-owner' || false;
  },

  calculateDistance: (origin: string, dest: string): number => (origin.length + dest.length) * 45,
  getCargoWeight: (cargo: string): number | undefined => (LOGISTICS_DB.CARGO_WEIGHTS as Record<string, number>)[cargo],
  fileToBase64: (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
  }),
  checkMonthlyReset: () => {}
};

export const LOGISTICS_DB = {
    CITIES: ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Berlin', 'Paris', 'London', 'Madrid', 'Roma'],
    CARGO_WEIGHTS: { 'Eletrônicos': 12, 'Maquinário': 25, 'Alimentos': 18, 'Químicos': 22, 'Veículos': 30 }
};
