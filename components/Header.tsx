import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { NepalFlagIcon, MenuIcon, XIcon } from './icons';

interface HeaderProps {
    showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showNav = false }) => {
    const { state: { user, profile }, dispatch } = useContext(AppContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const NavLink: React.FC<{ view: 'citizen' | 'admin' | 'kiosk', children: React.ReactNode }> = ({ view, children }) => (
      <button 
        onClick={() => {
          dispatch({ type: 'SET_VIEW', payload: view });
          setIsMenuOpen(false);
        }} 
        className="text-base font-medium text-gray-600 hover:text-[#003893] w-full text-left py-2 px-3 rounded-md hover:bg-gray-100"
      >
        {children}
      </button>
    );

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => dispatch({ type: 'SET_VIEW', payload: profile ? profile.role : 'landing' })}>
            <NepalFlagIcon className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-gray-800">Nagarik Card</h1>
          </div>
          {showNav && (
            <>
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-4">
                 {user && profile ? (
                     <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Welcome, {profile.name}</span>
                        <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
                     </div>
                 ) : (
                    <>
                        <NavLink view="citizen">Citizen</NavLink>
                        <NavLink view="admin">Admin</NavLink>
                        <NavLink view="kiosk">Kiosk</NavLink>
                    </>
                 )}
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                  {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && showNav && (
          <div className="md:hidden pb-4">
             {user && profile ? (
                     <div className="flex flex-col space-y-2 border-t pt-4">
                        <span className="text-sm font-medium text-gray-700 px-3 py-2">Welcome, {profile.name}</span>
                        <button onClick={() => { dispatch({ type: 'LOGOUT' }); setIsMenuOpen(false); }} className="text-base font-medium text-gray-600 hover:text-[#C51E3A] w-full text-left py-2 px-3 rounded-md hover:bg-gray-100">Logout</button>
                     </div>
                 ) : (
                    <div className="flex flex-col space-y-1">
                        <NavLink view="citizen">Citizen Portal</NavLink>
                        <NavLink view="admin">Admin Portal</NavLink>
                        <NavLink view="kiosk">Kiosk Portal</NavLink>
                    </div>
                 )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;