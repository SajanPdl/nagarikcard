import React, { createContext, useReducer, Dispatch, useEffect } from 'react';
import { Profile, Application, WalletDocument, Service } from '../types';
import { MOCK_SERVICES, MOCK_APPLICATIONS, MOCK_WALLET, MOCK_ALL_CITIZENS, MOCK_ALL_WALLET_DOCS } from '../constants';
import { User as SupabaseUser } from '@supabase/supabase-js';

type View = 'landing' | 'citizen' | 'admin' | 'kiosk' | 'login';

interface Notification {
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
  notifications: Notification[];
  allCitizenProfiles: Profile[];
  allWalletDocuments: WalletDocument[];
}

type Action =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { user: SupabaseUser | null; profile: Profile | null } }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_WALLET'; payload: WalletDocument[] }
  | { type: 'UPSERT_WALLET_DOCUMENT'; payload: WalletDocument }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'LOGOUT' }
  | { type: 'UPSERT_APPLICATION'; payload: Application }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'CALL_NEXT_TOKEN'; payload: string }
  | { type: 'SET_ALL_CITIZEN_DATA'; payload: { profiles: Profile[], documents: WalletDocument[] } }
  | { type: 'VERIFY_DOCUMENT'; payload: { documentId: string } }
  | { type: 'REJECT_DOCUMENT'; payload: { documentId: string } };

const initialState: AppState = {
  view: 'landing',
  isLoading: true,
  user: null,
  profile: null,
  wallet: [],
  applications: [],
  services: [],
  notifications: [],
  allCitizenProfiles: [],
  allWalletDocuments: [],
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
        return { ...initialState, isLoading: false, view: 'landing', services: state.services };
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
        let newNotifications = [...state.notifications];
        
        if(existingApp && existingApp.status !== action.payload.status) {
            const service = state.services.find(s => s.id === action.payload.serviceId);
            if (service) {
                if (action.payload.status === 'Approved') {
                    newNotifications.push({ id: Date.now(), message: `Application for "${service.name}" has been approved!`, type: 'success' });
                } else if (action.payload.status === 'Called') {
                    newNotifications.push({ id: Date.now(), message: `Token for "${service.name}" is being called.`, type: 'info' });
                }
            }
        }

        return { 
            ...state, 
            applications: [
                ...state.applications.filter(a => a.id !== action.payload.id),
                action.payload
            ].sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
            notifications: newNotifications,
        };
    case 'ADD_NOTIFICATION':
        return { ...state, notifications: [...state.notifications, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_NOTIFICATION':
        return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
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
        let notifications = [...state.notifications];
        if (service) {
            notifications.push({ id: Date.now(), message: `Token for "${service.name}" is being called.`, type: 'info' });
        }

        return {
            ...state,
            applications: [
                ...state.applications.filter(a => a.id !== updatedApp.id),
                updatedApp
            ].sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
            notifications: notifications,
        };
    }
    case 'SET_ALL_CITIZEN_DATA':
        return { ...state, allCitizenProfiles: action.payload.profiles, allWalletDocuments: action.payload.documents };
    case 'VERIFY_DOCUMENT': {
        const { documentId } = action.payload;
        const updateDoc = (doc: WalletDocument) => doc.id === documentId ? { ...doc, verificationStatus: 'verified' as const } : doc;
        const docName = state.allWalletDocuments.find(d => d.id === documentId)?.fileName || 'Document';

        return {
            ...state,
            wallet: state.wallet.map(updateDoc),
            allWalletDocuments: state.allWalletDocuments.map(updateDoc),
            notifications: [
                ...state.notifications,
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
            notifications: [
                ...state.notifications,
                { id: Date.now(), message: `"${docName}" has been rejected.`, type: 'info' }
            ]
        };
    }
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
    dispatch({ type: 'SET_SERVICES', payload: MOCK_SERVICES });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  useEffect(() => {
    if (state.profile) {
        if (state.profile.role === 'citizen') {
            dispatch({ type: 'SET_WALLET', payload: MOCK_WALLET });
            dispatch({ type: 'SET_APPLICATIONS', payload: MOCK_APPLICATIONS });
        } else if(state.profile.role === 'admin') {
            dispatch({ type: 'SET_APPLICATIONS', payload: MOCK_APPLICATIONS });
            dispatch({ type: 'SET_ALL_CITIZEN_DATA', payload: {
                profiles: MOCK_ALL_CITIZENS,
                documents: MOCK_ALL_WALLET_DOCS
            }});
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