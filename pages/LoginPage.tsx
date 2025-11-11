import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { NepalFlagIcon } from '../components/icons';
import { MOCK_CITIZEN_PROFILE, MOCK_ADMIN_PROFILE, MOCK_KIOSK_PROFILE } from '../constants';

// Fix: Add props interface to accept `intendedView` prop passed from App.tsx.
interface LoginPageProps {
    intendedView?: 'citizen' | 'admin' | 'kiosk';
}

const LoginPage: React.FC<LoginPageProps> = ({ intendedView }) => {
    const { dispatch } = useContext(AppContext);

    const handleLogin = (role: 'citizen' | 'admin' | 'kiosk') => {
        let profile;
        switch (role) {
            case 'admin':
                profile = MOCK_ADMIN_PROFILE;
                break;
            case 'kiosk':
                profile = MOCK_KIOSK_PROFILE;
                break;
            case 'citizen':
            default:
                profile = MOCK_CITIZEN_PROFILE;
                break;
        }

        // Mock a Supabase user object
        const mockUser = {
            id: profile.id,
            email: profile.email,
        };

        dispatch({
            type: 'SET_SESSION',
            payload: { user: mockUser as any, profile }
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="absolute top-4 left-4">
                <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })} className="text-sm font-medium text-gray-600 hover:text-[#003893]">← Back to Home</button>
            </div>
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center items-center space-x-3 mb-4">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">Nagarik Card</h1>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Demo Login</h2>
                <p className="text-gray-500 mb-8">Select a role to enter the portal. No password needed.</p>
                <div className="space-y-4">
                    <button
                        onClick={() => handleLogin('citizen')}
                        className="w-full bg-[#C51E3A] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-700 transition"
                    >
                        Log in as Citizen (Maya Thapa)
                    </button>
                    <button
                        onClick={() => handleLogin('admin')}
                        className="w-full bg-[#003893] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-800 transition"
                    >
                        Log in as Admin (Hari Sharma)
                    </button>
                    <button
                        onClick={() => handleLogin('kiosk')}
                        className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-gray-800 transition"
                    >
                        Log in as Kiosk User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;