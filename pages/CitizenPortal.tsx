
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Profile, WalletDocument, Service, Application, Office } from '../types';
import { CheckCircleIcon, NepalFlagIcon, CreditCardIcon, XCircleIcon, AlertTriangleIcon, SathiAiIcon, QrCodeIcon, BriefcaseIcon, HourglassIcon, WalletIcon, BellIcon, MapPinIcon, TrendingUpIcon, IdCardIcon, FilePlusIcon, BookOpenIcon, AwardIcon, SparklesIcon, ArrowRightIcon } from '../components/icons';
import ServiceCard from '../components/ServiceCard';
import ApplicationTracker from '../components/ApplicationTracker';
import QrCodeModal from '../components/QrCodeModal';
import PaymentModal from '../components/PaymentModal';
import SathiAiModal from '../components/SathiAiModal';
import NagarikWalletPage from './citizen/NagarikWalletPage';
import UploadDocumentModal from '../components/UploadDocumentModal';
import { MOCK_OFFICES } from '../constants';

// --- Helper Functions ---
export const sha256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const NepalMap: React.FC = () => {
    // Adjusted coordinates for a more accurate map representation
    const cities = [
        { name: 'Kathmandu', requests: 150, cx: 585, cy: 305, r: 15 },
        { name: 'Pokhara', requests: 80, cx: 480, cy: 290, r: 10 },
        { name: 'Biratnagar', requests: 50, cx: 830, cy: 405, r: 8 },
        { name: 'Nepalgunj', requests: 45, cx: 290, cy: 280, r: 7 },
        { name: 'Butwal', requests: 60, cx: 440, cy: 345, r: 9 },
        { name: 'Dhangadhi', requests: 30, cx: 160, cy: 230, r: 6 },
        { name: 'Janakpur', requests: 40, cx: 690, cy: 385, r: 7 },
    ];
    const getColor = (requests: number) => {
        if (requests > 100) return '#C8102E'; // Strong red
        if (requests > 60) return '#f97316';  // Orange
        return '#facc15'; // Yellow
    };

    return (
        <div className="bg-gray-100 p-2 rounded-lg flex justify-center items-center aspect-[16/10] -mx-2 sm:-mx-0">
            <style>{`
                .map-dot {
                    transition: transform 0.2s ease-out, r 0.2s ease-out;
                    stroke: rgba(0,0,0,0.2);
                    stroke-width: 1px;
                }
                .map-dot:hover {
                    transform: scale(1.5);
                    stroke: black;
                    stroke-width: 1.5px;
                    stroke-opacity: 0.7;
                }
            `}</style>
            <svg width="100%" height="100%" viewBox="0 0 1002 558" preserveAspectRatio="xMidYMid meet">
                <path
                    d="M991.6 410.7l-22.1-3.3-13.8-13.4-25.9-4.8-15.6 3.3-15.8-9-22.9-2-14-11.2-21.7 3.1-18-12.8-15.8-0.2-14-15.4-26.6-1.5-11.2 5.2-16-16.2-22.1 3.3-10-8.8-19.1-1.3-10.8 9.7-20.9-2-14.2 11-10-15.8-17.7-2.3-18.4 13.8-10.8-14-19.1-1.5-13.8 11.2-12.3-13.4-19.1-3.1-16.9 13.6-13-14-20-4.8-13.6 12.5-14.2-12.5-20.4-3.1-12.5 14.2-16-12.8-19.8-1.5-12.6 14.2-15.1-12.5-18.4-0.2-11.7 11.2-18.2-1.3-11.2 12.5-18.2-2.9-10.3 10-17.1-1.5-11.7 12.5-16.9-2.9-9.3 11.2-18.2-2.9-10.8 11.2-16-1.5-11.2 12.5-13-10-18.4 1.3-9.7 10-16-4.4-11.7 11.2-16-1.5-10.8 10-16-4.4-11.7 11.2-14.7-2.9-10.8 10-16.9-4.4-10.8 11.2-13.8-2.9-10.8 11.2-13-1.5-10 12.5-13.8-2.9-9.3 11.2-14.7-2.9-9.3 11.2-10 1.3-5.6 12.5-8.4-1.5-6.7 12.5-9.3-1.5-6.5 13.6-8.4-1.3-6.7 14.7.2 11.2-8.4 2.9-1.5 11.2-8.4 2.9 1.3 12.5-8.4 2.9 2.9 11.2-8.4 2.9 2.9 12.5 10 2.9 4.4 11.2 10 2.9 2.9 12.5 10 1.5 4.4 11.2 11.2 1.5 2.9 12.5 11.2 2.9 2.9 11.2 11.2 2.9 2.9 11.2 12.5 1.5 1.5 12.5 12.5 2.9 1.5 11.2 12.5 2.9 2.9 11.2 11.2 1.5 2.9 11.2 12.5 2.9 1.5 11.2 12.5 2.9 1.5 11.2 12.5 2.9 1.5 10 13.8 1.5 1.5 10 13.8 1.5 2.9 11.2 12.5 1.5 1.5 11.2 13.8 1.5 1.5 10 13.8 1.5 2.9 11.2 12.5 1.5 1.5 11.2 13.8 1.5 1.5 10 13.8 1.5 2.9 10 12.5 1.5 1.5 10 13.8 1.5 2.9 10 12.5 1.5 1.5 10 13.8 1.5 1.5-12.5 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2z"
                    fill="#e2e8f0"
                    stroke="#a0aec0"
                    strokeWidth="1"
                />
                {cities.map((city) => (
                    <circle
                        key={city.name}
                        cx={city.cx}
                        cy={city.cy}
                        r={city.r}
                        fill={getColor(city.requests)}
                        opacity="0.8"
                        className="map-dot"
                    >
                        <title>{`${city.name}: ${city.requests} Requests`}</title>
                    </circle>
                ))}
            </svg>
        </div>
    );
};


// --- New Dashboard Sub-Components ---
const QuickActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-white p-4 rounded-xl shadow-md text-left font-semibold text-gray-700 hover:bg-gray-100 hover:-translate-y-1 transition-transform flex items-center space-x-3 group">
        <div className="w-12 h-12 flex items-center justify-center text-white bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
            {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
        </div>
        <span className="text-base">{label}</span>
    </button>
);

const Dashboard: React.FC<{ 
    profile: Profile, 
    applications: Application[],
    services: Service[],
    offices: Office[],
    notifications: any[],
    onNavigate: (page: CitizenPage) => void, 
    onOpenAi: () => void,
    onQuickApply: (serviceCode: string) => void,
}> = ({ profile, applications, services, offices, notifications, onNavigate, onOpenAi, onQuickApply }) => {
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const civicFeedItems = [
        { id: 1, title: "Public Holiday Notice", content: "All government offices will be closed tomorrow for Gai Jatra.", category: "National"},
        { id: 2, title: "Kathmandu Valley Traffic Update", content: "Road maintenance scheduled on the Ring Road from 10 PM to 5 AM.", category: "Local" },
        { id: 3, title: "New Digital Service Launched", content: "You can now apply for a National ID card online via GovFlow.", category: "Technology" },
    ];

    const suggestions = [
        { id: 1, title: "License Renewal Due Soon", content: "Your driving license is set to expire in 25 days. Renew now to avoid fines.", action: "Renew License", icon: IdCardIcon, actionServiceCode: 'DL_RENEW' },
    ];

    const recentApplications = applications.slice(0, 2);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">{getGreeting()}, {profile.name.split(' ')[0]}!</h2>
                <p className="text-gray-500 mt-1">Welcome to your personalized civic dashboard.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <QuickActionButton icon={<IdCardIcon />} label="Renew License" onClick={() => onQuickApply('DL_RENEW')} />
                        <QuickActionButton icon={<CreditCardIcon />} label="Pay Land Tax" onClick={() => onQuickApply('LAND_TAX')} />
                        <QuickActionButton icon={<WalletIcon />} label="Nagarik Wallet" onClick={() => onNavigate('nagarik-wallet')} />
                        <QuickActionButton icon={<BriefcaseIcon />} label="All Services" onClick={() => onNavigate('service-catalog')} />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg flex items-center mb-4"><SparklesIcon className="w-5 h-5 mr-2 text-yellow-500" /> For You</h3>
                        <div className="space-y-4">
                            {suggestions.map(sugg => (
                                <div key={sugg.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-center justify-between">
                                    <div className="flex items-center">
                                        <sugg.icon className="w-8 h-8 text-yellow-600 mr-4" />
                                        <div>
                                            <p className="font-semibold text-yellow-800">{sugg.title}</p>
                                            <p className="text-sm text-yellow-700">{sugg.content}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onQuickApply(sugg.actionServiceCode)} className="bg-yellow-500 text-white text-sm font-bold py-1.5 px-3 rounded-md hover:bg-yellow-600 transition whitespace-nowrap">
                                        {sugg.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">My Recent Requests</h3>
                            <button onClick={() => onNavigate('my-applications')} className="text-sm font-medium text-blue-600 hover:underline">View All</button>
                        </div>
                         {recentApplications.length > 0 ? (
                            <div className="space-y-4">
                                {recentApplications.map(app => {
                                    const service = services.find(s => s.id === app.serviceId);
                                    return (
                                        <div key={app.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{service?.name}</p>
                                                    <p className="text-sm text-gray-500">Submitted: {app.submittedAt.toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${ app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{app.status}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No recent applications found.</p>
                        )}
                    </div>
                    
                     <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg flex items-center mb-4"><MapPinIcon className="w-5 h-5 mr-2 text-red-500" /> Service Request Hotspots</h3>
                        <NepalMap />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-gradient-to-br from-[#003893] to-blue-800 text-white rounded-2xl p-6 shadow-xl text-center cursor-pointer hover:shadow-2xl transition-shadow" onClick={onOpenAi}>
                        <SathiAiIcon className="w-10 h-10 mx-auto mb-3" />
                        <h3 className="font-bold text-lg">NepalSeva.AI Assistant</h3>
                        <p className="text-sm opacity-80 mt-1">Ask me anything about services.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold text-lg flex items-center mb-4"><BellIcon className="w-5 h-5 mr-2" /> Notification Center</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                             {notifications.slice(0, 4).map(notif => (
                                <div key={notif.id} className="flex items-start space-x-3 text-sm border-b border-gray-100 pb-2 last:border-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                        {notif.type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : <TrendingUpIcon className="w-5 h-5 text-blue-500" />}
                                    </div>
                                    <p className="text-gray-700">{notif.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                         <h3 className="font-bold text-lg flex items-center mb-4"><BookOpenIcon className="w-5 h-5 mr-2" /> Civic Feed</h3>
                         <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {civicFeedItems.map(item => (
                                <div key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                                    <span className="text-xs font-bold uppercase text-red-600">{item.category}</span>
                                    <p className="font-semibold text-gray-800 mt-1">{item.title}</p>
                                    <p className="text-sm text-gray-600">{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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
            <h2 className="text-2xl font-bold mb-2">Welcome to GovFlow</h2>
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
            <button onClick={handleSubmit} disabled={!file || uploading} className="mt-6 w-full bg-[#C8102E] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-400">
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

            <button onClick={handleSubmit} className="mt-6 w-full bg-[#C8102E] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition flex items-center justify-center space-x-2">
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

const DummyComponentWithError: React.FC = () => {
    console.log("This component had an error because it didn't return anything.");
    return null;
};

const HelpPage: React.FC<{ services: Service[] }> = ({ services }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        { q: "What is GovFlow?", a: "GovFlow is a digital platform designed to make it easy for citizens to access government services online. You can apply for services, track your application status, and manage your official documents in one secure place." },
        { q: "How do I start an application?", a: "From the dashboard, click 'Apply for Service' to see the service catalog. Choose the service you need and click 'Start'. The system will guide you through the process, using documents from your digital wallet to auto-fill forms." },
        { q: "What does 'document verification' mean?", a: "When you upload a document to your digital wallet, it is sent to the relevant government authority for verification. Once verified, you can use it for any service without needing to re-submit it. This process ensures your documents are authentic and secure." },
        { q: "How long does it take for my application to be approved?", a: "Processing times vary by service. Each service in the catalog provides an estimated time. You can track the real-time status of your application on the 'My Applications' page." },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Help & Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Frequently Asked Questions (FAQ)</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border rounded-lg">
                                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center p-4 text-left font-semibold hover:bg-gray-50">
                                    <span>{faq.q}</span>
                                    <span className={`transform transition-transform text-xl ${openFaq === index ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="p-4 border-t bg-gray-50 text-gray-700">
                                        <p>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Service Directory</h3>
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
                        {services.map(service => (
                            <div key={service.id} className="border-b pb-2 last:border-b-0">
                                <p className="font-semibold text-gray-800">{service.name}</p>
                                <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommunityImpactPage: React.FC<{ services: Service[] }> = ({ services }) => {
    const leaderboardData = [
        { rank: 1, name: 'Ramesh K.', points: 1250, badge: '🥇' },
        { rank: 2, name: 'Sita G.', points: 1100, badge: '🥈' },
        { rank: 3, name: 'Anjali P.', points: 980, badge: '🥉' },
        { rank: 4, name: 'Bikash T.', points: 850 },
        { rank: 5, name: 'Priya S.', points: 720 },
        { rank: 6, name: 'Suman D.', points: 680 },
    ];

    const communityStats = {
        requestsCompleted: 2450,
        badgesEarned: 128,
        avgTimeToHelp: '2 hours'
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Community Impact & Engagement</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-3xl font-bold text-blue-600">{communityStats.requestsCompleted.toLocaleString()}</h3>
                    <p className="text-gray-500 mt-1">Services Completed</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-3xl font-bold text-red-600">{communityStats.badgesEarned}</h3>
                    <p className="text-gray-500 mt-1">Civic Badges Earned</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md text-center">
                    <h3 className="text-3xl font-bold text-green-600">{communityStats.avgTimeToHelp}</h3>
                    <p className="text-gray-500 mt-1">Avg. Help Time</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 flex items-center"><AwardIcon className="w-5 h-5 mr-2 text-yellow-500"/> Engagement Leaderboard</h3>
                    <div className="space-y-2">
                        {leaderboardData.map(user => (
                            <div key={user.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-500 w-8">{user.badge || user.rank}</span>
                                    <span className="font-semibold text-gray-800">{user.name}</span>
                                </div>
                                <span className="font-bold text-blue-600">{user.points.toLocaleString()} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg flex items-center mb-4"><MapPinIcon className="w-5 h-5 mr-2 text-red-500" /> Community Request Map</h3>
                    <NepalMap />
                </div>
            </div>
        </div>
    );
};

type CitizenPage = 'dashboard' | 'onboarding' | 'service-catalog' | 'application' | 'my-applications' | 'nagarik-wallet' | 'help' | 'community-impact';

export const CitizenPortal: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { profile, wallet, applications, services, notifications } = state;
  const [page, setPage] = useState<CitizenPage>('dashboard');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appToPay, setAppToPay] = useState<Application | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (profile && wallet.length === 0 && page !== 'onboarding') {
      if (page !== 'dashboard') {
          setPage('onboarding');
      }
    } else if (profile && wallet.length > 0 && page === 'onboarding') {
      setPage('dashboard');
    }
  }, [wallet, profile, page]);

  const handleNavigate = (newPage: CitizenPage) => {
    setPage(newPage);
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setPage('application');
  };
  
  const handleQuickApply = (serviceCode: string) => {
    const service = services.find(s => s.code === serviceCode);
    if (service) {
      handleSelectService(service);
    } else {
      dispatch({type: 'ADD_NOTIFICATION', payload: { message: `Service ${serviceCode} not found.`, type: 'info' }})
    }
  }

  const handleApplicationSubmit = (app: Application) => {
    dispatch({ type: 'UPSERT_APPLICATION', payload: app });
    setAppToPay(app);
  };
  
  const handlePaymentSuccess = () => {
    if (!appToPay) return;
    
    const submittedApp: Application = {
        ...appToPay,
        status: 'Submitted',
        paymentStatus: 'Paid',
        token: `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
        statusHistory: [
            ...appToPay.statusHistory,
            { status: 'Submitted', timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
        ]
    };
    
    dispatch({ type: 'UPSERT_APPLICATION', payload: submittedApp });
    
    setTimeout(() => {
        const processingApp = {
            ...submittedApp,
            status: 'Processing' as const,
             statusHistory: [
                ...submittedApp.statusHistory,
                { status: 'Processing' as const, timestamp: new Date(), hash: `0x${Math.random().toString(16).slice(2, 10)}` }
            ]
        };
        dispatch({ type: 'UPSERT_APPLICATION', payload: processingApp });
    }, 2000);

    setAppToPay(null);
    setPage('my-applications');
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Payment successful! Application submitted.', type: 'success' } });
  };
  
  const handleOnboardingComplete = (doc: WalletDocument) => {
      dispatch({ type: 'UPSERT_WALLET_DOCUMENT', payload: doc });
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Citizenship document uploaded for verification.', type: 'success' } });
      setPage('dashboard');
  }

  const handleUploadDocument = (doc: WalletDocument) => {
    dispatch({ type: 'UPSERT_WALLET_DOCUMENT', payload: doc });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `"${doc.fileName}" uploaded for verification.`, type: 'success' } });
  }

  if (!profile) {
    return <div>Loading citizen profile...</div>;
  }
  
   const SideNavLink: React.FC<{
      pageName: CitizenPage;
      label: string;
      icon: React.ElementType;
    }> = ({ pageName, label, icon: Icon }) => (
      <button
        onClick={() => setPage(pageName)}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          page === pageName
            ? 'bg-[#003893] text-white'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </button>
  );

  const renderPage = () => {
    if (wallet.length === 0 && page !== 'onboarding') {
        return <Onboarding onComplete={handleOnboardingComplete} userId={profile.id} />
    }
    
    switch (page) {
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} userId={profile.id} />;
      case 'service-catalog':
        return <ServiceCatalogPage services={services} onSelectService={handleSelectService} />;
      case 'application':
        return selectedService ? <ApplicationPage service={selectedService} profile={profile} wallet={wallet} onSubmit={handleApplicationSubmit} /> : <p>Service not selected.</p>;
      case 'my-applications':
        return <MyApplicationsPage applications={applications} services={services} offices={MOCK_OFFICES} onPay={(app) => setAppToPay(app)} />;
      case 'nagarik-wallet':
        return <NagarikWalletPage wallet={wallet} onAddDocument={() => setIsUploadModalOpen(true)} onOpenQr={() => setIsQrModalOpen(true)} />;
      case 'help':
        return <HelpPage services={services} />;
      case 'community-impact':
        return <CommunityImpactPage services={services} />;
      case 'dashboard':
      default:
        return <Dashboard 
                  profile={profile} 
                  applications={applications} 
                  services={services}
                  offices={MOCK_OFFICES}
                  notifications={notifications}
                  onNavigate={handleNavigate}
                  onOpenAi={() => setIsAiModalOpen(true)}
                  onQuickApply={handleQuickApply}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPage('dashboard')}>
                        <NepalFlagIcon className="h-8 w-auto" />
                        <h1 className="text-xl font-bold text-gray-800">GovFlow Portal</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsAiModalOpen(true)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><SathiAiIcon className="w-6 h-6"/></button>
                        <button onClick={() => setIsQrModalOpen(true)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><QrCodeIcon className="w-6 h-6"/></button>
                        <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C8102E]">Logout</button>
                    </div>
                </div>
            </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <aside className="lg:col-span-1 bg-white p-4 rounded-xl shadow-md space-y-2 sticky top-24">
                   <SideNavLink pageName="dashboard" label="Dashboard" icon={BriefcaseIcon} />
                   <SideNavLink pageName="my-applications" label="My Applications" icon={BellIcon} />
                   <SideNavLink pageName="service-catalog" label="Service Catalog" icon={BookOpenIcon} />
                   <SideNavLink pageName="nagarik-wallet" label="Nagarik Wallet" icon={WalletIcon} />
                   <SideNavLink pageName="community-impact" label="Community Impact" icon={TrendingUpIcon} />
                   <SideNavLink pageName="help" label="Help & Info" icon={BookOpenIcon} />
                </aside>
                <main className="lg:col-span-3">
                     {renderPage()}
                </main>
            </div>
        </div>

        {isQrModalOpen && <QrCodeModal user={profile} onClose={() => setIsQrModalOpen(false)} />}
        {isAiModalOpen && <SathiAiModal services={services} onClose={() => setIsAiModalOpen(false)} />}
        {isUploadModalOpen && <UploadDocumentModal userId={profile.id} onClose={() => setIsUploadModalOpen(false)} onUpload={handleUploadDocument} />}
        {appToPay && <PaymentModal application={appToPay} service={services.find(s => s.id === appToPay.serviceId)} onPaymentSuccess={handlePaymentSuccess} onClose={() => setAppToPay(null)} />}
    </div>
  );
};