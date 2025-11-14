import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { 
    GovFlowLogoIcon, MenuIcon, XIcon, WalletIcon, BriefcaseIcon, UserIcon, BellIcon, 
    SparklesIcon, LogOutIcon, SathiAiIcon, ChevronDownIcon, SearchIcon,
    SunIcon, MoonIcon, AccessibilityIcon, LanguagesIcon, KeyIcon,
    ContrastIcon, TypeIcon, FileTextIcon, HistoryIcon, BookOpenIcon
} from './icons';
import { CitizenPage, Notification, Language, Service, Application, FAQ } from '../types';
import { MOCK_FAQS } from '../constants';

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
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

const Dropdown: React.FC<{ trigger: React.ReactNode, children: React.ReactNode, widthClass?: string }> = ({ trigger, children, widthClass = 'w-56' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className={`absolute right-0 mt-2 ${widthClass} origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50`}>
                    {children}
                </div>
            )}
        </div>
    );
};

const Header: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user, profile, notifications, theme, language, accessibility, services, applications } = state;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ services: Service[], applications: Application[], faqs: FAQ[] }>({ services: [], applications: [], faqs: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    useClickOutside(searchRef, () => setIsSearchOpen(false));
    
    // Debounced Search Effect
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults({ services: [], applications: [], faqs: [] });
            if(isSearchOpen) setIsSearchOpen(false);
            return;
        }

        const handler = setTimeout(() => {
            const lowerQuery = searchQuery.toLowerCase();

            const foundServices = services.filter(s =>
                s.name.toLowerCase().includes(lowerQuery) ||
                s.description.toLowerCase().includes(lowerQuery)
            ).slice(0, 3);

            const foundApplications = applications.filter(app => {
                const service = services.find(s => s.id === app.serviceId);
                return app.token?.toLowerCase().includes(lowerQuery) ||
                       service?.name.toLowerCase().includes(lowerQuery);
            }).slice(0, 3);

            const foundFaqs = MOCK_FAQS.filter(faq =>
                faq.q.toLowerCase().includes(lowerQuery) ||
                faq.a.toLowerCase().includes(lowerQuery)
            ).slice(0, 3);

            setSearchResults({ services: foundServices, applications: foundApplications, faqs: foundFaqs });
            setIsSearchOpen(true);
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [searchQuery, services, applications]);

    // FIX: Expanded handleNav to accept 'government' view type for super_admin role.
    const handleNav = (targetView: 'landing' | 'citizen' | 'admin' | 'kiosk' | 'login' | 'government') => {
        dispatch({ type: 'SET_VIEW', payload: targetView });
        setIsMenuOpen(false);
    };
    
    const handleCitizenNav = (page: CitizenPage) => {
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: page });
        setIsMenuOpen(false);
    };
    
    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    // Search Result Click Handlers
    const handleSearchItemClick = () => {
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleServiceClick = (service: Service) => {
        dispatch({ type: 'SET_SELECTED_SERVICE', payload: service.id });
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'application' });
        handleSearchItemClick();
    };

    const handleApplicationClick = (app: Application) => {
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'my-applications' });
        handleSearchItemClick();
    };

    const handleFaqClick = () => {
        dispatch({ type: 'SET_CITIZEN_PAGE', payload: 'help' });
        handleSearchItemClick();
    };


    const NavLink: React.FC<{ children: React.ReactNode, onClick: () => void, isMobile?: boolean }> = ({ children, onClick, isMobile }) => (
        <button 
            onClick={onClick} 
            className={`px-3 py-2 rounded-md text-sm font-semibold ${isMobile ? 'w-full text-left' : ''} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
        >
            {children}
        </button>
    );

    const DropdownItem: React.FC<{ onClick?: () => void; children: React.ReactNode; icon: React.ElementType; }> = ({ onClick, children, icon: Icon }) => (
        <button onClick={onClick} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
            <Icon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"/>
            {children}
        </button>
    );
    
    const priorityStyles = {
        critical: 'border-red-500', high: 'border-orange-400', medium: 'border-yellow-400', low: 'border-blue-400',
    };

    const totalResults = searchResults.services.length + searchResults.applications.length + searchResults.faqs.length;

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 h-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* FIX: Mapped super_admin role to 'government' view to match handleNav type. */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav(profile ? (profile.role === 'super_admin' ? 'government' : profile.role) : 'landing')}>
                        <GovFlowLogoIcon className="h-12 w-auto" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">GovFlow</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">Unified Nepal Digital Governance</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-1">
                        <NavLink onClick={() => handleCitizenNav('dashboard')}>Home</NavLink>
                        <NavLink onClick={() => handleCitizenNav('service-catalog')}>Services</NavLink>
                        {profile?.role === 'citizen' && (
                            <>
                                <NavLink onClick={() => handleCitizenNav('nagarik-wallet')}>Nagarik Wallet</NavLink>
                                <NavLink onClick={() => handleCitizenNav('my-applications')}>Applications</NavLink>
                            </>
                        )}
                        <NavLink onClick={() => dispatch({ type: 'SET_VIEW', payload: 'notifications' })}>Announcements</NavLink>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2">
                        <div className="hidden md:block relative w-48" ref={searchRef}>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                             {isSearchOpen && totalResults > 0 && profile?.role === 'citizen' && (
                                <div className="absolute top-full mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50 p-2">
                                    {searchResults.services.length > 0 && (
                                        <div>
                                            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Services</h4>
                                            {searchResults.services.map(s => (
                                                <button key={s.id} onClick={() => handleServiceClick(s)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left">
                                                    <FileTextIcon className="w-4 h-4 mr-3 text-gray-400"/> {s.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.applications.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">My Applications</h4>
                                            {searchResults.applications.map(a => (
                                                <button key={a.id} onClick={() => handleApplicationClick(a)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left">
                                                    <HistoryIcon className="w-4 h-4 mr-3 text-gray-400"/> {services.find(s=>s.id === a.serviceId)?.name} ({a.token})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.faqs.length > 0 && (
                                        <div className="mt-2">
                                            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">FAQs</h4>
                                            {searchResults.faqs.map(faq => (
                                                <button key={faq.q} onClick={handleFaqClick} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-left">
                                                    <BookOpenIcon className="w-4 h-4 mr-3 text-gray-400"/> {faq.q}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {user && profile ? (
                            <>
                                <button onClick={() => dispatch({ type: 'TOGGLE_AI_MODAL' })} className="hidden lg:inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-3 py-2 rounded-full text-sm">
                                    <SathiAiIcon className="w-5 h-5"/> Sathi.AI
                                </button>
                                 <button onClick={() => handleNav('kiosk')} className="hidden lg:inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700/80 font-semibold px-3 py-2 rounded-full text-sm">
                                    <KeyIcon className="w-5 h-5"/> Kiosk Mode
                                </button>
                            </>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-2">
                                <button onClick={() => handleNav('login')} className="bg-transparent text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm">
                                    Login
                                </button>
                                <button onClick={() => handleNav('login')} className="bg-[#C8102E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition text-sm">
                                    Register
                                </button>
                            </div>
                        )}
                        
                        <div className="h-6 border-l border-gray-200 dark:border-gray-700 mx-1 hidden lg:block"></div>

                        <div className="flex items-center">
                            <Dropdown trigger={<button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><LanguagesIcon className="w-5 h-5"/></button>} widthClass="w-40">
                                <DropdownItem onClick={() => dispatch({type: 'SET_LANGUAGE', payload: 'en'})} icon={() => <span className='mr-3'>🇬🇧</span>}>English</DropdownItem>
                                <DropdownItem onClick={() => dispatch({type: 'SET_LANGUAGE', payload: 'np'})} icon={() => <span className='mr-3'>🇳🇵</span>}>Nepali</DropdownItem>
                            </Dropdown>
                            
                            <Dropdown trigger={<button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><AccessibilityIcon className="w-5 h-5"/></button>} widthClass="w-56">
                                <div className="p-2">
                                    <p className="px-2 py-1 text-xs font-semibold text-gray-500">Text Size</p>
                                    <div className="flex justify-around items-center p-1">
                                       <button onClick={() => dispatch({type: 'SET_FONT_SIZE', payload: 'normal'})} className={`px-3 py-1 text-sm rounded ${accessibility.fontSize === 'normal' ? 'bg-blue-100 text-blue-700' : ''}`}>A</button>
                                       <button onClick={() => dispatch({type: 'SET_FONT_SIZE', payload: 'large'})} className={`px-3 py-1 text-lg rounded ${accessibility.fontSize === 'large' ? 'bg-blue-100 text-blue-700' : ''}`}>A</button>
                                       <button onClick={() => dispatch({type: 'SET_FONT_SIZE', payload: 'xlarge'})} className={`px-3 py-1 text-xl rounded ${accessibility.fontSize === 'xlarge' ? 'bg-blue-100 text-blue-700' : ''}`}>A</button>
                                    </div>
                                </div>
                                 <div className="p-2 border-t">
                                    <p className="px-2 py-1 text-xs font-semibold text-gray-500">Contrast</p>
                                    <DropdownItem onClick={() => dispatch({type: 'SET_CONTRAST', payload: accessibility.contrast === 'high' ? 'normal' : 'high'})} icon={ContrastIcon}>
                                        High Contrast {accessibility.contrast === 'high' ? ' (On)' : ' (Off)'}
                                    </DropdownItem>
                                 </div>
                            </Dropdown>

                            <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        
                        {user && profile && (
                            <>
                                <Dropdown trigger={
                                    <button className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <BellIcon className="w-5 h-5"/>
                                        {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 bg-red-500" />}
                                    </button>
                                } widthClass="w-80">
                                    <div className="p-2">
                                        <div className="flex justify-between items-center px-2 py-1"><h4 className="font-semibold text-gray-800 dark:text-white">Notifications</h4><button onClick={() => handleCitizenNav('notifications')} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</button></div>
                                        <div className="mt-2 max-h-80 overflow-y-auto space-y-2">{notifications.slice(0, 5).map(n => (<div key={n.id} className={`p-2.5 rounded-lg border-l-4 ${priorityStyles[n.priority]} bg-gray-50 dark:bg-gray-700/50`}><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{n.title}</p><p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.body}</p></div>))}</div>
                                    </div>
                                </Dropdown>
                                <Dropdown trigger={
                                    <button className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-200 font-bold text-sm ring-2 ring-offset-2 ring-transparent hover:ring-[#003893] transition"><img className="rounded-full" src={`https://ui-avatars.com/api/?name=${profile.name.replace(' ','+')}&background=random`} alt="User avatar" /></button>
                                }>
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b dark:border-gray-700"><p className="text-sm font-semibold text-gray-800 dark:text-white">{profile.name}</p><p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.email}</p></div>
                                        <div className="py-1"><DropdownItem onClick={() => handleCitizenNav('profile-settings')} icon={UserIcon}>Profile</DropdownItem><DropdownItem onClick={() => handleCitizenNav('nagarik-wallet')} icon={WalletIcon}>My Wallet</DropdownItem><DropdownItem onClick={() => handleCitizenNav('my-applications')} icon={BriefcaseIcon}>My Applications</DropdownItem></div>
                                        <div className="py-1 border-t dark:border-gray-700"><DropdownItem onClick={() => dispatch({type: 'LOGOUT'})} icon={LogOutIcon}>Logout</DropdownItem></div>
                                    </div>
                                </Dropdown>
                            </>
                        )}
                        <div className="lg:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300"><MenuIcon className="w-6 h-6" /></button></div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-lg p-4">
                        {user ? (
                            <div className="flex flex-col space-y-2">
                                <NavLink isMobile onClick={() => handleCitizenNav('dashboard')}>Home</NavLink><NavLink isMobile onClick={() => handleCitizenNav('service-catalog')}>Services</NavLink><NavLink isMobile onClick={() => handleCitizenNav('nagarik-wallet')}>Nagarik Wallet</NavLink><NavLink isMobile onClick={() => handleCitizenNav('my-applications')}>Applications</NavLink><NavLink isMobile onClick={() => handleCitizenNav('notifications')}>Notifications</NavLink>
                                <div className="border-t dark:border-gray-700 pt-4 mt-2"><NavLink isMobile onClick={() => handleCitizenNav('profile-settings')}>Profile</NavLink><button onClick={() => dispatch({type: 'LOGOUT'})} className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">Logout</button></div>
                            </div>
                        ) : (
                             <div className="flex flex-col space-y-2">
                                <NavLink isMobile onClick={() => handleNav('landing')}>Home</NavLink>
                                <NavLink isMobile onClick={() => dispatch({ type: 'SET_VIEW', payload: 'notifications' })}>Announcements</NavLink>
                                <button onClick={() => handleNav('login')} className="w-full bg-[#C8102E] text-white font-bold py-3 px-5 rounded-lg shadow-md hover:bg-red-700 transition">Login / Register</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;