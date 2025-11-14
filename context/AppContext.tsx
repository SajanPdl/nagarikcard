import React, { createContext, useReducer, Dispatch, useEffect } from 'react';
import { Profile, Application, WalletDocument, Service, CitizenPage, Notification, Theme, Language, AccessibilityState } from '../types';
import { MOCK_SERVICES, MOCK_APPLICATIONS, MOCK_WALLET, MOCK_ALL_CITIZENS, MOCK_ALL_WALLET_DOCS, MOCK_ADMIN_PROFILE, MOCK_KIOSK_PROFILE, MOCK_NOTIFICATIONS } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

type View = 'landing' | 'citizen' | 'admin' | 'kiosk' | 'login' | 'notifications';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'info';
}

interface AppState {
  view: View;
  isLoading: boolean;
  user: SupabaseUser | null;
  profile: Profile | null;
  wallet: WalletDocument[];
  applications: Application[];
  services: Service[];
  toasts: Toast[];
  notifications: Notification[];
  allCitizenProfiles: Profile[];
  allWalletDocuments: WalletDocument[];
  citizenPage: CitizenPage;
  selectedServiceId: string | null;
  theme: Theme;
  language: Language;
  accessibility: AccessibilityState;
  isAiModalOpen: boolean;
}

type Action =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { user: SupabaseUser | null; profile: Profile | null } }
  | { type: 'LOGIN'; payload: { email: string, role: 'citizen' | 'admin' | 'kiosk' } }
  | { type: 'SIGNUP'; payload: { name: string; email: string } }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_WALLET'; payload: WalletDocument[] }
  | { type: 'UPSERT_WALLET_DOCUMENT'; payload: WalletDocument }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'LOGOUT' }
  | { type: 'UPSERT_APPLICATION'; payload: Application }
  | { type: 'UPSERT_SERVICE'; payload: Service }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'CALL_NEXT_TOKEN'; payload: string }
  | { type: 'SET_ALL_CITIZEN_DATA'; payload: { profiles: Profile[], documents: WalletDocument[] } }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'VERIFY_DOCUMENT'; payload: { documentId: string } }
  | { type: 'REJECT_DOCUMENT'; payload: { documentId: string } }
  | { type: 'APPROVE_APPLICATION', payload: string }
  | { type: 'REJECT_APPLICATION', payload: string }
  | { type: 'REQUEST_INFO_APPLICATION', payload: string }
  | { type: 'SET_CITIZEN_PAGE', payload: CitizenPage }
  | { type: 'SET_SELECTED_SERVICE', payload: string | null }
  | { type: 'SET_NOTIFICATIONS', payload: Notification[] }
  | { type: 'MARK_NOTIFICATION_READ', payload: { notificationId: string, read: boolean } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_FONT_SIZE'; payload: AccessibilityState['fontSize'] }
  | { type: 'SET_CONTRAST'; payload: AccessibilityState['contrast'] }
  | { type: 'TOGGLE_AI_MODAL' };


const initialState: AppState = {
  view: 'landing',
  isLoading: true,
  user: null,
  profile: null,
  wallet: [],
  applications: [],
  services: [],
  toasts: [],
  notifications: [],
  allCitizenProfiles: [],
  allWalletDocuments: [],
  citizenPage: 'dashboard',
  selectedServiceId: null,
  theme: 'light',
  language: 'en',
  accessibility: {
    fontSize: 'normal',
    contrast: 'normal',
  },
  isAiModalOpen: false,
};

const updateApplicationStatus = (
    state: AppState,
    appId: string,
    newStatus: Application['status'],
    notificationMessage: string,
    notificationType: Toast['type'] = 'success'
): AppState => {
    const appToUpdate = state.applications.find(a => a.id === appId);
    if (!appToUpdate) return state;

    const updatedApp: Application = {
        ...appToUpdate,
        status: newStatus,
        statusHistory: [
            ...appToUpdate.statusHistory,
            { status: newStatus, timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
        ]
    };
    
    return {
        ...state,
        applications: state.applications.map(a => a.id === appId ? updatedApp : a),
        toasts: [...state.toasts, { id: Date.now(), message: notificationMessage, type: notificationType }]
    };
};


const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SESSION':
      return { ...state, user: action.payload.user, profile: action.payload.profile, view: action.payload.profile ? action.payload.profile.role : 'landing', isLoading: false };
    case 'LOGOUT':
        return { ...initialState, isLoading: false, view: 'landing', services: state.services, citizenPage: 'dashboard', theme: state.theme };
    case 'LOGIN': {
        const { email, role } = action.payload;
        let profile: Profile | undefined;
        let allProfiles: Profile[] = [ ...state.allCitizenProfiles, MOCK_ADMIN_PROFILE, MOCK_KIOSK_PROFILE ];

        profile = allProfiles.find(p => p.email === email && p.role === role);

        if (profile) {
            const mockUser = { id: profile.id, email: profile.email };
            return {
                ...state,
                user: mockUser as any,
                profile,
                view: profile.role,
                citizenPage: 'dashboard', // Reset to dashboard on login
                toasts: [...state.toasts, { id: Date.now(), message: `Welcome back, ${profile.name}!`, type: 'success'}]
            };
        } else {
             return {
                ...state,
                toasts: [...state.toasts, { id: Date.now(), message: 'Login failed. User not found.', type: 'info'}]
            };
        }
    }
    case 'SIGNUP': {
        const { name, email } = action.payload;
        if(state.allCitizenProfiles.some(p => p.email === email)) {
            return {
                ...state,
                toasts: [...state.toasts, { id: Date.now(), message: 'An account with this email already exists.', type: 'info'}]
            };
        }
        
        const newProfile: Profile = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'citizen',
        };

        const mockUser = { id: newProfile.id, email: newProfile.email };

        return {
            ...state,
            user: mockUser as any,
            profile: newProfile,
            allCitizenProfiles: [...state.allCitizenProfiles, newProfile],
            view: 'citizen',
            toasts: [...state.toasts, { id: Date.now(), message: `Welcome, ${name}! Your account has been created.`, type: 'success'}]
        };
    }
    case 'SET_SERVICES':
        return { ...state, services: action.payload };
    case 'SET_WALLET':
        return { ...state, wallet: action.payload };
    case 'UPSERT_WALLET_DOCUMENT':
        return { 
            ...state, 
            wallet: [
                ...state.wallet.filter(d => d.id !== action.payload.id),
                action.payload
            ]
        };
    case 'SET_APPLICATIONS':
        return { ...state, applications: action.payload.sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()) };
    case 'UPSERT_APPLICATION':
        const existingApp = state.applications.find(a => a.id === action.payload.id);
        let newToasts = [...state.toasts];
        
        if(existingApp && existingApp.status !== action.payload.status) {
            const service = state.services.find(s => s.id === action.payload.serviceId);
            if (service) {
                if (action.payload.status === 'Approved') {
                    newToasts.push({ id: Date.now(), message: `Application for "${service.name}" has been approved!`, type: 'success' });
                } else if (action.payload.status === 'Called') {
                    newToasts.push({ id: Date.now(), message: `Token for "${service.name}" is being called.`, type: 'info' });
                }
            }
        }

        return { 
            ...state, 
            applications: [
                ...state.applications.filter(a => a.id !== action.payload.id),
                action.payload
            ].sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
            toasts: newToasts,
        };
    case 'UPSERT_SERVICE': {
        const isUpdate = state.services.some(s => s.id === action.payload.id);
        const newServices = isUpdate
            ? state.services.map(s => s.id === action.payload.id ? action.payload : s)
            : [...state.services, action.payload];
        
        return {
            ...state,
            services: newServices,
            toasts: [
                ...state.toasts,
                { id: Date.now(), message: `Service "${action.payload.name}" has been ${isUpdate ? 'updated' : 'created'}.`, type: 'success' }
            ]
        };
    }
    case 'ADD_NOTIFICATION':
        return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_NOTIFICATION':
        return { ...state, toasts: state.toasts.filter(n => n.id !== action.payload) };
    case 'CALL_NEXT_TOKEN': {
        const appToCall = state.applications.find(a => a.token === action.payload && a.status === 'Approved');
        if (!appToCall) return state;

        const updatedApp: Application = {
            ...appToCall,
            status: 'Called',
            statusHistory: [
                ...appToCall.statusHistory,
                { status: 'Called', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
            ]
        };
        
        const service = state.services.find(s => s.id === updatedApp.serviceId);
        let toasts = [...state.toasts];
        if (service) {
            toasts.push({ id: Date.now(), message: `Token for "${service.name}" is being called.`, type: 'info' });
        }

        return {
            ...state,
            applications: [
                ...state.applications.filter(a => a.id !== updatedApp.id),
                updatedApp
            ].sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
            toasts: toasts,
        };
    }
    case 'SET_ALL_CITIZEN_DATA':
        return { ...state, allCitizenProfiles: action.payload.profiles, allWalletDocuments: action.payload.documents };
    case 'UPDATE_PROFILE': {
        const updatedProfile = action.payload;
        const isSelfUpdate = state.profile?.id === updatedProfile.id;
        
        const message = isSelfUpdate && state.profile.role === 'citizen'
            ? 'Your profile has been successfully updated.'
            : `Profile for ${updatedProfile.name} has been updated.`;

        return {
            ...state,
            allCitizenProfiles: state.allCitizenProfiles.map(p =>
                p.id === updatedProfile.id ? updatedProfile : p
            ),
            profile: isSelfUpdate ? updatedProfile : state.profile,
            toasts: [
                ...state.toasts,
                { id: Date.now(), message, type: 'success' }
            ]
        }
    }
    case 'VERIFY_DOCUMENT': {
        const { documentId } = action.payload;
        const updateDoc = (doc: WalletDocument) => doc.id === documentId ? { ...doc, verificationStatus: 'verified' as const } : doc;
        const docName = state.allWalletDocuments.find(d => d.id === documentId)?.fileName || 'Document';

        return {
            ...state,
            wallet: state.wallet.map(updateDoc),
            allWalletDocuments: state.allWalletDocuments.map(updateDoc),
            toasts: [
                ...state.toasts,
                { id: Date.now(), message: `"${docName}" has been verified.`, type: 'success' }
            ]
        };
    }
    case 'REJECT_DOCUMENT': {
        const { documentId } = action.payload;
        const updateDoc = (doc: WalletDocument) => doc.id === documentId ? { ...doc, verificationStatus: 'rejected' as const } : doc;
        const docName = state.allWalletDocuments.find(d => d.id === documentId)?.fileName || 'Document';

        return {
            ...state,
            wallet: state.wallet.map(updateDoc),
            allWalletDocuments: state.allWalletDocuments.map(updateDoc),
            toasts: [
                ...state.toasts,
                { id: Date.now(), message: `"${docName}" has been rejected.`, type: 'info' }
            ]
        };
    }
    case 'APPROVE_APPLICATION': {
        return updateApplicationStatus(state, action.payload, 'Approved', 'Application has been approved.');
    }
    case 'REJECT_APPLICATION': {
        return updateApplicationStatus(state, action.payload, 'Rejected', 'Application has been rejected.', 'info');
    }
    case 'REQUEST_INFO_APPLICATION': {
        return updateApplicationStatus(state, action.payload, 'More Info Requested', 'Requested more information from citizen.', 'info');
    }
    case 'SET_CITIZEN_PAGE':
        return { ...state, citizenPage: action.payload, view: 'citizen' };
    case 'SET_SELECTED_SERVICE':
        return { ...state, selectedServiceId: action.payload };
    case 'SET_NOTIFICATIONS':
        return { ...state, notifications: action.payload.sort((a,b) => b.created_at.getTime() - a.created_at.getTime()) };
    case 'MARK_NOTIFICATION_READ': {
        const { notificationId, read } = action.payload;
        return {
            ...state,
            notifications: state.notifications.map(n => 
                n.id === notificationId ? { ...n, read } : n
            )
        };
    }
    case 'TOGGLE_THEME': {
        return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    }
    case 'SET_LANGUAGE':
        return { ...state, language: action.payload };
    case 'SET_FONT_SIZE':
        return { ...state, accessibility: { ...state.accessibility, fontSize: action.payload } };
    case 'SET_CONTRAST':
        return { ...state, accessibility: { ...state.accessibility, contrast: action.payload } };
    case 'TOGGLE_AI_MODAL':
        return { ...state, isAiModalOpen: !state.isAiModalOpen };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // This effect runs once on mount to initialize data and theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && initialState.theme === 'light') {
        dispatch({ type: 'TOGGLE_THEME' });
    }

    dispatch({ type: 'SET_SERVICES', payload: MOCK_SERVICES });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: MOCK_NOTIFICATIONS });
    // This pre-populates admin-viewable data
    dispatch({ type: 'SET_ALL_CITIZEN_DATA', payload: {
        profiles: MOCK_ALL_CITIZENS,
        documents: MOCK_ALL_WALLET_DOCS
    }});
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  useEffect(() => {
    // This effect syncs theme and accessibility settings with the DOM
    const root = document.documentElement;
    
    // Theme
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Font Size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${state.accessibility.fontSize}`);

    // Contrast
     if (state.accessibility.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

  }, [state.theme, state.accessibility]);


  useEffect(() => {
    if (state.profile) {
        if (state.profile.role === 'citizen') {
            // Check if this is the mock user to load their data
            if (state.profile.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef') {
                dispatch({ type: 'SET_WALLET', payload: MOCK_WALLET });
                dispatch({ type: 'SET_APPLICATIONS', payload: MOCK_APPLICATIONS });
            } else {
                 // It's a newly signed-up user
                dispatch({ type: 'SET_WALLET', payload: [] });
                dispatch({ type: 'SET_APPLICATIONS', payload: [] });
            }
        } else if(state.profile.role === 'admin') {
            dispatch({ type: 'SET_APPLICATIONS', payload: MOCK_APPLICATIONS });
            // Admin data already loaded in initial effect
        } else { // Kiosk
            dispatch({ type: 'SET_WALLET', payload: [] });
            dispatch({ type: 'SET_APPLICATIONS', payload: [] });
        }
    } else {
        dispatch({ type: 'SET_WALLET', payload: [] });
        dispatch({ type: 'SET_APPLICATIONS', payload: [] });
    }
  }, [state.profile]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};