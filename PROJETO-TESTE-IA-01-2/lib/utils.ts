import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Employee } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
};

export const getUserInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
}

export const getEmployeeName = (employeeId: number, employees: Employee[]): string => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Desconhecido';
};