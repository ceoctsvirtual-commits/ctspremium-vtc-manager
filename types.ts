

export enum ScreenName {
  INTRO = 'INTRO',
  LOGIN = 'LOGIN',
  REGISTER_COMPANY = 'REGISTER_COMPANY',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  ADD_TRIP = 'ADD_TRIP',
  RANKINGS = 'RANKINGS',
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  MAP = 'MAP',
  DRIVER_ID = 'DRIVER_ID',
  CALCULATOR = 'CALCULATOR',
  TRIP_DETAILS = 'TRIP_DETAILS',
  REGISTER_DRIVER = 'REGISTER_DRIVER',
  REQUESTS = 'REQUESTS',
  SETTINGS = 'SETTINGS',
  ADMIN_PANEL = 'ADMIN_PANEL'
}

export type Permission = 
  | 'GLOBAL_ADMIN' 
  | 'MANAGE_COMPANIES' 
  | 'MANAGE_MODERATORS' 
  | 'MANAGE_ALL_DRIVERS' 
  | 'VIEW_ALL_LOGS'
  | 'OWNER_ACCESS' 
  | 'MANAGE_COMPANY_DRIVERS' 
  | 'APPROVE_COMPANY_TRIPS'
  | 'DRIVER_ACCESS' 
  | 'LOG_TRIPS' 
  | 'VIEW_PERSONAL_ID';

export interface NavItem {
  icon: string;
  label: string;
  screen: ScreenName;
}

export type OrganizationType = 'COMPANY' | 'GROUP' | 'AUTONOMOUS';
export type VehicleType = 'CAR' | 'LIGHT_TRUCK' | 'TRUCK' | 'BITRUCK' | 'RODOTREM' | 'BUS' | 'MINIBUS';

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: Permission[];
  companyId?: string;
  isSystem?: boolean;
}

export interface Company {
  id: string;
  type: OrganizationType;
  name: string;
  tag: string;
  logo: string | null;
  banner: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhoto: string | null; // Added ownerPhoto property to resolve type errors during registration
  description?: string;
  segment: string;
  platforms: string[];
  isGroup: boolean;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  avatar: string;
  roleId: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  distance: number;
  rank: number;
}

export interface BackupRankEntry {
  name: string;
  value: string | number;
  company?: string;
  category: string;
}

export interface MonthlyBackup {
  id: string;
  month: number;
  year: number;
  totalRevenue: string;
  top3: BackupRankEntry[];
  secondaryList: BackupRankEntry[];
  timestamp: string;
}

export interface SystemLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  type: 'INFO' | 'WARNING' | 'DANGER';
}

export interface Request {
    id: string;
    name: string;
    avatar: string;
    message: string;
    type: 'ENTRY' | 'OTHER' | 'CONTRACT_PROPOSAL';
    timestamp: string;
    fromId?: string;
    targetId?: string;
    details?: any;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  status: 'Aprovado' | 'Análise' | 'Rejeitado';
  value: string;
  date: string;
  truck: string;
  cargo: string;
  distance: number;
  weight: string;
  platform: 'ETS2' | 'ATS' | string;
  driverName?: string;
  driverAvatar?: string;
}

export const PLATFORMS_LIST = ["ETS2", "ATS", "WTDS", "WBDS", "GTO", "TOE3", "JOB'S"];
export const SEGMENTS_LIST = ["Truck", "Bus", "Misto"];
