import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import AdminPortal from './pages/AdminPortal';
import KioskPortal from './pages/KioskPortal';
import LoginPage from './pages/LoginPage';
import Toast from './components/Toast';
import { NepalFlagIcon } from './components/icons';

const App: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { view, user, profile, notifications, isLoading } = state;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <NepalFlagIcon className="h-16 w-auto animate-pulse" />
        <p className="mt-4 text-gray-600">Initializing Nagarik Card...</p>
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

  return (
    <div className="bg-[#F7F8FC] min-h-screen text-gray-800">
       <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            {notifications.map(notif => (
            <Toast 
                key={notif.id}
                message={notif.message}
                type={notif.type}
                onClose={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notif.id })}
            />
            ))}
        </div>
      </div>
      {renderView()}
    </div>
  );
};

export default App;