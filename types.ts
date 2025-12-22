
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

export interface NavItem {
  icon: string;
  label: string;
  screen: ScreenName;
}

export type OrganizationType = 'COMPANY' | 'GROUP' | 'AUTONOMOUS';

export interface Company {
  id: string;
  type: OrganizationType; // New field
  name: string;
  tag: string;
  logo: string | null;
  banner: string | null; // New field
  ownerName: string;
  ownerEmail: string;
  description?: string;
  segment: string;
  platforms: string[];
  isGroup: boolean; // Deprecated in favor of type, kept for compatibility if needed
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  avatar: string;
  role: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  distance: number;
  rank: number;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
  companyId?: string;
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
    type: 'ENTRY' | 'OTHER';
    timestamp: string;
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
  distance: string;
  weight: string;
  platform: 'ETS2' | 'ATS' | string;
  driverName?: string;
  driverAvatar?: string;
}

export const PLATFORMS_LIST = ["ETS2", "ATS", "WTDS", "WBDS", "GTO", "TOE3", "JOB'S"];
export const SEGMENTS_LIST = ["Truck", "Bus", "Misto"];
