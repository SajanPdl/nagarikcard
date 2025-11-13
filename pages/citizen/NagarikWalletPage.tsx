import React, { useState } from 'react';
// FIX: The CitizenPage type is defined in types.ts and should be imported from there directly.
import { WalletDocument, DocumentType, Service, Application, CitizenPage } from '../../types';
import { FileTextIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon, FilePlusIcon, IdCardIcon, WalletIcon, CreditCardIcon, ShieldLockIcon, HistoryIcon, LandPlotIcon, HealthIcon, QrCodeIcon, BellIcon, BriefcaseIcon, CarIcon, UsersIcon, BookOpenIcon, ScaleIcon, SparklesIcon } from '../../components/icons';
import { MOCK_PAYMENTS_DUE, MOCK_TRANSACTION_HISTORY } from '../../constants';


type WalletTab = 'overview' | 'civic_services' | 'id_cards' | 'documents' | 'payments' | 'security';

interface NagarikWalletPageProps {
    wallet: WalletDocument[];
    onAddDocument: () => void;
    onOpenQr: () => void;
    services: Service[];
    applications: Application[];
    onNavigate: (page: CitizenPage) => void;
    onQuickApply: (serviceCode: string) => void;
}

const getDocumentIcon = (docType: DocumentType) => {
    switch(docType) {
        case 'citizenship':
        case 'driving_license':
        case 'passport':
        case 'pan_card':
            return <IdCardIcon className="w-8 h-8 text-gray-400" />;
        case 'health_card':
            return <HealthIcon className="w-8 h-8 text-gray-400" />;
        case 'land_ownership':
            return <LandPlotIcon className="w-8 h-8 text-gray-400" />;
        default:
            return <FileTextIcon className="w-8 h-8 text-gray-400" />;
    }
}

const getStatusInfo = (status: WalletDocument['verificationStatus']) => {
    switch (status) {
        case 'verified': return { text: 'Verified', icon: <CheckCircleIcon className="w-5 h-5" />, color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' };
        case 'pending': return { text: 'Pending', icon: <AlertTriangleIcon className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-300' };
        case 'rejected': return { text: 'Rejected', icon: <XCircleIcon className="w-5 h-5" />, color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' };
    }
};

// --- Sub-Components for Tabs ---

const OverviewTab: React.FC<{ onOpenQr: () => void }> = ({ onOpenQr }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#003893] to-blue-800 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg">Smart ID Card</h3>
                    <p className="text-sm opacity-80 mt-1">Your universal digital identity for all government services.</p>
                </div>
                <button onClick={onOpenQr} className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <QrCodeIcon className="w-5 h-5"/>
                    <span>Show Smart ID QR</span>
                </button>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                 <h3 className="font-bold text-lg flex items-center mb-4"><BellIcon className="w-5 h-5 mr-2 text-red-500"/> Alerts & Reminders</h3>
                 <div className="space-y-3">
                     <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                        <p className="font-semibold text-red-800">Vehicle Tax Due Soon</p>
                        <p className="text-sm text-red-700">Your vehicle tax for Ba 2 Pa 1234 expires in 4 days.</p>
                     </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
                        <p className="font-semibold text-yellow-800">Passport Verification Pending</p>
                        <p className="text-sm text-yellow-700">Your passport is still awaiting verification from the authorities.</p>
                     </div>
                 </div>
             </div>
        </div>
    </div>
);

const DocumentCard: React.FC<{ doc: WalletDocument }> = ({ doc }) => {
    const statusInfo = getStatusInfo(doc.verificationStatus);
    return (
        <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${statusInfo.borderColor} flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        {getDocumentIcon(doc.docType)}
                        <div>
                            <h3 className="font-bold text-gray-800 capitalize">{doc.docType.replace(/_/g, ' ')}</h3>
                            <p className="text-sm text-gray-500">{doc.documentNumber || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 space-y-1">
                    {doc.issuedDate && <p>Issued: {doc.issuedDate}</p>}
                    {doc.expiryDate && <p>Expires: {doc.expiryDate}</p>}
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-2 text-sm">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition">View</button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition">Share</button>
            </div>
        </div>
    );
};


const IdCardsTab: React.FC<{ documents: WalletDocument[] }> = ({ documents }) => {
    const idCardTypes: DocumentType[] = ['citizenship', 'driving_license', 'passport', 'pan_card', 'health_card'];
    const idCards = documents.filter(d => idCardTypes.includes(d.docType));
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {idCards.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
        </div>
    );
};

const DocumentsTab: React.FC<{ documents: WalletDocument[] }> = ({ documents }) => {
    const otherDocTypes: DocumentType[] = ['birth_certificate', 'land_ownership', 'academic_certificate'];
    const otherDocs = documents.filter(d => otherDocTypes.includes(d.docType));
     return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {otherDocs.length > 0 ? 
                otherDocs.map(doc => <DocumentCard key={doc.id} doc={doc} />) :
                <p className="text-gray-500 md:col-span-2 text-center">No other documents found.</p>
             }
        </div>
    );
};

const CivicServicesTab: React.FC<{
    services: Service[];
    applications: Application[];
    onNavigate: (page: CitizenPage) => void;
    onQuickApply: (serviceCode: string) => void;
}> = ({ services, applications, onNavigate, onQuickApply }) => {
    const recentApplications = applications.slice(0, 2);

    const categories = [
        { name: 'Transport', icon: CarIcon, color: 'text-blue-500' },
        { name: 'Revenue', icon: CreditCardIcon, color: 'text-red-500' },
        { name: 'Civil Registration', icon: UsersIcon, color: 'text-green-500' },
        { name: 'Health', icon: HealthIcon, color: 'text-pink-500' },
        { name: 'Education', icon: BookOpenIcon, color: 'text-purple-500' },
        { name: 'Legal', icon: ScaleIcon, color: 'text-yellow-500' },
    ];
    
    return (
        <div className="space-y-8">
            <div>
                 <h3 className="text-xl font-bold">Civic Service Hub</h3>
                 <p className="text-gray-500 mt-1">Apply for, track, and manage all your government service requests in one place.</p>
            </div>
            
             <div className="relative">
                <input type="text" placeholder="Search for a service... e.g., 'Renew License'" className="w-full p-3 pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-4">Service Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map(cat => (
                        <button key={cat.name} onClick={() => onNavigate('service-catalog')} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all group">
                            <cat.icon className={`w-8 h-8 ${cat.color} mb-2 group-hover:scale-110 transition-transform`} />
                            <span className="text-sm font-semibold text-gray-700 text-center">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg">My Recent Applications</h3>
                     {recentApplications.length > 0 ? (
                        <div className="space-y-4 mt-4">
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
                        <p className="text-center text-gray-500 py-4 mt-4">No recent applications found.</p>
                    )}
                     <button onClick={() => onNavigate('my-applications')} className="mt-4 text-sm font-medium text-blue-600 hover:underline w-full text-right">View All Applications</button>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-lg flex items-center mb-4"><SparklesIcon className="w-5 h-5 mr-2 text-purple-500"/> What's New</h3>
                     <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2"/> AI-powered form auto-fill.</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2"/> Predictive ETA for service completion.</li>
                        <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-2"/> Secure digital signature verification.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const PaymentsTab: React.FC = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-bold mb-4">Due Payments</h3>
            <div className="space-y-4">
                {MOCK_PAYMENTS_DUE.map(payment => (
                    <div key={payment.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{payment.title}</p>
                            <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-lg text-red-600">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(payment.amount)}</p>
                             <button className="text-sm font-semibold text-blue-600 hover:underline">Pay Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
         <div>
            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
            <div className="bg-white p-4 rounded-xl shadow-md">
                 <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {MOCK_TRANSACTION_HISTORY.map((txn, idx) => (
                        <li key={txn.id}>
                            <div className="relative pb-8">
                            {idx !== MOCK_TRANSACTION_HISTORY.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">{txn.description}</p>
                                    <p className="text-sm text-gray-500">{txn.date.toLocaleDateString()}</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-700 font-semibold">
                                     {new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(txn.amount)}
                                </div>
                                </div>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const SecurityTab: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Security Settings</h3>
        <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
                <p>Change Password</p>
                <button className="font-semibold text-blue-600">Change</button>
            </div>
             <div className="flex justify-between items-center p-3 border rounded-lg">
                <p>Two-Factor Authentication (2FA)</p>
                <button className="font-semibold text-blue-600">Enable</button>
            </div>
             <div className="flex justify-between items-center p-3 border rounded-lg">
                <p>Login History</p>
                <button className="font-semibold text-blue-600">View</button>
            </div>
        </div>
    </div>
);


// --- Main Component ---
const NagarikWalletPage: React.FC<NagarikWalletPageProps> = ({ wallet, onAddDocument, onOpenQr, services, applications, onNavigate, onQuickApply }) => {
    const [activeTab, setActiveTab] = useState<WalletTab>('overview');

    const TabButton: React.FC<{ tabName: WalletTab; label: string; icon: React.ElementType }> = ({ tabName, label, icon: Icon }) => (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-semibold rounded-t-lg border-b-4 transition-colors ${
          activeTab === tabName
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </button>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'overview': return <OverviewTab onOpenQr={onOpenQr} />;
            case 'civic_services': return <CivicServicesTab services={services} applications={applications} onNavigate={onNavigate} onQuickApply={onQuickApply} />;
            case 'id_cards': return <IdCardsTab documents={wallet} />;
            case 'documents': return <DocumentsTab documents={wallet} />;
            case 'payments': return <PaymentsTab />;
            case 'security': return <SecurityTab />;
            default: return null;
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Nagarik Wallet</h2>
                 <button onClick={onAddDocument} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center space-x-2">
                    <FilePlusIcon className="w-5 h-5"/>
                    <span>Add Document</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-2 mb-6">
                <nav className="flex items-center space-x-2">
                    <TabButton tabName="overview" label="Overview" icon={WalletIcon} />
                    <TabButton tabName="civic_services" label="Civic Services" icon={BriefcaseIcon} />
                    <TabButton tabName="id_cards" label="ID Cards" icon={IdCardIcon} />
                    <TabButton tabName="documents" label="Documents" icon={FileTextIcon} />
                    <TabButton tabName="payments" label="Payments" icon={CreditCardIcon} />
                    <TabButton tabName="security" label="Security" icon={ShieldLockIcon} />
                </nav>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default NagarikWalletPage;