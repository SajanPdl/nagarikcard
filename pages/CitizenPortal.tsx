import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { Profile, WalletDocument, Service, Application } from '../types';
import { CheckCircleIcon, NepalFlagIcon, CreditCardIcon, XCircleIcon, AlertTriangleIcon } from '../components/icons';
import ServiceCard from '../components/ServiceCard';
import ApplicationTracker from '../components/ApplicationTracker';
import QrCodeModal from '../components/QrCodeModal';
import PaymentModal from '../components/PaymentModal';

// --- Helper Functions ---
const sha256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- Sub-Components ---

const Dashboard: React.FC<{ profile: Profile, wallet: WalletDocument[], onNavigate: (page: CitizenPage) => void, onShowQr: () => void }> = ({ profile, wallet, onNavigate, onShowQr }) => {
    const citizenDoc = wallet.find(doc => doc.docType === 'citizenship');
    
    const getStatusInfo = (status: WalletDocument['verificationStatus']) => {
        switch (status) {
            case 'verified':
                return { text: 'Verified', icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />, color: 'text-green-400' };
            case 'pending':
                return { text: 'Pending Review', icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' };
            case 'rejected':
                return { text: 'Rejected', icon: <XCircleIcon className="w-5 h-5 text-red-400" />, color: 'text-red-400' };
            default:
                return { text: 'Unknown', icon: null, color: '' };
        }
    };

    const citizenStatus = citizenDoc ? getStatusInfo(citizenDoc.verificationStatus) : null;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Digital Wallet</h2>
            <div className="bg-gradient-to-br from-[#003893] to-blue-800 text-white rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold">{profile.name}</p>
                        <p className="text-sm opacity-80 mt-1">Nagarik Card</p>
                    </div>
                    <NepalFlagIcon className="w-10 h-auto" />
                </div>
                {citizenDoc && citizenStatus ? (
                    <div className="mt-6">
                        <div className={`flex items-center space-x-2 text-sm ${citizenStatus.color}`}>
                            {citizenStatus.icon}
                            <span>Citizenship {citizenStatus.text}</span>
                        </div>
                        <p className="text-xs font-mono break-all mt-2 opacity-60">Hash: {citizenDoc.hash}</p>
                    </div>
                ) : (
                    <p className="mt-6 text-yellow-300">Please upload your Citizenship.</p>
                )}
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button onClick={onShowQr} className="p-4 bg-white rounded-xl shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50 transition">Show My QR ID</button>
                <button onClick={() => onNavigate('service-catalog')} className="p-4 bg-white rounded-xl shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50 transition">Apply for a Service</button>
                <button onClick={() => onNavigate('my-applications')} className="p-4 bg-white rounded-xl shadow-md text-left font-semibold text-gray-700 hover:bg-gray-50 transition col-span-1 sm:col-span-2">Track My Applications</button>
            </div>
        </div>
    );
};

const Onboarding: React.FC<{ onComplete: (doc: WalletDocument) => void, userId: string }> = ({ onComplete, userId }) => {
    const [file, setFile] = useState<File | null>(null);
    const [hash, setHash] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const calculatedHash = await sha256(selectedFile);
            setHash(calculatedHash);
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!file || !hash || !userId) return;
        setUploading(true);
        setError('');

        const newDoc: WalletDocument = {
            id: `doc-${Date.now()}`,
            user_id: userId,
            docType: 'citizenship',
            fileName: file.name,
            hash,
            verificationStatus: 'pending',
            storage_path: `${userId}/${Date.now()}-${file.name}`,
        };

        setTimeout(() => {
            onComplete(newDoc);
            setUploading(false);
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to Nagarik Card</h2>
            <p className="text-gray-600 mb-6">To get started, please upload your Citizenship document.</p>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl">
                <input type="file" id="doc-upload" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                <label htmlFor="doc-upload" className="cursor-pointer text-[#003893] font-semibold">
                    {file ? file.name : 'Choose a file'}
                </label>
                {uploading && <p className="text-sm mt-2">Generating hash...</p>}
                {hash && <p className="text-xs font-mono mt-2 break-all text-gray-500">{hash}</p>}
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <button onClick={handleSubmit} disabled={!file || uploading} className="mt-6 w-full bg-[#C51E3A] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-400">
                {uploading ? 'Uploading...' : 'Complete Setup'}
            </button>
        </div>
    );
};

const ServiceCatalogPage: React.FC<{ services: Service[], onSelectService: (service: Service) => void }> = ({ services, onSelectService }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Service Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
                <ServiceCard key={service.id} service={service} onSelect={() => onSelectService(service)} />
            ))}
        </div>
    </div>
);


const ApplicationPage: React.FC<{ service: Service, profile: Profile, onSubmit: (app: Application) => void, wallet: WalletDocument[] }> = ({ service, profile, onSubmit, wallet }) => {
    const walletHasDoc = (docType: string) => wallet.some(d => d.docType === docType && d.verificationStatus === 'verified');

    const handleSubmit = async () => {
        if (!service.offices || service.offices.length === 0) {
            alert("This service cannot be applied for as it has no assigned offices.");
            return;
        }
        
        const newApplication: Application = {
            id: `app-${Date.now()}`,
            serviceId: service.id,
            userId: profile.id,
            submittedAt: new Date(),
            status: 'Pending Payment',
            paymentStatus: 'Unpaid',
            statusHistory: [{ status: 'Pending Payment', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }],
            formData: { /* Collect form data here */ },
            officeId: service.offices[0].id,
        };
        
        setTimeout(() => {
            onSubmit(newApplication);
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-6">{service.description}</p>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="font-bold text-lg mb-4">Required Documents</h3>
                <ul className="space-y-2">
                    {service.requiredDocs.map(doc => (
                        <li key={doc} className="flex items-center">
                            {walletHasDoc(doc) ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> : <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2"></div>}
                            <span className="capitalize">{doc.replace('_', ' ')}</span>
                            {walletHasDoc(doc) && <span className="text-sm text-green-600 ml-2">(Verified in wallet)</span>}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-4">Auto-filled Form</h3>
                <div className="space-y-4">
                    {Object.keys(service.formSchema.properties).map((key) => {
                        const prop = service.formSchema.properties[key];
                        return (
                            <div key={key}>
                                <label className="text-sm font-medium text-gray-500">{prop.title}</label>
                                <input 
                                    type={prop.type === 'date' ? 'date' : 'text'}
                                    value={prop.mapping === 'user.name' ? profile.name : `Pre-filled data for ${prop.title}`}
                                    readOnly
                                    className="w-full mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-600">Application Fee</p>
                <p className="text-3xl font-bold text-gray-800">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(service.fee)}</p>
            </div>

            <button onClick={handleSubmit} className="mt-6 w-full bg-[#C51E3A] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition flex items-center justify-center space-x-2">
                <CreditCardIcon className="w-5 h-5" />
                <span>Submit & Proceed to Payment</span>
            </button>
        </div>
    );
};

const MyApplicationsPage: React.FC<{ applications: Application[], services: Service[], offices: any[], onPay: (app: Application) => void }> = ({ applications, services, offices, onPay }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6">My Applications</h2>
        {applications.length === 0 ? (
            <p className="text-gray-600 text-center py-8">You have no active applications.</p>
        ) : (
            <div className="space-y-6">
                {applications.map(app => (
                    <ApplicationTracker key={app.id} application={app} services={services} offices={offices} onPay={() => onPay(app)} />
                ))}
            </div>
        )}
    </div>
);


type CitizenPage = 'dashboard' | 'onboarding' | 'service-catalog' | 'application' | 'my-applications';

const CitizenPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user, profile, applications, services, wallet } = state;
    const [page, setPage] = useState<CitizenPage>('dashboard');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showQr, setShowQr] = useState(false);
    const [appForPayment, setAppForPayment] = useState<Application | null>(null);
    
    useEffect(() => {
        if (profile && wallet.length === 0) {
            setPage('onboarding');
        } else if (profile && page === 'onboarding' && wallet.length > 0) {
            setPage('dashboard');
        }
    }, [profile, wallet, page]);

    const handleNavigate = (newPage: CitizenPage) => {
        setPage(newPage);
    };

    const handleOnboardingComplete = (newDoc: WalletDocument) => {
        dispatch({ type: 'UPSERT_WALLET_DOCUMENT', payload: newDoc });
    };

    const handleSelectService = (service: Service) => {
        setSelectedService(service);
        setPage('application');
    };
    
    const handleApplicationSubmit = (app: Application) => {
        dispatch({ type: 'UPSERT_APPLICATION', payload: app });
        setAppForPayment(app);
    };

    const handlePaymentSuccess = async (appId: string) => {
        const appToUpdate = state.applications.find(a => a.id === appId);
        if (!appToUpdate) return;
        
        const updatedApp: Application = {
            ...appToUpdate,
            status: 'Submitted',
            paymentStatus: 'Paid',
            token: `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
            statusHistory: [
                ...appToUpdate.statusHistory,
                { status: 'Payment Confirmed', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` },
                { status: 'Submitted', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` },
            ]
        };

        dispatch({ type: 'UPSERT_APPLICATION', payload: updatedApp });

        setAppForPayment(null);
        setPage('my-applications');
    };
    
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    }

    const renderPage = () => {
        if (!profile) return <div>Loading...</div>;

        switch (page) {
            case 'onboarding':
                return <Onboarding onComplete={handleOnboardingComplete} userId={profile.id} />;
            case 'service-catalog':
                return <ServiceCatalogPage services={services} onSelectService={handleSelectService} />;
            case 'application':
                if (selectedService) {
                    return <ApplicationPage service={selectedService} profile={profile} onSubmit={handleApplicationSubmit} wallet={wallet} />;
                }
                return null;
            case 'my-applications':
                return <MyApplicationsPage applications={applications.filter(a => a.userId === profile.id)} services={services} offices={state.services.flatMap(s => s.offices || [])} onPay={setAppForPayment} />;
            case 'dashboard':
            default:
                return <Dashboard profile={profile} wallet={wallet} onNavigate={handleNavigate} onShowQr={() => setShowQr(true)} />;
        }
    };
    
    if (!profile || !user) return <div>Authenticating...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">Nagarik Card Portal</h1>
                </div>
                <div>
                     {page !== 'dashboard' && <button onClick={() => setPage('dashboard')} className="text-sm font-medium text-[#003893] hover:underline">← Back to Dashboard</button>}
                </div>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
            </div>
            
            <main>
                {renderPage()}
            </main>

            {showQr && <QrCodeModal user={profile} onClose={() => setShowQr(false)} />}
            {appForPayment && (
                <PaymentModal 
                    application={appForPayment}
                    service={services.find(s => s.id === appForPayment.serviceId)}
                    onPaymentSuccess={() => handlePaymentSuccess(appForPayment.id)}
                    onClose={() => setAppForPayment(null)}
                />
            )}
        </div>
    );
};

export default CitizenPortal;