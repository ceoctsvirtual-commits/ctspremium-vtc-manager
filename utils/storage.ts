
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

const getCachedData = (): AppData | null => {
    const raw = localStorage.getItem('cts_app_cache');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
};

const INITIAL_DATA: AppData = getCachedData() || {
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
  ownerEmail: localStorage.getItem('vtc_remember_email') || "",
  ownerPass: localStorage.getItem('vtc_remember_pass') || "",
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
    localStorage.setItem('cts_app_cache', JSON.stringify(internalData));
    listeners.forEach(listener => listener({ ...internalData }));
  },

  getData: (): AppData => ({ ...internalData }),

  setError: (error: string | null) => {
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
    localStorage.removeItem('vtc_user_email');
  },

  initRealtime: () => {
    try {
        supabase.channel('global').on('postgres_changes', { event: '*', schema: 'public' }, () => {
            StorageService.fetchRemoteData();
        }).subscribe();
    } catch (e) { console.warn("Realtime Offline"); }
  },

  fetchRemoteData: async () => {
    try {
      const queries = [
        supabase.from('companies').select('*'),
        supabase.from('drivers').select('*'),
        supabase.from('trips').select('*').order('date', { ascending: false }),
        supabase.from('requests').select('*'),
        supabase.from('roles').select('*'),
        supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(30)
      ];

      const results = await Promise.allSettled(queries);

      results.forEach((res, i) => {
        if (res.status === 'fulfilled' && res.value.data) {
          const data = res.value.data;
          if (i === 0) internalData.dbCompanies = data.map((c: any) => ({ ...c, ownerEmail: c.owner_email, ownerName: c.owner_name, ownerPhoto: c.owner_photo }));
          if (i === 1) internalData.dbDrivers = data.map((d: any) => ({ ...d, companyId: d.company_id, companyName: d.company_name, roleId: d.role_id }));
          if (i === 2) internalData.dbTrips = data.map((t: any) => ({ ...t, driverName: t.driver_name, driverAvatar: t.driver_avatar }));
          if (i === 3) internalData.dbRequests = data;
          if (i === 4) internalData.dbRoles = data;
          // Fix: Mapping user_email database column to user property in UI
          if (i === 5) internalData.dbLogs = data.map((l: any) => ({ ...l, user: l.user_email }));
        }
      });

      const email = localStorage.getItem('vtc_user_email') || internalData.ownerEmail;
      if (email) {
          const me = internalData.dbDrivers.find(d => d.email.toLowerCase() === email.toLowerCase());
          if (me) {
              internalData.currentUserEmail = email;
              internalData.ownerName = me.name;
              internalData.ownerPhoto = me.avatar;
              const myComp = internalData.dbCompanies.find(c => c.id === me.companyId);
              if (myComp) {
                  internalData.companyName = myComp.name;
                  internalData.companyTag = myComp.tag;
                  internalData.companyLogo = myComp.logo || SYSTEM_LOGO;
              }
          }
      }

      StorageService.setError(null);
      StorageService.notify();
    } catch (e) {
      console.warn("Sync falhou, usando cache.");
    }
  },

  login: async (email: string, pass: string): Promise<boolean> => {
      try {
          const { data, error } = await supabase.from('drivers').select('*').eq('email', email.toLowerCase().trim()).eq('password', pass).maybeSingle();
          if (data && !error) {
              localStorage.setItem('vtc_user_email', email.toLowerCase().trim());
              await StorageService.fetchRemoteData();
              return true;
          }
      } catch (e) { console.error(e); }
      return false;
  },

  logout: () => {
    StorageService.clearRememberedCredentials();
    internalData = { ...INITIAL_DATA, currentUserEmail: "" };
    StorageService.notify();
  },

  // Fix: Added missing createCompany method
  createCompany: async (c: any) => {
    const companyId = 'CMP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const driverId = 'DRV-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const { error: cErr } = await supabase.from('companies').insert([{
      id: companyId,
      name: c.name,
      tag: c.tag,
      logo: c.logo,
      banner: c.banner,
      owner_name: c.ownerName,
      owner_email: c.ownerEmail.toLowerCase().trim(),
      owner_photo: c.ownerPhoto,
      type: c.type,
      platforms: c.platforms,
      segment: c.segment,
      is_group: c.isGroup,
      description: c.description
    }]);
    if (cErr) throw cErr;

    const { error: dErr } = await supabase.from('drivers').insert([{
      id: driverId,
      name: c.ownerName,
      email: c.ownerEmail.toLowerCase().trim(),
      password: c.ownerPass,
      company_id: companyId,
      company_name: c.name,
      avatar: c.ownerPhoto,
      role_id: 'role-owner',
      status: 'Ativo',
      distance: 0,
      rank: 0
    }]);
    if (dErr) throw dErr;

    localStorage.setItem('vtc_user_email', c.ownerEmail.toLowerCase().trim());
    await StorageService.fetchRemoteData();
  },

  addTrip: async (trip: any) => {
      const id = 'TRP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await supabase.from('trips').insert([{ ...trip, id }]);
      await StorageService.fetchRemoteData();
  },

  deleteTrip: async (id: string) => {
      await supabase.from('trips').delete().eq('id', id);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing addRequest method
  addRequest: async (req: any) => {
      const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await supabase.from('requests').insert([{ ...req, id }]);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing removeRequest method
  removeRequest: async (id: string) => {
      await supabase.from('requests').delete().eq('id', id);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing approveRequest method
  approveRequest: async (req: Request) => {
      if (req.type === 'ENTRY' && req.details) {
        const details = req.details;
        const driverId = 'DRV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await supabase.from('drivers').insert([{
          id: driverId,
          name: req.name,
          email: details.email.toLowerCase().trim(),
          password: details.password,
          company_id: details.companyId,
          company_name: details.companyName,
          avatar: req.avatar,
          role_id: 'role-driver',
          status: 'Ativo',
          distance: 0,
          rank: 0
        }]);
      }
      await supabase.from('requests').delete().eq('id', req.id);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing sendContractProposal method
  sendContractProposal: async (target: Company, split: number) => {
      const id = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const me = internalData.dbDrivers.find(d => d.email === internalData.currentUserEmail);
      await supabase.from('requests').insert([{
        id,
        name: internalData.companyName,
        avatar: internalData.companyLogo,
        message: `Proposta de contrato B2B: Divisão ${split}% / ${100 - split}%`,
        type: 'CONTRACT_PROPOSAL',
        timestamp: new Date().toISOString(),
        from_id: me?.companyId,
        target_id: target.id,
        details: { split, senderName: internalData.companyName }
      }]);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing addRole method
  addRole: async (role: any) => {
      const id = 'ROL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await supabase.from('roles').insert([{ ...role, id }]);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing updateRole method
  updateRole: async (id: string, updates: any) => {
      await supabase.from('roles').update(updates).eq('id', id);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing deleteRole method
  deleteRole: async (id: string) => {
      await supabase.from('roles').delete().eq('id', id);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing assignRole method
  assignRole: async (driverId: string, roleId: string) => {
      await supabase.from('drivers').update({ role_id: roleId }).eq('id', driverId);
      await StorageService.fetchRemoteData();
  },

  // Fix: Added missing addLog method
  addLog: async (action: string, details: string, type: 'INFO' | 'WARNING' | 'DANGER') => {
      const id = 'LOG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await supabase.from('logs').insert([{
        id,
        action,
        details,
        type,
        timestamp: new Date().toISOString(),
        user_email: internalData.currentUserEmail || 'Sistema'
      }]);
      await StorageService.fetchRemoteData();
  },

  saveData: (updates: Partial<AppData>) => {
      internalData = { ...internalData, ...updates };
      StorageService.notify();
      return internalData;
  },

  hasPermission: (permission: Permission): boolean => {
      const email = internalData.currentUserEmail.toLowerCase();
      if (email === 'ceoctsvirtual@gmail.com') return true;
      const me = internalData.dbDrivers.find(d => d.email.toLowerCase() === email);
      if (!me) return false;
      const role = internalData.dbRoles.find(r => r.id === me.roleId);
      return role?.permissions.includes(permission) || me.roleId === 'role-owner';
  },

  calculateDistance: (o: string, d: string) => (o.length + d.length) * 45,
  getCargoWeight: (c: string) => (LOGISTICS_DB.CARGO_WEIGHTS as any)[c],
  fileToBase64: (f: File): Promise<string> => new Promise((res, rej) => {
      const r = new FileReader(); r.readAsDataURL(f);
      r.onload = () => res(r.result as string); r.onerror = e => rej(e);
  })
};

export const LOGISTICS_DB = {
    CITIES: ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Berlin', 'Paris', 'London', 'Madrid', 'Roma'],
    CARGO_WEIGHTS: { 'Eletrônicos': 12, 'Maquinário': 25, 'Alimentos': 18, 'Químicos': 22, 'Veículos': 30 }
};
