import React from 'react';
import { useData } from '../../../contexts/DataContext';
import { UserRole, PermissionSet } from '../../../types';
import { PERMISSION_LABELS, ROLE_LABELS } from '../../../constants';
import Card from '../../ui/Card';

const SettingsTab: React.FC = () => {
    const { permissions, updatePermissions } = useData();

    // Roles that can be configured (admin role permissions are not editable)
    const configurableRoles = (Object.keys(permissions) as UserRole[]).filter(role => role !== 'admin');
    
    const handlePermissionChange = (role: UserRole, pKey: keyof PermissionSet, checked: boolean) => {
        updatePermissions(role, pKey, checked);
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Permissões por Função</h2>
                <p className="text-sm text-gray-500 mb-6">Controle o que cada função de usuário pode ver e fazer no sistema. As permissões de Administrador não podem ser alteradas.</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 min-w-[200px]">Permissão</th>
                                {configurableRoles.map(role => (
                                    <th key={role} scope="col" className="px-6 py-3 text-center">{ROLE_LABELS[role]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(Object.keys(PERMISSION_LABELS) as Array<keyof PermissionSet>).map(pKey => {
                                // Don't show the "Manage Settings" permission toggle as it's admin-only and unchangeable
                                if (pKey === 'canManageSettings') return null;

                                return (
                                <tr key={pKey} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{PERMISSION_LABELS[pKey]}</td>
                                    {configurableRoles.map(role => (
                                        <td key={`${role}-${pKey}`} className="px-6 py-4 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={permissions[role]?.[pKey] || false}
                                                    onChange={(e) => handlePermissionChange(role, pKey, e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SettingsTab;
