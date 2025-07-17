
export type UserRole = 'admin' | 'coordinator' | 'support' | 'director';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  department: string;
  pfp?: string;
}

export interface PermissionSet {
    canViewDashboard: boolean;
    canManageEmployees: boolean;
    canManageTasks: boolean;
    canManageFinance: boolean; // Controls both Finance and Municipalities
    canViewReports: boolean;
    canManageSettings: boolean; // Admin only
}

export interface Permissions {
    [role: string]: PermissionSet;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
}

export type TaskStatus = 'Concluída' | 'Em Andamento' | 'Pendente';

export interface Task {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  date: string;
  hours: number;
  status: TaskStatus;
}

export interface FinanceData {
    id: number;
    municipality: string;
    paid: number;
    pending: number;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}