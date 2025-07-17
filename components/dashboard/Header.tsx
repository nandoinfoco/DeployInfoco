
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserInitials } from '../../lib/utils';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import ProfileModal from './ProfileModal';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const confirmLogout = () => {
    authContext?.logout();
    setLogoutModalOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user?.pfp ? (
                        <img src={user.pfp} alt="User profile" className="w-full h-full object-cover" />
                    ) : (
                        <span>{user ? getUserInitials(user.name) : 'U'}</span>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800 text-left">{user?.name}</p>
                    <p className="text-xs text-gray-500 text-left">{user?.email}</p>
                </div>
                <ChevronDown size={20} className={cn("text-gray-500 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                    <button onClick={() => { setProfileModalOpen(true); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User size={16} className="mr-2"/>
                        Alterar Foto
                    </button>
                    <button onClick={() => { setLogoutModalOpen(true); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                       <LogOut size={16} className="mr-2"/>
                        Sair
                    </button>
                </div>
            )}
        </div>
      </div>
       <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      <DeleteConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?"
      />
       <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </header>
  );
};

export default Header;