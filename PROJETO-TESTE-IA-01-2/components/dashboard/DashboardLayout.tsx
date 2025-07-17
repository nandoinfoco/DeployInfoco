
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

import Sidebar from './Sidebar';
import Header from './Header';
import DashboardTab from './tabs/DashboardTab';
import EmployeesTab from './tabs/EmployeesTab';
import TasksTab from './tabs/TasksTab';
import FinanceTab from './tabs/FinanceTab';
import ReportsTab from './tabs/ReportsTab';
import MunicipalitiesTab from './tabs/MunicipalitiesTab';
import SettingsTab from './tabs/SettingsTab';
import AiAssistant from '../ai/AiAssistant';
import { Bot } from 'lucide-react';
import { PermissionSet } from '../../types';

const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  
  const authContext = useContext(AuthContext);
  const { permissions } = useData();
  const user = authContext?.user;
  const userPermissions = user ? permissions[user.role] : null;

  useEffect(() => {
    if (!userPermissions) return;

    const tabPermissionMap: Record<string, keyof PermissionSet> = {
        dashboard: 'canViewDashboard',
        employees: 'canManageEmployees',
        tasks: 'canManageTasks',
        finance: 'canManageFinance',
        municipalities: 'canManageFinance',
        reports: 'canViewReports',
        settings: 'canManageSettings',
    };
    
    const currentTabPermission = tabPermissionMap[activeTab];

    if (currentTabPermission && !userPermissions[currentTabPermission]) {
        setActiveTab('dashboard');
    }
  }, [activeTab, userPermissions]);

  const renderContent = () => {
    if (!userPermissions) return <div className="p-6">Carregando permissões...</div>;

    const tabs: Record<string, { component: React.ReactNode, permission: keyof PermissionSet }> = {
        dashboard: { component: <DashboardTab setActiveTab={setActiveTab} />, permission: 'canViewDashboard' },
        employees: { component: <EmployeesTab />, permission: 'canManageEmployees' },
        tasks: { component: <TasksTab />, permission: 'canManageTasks' },
        finance: { component: <FinanceTab />, permission: 'canManageFinance' },
        municipalities: { component: <MunicipalitiesTab />, permission: 'canManageFinance' },
        reports: { component: <ReportsTab />, permission: 'canViewReports' },
        settings: { component: <SettingsTab />, permission: 'canManageSettings' },
    }
    
    const currentTabInfo = tabs[activeTab];

    if(currentTabInfo && userPermissions[currentTabInfo.permission]) {
        return currentTabInfo.component;
    }
    
    // Fallback to dashboard if something goes wrong or access is denied
    return <DashboardTab setActiveTab={setActiveTab} />;
  };

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    employees: 'Gerenciar Funcionários',
    tasks: 'Gerenciar Tarefas',
    finance: 'Balanço Financeiro',
    municipalities: 'Gerenciar Municípios',
    reports: 'Relatórios e Análises',
    settings: 'Configurações Gerais'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitles[activeTab]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <button 
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-40"
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
      </button>

      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
