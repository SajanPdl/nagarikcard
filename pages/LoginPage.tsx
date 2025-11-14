import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { NepalFlagIcon, KeyIcon, UsersIcon, GlobeIcon } from '../components/icons';
import { MOCK_ADMIN_PROFILE, MOCK_CITIZEN_PROFILE, MOCK_KIOSK_PROFILE, MOCK_SUPER_ADMIN_PROFILE } from '../constants';

interface LoginPageProps {
    intendedView?: 'citizen' | 'admin' | 'kiosk' | 'government';
}

const LoginPage: React.FC<LoginPageProps> = ({ intendedView }) => {
    const { dispatch } = useContext(AppContext);
    const [mode, setMode] = useState<'login' | 'signup' | 'forgotPassword'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'login') {
            let role: 'citizen' | 'admin' | 'kiosk' | 'super_admin' = 'citizen';
            if (email === MOCK_ADMIN_PROFILE.email) role = 'admin';
            if (email === MOCK_KIOSK_PROFILE.email) role = 'kiosk';
            if (email === MOCK_SUPER_ADMIN_PROFILE.email) role = 'super_admin';
            dispatch({ type: 'LOGIN', payload: { email, role } });
        } else if (mode === 'signup') {
            dispatch({ type: 'SIGNUP', payload: { name, email } });
        } else { // forgotPassword
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'If an account with that email exists, a password reset link has been sent.', type: 'info' } });
            setMode('login');
        }
    };
    
    const handleDemoLogin = (role: 'citizen' | 'admin' | 'kiosk' | 'super_admin') => {
        let profile;
        switch (role) {
            case 'citizen':
                profile = MOCK_CITIZEN_PROFILE;
                break;
            case 'admin':
                profile = MOCK_ADMIN_PROFILE;
                break;
            case 'kiosk':
                profile = MOCK_KIOSK_PROFILE;
                break;
            case 'super_admin':
                profile = MOCK_SUPER_ADMIN_PROFILE;
                break;
        }
        dispatch({ type: 'LOGIN', payload: { email: profile.email!, role } });
    };
    
    const getTitle = () => {
        if(mode === 'login') return 'Welcome Back';
        if(mode === 'signup') return 'Create Account';
        return 'Reset Password';
    }
    
     const getSubtitle = () => {
        if(mode === 'login') return 'Log in to access your services.';
        if(mode === 'signup') return 'Join to streamline your government interactions.';
        return 'Enter your email to receive a reset link.';
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="absolute top-4 left-4">
                <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#003893] dark:hover:text-blue-400">← Back to Home</button>
            </div>
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex justify-center items-center space-x-3 mb-4">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">GovFlow</h1>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-100 mb-2">
                    {getTitle()}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
                    {getSubtitle()}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003893] focus:border-[#003893]"
                                placeholder="Maya Kumari Thapa"
                            />
                        </div>
                    )}
                    
                    {mode !== 'login' || (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003893] focus:border-[#003893]"
                                placeholder="maya.thapa@email.com"
                            />
                        </div>
                    )}
                    
                     {mode === 'forgotPassword' && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003893] focus:border-[#003893]"
                                placeholder="Enter your registered email"
                            />
                        </div>
                    )}

                    {mode !== 'forgotPassword' && (
                        <div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                {mode === 'login' && (
                                    <button type="button" onClick={() => setMode('forgotPassword')} className="text-sm font-medium text-[#003893] dark:text-blue-400 hover:underline">
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#003893] focus:border-[#003893]"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#C8102E] text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-700 transition"
                    >
                        {mode === 'login' && 'Log In'}
                        {mode === 'signup' && 'Sign Up'}
                        {mode === 'forgotPassword' && 'Send Reset Link'}
                    </button>
                </form>
                
                <div className="text-center mt-6">
                    {mode === 'forgotPassword' ? (
                        <button onClick={() => setMode('login')} className="text-sm font-medium text-[#003893] dark:text-blue-400 hover:underline">
                            Back to Login
                        </button>
                    ) : (
                        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm font-medium text-[#003893] dark:text-blue-400 hover:underline">
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                        </button>
                    )}
                </div>
                
                {mode !== 'forgotPassword' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">For demonstration purposes:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleDemoLogin('citizen')}
                                className="w-full flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center justify-center space-x-2"
                            >
                            <UsersIcon className="w-4 h-4" /> <span>Citizen</span>
                            </button>
                            <button
                                onClick={() => handleDemoLogin('admin')}
                                className="w-full flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center justify-center space-x-2"
                            >
                            <UsersIcon className="w-4 h-4" /> <span>Admin</span>
                            </button>
                             <button
                                onClick={() => handleDemoLogin('kiosk')}
                                className="w-full flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center justify-center space-x-2"
                            >
                                <KeyIcon className="w-4 h-4" /> <span>Kiosk</span>
                            </button>
                             <button
                                onClick={() => handleDemoLogin('super_admin')}
                                className="w-full flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition flex items-center justify-center space-x-2"
                            >
                                <GlobeIcon className="w-4 h-4" /> <span>Govt. Admin</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;