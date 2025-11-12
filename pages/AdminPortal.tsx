import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Service, Application, WalletDocument, Profile } from '../types';
import { NepalFlagIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, UsersIcon, FileCheckIcon, HourglassIcon, BriefcaseIcon, EditIcon, SparklesIcon, TrendingUpIcon } from '../components/icons';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import ServiceEditorModal from '../components/ServiceEditorModal';
import UserEditorModal from '../components/UserEditorModal';

const BarChart: React.FC<{ title: string, data: { label: string, value: number }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-4">{title}</h4>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.label} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm text-gray-600 col-span-1 truncate">{item.label}</span>
                        <div className="col-span-3 bg-gray-200 rounded-full h-5">
                            <div 
                                className="bg-blue-500 h-5 rounded-full flex items-center justify-end"
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                <span className="text-xs font-bold text-white pr-2">{item.value}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const SentimentDonut: React.FC<{ data: { positive: number, neutral: number, negative: number } }> = ({ data }) => {
    const total = data.positive + data.neutral + data.negative;
    if (total === 0) return <div>No sentiment data available.</div>;
    const positivePercent = (data.positive / total) * 100;
    const neutralPercent = (data.neutral / total) * 100;

    const conicGradient = `conic-gradient(
        #22c55e 0% ${positivePercent}%,
        #f59e0b ${positivePercent}% ${positivePercent + neutralPercent}%,
        #ef4444 ${positivePercent + neutralPercent}% 100%
    )`;
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-4">Citizen Sentiment</h4>
            <div className="flex items-center gap-6">
                <div style={{ background: conicGradient }} className="w-32 h-32 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{total}</span>
                        <span className="text-xs text-gray-500">Total</span>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Positive: <span className="font-semibold ml-1">{data.positive}</span></div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div> Neutral: <span className="font-semibold ml-1">{data.neutral}</span></div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Negative: <span className="font-semibold ml-1">{data.negative}</span></div>
                </div>
            </div>
        </div>
    );
}

const NepalHeatmap: React.FC = () => (
    <div>
        <h4 className="font-semibold text-gray-700 mb-4">Request Density Heatmap</h4>
        <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center aspect-video">
            <svg width="100%" height="100%" viewBox="0 0 550 280">
                <path d="M545 229L521 217L515 198L485 186L474 163L435 163L418 174L388 163L336 128L281 127L229 113L208 92L167 71L124 53L101 43L70 41L45 42L25 53L4 74L1 95L12 116L40 128L57 141L95 151L124 162L167 178L205 192L249 203L282 220L319 231L345 237L392 240L439 240L488 234Z" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="2"/>
                <circle cx="282" cy="220" r="15" fill="red" opacity="0.6"><title>Kathmandu: 150 Requests</title></circle>
                <circle cx="124" cy="162" r="10" fill="orange" opacity="0.6"><title>Pokhara: 80 Requests</title></circle>
                <circle cx="485" cy="186" r="8" fill="yellow" opacity="0.6"><title>Biratnagar: 50 Requests</title></circle>
                 <circle cx="45" cy="100" r="7" fill="yellow" opacity="0.6"><title>Nepalgunj: 45 Requests</title></circle>
            </svg>
        </div>
    </div>
);

const AnalyticsPage: React.FC<{ applications: Application[], services: Service[] }> = ({ applications, services }) => {
    
    const serviceVolumeData = useMemo(() => {
        return services.map(s => ({
            label: s.name,
            value: applications.filter(a => a.serviceId === s.id).length
        })).sort((a, b) => b.value - a.value);
    }, [applications, services]);

    const sentimentData = useMemo(() => {
        return applications.reduce((acc, app) => {
            if (app.sentiment) {
                acc[app.sentiment]++;
            }
            return acc;
        }, { positive: 0, neutral: 0, negative: 0 });
    }, [applications]);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
            <div className="space-y-8">
                <BarChart title="Service Request Volume" data={serviceVolumeData} />
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
                    <SentimentDonut data={sentimentData} />
                    <NepalHeatmap />
                </div>
            </div>
        </div>
    );
};


const AdminPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, allCitizenProfiles, allWalletDocuments } = state;
    
    const [activeTab, setActiveTab] = useState('applications');
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
    const [selectedUserId, setSelectedUserId] = useState<string>(allCitizenProfiles[0]?.id || '');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [isServiceEditorOpen, setIsServiceEditorOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Profile | null>(null);

    const systemHealthData = [
        { name: 'Document Verification', status: 'Operational' },
        { name: 'Application Processing', status: 'Operational' },
        { name: 'Notification Service', status: 'Operational' },
        { name: 'Database Connectivity', status: 'Operational' },
        { name: 'Citizen Authentication', status: 'Operational' },
    ];
    
    const filteredApplications = useMemo(() => 
        applications.filter(app => app.serviceId === selectedServiceId),
        [applications, selectedServiceId]
    );

    const queue = useMemo(() => 
        filteredApplications.filter(app => app.status === 'Approved').sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime()),
        [filteredApplications]
    );

    const selectedUserDocs = useMemo(() => 
        allWalletDocuments.filter(doc => doc.user_id === selectedUserId),
        [allWalletDocuments, selectedUserId]
    );
    
    const citizensWithDocCount = useMemo(() => {
        return allCitizenProfiles.map(profile => {
            const docCount = allWalletDocuments.filter(doc => doc.user_id === profile.id).length;
            return { ...profile, docCount };
        });
    }, [allCitizenProfiles, allWalletDocuments]);
    
    const kpis = useMemo(() => {
        const activeUsers = allCitizenProfiles.length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const processedToday = applications.filter(app => {
            const lastStatus = app.statusHistory[app.statusHistory.length - 1];
            return (lastStatus.status === 'Approved' || lastStatus.status === 'Called') && lastStatus.timestamp >= today;
        }).length;

        const approvedApps = applications.filter(app => 
            app.statusHistory.some(h => h.status === 'Approved')
        );

        let avgApprovalTime = 'N/A';
        if (approvedApps.length > 0) {
            const totalTime = approvedApps.reduce((acc, app) => {
                const submittedTime = app.statusHistory.find(h => h.status === 'Submitted')?.timestamp;
                const approvedTime = app.statusHistory.find(h => h.status === 'Approved')?.timestamp;
                if (submittedTime && approvedTime) {
                    return acc + (approvedTime.getTime() - submittedTime.getTime());
                }
                return acc;
            }, 0);
            const avgTimeMs = totalTime / approvedApps.length;
            const avgTimeDays = (avgTimeMs / (1000 * 60 * 60 * 24)).toFixed(1);
            avgApprovalTime = `${avgTimeDays} days`;
        }
        
        return { activeUsers, processedToday, avgApprovalTime };
    }, [allCitizenProfiles, applications]);


    const handleCallNext = () => {
        const nextInQueue = queue[0];
        if (nextInQueue && nextInQueue.token) {
            dispatch({ type: 'CALL_NEXT_TOKEN', payload: nextInQueue.token });
        }
    };

    const handleVerify = (documentId: string) => {
        dispatch({ type: 'VERIFY_DOCUMENT', payload: { documentId } });
    };
    
    const handleReject = (documentId: string) => {
        dispatch({ type: 'REJECT_DOCUMENT', payload: { documentId } });
    };
    
    const openServiceEditor = (service: Service | null) => {
        setEditingService(service);
        setIsServiceEditorOpen(true);
    };
    
    const handleSaveService = (service: Service) => {
        dispatch({ type: 'UPSERT_SERVICE', payload: service });
        setIsServiceEditorOpen(false);
    };

    const openUserEditor = (user: Profile) => {
        setEditingUser(user);
        setIsUserEditorOpen(true);
    };

    const handleSaveUser = (user: Profile) => {
        dispatch({ type: 'UPDATE_PROFILE', payload: user });
        setIsUserEditorOpen(false);
    };

    const tabs = [
        { name: 'Applications', id: 'applications', icon: HourglassIcon },
        { name: 'Services', id: 'services', icon: BriefcaseIcon },
        { name: 'Citizens', id: 'citizens', icon: UsersIcon },
        { name: 'Analytics', id: 'analytics', icon: TrendingUpIcon },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">GovOps Dashboard</h1>
                </div>
                <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C8102E]">Logout</button>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Center Content: Main Panels */}
                <div className="lg:col-span-3">
                    <div className="flex border-b border-gray-200 mb-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg -mb-px focus:outline-none ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-[#003893] text-[#003893]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>
                    
                    {activeTab === 'applications' && (
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4">Application Management</h2>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                                <select 
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md w-full sm:w-auto"
                                >
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <button 
                                    onClick={handleCallNext} 
                                    disabled={queue.length === 0}
                                    className="bg-[#C8102E] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-400 w-full sm:w-auto"
                                >
                                    Call Next (Token: {queue[0]?.token || 'N/A'})
                                </button>
                            </div>
                             <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredApplications.length > 0 ? filteredApplications.sort((a,b) => b.submittedAt.getTime() - a.submittedAt.getTime()).map((app) => {
                                            const citizen = allCitizenProfiles.find(p => p.id === app.userId);
                                            return (
                                                <tr key={app.id} onClick={() => setSelectedApp(app)} className="cursor-pointer hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.token || 'N/A'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{citizen?.name || 'Unknown'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.submittedAt.toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.status}</td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-8 text-gray-500">No applications for this service.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h2 className="text-2xl font-bold">Service Management</h2>
                                <button onClick={() => openServiceEditor(null)} className="bg-[#003893] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-800 transition text-sm w-full sm:w-auto">
                                    Add New Service
                                </button>
                            </div>
                            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {services.map((service) => (
                                            <tr key={service.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {service.fee}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                    <button onClick={() => openServiceEditor(service)} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'citizens' && (
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold mb-4">Citizen Directory</h2>
                            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Docs</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {citizensWithDocCount.length > 0 ? citizensWithDocCount.map((citizen) => (
                                            <tr key={citizen.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{citizen.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{citizen.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{citizen.phone || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-medium">{citizen.docCount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                    <button onClick={() => openUserEditor(citizen)} className="text-blue-600 hover:text-blue-900 font-medium p-1 hover:bg-blue-50 rounded-md">
                                                        <EditIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-500">No citizens have registered yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <AnalyticsPage applications={applications} services={services} />
                    )}
                </div>

                {/* Right side: KPIs and other panels */}
                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4 flex items-center"><TrendingUpIcon className="w-5 h-5 mr-2 text-blue-500"/>Key Metrics</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <UsersIcon className="w-8 h-8 mx-auto text-blue-500 mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">{kpis.activeUsers}</p>
                                <p className="text-xs text-gray-500">Active Users</p>
                            </div>
                            <div>
                                <FileCheckIcon className="w-8 h-8 mx-auto text-green-500 mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">{kpis.processedToday}</p>
                                <p className="text-xs text-gray-500">Processed Today</p>
                            </div>
                            <div>
                                <HourglassIcon className="w-8 h-8 mx-auto text-yellow-500 mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">{kpis.avgApprovalTime}</p>
                                <p className="text-xs text-gray-500">Avg. Approval</p>
                            </div>
                        </div>
                    </div>

                     <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-purple-500"/>Real-time Analytics</h3>
                        <div className="space-y-4 text-sm">
                             <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                                <p className="font-semibold text-yellow-800">Workload Alert</p>
                                <p className="text-yellow-700">High volume detected for Driving License Renewals. Suggest prioritizing older applications.</p>
                             </div>
                             <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                                <p className="font-semibold text-blue-800">Citizen Sentiment</p>
                                <p className="text-blue-700">Overall feedback sentiment is trending <span className="font-bold">Positive</span> this week.</p>
                             </div>
                             <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-md">
                                <p className="font-semibold text-green-800">Efficiency Insight</p>
                                <p className="text-green-700">Land Tax payments are processing 25% faster than average.</p>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4">System Health</h3>
                        <div className="space-y-3">
                            {systemHealthData.map(service => (
                                <div key={service.name} className="flex justify-between items-center text-sm">
                                    <p className="text-gray-600">{service.name}</p>
                                    <div className={`flex items-center space-x-2 font-medium ${service.status === 'Operational' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'Operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span>{service.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            {selectedApp && (
                <ApplicationDetailModal 
                    application={selectedApp}
                    service={services.find(s => s.id === selectedApp.serviceId)}
                    citizen={allCitizenProfiles.find(p => p.id === selectedApp.userId)}
                    onClose={() => setSelectedApp(null)}
                />
            )}
            {isServiceEditorOpen && (
                <ServiceEditorModal
                    serviceToEdit={editingService}
                    onSave={handleSaveService}
                    onClose={() => setIsServiceEditorOpen(false)}
                />
            )}
            {isUserEditorOpen && (
                <UserEditorModal
                    userToEdit={editingUser}
                    onSave={handleSaveUser}
                    onClose={() => setIsUserEditorOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminPortal;