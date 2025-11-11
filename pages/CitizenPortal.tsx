import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Profile, WalletDocument, Service, Application, Office } from '../types';
import { CheckCircleIcon, NepalFlagIcon, CreditCardIcon, XCircleIcon, AlertTriangleIcon, SathiAiIcon, QrCodeIcon, BriefcaseIcon, HourglassIcon, WalletIcon, BellIcon, MapPinIcon, TrendingUpIcon, IdCardIcon, FilePlusIcon } from '../components/icons';
import ServiceCard from '../components/ServiceCard';
import ApplicationTracker from '../components/ApplicationTracker';
import QrCodeModal from '../components/QrCodeModal';
import PaymentModal from '../components/PaymentModal';
import SathiAiModal from '../components/SathiAiModal';
import DigitalWalletPage from '../components/DigitalWalletPage';
import UploadDocumentModal from '../components/UploadDocumentModal';

// --- Helper Functions ---
export const sha256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- Sub-Components ---
const Dashboard: React.FC<{ 
    profile: Profile, 
    wallet: WalletDocument[], 
    notifications: any[],
    offices: Office[],
    onNavigate: (page: CitizenPage) => void, 
    onShowQr: () => void 
}> = ({ profile, wallet, notifications, offices, onNavigate, onShowQr }) => {
    const [privacyMode, setPrivacyMode] = useState(false);
    const citizenDoc = wallet.find(doc => doc.docType === 'citizenship');

    const getStatusInfo = (status: WalletDocument['verificationStatus']) => {
        switch (status) {
            case 'verified': return { text: 'Verified', icon: <CheckCircleIcon className="w-4 h-4 text-green-400" />, color: 'text-green-300' };
            case 'pending': return { text: 'Pending', icon: <AlertTriangleIcon className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-300' };
            case 'rejected': return { text: 'Rejected', icon: <XCircleIcon className="w-4 h-4 text-red-400" />, color: 'text-red-300' };
            default: return { text: 'Unknown', icon: null, color: '' };
        }
    };

    const citizenStatus = citizenDoc ? getStatusInfo(citizenDoc.verificationStatus) : { text: 'Not Uploaded', icon: <AlertTriangleIcon className="w-4 h-4 text-yellow-400"/>, color: 'text-yellow-300' };
    
    const getShortName = (name: string) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
        }
        return name;
    };
    
    const getCrowdStatus = (officeName: string) => {
        const hash = officeName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const status = ['Low', 'Moderate', 'High'];
        return status[Math.abs(hash) % status.length];
    }


    return (
        <div className="space-y-8">
            {/* Digital ID Card */}
            <div className="bg-gradient-to-br from-[#003893] to-blue-800 text-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <IdCardIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                             <p className="text-2xl font-bold">{privacyMode ? getShortName(profile.name) : profile.name}</p>
                             <div 
                                 className="flex items-center space-x-2 mt-1 cursor-pointer"
                                 onClick={() => onNavigate('wallet')}
                             >
                                {citizenStatus.icon}
                                <span className={`text-sm font-medium ${citizenStatus.color}`}>{citizenStatus.text} Citizenship</span>
                             </div>
                        </div>
                    </div>
                     <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">{privacyMode ? 'Show' : 'Hide'}</span>
                            <button onClick={() => setPrivacyMode(!privacyMode)} className={`w-10 h-5 flex items-center rounded-full transition-colors ${privacyMode ? 'bg-white/30' : 'bg-black/20'}`}>
                                <span className={`w-4 h-4 bg-white rounded-full transform transition-transform ${privacyMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                        <button onClick={onShowQr} className="mt-2 text-sm bg-white/20 hover:bg-white/30 font-semibold py-1 px-3 rounded-lg flex items-center space-x-1.5">
                            <QrCodeIcon className="w-4 h-4"/>
                            <span>Show QR</span>
                        </button>
                     </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <QuickAction icon={<BriefcaseIcon />} label="Apply for Service" onClick={() => onNavigate('service-catalog')} />
                <QuickAction icon={<HourglassIcon />} label="Track Applications" onClick={() => onNavigate('my-applications')} />
                <QuickAction icon={<MapPinIcon />} label="Book Visit/Token" onClick={() => alert("Coming soon!")}/>
                <QuickAction icon={<WalletIcon />} label="Digital Documents" onClick={() => onNavigate('wallet')} />
            </div>

            {/* Information Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-lg flex items-center mb-4"><MapPinIcon className="w-5 h-5 mr-2 text-blue-500" /> Nearby Offices</h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                         {offices.slice(0, 3).map(office => {
                             const crowd = getCrowdStatus(office.name);
                             return (
                                <div key={office.id} className="text-sm border-b border-gray-100 pb-2">
                                    <p className="font-semibold text-gray-800">{office.name}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                        <span>Status: <span className="font-bold text-green-600">Open</span></span>
                                        <span>Queue: <span className="font-bold text-gray-800">102 / 125</span></span>
                                        <span>Crowd: <span className={`font-bold ${crowd === 'Low' ? 'text-green-600' : crowd === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>{crowd}</span></span>
                                    </div>
                                </div>
                             )
                         })}
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-lg flex items-center mb-4"><BellIcon className="w-5 h-5 mr-2 text-red-500" /> Recent Activity</h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                         {notifications.slice(0, 4).map(notif => (
                            <div key={notif.id} className="flex items-start space-x-3 text-sm border-b border-gray-100 pb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                    {notif.type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : <TrendingUpIcon className="w-5 h-5 text-blue-500" />}
                                </div>
                                <p className="text-gray-700">{notif.message}</p>
                            </div>
                         ))}
                     </div>
                 </div>
            </div>
        </div>
    );
};

const QuickAction: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-white p-4 rounded-xl shadow-md text-center font-semibold text-gray-700 hover:bg-gray-100 hover:-translate-y-1 transition-transform flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 flex items-center justify-center text-[#003893]">
{/* FIX: Explicitly cast icon to React.ReactElement<any> to resolve TypeScript overload issue with React.cloneElement. */}
{React.cloneElement(icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
</div>
        <span className="text-sm">{label}</span>
    </button>
);


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
            file: file,
            previewUrl: URL.createObjectURL(file),
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


type CitizenPage = 'dashboard' | 'onboarding' | 'service-catalog' | 'application' | 'my-applications' | 'wallet';

const CitizenPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user, profile, applications, services, wallet, notifications } = state;
    const [page, setPage] = useState<CitizenPage>('dashboard');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showQr, setShowQr] = useState(false);
    const [appForPayment, setAppForPayment] = useState<Application | null>(null);
    const [isSathiAiOpen, setIsSathiAiOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
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
            case 'wallet':
                return <DigitalWalletPage wallet={wallet} onAddDocument={() => setIsUploadModalOpen(true)} />;
            case 'dashboard':
            default:
                return <Dashboard profile={profile} wallet={wallet} notifications={notifications} offices={services.flatMap(s => s.offices)} onNavigate={handleNavigate} onShowQr={() => setShowQr(true)} />;
        }
    };
    
    if (!profile || !user) return <div>Authenticating...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">Nagarik Card Portal</h1>
                </div>
                <div className='flex items-center gap-4'>
                     {page !== 'dashboard' && <button onClick={() => setPage('dashboard')} className="text-sm font-medium text-[#003893] hover:underline whitespace-nowrap">← Back to Dashboard</button>}
                     <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
                </div>
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
            
            {isUploadModalOpen && profile && (
                <UploadDocumentModal
                    userId={profile.id}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={(doc) => dispatch({ type: 'UPSERT_WALLET_DOCUMENT', payload: doc })}
                />
            )}

            <button
                onClick={() => setIsSathiAiOpen(true)}
                className="fixed bottom-6 right-6 bg-[#003893] text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition transform hover:scale-110 z-40"
                aria-label="Open Sathi AI Assistant"
            >
                <SathiAiIcon className="w-6 h-6" />
            </button>

            {isSathiAiOpen && (
                <SathiAiModal
                    services={services}
                    onClose={() => setIsSathiAiOpen(false)}
                />
            )}
        </div>
    );
};

export default CitizenPortal;