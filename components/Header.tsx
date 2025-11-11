import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { NepalFlagIcon } from './icons';

interface HeaderProps {
    showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNav = false }) => {
    const { state: { user, profile }, dispatch } = useContext(AppContext);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => dispatch({ type: 'SET_VIEW', payload: profile ? profile.role : 'landing' })}>
            <NepalFlagIcon className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-gray-800">Nagarik Card</h1>
          </div>
          {showNav && (
            <div className="flex items-center space-x-4">
                 {user && profile ? (
                     <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">Welcome, {profile.name}</span>
                        <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
                     </div>
                 ) : (
                    <>
                        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'citizen' })} className="text-sm font-medium text-gray-600 hover:text-[#003893]">Citizen</button>
                        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })} className="text-sm font-medium text-gray-600 hover:text-[#003893]">Admin</button>
                        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'kiosk' })} className="text-sm font-medium text-gray-600 hover:text-[#003893]">Kiosk</button>
                    </>
                 )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
