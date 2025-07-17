
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, ListChecks, DollarSign, BarChart2, Building, Landmark, SlidersHorizontal } from 'lucide-react';
import { PermissionSet } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems: Array<{ id: string; label: string; icon: React.ElementType; permission: keyof PermissionSet; }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'canViewDashboard' },
  { id: 'employees', label: 'Funcionários', icon: Users, permission: 'canManageEmployees' },
  { id: 'tasks', label: 'Tarefas', icon: ListChecks, permission: 'canManageTasks' },
  { id: 'finance', label: 'Financeiro', icon: DollarSign, permission: 'canManageFinance' },
  { id: 'municipalities', label: 'Municípios', icon: Landmark, permission: 'canManageFinance' },
  { id: 'reports', label: 'Relatórios', icon: BarChart2, permission: 'canViewReports' },
  { id: 'settings', label: 'Configurações Gerais', icon: SlidersHorizontal, permission: 'canManageSettings' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const authContext = useContext(AuthContext);
  const { permissions } = useData();
  const userRole = authContext?.user?.role;

  const userPermissions = userRole ? permissions[userRole] : null;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shrink-0">
      <div className="h-20 flex items-center justify-center border-b border-gray-700/50">
          <div className="flex items-center gap-3">
              <Building className="text-blue-400" size={28}/>
              <h1 className="text-2xl font-bold">INFOCO</h1>
          </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          if (userPermissions && userPermissions[item.permission]) {
            return (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === item.id
                    ? 'bg-blue-600/30 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </a>
            )
          }
          return null;
        })}
      </nav>
      <div className="p-4 border-t border-gray-700/50 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Infoco
      </div>
    </aside>
  );
};

export default Sidebar;
