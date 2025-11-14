

import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import { CitizenPortal } from './pages/CitizenPortal';
import AdminPortal from './pages/AdminPortal';
import KioskPortal from './pages/KioskPortal';
import LoginPage from './pages/LoginPage';
import Toast from './components/Toast';
import { NepalFlagIcon } from './components/icons';
import Header from './components/Header';
import SathiAiModal from './components/SathiAiModal';
import NotificationsPage from './pages/citizen/NotificationsPage';

const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { view, user, profile, toasts, isLoading, isAiModalOpen, services } = state;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-[#003893] rounded-full animate-spin"></div>
            <NepalFlagIcon className="h-14 w-auto" />
          </div>
          <h2 className="text-2xl font-bold mt-6">Initializing GovFlow</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Preparing your secure e-governance portal...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    const isProtectedView = ['citizen', 'admin', 'kiosk'].includes(view);

    if (isProtectedView && !user) {
        return <LoginPage intendedView={view as 'citizen' | 'admin' | 'kiosk'} />;
    }

    if(user && profile && view !== profile.role && isProtectedView) {
        // Logged in but trying to access wrong portal, redirect to their own portal
        return renderCorrectPortal(profile.role);
    }
    
    switch (view) {
      case 'citizen':
        return <CitizenPortal />;
      case 'admin':
        return <AdminPortal />;
      case 'kiosk':
        return <KioskPortal />;
      case 'login':
        return <LoginPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };
  
  const renderCorrectPortal = (role: 'citizen' | 'admin' | 'kiosk') => {
      switch(role) {
          case 'citizen': return <CitizenPortal />;
          case 'admin': return <AdminPortal />;
          case 'kiosk': return <KioskPortal />;
          default: return <LandingPage />;
      }
  }

  const showHeader = view !== 'kiosk';

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
       <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            {toasts.map(notif => (
            <Toast 
                key={notif.id}
                message={notif.message}
                type={notif.type}
                onClose={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notif.id })}
            />
            ))}
        </div>
      </div>
      {isAiModalOpen && <SathiAiModal services={services} onClose={() => dispatch({ type: 'TOGGLE_AI_MODAL' })} />}
      {showHeader && <Header />}
      <div className={showHeader ? 'pt-20' : ''}>
        {renderView()}
      </div>
    </div>
  );
};

export default App;