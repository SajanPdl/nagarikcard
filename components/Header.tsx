import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
    NepalFlagIcon, MenuIcon, XIcon, GlobeIcon, WalletIcon, 
    BriefcaseIcon, UserIcon, BellIcon, SparklesIcon, LogOutIcon, 
    MessageSquareIcon, SathiAiIcon, MapPinIcon 
} from './icons';
import { CitizenPage } from '../types';

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


const Dropdown: React.FC<{ trigger: React.ReactNode, children: React.ReactNode }> = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user, profile, view, citizenPage } = state;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleNav = (targetView: 'landing' | 'citizen' | 'admin' | 'kiosk' | 'login') => {
        dispatch({ type: 'SET_VIEW', payload: targetView });
        setIsMenuOpen(false);
    };
    
    const handleCitizenNav = (page: CitizenPage) => {
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: page });
        setIsMenuOpen(false);
    };
    
    const NavLink: React.FC<{ 
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        isMobile?: boolean;
    }> = ({ onClick, isActive, children, isMobile }) => (
      <button 
        onClick={onClick} 
        className={`${
            isMobile
              ? 'block px-3 py-2 rounded-md text-base font-medium w-full text-left'
              : 'px-3 py-2 rounded-md text-sm font-medium'
            } ${
            isActive 
            ? 'bg-gray-100 text-[#003893]' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {children}
      </button>
    );

    const DropdownItem: React.FC<{
        onClick: () => void;
        children: React.ReactNode;
        icon: React.ElementType;
    }> = ({ onClick, children, icon: Icon }) => (
        <button onClick={onClick} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left">
            <Icon className="w-5 h-5 mr-3 text-gray-500"/>
            {children}
        </button>
    );

    const renderCitizenNav = (isMobile = false) => (
        <>
            <NavLink isMobile={isMobile} onClick={() => handleCitizenNav('dashboard')} isActive={citizenPage === 'dashboard'}>Dashboard</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleCitizenNav('service-catalog')} isActive={citizenPage === 'service-catalog'}>Services</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleCitizenNav('nagarik-wallet')} isActive={citizenPage === 'nagarik-wallet'}>Wallet</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleNav('kiosk')}>Kiosk</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleCitizenNav('help')} isActive={citizenPage === 'help'}>Help</NavLink>
        </>
    );

    const renderAdminNav = (isMobile = false) => (
        <>
             <NavLink isMobile={isMobile} onClick={() => {}} isActive={true}>Dashboard</NavLink>
        </>
    );
    
    const renderLoggedOutNav = (isMobile = false) => (
        <>
            <NavLink isMobile={isMobile} onClick={() => handleNav('citizen')}>Citizen</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleNav('admin')}>Admin</NavLink>
            <NavLink isMobile={isMobile} onClick={() => handleNav('kiosk')}>Kiosk</NavLink>
        </>
    );

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav(profile ? profile.role : 'landing')}>
            <NepalFlagIcon className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-gray-800">GovFlow</h1>
          </div>
          
            <>
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-1">
                 {user && profile?.role === 'citizen' && renderCitizenNav()}
                 {user && profile?.role === 'admin' && renderAdminNav()}
                 {!user && view === 'landing' && renderLoggedOutNav()}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                 {user && profile ? (
                     <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100"><BellIcon className="w-5 h-5"/></button>
                         <Dropdown 
                            trigger={
                                <button className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm ring-2 ring-offset-2 ring-transparent hover:ring-[#003893] transition">
                                    {profile.name.charAt(0)}
                                </button>
                            }
                        >
                             <div className="px-4 py-3 border-b">
                                <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                                <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                            </div>
                            <div className="py-1">
                                <DropdownItem onClick={() => handleCitizenNav('dashboard')} icon={BriefcaseIcon}>Dashboard</DropdownItem>
                                <DropdownItem onClick={() => handleCitizenNav('profile-settings')} icon={UserIcon}>Profile Settings</DropdownItem>
                                <DropdownItem onClick={() => handleCitizenNav('nagarik-wallet')} icon={WalletIcon}>Nagarik Wallet</DropdownItem>
                            </div>
                            <div className="py-1 border-t">
                                <DropdownItem onClick={() => dispatch({type: 'LOGOUT'})} icon={LogOutIcon}>Logout</DropdownItem>
                            </div>
                        </Dropdown>
                     </div>
                 ) : (
                    <button onClick={() => handleNav('login')} className="bg-[#C8102E] text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-red-700 transition">
                        Login
                    </button>
                 )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                  {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
              </div>
            </>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
             {user && profile ? (
                <div className="flex flex-col space-y-1 border-t pt-4 mt-2">
                    <div className="px-3 py-2">
                        <p className="text-base font-semibold text-gray-800">{profile.name}</p>
                        <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                    </div>
                    {profile.role === 'citizen' && renderCitizenNav(true)}
                    {profile.role === 'admin' && renderAdminNav(true)}
                    <div className="border-t pt-2 mt-2">
                         <NavLink isMobile={true} onClick={() => handleCitizenNav('profile-settings')}>Profile Settings</NavLink>
                         <button onClick={() => { dispatch({ type: 'LOGOUT' }); setIsMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-red-600 hover:bg-red-50">
                             Logout
                         </button>
                    </div>
                </div>
                 ) : (
                    <div className="flex flex-col space-y-1 border-t pt-4 mt-2">
                       {renderLoggedOutNav(true)}
                        <div className="mt-4">
                           <button onClick={() => handleNav('login')} className="w-full bg-[#C8102E] text-white font-bold py-3 px-5 rounded-lg shadow-md hover:bg-red-700 transition">
                                Login / Register
                            </button>
                        </div>
                    </div>
                 )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;