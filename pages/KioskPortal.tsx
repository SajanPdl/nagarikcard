

import React, { useState, useContext, useEffect, useReducer, useRef, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { MOCK_CITIZEN_PROFILE } from '../constants';
import { NepalFlagIcon, KioskAvatarIcon, CarIcon, LandPlotIcon, CreditCardIcon, IdCardIcon, FileTextIcon, ArrowRightIcon, KeyIcon, CheckCircleIcon, PrinterIcon, FingerprintIcon, QrCodeIcon, LogOutIcon, UsersIcon } from '../components/icons';
import { Service, Profile, Application, KioskScreen, Language } from '../types';

interface KioskState {
    screen: KioskScreen;
    currentUser: Profile | null;
    selectedCategory: string | null;
    selectedService: Service | null;
    currentApplication: Application | null;
    loading: boolean;
}

type KioskAction =
    | { type: 'LOGIN'; payload: Profile }
    | { type: 'LOGOUT' }
    | { type: 'START_APPLICATION_FLOW' }
    | { type: 'SELECT_CATEGORY'; payload: string }
    | { type: 'SELECT_SERVICE'; payload: Service }
    | { type: 'SUBMIT_APPLICATION'; payload: Application }
    | { type: 'COMPLETE_PAYMENT'; payload: Application }
    | { type: 'FINISH_SESSION' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'BACK_TO_DASHBOARD' }
    | { type: 'BACK_TO_CATEGORIES' }
    | { type: 'BACK_TO_SERVICE_LIST' }
    | { type: 'VIEW_APPLICATIONS' }
    | { type: 'RESET' };

const initialState: KioskState = {
    screen: 'login',
    currentUser: null,
    selectedCategory: null,
    selectedService: null,
    currentApplication: null,
    loading: false,
};

function kioskReducer(state: KioskState, action: KioskAction): KioskState {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, screen: 'dashboard', currentUser: action.payload, loading: false };
        case 'LOGOUT':
            return { ...state, screen: 'goodbye', currentUser: null };
        case 'START_APPLICATION_FLOW':
            return { ...state, screen: 'service_categories' };
        case 'SELECT_CATEGORY':
            return { ...state, screen: 'service_list', selectedCategory: action.payload };
        case 'SELECT_SERVICE':
            return { ...state, screen: 'application', selectedService: action.payload };
        case 'SUBMIT_APPLICATION':
            return { ...state, screen: 'payment', currentApplication: action.payload };
        case 'COMPLETE_PAYMENT':
            return { ...state, screen: 'receipt', loading: false, currentApplication: action.payload };
        case 'FINISH_SESSION':
            return { ...state, screen: 'dashboard', selectedCategory: null, selectedService: null, currentApplication: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'BACK_TO_DASHBOARD':
             return { ...state, screen: 'dashboard', selectedService: null, selectedCategory: null, currentApplication: null };
        case 'BACK_TO_CATEGORIES':
            return { ...state, screen: 'service_categories', selectedCategory: null, selectedService: null };
        case 'BACK_TO_SERVICE_LIST':
            return { ...state, screen: 'service_list', selectedService: null };
        case 'VIEW_APPLICATIONS':
            return { ...state, screen: 'my_applications' };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const translations = {
    en: {
        welcomeTitle: "Welcome to GovFlow Kiosk",
        welcomeSubtitle: "Digital governance at your fingertips. Please authenticate to begin.",
        sathiWelcome: "Namaste! I am Sathi. Please log in using your Nagarik Card, Biometrics, or Citizenship number to access your personalized dashboard.",
        dashboardTitle: "Welcome, ",
        dashboardSubtitle: "This is your personal government service portal.",
        sathiDashboard: "Welcome! From here you can apply for new services, check your application status, or manage your documents.",
        servicesTitle: "Select a Service Category",
        sathiServices: "Please choose the type of service you need. Just tap on one of the icons.",
        serviceListTitle: "Choose a Service",
        sathiAuth: "Great! Now, please verify your identity by scanning your Nagarik Card.",
        appTitle: "Confirm Your Application",
        sathiApp: "We've filled out the form for you using your verified details. Does this look correct?",
        appConfirmButton: "Confirm & Proceed to Payment",
        paymentTitle: "Complete Payment",
        sathiPayment: "You're almost done! Please complete the payment to submit your application.",
        paymentButton: "Simulate Payment",
        receiptTitle: "Application Submitted Successfully!",
        sathiReceipt: "Congratulations! Your application is submitted. Don't forget to take your receipt.",
        printButton: "Print Receipt",
        finishButton: "Back to Dashboard",
        goodbyeTitle: "Thank you for using GovFlow!",
        goodbyeSubtitle: "Session ended securely. Serving every citizen, everywhere.",
        backButton: "Back",
    },
    np: {
        welcomeTitle: "GovFlow किओस्कमा स्वागत छ",
        welcomeSubtitle: "डिजिटल सुशासन तपाईंको औंलाको छेउमा। सुरु गर्न कृपया प्रमाणित गर्नुहोस्।",
        sathiWelcome: "नमस्ते! म साथी हुँ। आफ्नो व्यक्तिगत ड्यासबोर्ड पहुँच गर्न कृपया आफ्नो नागरिक कार्ड, बायोमेट्रिक्स, वा नागरिकता नम्बर प्रयोग गरी लग इन गर्नुहोस्।",
        dashboardTitle: "स्वागत छ, ",
        dashboardSubtitle: "यो तपाईंको व्यक्तिगत सरकारी सेवा पोर्टल हो।",
        sathiDashboard: "स्वागत छ! यहाँबाट तपाईं नयाँ सेवाहरूको लागि आवेदन दिन, आफ्नो आवेदनको स्थिति जाँच गर्न, वा आफ्नो कागजातहरू व्यवस्थापन गर्न सक्नुहुन्छ।",
        servicesTitle: "सेवाको श्रेणी छान्नुहोस्",
        sathiServices: "कृपया आवश्यक सेवाको प्रकार छान्नुहोस्। केवल कुनै एक आइकनमा ट्याप गर्नुहोस्।",
        serviceListTitle: "एउटा सेवा छान्नुहोस्",
        sathiAuth: "धेरै राम्रो! अब, कृपया आफ्नो नागरिक कार्ड स्क्यान गरेर आफ्नो पहिचान प्रमाणीकरण गर्नुहोस्।",
        appTitle: "आवेदन पुष्टि गर्नुहोस्",
        sathiApp: "हामीले तपाईंको प्रमाणित विवरणहरू प्रयोग गरेर फारम भरेका छौं। के यो सही देखिन्छ?",
        appConfirmButton: "पुष्टि गर्नुहोस् र भुक्तानीमा जानुहोस्",
        paymentTitle: "भुक्तानी पूरा गर्नुहोस्",
        sathiPayment: "तपाईं लगभग सकिसक्नुभयो! कृपया आफ्नो आवेदन पेश गर्न भुक्तानी पूरा गर्नुहोस्।",
        paymentButton: "भुक्तानी सिमुलेट गर्नुहोस्",
        receiptTitle: "आवेदन सफलतापूर्वक पेश भयो!",
        sathiReceipt: "बधाई छ! तपाईंको आवेदन पेश भएको छ। आफ्नो रसिद लिन नबिर्सनुहोस्।",
        printButton: "रसिद प्रिन्ट गर्नुहोस्",
        finishButton: "ड्यासबोर्डमा फर्कनुहोस्",
        goodbyeTitle: "GovFlow प्रयोग गर्नुभएकोमा धन्यवाद!",
        goodbyeSubtitle: "सत्र सुरक्षित रूपमा समाप्त भयो। प्रत्येक नागरिकको सेवामा, जताततै।",
        backButton: "पछाडि",
    }
};

const SathiGuide: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute bottom-6 left-6 z-10 flex items-end space-x-4 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-blue-500/50 backdrop-blur-sm border-2 border-blue-400 flex items-center justify-center sathi-avatar shrink-0">
            <KioskAvatarIcon className="w-12 h-12 text-white"/>
        </div>
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl rounded-bl-none text-white text-lg max-w-sm shadow-lg">
            <p>{message}</p>
        </div>
    </div>
);

const LoginScreen: React.FC<{ t: any; loading: boolean; language: Language; handleLogin: () => void; }> = ({ t, loading, language, handleLogin }) => {
    const [authMethod, setAuthMethod] = useState('qr');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'scanned'>('idle');
    const [scanProgress, setScanProgress] = useState(0);

    // FIX: useEffect to safely attach stream to video element once it's available
    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Effect to manage the camera stream
    useEffect(() => {
        let currentStream: MediaStream | null = null;
        if (authMethod === 'qr' && !loading) {
            setScanStatus('scanning');
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
                .then(mediaStream => {
                    currentStream = mediaStream;
                    setStream(mediaStream);
                    setCameraError(null);
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    setCameraError("Camera access denied. Please enable camera permissions in your browser settings.");
                    setStream(null);
                });
        } else if (stream) {
            // If we switch away from QR or start loading, stop the stream
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        return () => { // Cleanup function
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            setScanStatus('idle');
            setScanProgress(0);
        };
    }, [authMethod, loading]);

    // Effect to manage the scanning flow timing
    useEffect(() => {
        let scanInterval: number;
        let loginTimeout: number;

        if (scanStatus === 'scanning' && stream) {
            const startTime = Date.now();
            scanInterval = window.setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(100, (elapsedTime / 10000) * 100);
                setScanProgress(progress);

                if (progress >= 100) {
                    clearInterval(scanInterval);
                    setScanStatus('scanned');
                }
            }, 100); // update every 100ms for smooth progress
        } else if (scanStatus === 'scanned') {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            loginTimeout = window.setTimeout(() => {
                handleLogin();
            }, 4000); // Show details for 4 seconds
        }

        return () => {
            clearInterval(scanInterval);
            clearTimeout(loginTimeout);
        };
    }, [scanStatus, stream, handleLogin]);


    return (
        <div className="text-center text-white flex flex-col items-center justify-center h-full kiosk-screen p-8">
            <SathiGuide message={t.sathiWelcome} />
            <NepalFlagIcon className="h-20 w-auto mb-6" />
            <h1 className="text-5xl font-extrabold">{t.welcomeTitle}</h1>
            <p className="text-xl mt-4 max-w-lg opacity-80">{t.welcomeSubtitle}</p>

            <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl mt-12 w-full max-w-md shadow-lg border border-white/20">
                <div className="flex justify-center border-b border-white/20 mb-6">
                    <button onClick={() => setAuthMethod('qr')} className={`px-4 py-2 text-lg font-semibold ${authMethod === 'qr' ? 'border-b-2 border-white' : 'text-white/60'}`}>QR</button>
                    <button onClick={() => setAuthMethod('bio')} className={`px-4 py-2 text-lg font-semibold ${authMethod === 'bio' ? 'border-b-2 border-white' : 'text-white/60'}`}>Biometric</button>
                    <button onClick={() => setAuthMethod('manual')} className={`px-4 py-2 text-lg font-semibold ${authMethod === 'manual' ? 'border-b-2 border-white' : 'text-white/60'}`}>Manual</button>
                </div>
                
                {loading ? (
                     <div className="h-64 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-8 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <p className="text-xl mt-6 opacity-80">{language === 'en' ? 'Authenticating...' : 'प्रमाणीकरण हुँदैछ...'}</p>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center">
                         {authMethod === 'qr' && (
                            <div className={`w-full h-full flex flex-col items-center justify-center relative rounded-lg overflow-hidden ${scanStatus === 'scanned' ? 'animate-flash-success' : ''}`}>
                                {scanStatus === 'scanning' && (
                                    <>
                                        {cameraError ? (
                                            <div className="flex flex-col items-center justify-center text-center text-red-300">
                                                <QrCodeIcon className="w-24 h-24 text-red-400/50 mb-4" />
                                                <p>{cameraError}</p>
                                            </div>
                                        ) : stream ? (
                                             <>
                                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 flex flex-col justify-between">
                                                    <div className="relative h-full">
                                                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-scan-line"></div>
                                                    </div>
                                                    <div className="p-3 bg-black/50">
                                                        <p className="text-white/90 text-center text-sm font-semibold animate-pulse">{language === 'en' ? 'Scanning... Hold your QR code steady.' : 'स्क्यान गर्दै... आफ्नो QR कोड स्थिर राख्नुहोस्।'}</p>
                                                        <div className="w-full bg-white/20 rounded-full h-3 mt-2">
                                                            <div className="h-3 rounded-full progress-bar-inner" style={{ width: `${scanProgress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        )}
                                    </>
                                )}
                                {scanStatus === 'scanned' && (
                                    <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full h-full bg-black/30">
                                        <CheckCircleIcon className="w-20 h-20 text-green-300 mb-4" />
                                        <h3 className="text-2xl font-bold">Scan Successful</h3>
                                        <div className="mt-4 bg-white/10 p-4 rounded-lg flex items-center space-x-4">
                                            <img className="w-16 h-16 rounded-full" src={`https://ui-avatars.com/api/?name=${MOCK_CITIZEN_PROFILE.name.replace(' ','+')}&background=random`} alt="User avatar" />
                                            <div>
                                                <p className="text-xl font-semibold">{MOCK_CITIZEN_PROFILE.name}</p>
                                                <p className="text-white/70">Citizen ID: ...cdef</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {authMethod === 'bio' && <>
                            <FingerprintIcon className="w-24 h-24 text-white/50 mb-4" />
                            <p className="text-white/80">Place your finger on the scanner</p>
                        </>}
                        {authMethod === 'manual' && <>
                            <IdCardIcon className="w-24 h-24 text-white/50 mb-4" />
                             <p className="text-white/80">Enter your Citizenship Number</p>
                        </>}
                    </div>
                )}
            </div>
            {authMethod !== 'qr' && (
                <button 
                    onClick={handleLogin} 
                    disabled={loading} 
                    className="mt-8 bg-[#C8102E] font-bold text-xl py-4 px-10 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 disabled:bg-gray-500"
                >
                   {language === 'en' ? "Simulate Login" : "लगइन सिमुलेट गर्नुहोस्"}
                </button>
            )}
        </div>
    );
};

export const KioskPortal: React.FC = () => {
    const { state: appState, dispatch: appDispatch } = useContext(AppContext);
    const [kioskState, kioskDispatch] = useReducer(kioskReducer, initialState);
    const inactivityTimer = useRef<number | undefined>(undefined);
    
    const { screen, currentUser, selectedCategory, selectedService, currentApplication, loading } = kioskState;
    const { language } = appState;
    const t = translations[language];

    const resetInactivityTimer = () => {
        window.clearTimeout(inactivityTimer.current);
        inactivityTimer.current = window.setTimeout(() => {
            kioskDispatch({ type: 'LOGOUT' });
        }, 300000); // 5 minutes
    };
    
    useEffect(() => {
        document.body.addEventListener('click', resetInactivityTimer);
        document.body.addEventListener('keypress', resetInactivityTimer);
        resetInactivityTimer();

        return () => {
            window.clearTimeout(inactivityTimer.current);
            document.body.removeEventListener('click', resetInactivityTimer);
            document.body.removeEventListener('keypress', resetInactivityTimer);
        };
    }, []);

    useEffect(() => {
        if (screen === 'goodbye') {
            const timer = window.setTimeout(() => {
                kioskDispatch({ type: 'RESET' });
            }, 5000);
            return () => window.clearTimeout(timer);
        }
    }, [screen]);

    const handleLogin = useCallback(() => {
        kioskDispatch({ type: 'SET_LOADING', payload: true });
        setTimeout(() => {
            kioskDispatch({ type: 'LOGIN', payload: MOCK_CITIZEN_PROFILE });
        }, 1500);
    }, []);

    const handleSelectCategory = (category: string) => {
        kioskDispatch({ type: 'SELECT_CATEGORY', payload: category });
    };

    const handleSelectService = (service: Service) => {
        kioskDispatch({ type: 'SELECT_SERVICE', payload: service });
    };

    const handleSubmitApplication = () => {
        if (!selectedService || !currentUser) return;
        
        if (!selectedService.offices || selectedService.offices.length === 0) {
            console.error("Selected service has no offices assigned.");
            // Here you might want to show an error to the user
            return;
        }

        const newApp: Application = {
            id: `app-kiosk-${Date.now()}`,
            serviceId: selectedService.id,
            userId: currentUser.id,
            submittedAt: new Date(),
            status: 'Pending Payment',
            paymentStatus: 'Unpaid',
            statusHistory: [{ status: 'Pending Payment', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }],
            formData: {}, // In a real app, form data would be collected based on the service schema
            officeId: selectedService.offices[0].id, // Default to the first office
        };
        
        appDispatch({ type: 'UPSERT_APPLICATION', payload: newApp });
        kioskDispatch({ type: 'SUBMIT_APPLICATION', payload: newApp });
    };

    const handlePayment = () => {
        kioskDispatch({ type: 'SET_LOADING', payload: true });

        if (currentApplication) {
            const submittedApp: Application = {
                ...currentApplication,
                status: 'Submitted',
                paymentStatus: 'Paid',
                token: `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
                statusHistory: [
                    ...currentApplication.statusHistory,
                    { status: 'Submitted', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
                ]
            };
            appDispatch({ type: 'UPSERT_APPLICATION', payload: submittedApp });

            // Simulate processing start after a short delay
            setTimeout(() => {
                const processingApp = {
                    ...submittedApp,
                    status: 'Processing' as const,
                     statusHistory: [
                        ...submittedApp.statusHistory,
                        { status: 'Processing' as const, timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
                    ]
                };
                appDispatch({ type: 'UPSERT_APPLICATION', payload: processingApp });
            }, 1000);

            setTimeout(() => {
                kioskDispatch({ type: 'COMPLETE_PAYMENT', payload: submittedApp });
            }, 2000);
        }
    };

    const serviceCategories = [
        { name: language === 'en' ? 'Transport' : ' यातायात', icon: CarIcon, category: 'Transport' },
        { name: language === 'en' ? 'Revenue' : ' राजस्व', icon: LandPlotIcon, category: 'Revenue' },
        { name: language === 'en' ? 'Civil Registration' : ' नागरिक पञ्जीकरण', icon: UsersIcon, category: 'Civil Registration' },
        { name: language === 'en' ? 'Utilities' : 'उपयोगिताहरू', icon: CreditCardIcon, category: 'Utilities' },
    ];
    
    const renderScreen = () => {
        switch (screen) {
            case 'login':
                return <LoginScreen t={t} loading={loading} language={language} handleLogin={handleLogin} />;
            case 'dashboard':
                if (!currentUser) return null;
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                        <SathiGuide message={`${t.sathiDashboard}`} />
                        <h1 className="text-5xl font-extrabold">{t.dashboardTitle}{currentUser.name}</h1>
                        <p className="text-xl mt-2 opacity-80">{t.dashboardSubtitle}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            <button onClick={() => kioskDispatch({ type: 'START_APPLICATION_FLOW' })} className="kiosk-card group">
                                <FileTextIcon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform"/>
                                <h2 className="text-2xl font-bold mt-4">{language === 'en' ? 'Apply for Service' : 'सेवाको लागि आवेदन दिनुहोस्'}</h2>
                            </button>
                            <button onClick={() => kioskDispatch({ type: 'VIEW_APPLICATIONS' })} className="kiosk-card group">
                                <UsersIcon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform"/>
                                <h2 className="text-2xl font-bold mt-4">{language === 'en' ? 'My Applications' : 'मेरो आवेदनहरू'}</h2>
                            </button>
                             <button onClick={() => kioskDispatch({ type: 'LOGOUT' })} className="kiosk-card group bg-red-500/30 border-red-400/50 hover:bg-red-500/50">
                                <LogOutIcon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform"/>
                                <h2 className="text-2xl font-bold mt-4">{language === 'en' ? 'Logout' : 'लगआउट'}</h2>
                            </button>
                        </div>
                    </div>
                );
            case 'my_applications':
                if (!currentUser) return null;
                const userApplications = appState.applications.filter(app => app.userId === currentUser.id);
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                        <button onClick={() => kioskDispatch({ type: 'BACK_TO_DASHBOARD' })} className="kiosk-back-button">{t.backButton}</button>
                        <h1 className="text-5xl font-extrabold text-center">{language === 'en' ? 'My Applications' : 'मेरो आवेदनहरू'}</h1>
                        {userApplications.length > 0 ? (
                            <div className="mt-12 max-w-4xl mx-auto space-y-6 overflow-y-auto max-h-[70vh] p-2">
                                {userApplications.sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()).map(app => {
                                    const service = appState.services.find(s => s.id === app.serviceId);
                                    const status = app.status;
                                    const statusColor = 
                                        status === 'Approved' || status === 'Called' ? 'bg-green-500/80' : 
                                        status === 'Pending Payment' ? 'bg-yellow-500/80' :
                                        status === 'Rejected' ? 'bg-red-500/80' :
                                        'bg-blue-500/80';
                                    
                                    return (
                                        <div key={app.id} className="kiosk-card text-left p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="text-2xl font-bold">{service?.name || 'Unknown Service'}</h2>
                                                    <p className="text-white/70 mt-1">Submitted: {app.submittedAt.toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 text-sm font-bold rounded-full self-start ${statusColor}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="border-t border-white/20 my-4"></div>
                                            <p className="text-lg">Token Number: <span className="font-bold tracking-widest">{app.token || 'N/A'}</span></p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center mt-12">
                                <FileTextIcon className="w-24 h-24 text-white/50 mx-auto mb-4" />
                                <p className="text-xl text-white/80">You have not submitted any applications yet.</p>
                            </div>
                        )}
                    </div>
                );
            case 'service_categories':
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                        <SathiGuide message={t.sathiServices} />
                        <button onClick={() => kioskDispatch({ type: 'BACK_TO_DASHBOARD' })} className="kiosk-back-button">{t.backButton}</button>
                        <h1 className="text-5xl font-extrabold text-center">{t.servicesTitle}</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                            {serviceCategories.map(cat => (
                                <button key={cat.category} onClick={() => handleSelectCategory(cat.category)} className="kiosk-card group">
                                    <cat.icon className="w-20 h-20 text-white/80 group-hover:scale-110 transition-transform"/>
                                    <h2 className="text-2xl font-bold mt-4">{cat.name}</h2>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'service_list':
                const filteredServices = appState.services.filter(s => s.category === selectedCategory);
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                        <button onClick={() => kioskDispatch({ type: 'BACK_TO_CATEGORIES' })} className="kiosk-back-button">{t.backButton}</button>
                        <h1 className="text-5xl font-extrabold text-center">{t.serviceListTitle}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            {filteredServices.map(service => (
                                <button key={service.id} onClick={() => handleSelectService(service)} className="kiosk-card group text-left p-6">
                                    <h2 className="text-2xl font-bold">{service.name}</h2>
                                    <p className="text-white/70 mt-2 text-base">{service.description}</p>
                                    <p className="font-bold text-lg mt-4">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(service.fee)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'application':
                if (!selectedService || !currentUser) return null;
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                        <SathiGuide message={t.sathiApp} />
                        <button onClick={() => kioskDispatch({ type: 'BACK_TO_SERVICE_LIST' })} className="kiosk-back-button">{t.backButton}</button>
                        <h1 className="text-5xl font-extrabold text-center">{t.appTitle}</h1>
                        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl mt-12 max-w-2xl mx-auto border border-white/20">
                            <h2 className="text-3xl font-bold mb-6">{selectedService.name}</h2>
                            <div className="space-y-4 text-lg">
                                {Object.keys(selectedService.formSchema.properties).map((key) => {
                                    const prop = selectedService.formSchema.properties[key];
                                    return (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-white/70">{prop.title}:</span>
                                            <span className="font-semibold">{prop.mapping === 'user.name' ? currentUser.name : 'Auto-filled Data'}</span>
                                        </div>
                                    );
                                })}
                            </div>
                             <div className="border-t border-white/20 my-6"></div>
                             <div className="flex justify-between text-2xl font-bold">
                                <span>{language === 'en' ? 'Fee:' : 'शुल्क:'}</span>
                                <span>{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(selectedService.fee)}</span>
                             </div>
                        </div>
                        <div className="text-center mt-8">
                             <button onClick={handleSubmitApplication} className="kiosk-cta-button">
                                {t.appConfirmButton} <ArrowRightIcon className="w-6 h-6 ml-2"/>
                            </button>
                        </div>
                    </div>
                );
            case 'payment':
                 if (!selectedService || !currentApplication) return null;
                return (
                    <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                         <SathiGuide message={t.sathiPayment} />
                        <h1 className="text-5xl font-extrabold text-center">{t.paymentTitle}</h1>
                        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl mt-12 max-w-lg mx-auto border border-white/20 text-center">
                             <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                             <p className="text-6xl font-extrabold my-8">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(selectedService.fee)}</p>
                             <p className="text-white/70">{language === 'en' ? 'Please use the terminal below to complete your payment.' : 'कृपया आफ्नो भुक्तानी पूरा गर्न तलको टर्मिनल प्रयोग गर्नुहोस्।'}</p>
                        </div>
                        <div className="text-center mt-8">
                             <button onClick={handlePayment} disabled={loading} className="kiosk-cta-button disabled:bg-gray-600">
                                {loading ? (language === 'en' ? 'Processing...' : 'प्रशोधन हुँदैछ...') : t.paymentButton}
                            </button>
                        </div>
                    </div>
                );
            case 'receipt':
                if (!selectedService || !currentApplication) return null;
                return (
                     <div className="text-white kiosk-screen p-8 lg:p-12 animate-fade-in">
                         <SathiGuide message={t.sathiReceipt} />
                         <h1 className="text-5xl font-extrabold text-center">{t.receiptTitle}</h1>
                          <div className="bg-white text-gray-800 p-8 rounded-lg mt-12 max-w-lg mx-auto font-mono shadow-2xl">
                              <div className="text-center border-b pb-4">
                                  <h2 className="text-2xl font-bold">GovFlow Kiosk</h2>
                                  <p className="text-sm">Transaction Receipt</p>
                              </div>
                              <div className="space-y-2 mt-4 text-sm">
                                  <p><strong>Service:</strong> {selectedService.name}</p>
                                  <p><strong>Token:</strong> {currentApplication.token}</p>
                                  <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
                                  <p><strong>Amount Paid:</strong> {new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(selectedService.fee)}</p>
                              </div>
                              <div className="text-center mt-6">
                                  <PrinterIcon className="w-12 h-12 text-gray-400 mx-auto"/>
                                  <p className="text-xs mt-2 text-gray-500">Please take your printed receipt</p>
                              </div>
                          </div>
                          <div className="text-center mt-8">
                              <button onClick={() => kioskDispatch({ type: 'FINISH_SESSION' })} className="kiosk-cta-button">
                                 {t.finishButton}
                              </button>
                          </div>
                     </div>
                );
            case 'goodbye':
                return (
                    <div className="kiosk-screen text-white flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                        <CheckCircleIcon className="w-24 h-24 text-white mb-6"/>
                        <h1 className="text-5xl font-extrabold">{t.goodbyeTitle}</h1>
                        <p className="text-xl mt-4 opacity-80">{t.goodbyeSubtitle}</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative">
            <style>{`
                .kiosk-screen {
                    min-height: 100vh;
                    background: linear-gradient(145deg, #003893 0%, #2a5298 50%, #C8102E 100%);
                }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                
                .kiosk-card {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 1.5rem;
                    padding: 2rem;
                    text-align: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                }
                .kiosk-card:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-10px);
                    box-shadow: 0 16px 40px 0 rgba(0, 0, 0, 0.3);
                }
                .kiosk-cta-button {
                    background-color: #C8102E;
                    color: white;
                    font-weight: bold;
                    font-size: 1.25rem;
                    padding: 1rem 2.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 15px rgba(200, 16, 46, 0.4);
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                }
                .kiosk-cta-button:hover {
                    background-color: #A40D26;
                    transform: scale(1.05);
                }
                 .kiosk-back-button {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    background: rgba(0,0,0,0.2);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 999px;
                    font-weight: bold;
                    transition: background-color 0.2s;
                }
                .kiosk-back-button:hover {
                    background: rgba(0,0,0,0.4);
                }
                @keyframes sathi-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(96, 165, 250, 0); }
                }
                .sathi-avatar {
                    animation: sathi-pulse 2s infinite;
                }
                @keyframes scan-line {
                    0% { transform: translateY(-100%); opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { transform: translateY(256px); opacity: 0.5; } /* h-64 is 256px */
                }
                .animate-scan-line {
                    animation: scan-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    box-shadow: 0 0 30px 8px #FF4444; 
                    filter: blur(1px);
                }
                .progress-bar-inner {
                    transition: width 0.1s linear;
                    background-image: linear-gradient(to right, #4ade80, #34d399); 
                }
                @keyframes flash-success {
                    0% { box-shadow: inset 0 0 0 0px rgba(74, 222, 128, 0); }
                    50% { 
                        box-shadow: inset 0 0 0 16px rgba(52, 211, 153, 0.9); 
                    }
                    100% { box-shadow: inset 0 0 0 0px rgba(74, 222, 128, 0); }
                }
                .animate-flash-success {
                    animation: flash-success 0.8s ease-out;
                }
            `}</style>

            <div className="absolute top-6 right-6 z-20 flex space-x-2 bg-black/20 p-1 rounded-full">
                <button onClick={() => appDispatch({ type: 'SET_LANGUAGE', payload: 'en' })} className={`px-3 py-1 text-sm rounded-full ${language === 'en' ? 'bg-white text-black' : 'text-white'}`}>EN</button>
                <button onClick={() => appDispatch({ type: 'SET_LANGUAGE', payload: 'np' })} className={`px-3 py-1 text-sm rounded-full ${language === 'np' ? 'bg-white text-black' : 'text-white'}`}>NE</button>
            </div>
            
            {renderScreen()}
        </div>
    );
};

export default KioskPortal;