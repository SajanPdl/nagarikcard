import React, { useContext, useState, useMemo, useEffect } from 'react';
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

const KioskActivityMap: React.FC = () => (
    <div>
        <h4 className="font-semibold text-gray-700 mb-4">Live Kiosk Activity Map</h4>
        <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center aspect-video">
            <svg width="100%" height="100%" viewBox="0 0 846 228">
                <path d="M845.3,212.4l-31.1-15.3l-7.7-25.1l-38.6-15.4l-14.3-29.6l-50.5-0.1l-22.1,14.4l-38.9-14.2l-67.4-45.6L509,114.3l-67.1-18.4l-26.6-27.1L355,47.3L298.6,28L268.9,15.2l-40.4-2.8l-32.9,1.1l-26,14.4L114,68.3L89.1,93.4l14.2,28.2l35.7,16.5l22.7,17.2l49.2,13l42.6,14.3l49,18.4l43.7,18.1l56.8,14.3l42.6,15.3l42.5,14.3l27.1,8.6l59.4,3.7l60.7-0.4l63.2-8Z" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="1"/>
                <circle cx="490" cy="140" r="15" fill="red" opacity="0.6"><title>Kathmandu Kiosk: 150 Requests</title></circle>
                <circle cx="320" cy="120" r="10" fill="orange" opacity="0.6"><title>Pokhara Kiosk: 80 Requests</title></circle>
                <circle cx="730" cy="190" r="8" fill="yellow" opacity="0.6"><title>Biratnagar Kiosk: 50 Requests</title></circle>
                <circle cx="150" cy="130" r="7" fill="yellow" opacity="0.6"><title>Nepalgunj Kiosk: 45 Requests</title></circle>
            </svg>
        </div>
    </div>
);

const RealTimeVolumeChart: React.FC = () => {
    const [data, setData] = useState<{ time: string, requests: number }[]>([]);

    useEffect(() => {
        const generateInitialData = () => {
            const now = new Date();
            const initialData = Array.from({ length: 24 }, (_, i) => {
                const date = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
                return {
                    time: `${date.getHours()}:00`,
                    requests: Math.floor(Math.random() * 20) + 5,
                };
            });
            setData(initialData);
        };
        generateInitialData();

        const interval = setInterval(() => {
            setData(prevData => {
                const now = new Date();
                const newData = [...prevData.slice(1)];
                const lastRequests = newData[newData.length - 1].requests;
                const newRequests = Math.max(5, lastRequests + Math.floor(Math.random() * 7) - 3);
                newData.push({ time: `${now.getHours()}:${now.getMinutes()}`, requests: newRequests });
                return newData;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const SVG_WIDTH = 600;
    const SVG_HEIGHT = 250;
    const PADDING = 40;
    const chartWidth = SVG_WIDTH - PADDING * 2;
    const chartHeight = SVG_HEIGHT - PADDING * 2;

    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.requests), 10);
    const xStep = chartWidth / (data.length - 1);

    const getCoords = (requests: number, index: number) => {
        const x = PADDING + index * xStep;
        const y = SVG_HEIGHT - PADDING - (requests / maxValue) * chartHeight;
        return { x, y };
    };

    const linePath = data.map((d, i) => {
        const { x, y } = getCoords(d.requests, i);
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');

    const areaPath = `${linePath} L${SVG_WIDTH - PADDING},${SVG_HEIGHT - PADDING} L${PADDING},${SVG_HEIGHT - PADDING} Z`;
    const lastPoint = getCoords(data[data.length - 1].requests, data.length - 1);
    
    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-4">Real-time Request Volume (All Kiosks)</h4>
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#003893" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#003893" stopOpacity="0"/>
                    </linearGradient>
                </defs>

                {/* Grid */}
                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                    <line key={tick}
                        x1={PADDING} y1={SVG_HEIGHT - PADDING - tick * chartHeight}
                        x2={SVG_WIDTH - PADDING} y2={SVG_HEIGHT - PADDING - tick * chartHeight}
                        stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3"
                    />
                ))}

                {/* Y Axis Labels */}
                {[0, 0.5, 1].map(tick => (
                    <text key={tick} x={PADDING - 8} y={SVG_HEIGHT - PADDING - tick * chartHeight + 4} textAnchor="end" className="text-xs fill-current text-gray-500">
                        {Math.round(tick * maxValue)}
                    </text>
                ))}

                {/* X Axis Labels */}
                 <text x={PADDING} y={SVG_HEIGHT - PADDING + 20} textAnchor="start" className="text-xs fill-current text-gray-500">24h ago</text>
                 <text x={PADDING + chartWidth / 2} y={SVG_HEIGHT - PADDING + 20} textAnchor="middle" className="text-xs fill-current text-gray-500">12h ago</text>
                 <text x={SVG_WIDTH - PADDING} y={SVG_HEIGHT - PADDING + 20} textAnchor="end" className="text-xs fill-current text-gray-500">Now</text>
                
                <path d={areaPath} fill="url(#areaGradient)" style={{ transition: 'd 0.3s ease-in-out' }}/>
                <path d={linePath} fill="none" stroke="#003893" strokeWidth="2" style={{ transition: 'd 0.3s ease-in-out' }} />

                {/* Live point indicator */}
                <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill="#003893" fillOpacity="0.2">
                    <animate attributeName="r" from="4" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                </circle>
                <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#003893" stroke="white" strokeWidth="2" />
            </svg>
        </div>
    );
};

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
                <div className="pb-8 border-b border-gray-200">
                    <RealTimeVolumeChart />
                </div>
                <BarChart title="Total Request Volume By Service" data={serviceVolumeData} />
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                    <SentimentDonut data={sentimentData} />
                    <KioskActivityMap />
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