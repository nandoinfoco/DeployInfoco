import { Employee, Task, FinanceData, Permissions, PermissionSet, UserRole } from './types';

export const DEFAULT_EMPLOYEES: Employee[] = [
    {
        id: 1,
        name: 'Fernando Luiz',
        position: 'Coordenador Operacional',
        department: 'Técnico',
        email: 'fernando@infoco.com'
    },
    {
        id: 2,
        name: 'Wendel Infoco',
        position: 'Suporte Técnico',
        department: 'Suporte',
        email: 'wendel@gmail.com'
    },
    {
        id: 3,
        name: 'Uilber Aragão',
        position: 'Diretor Executivo',
        department: 'SEO',
        email: 'uilber@gmail.com'
    },
    {
        id: 4,
        name: 'Ana Costa',
        position: 'Analista Financeiro',
        department: 'Financeiro',
        email: 'ana.costa@infoco.com'
    },
     {
        id: 5,
        name: 'Carlos Silva',
        position: 'Advogado',
        department: 'Jurídico',
        email: 'carlos.silva@infoco.com'
    }
];

export const DEFAULT_TASKS: Task[] = [
    {
        id: 1,
        employeeId: 1,
        title: 'Análise de ARPs e Contratos',
        description: 'Revisar e analisar processos administrativos pendentes',
        date: '2025-07-08',
        hours: 8,
        status: 'Concluída'
    },
    {
        id: 2,
        employeeId: 2,
        title: 'Suporte Sistema',
        description: 'Atendimento a chamados técnicos do sistema',
        date: '2025-07-09',
        hours: 6,
        status: 'Em Andamento'
    },
    {
        id: 3,
        employeeId: 3,
        title: 'Verificação de Processos Internos',
        description: 'Direção da Infoco',
        date: '2025-07-09',
        hours: 4,
        status: 'Pendente'
    },
    {
        id: 4,
        employeeId: 4,
        title: 'Relatório de Fechamento Mensal',
        description: 'Compilar dados financeiros para o relatório de Junho.',
        date: '2025-07-10',
        hours: 7.5,
        status: 'Em Andamento'
    },
     {
        id: 5,
        employeeId: 5,
        title: 'Análise de Contrato - Cliente X',
        description: 'Revisar cláusulas do novo contrato com o Cliente X.',
        date: '2025-07-11',
        hours: 5,
        status: 'Pendente'
    },
];

export const DEPARTMENTS = [
  "Administrativo", "Financeiro", "Recursos Humanos", "Tecnologia", "Jurídico", "Técnico", "Suporte", "SEO"
];

export const DEFAULT_FINANCE_DATA: FinanceData[] = [
    { id: 1, municipality: "ALMADINA", paid: 150000, pending: 25000 },
    { id: 2, municipality: "NOVA VIÇOSA", paid: 120000, pending: 45000 },
    { id: 3, municipality: "CACULÉ", paid: 95000, pending: 10000 },
    { id: 4, municipality: "MASCOTE", paid: 80000, pending: 30000 },
    { id: 5, municipality: "ITAQUARA", paid: 180000, pending: 5000 },
    { id: 6, municipality: "TEIXEIRA DE FREITAS", paid: 110000, pending: 12000 },
];

export const DEFAULT_PERMISSIONS: Permissions = {
  admin: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManageTasks: true,
    canManageFinance: true,
    canViewReports: true,
    canManageSettings: true,
  },
  director: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManageTasks: true,
    canManageFinance: true,
    canViewReports: true,
    canManageSettings: false,
  },
  coordinator: {
    canViewDashboard: true,
    canManageEmployees: true,
    canManageTasks: true,
    canManageFinance: false,
    canViewReports: true,
    canManageSettings: false,
  },
  support: {
    canViewDashboard: true,
    canManageEmployees: false,
    canManageTasks: true,
    canManageFinance: false,
    canViewReports: false,
    canManageSettings: false,
  },
};


export const PERMISSION_LABELS: Record<keyof PermissionSet, string> = {
    canViewDashboard: "Visualizar Dashboard",
    canManageEmployees: "Gerenciar Funcionários",
    canManageTasks: "Gerenciar Tarefas",
    canManageFinance: "Gerenciar Financeiro e Municípios",
    canViewReports: "Visualizar Relatórios",
    canManageSettings: "Acessar Configurações",
};

export const ROLE_LABELS: Record<UserRole, string> = {
    admin: "Administrador",
    director: "Diretor",
    coordinator: "Coordenador",
    support: "Suporte"
};
