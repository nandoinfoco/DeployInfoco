
import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Employee, Task, FinanceData, Permissions, PermissionSet, UserRole } from '../types';
import { DEFAULT_EMPLOYEES, DEFAULT_TASKS, DEFAULT_FINANCE_DATA, DEFAULT_PERMISSIONS } from '../constants';
import { generateId } from '../lib/utils';

interface DataContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: number) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;

  financeData: FinanceData[];
  addMunicipality: (municipality: Omit<FinanceData, 'id'>) => void;
  updateMunicipality: (municipality: FinanceData) => void;
  deleteMunicipality: (municipalityId: number) => void;

  permissions: Permissions;
  updatePermissions: (role: UserRole, permissionKey: keyof PermissionSet, value: boolean) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('infoco_employees', DEFAULT_EMPLOYEES);
  const [tasks, setTasks] = useLocalStorage<Task[]>('infoco_tasks', DEFAULT_TASKS);
  const [financeData, setFinanceData] = useLocalStorage<FinanceData[]>('infoco_finance', DEFAULT_FINANCE_DATA);
  const [permissions, setPermissions] = useLocalStorage<Permissions>('infoco_permissions', DEFAULT_PERMISSIONS);


  // Employee CRUD
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...employee, id: generateId() }]);
  };
  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  };
  const deleteEmployee = (employeeId: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  };

  // Task CRUD
  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: generateId() }]);
  };
  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  const deleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Municipality CRUD
  const addMunicipality = (municipality: Omit<FinanceData, 'id'>) => {
    setFinanceData(prev => [...prev, { ...municipality, id: generateId() }]);
  };
  const updateMunicipality = (updatedMunicipality: FinanceData) => {
    setFinanceData(prev => prev.map(m => m.id === updatedMunicipality.id ? updatedMunicipality : m));
  };
  const deleteMunicipality = (municipalityId: number) => {
    setFinanceData(prev => prev.filter(m => m.id !== municipalityId));
  };

  // Permissions CRUD
  const updatePermissions = (role: UserRole, permissionKey: keyof PermissionSet, value: boolean) => {
    setPermissions(prev => ({
        ...prev,
        [role]: {
            ...prev[role],
            [permissionKey]: value,
        }
    }));
  };


  const value = {
    employees, addEmployee, updateEmployee, deleteEmployee,
    tasks, addTask, updateTask, deleteTask,
    financeData, addMunicipality, updateMunicipality, deleteMunicipality,
    permissions, updatePermissions
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
