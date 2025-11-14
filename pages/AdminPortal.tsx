

import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Service, Application, WalletDocument, Profile, Notification, Office } from '../types';
import { MOCK_OFFICES } from '../constants';
import { NepalFlagIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, UsersIcon, FileCheckIcon, HourglassIcon, BriefcaseIcon, EditIcon, SparklesIcon, TrendingUpIcon, BellIcon, BuildingIcon, WalletIcon, HistoryIcon, FileTextIcon } from '../components/icons';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import ServiceEditorModal from '../components/ServiceEditorModal';
import UserEditorModal from '../components/UserEditorModal';
import DigitalWalletPage from '../components/DigitalWalletPage';

const BarChart: React.FC<{ title: string, data: { label: string, value: number }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h4>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.label} className="grid grid-cols-4 gap-2 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 col-span-1 truncate">{item.label}</span>
                        <div className="col-span-3 bg-gray-200 dark:bg-gray-700 rounded-full h-5">
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
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Citizen Sentiment</h4>
            <div className="flex items-center gap-6">
                <div style={{ background: conicGradient }} className="w-32 h-32 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{total}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
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
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Live Kiosk Activity Map</h4>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex justify-center items-center aspect-video">
            <svg width="100%" height="100%" viewBox="0 0 846 228">
                <path d="M845.3,212.4l-31.1-15.3l-7.7-25.1l-38.6-15.4l-14.3-29.6l-50.5-0.1l-22.1,14.4l-38.9-14.2l-67.4-45.6L509,114.3l-67.1-18.4l-26.6-27.1L355,47.3L298.6,28L268.9,15.2l-40.4-2.8l-32.9,1.1l-26,14.4L114,68.3L89.1,93.4l14.2,28.2l35.7,16.5l22.7,17.2l49.2,13l42.6,14.3l49,18.4l43.7,18.1l56.8,14.3l42.6,15.3l42.5,14.3l27.1,8.6l59.4,3.7l60.7-0.4l63.2-8Z" fill="#e0e0e0" className="dark:fill-gray-600" stroke="#a0a0a0" strokeWidth="1"/>
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
    const { state } = useContext(AppContext);
    const isDarkMode = state.theme === 'dark';

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
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Real-time Request Volume (All Kiosks)</h4>
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
                        stroke={isDarkMode ? '#374151' : '#e5e7eb'} strokeWidth="1" strokeDasharray="3,3"
                    />
                ))}

                {/* Y Axis Labels */}
                {[0, 0.5, 1].map(tick => (
                    <text key={tick} x={PADDING - 8} y={SVG_HEIGHT - PADDING - tick * chartHeight + 4} textAnchor="end" className="text-xs fill-current text-gray-500 dark:text-gray-400">
                        {Math.round(tick * maxValue)}
                    </text>
                ))}

                {/* X Axis Labels */}
                 <text x={PADDING} y={SVG_HEIGHT - PADDING + 20} textAnchor="start" className="text-xs fill-current text-gray-500 dark:text-gray-400">24h ago</text>
                 <text x={PADDING + chartWidth / 2} y={SVG_HEIGHT - PADDING + 20} textAnchor="middle" className="text-xs fill-current text-gray-500 dark:text-gray-400">12h ago</text>
                 <text x={SVG_WIDTH - PADDING} y={SVG_HEIGHT - PADDING + 20} textAnchor="end" className="text-xs fill-current text-gray-500 dark:text-gray-400">Now</text>
                
                <path d={areaPath} fill="url(#areaGradient)" style={{ transition: 'd 0.3s ease-in-out' }}/>
                <path d={linePath} fill="none" stroke="#003893" strokeWidth="2" style={{ transition: 'd 0.3s ease-in-out' }} />

                {/* Live point indicator */}
                <circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill="#003893" fillOpacity="0.2">
                    <animate attributeName="r" from="4" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                </circle>
                <circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#003893" stroke={isDarkMode ? '#111827' : 'white'} strokeWidth="2" />
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
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
            <div className="space-y-8">
                <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                    <RealTimeVolumeChart />
                </div>
                <BarChart title="Total Request Volume By Service" data={serviceVolumeData} />
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <SentimentDonut data={sentimentData} />
                    <KioskActivityMap />
                </div>
            </div>
        </div>
    );
};


// --- Notification Portal Components ---
const priorityStyles = {
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', border: 'border-red-500' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-500' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-500' },
    low: { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-500' },
};

const NotificationCard: React.FC<{ notification: Notification, isSelected: boolean, onSelect: () => void }> = ({ notification, isSelected, onSelect }) => {
    const office = MOCK_OFFICES.find(o => o.id === notification.office.office_id);
    const priority = priorityStyles[notification.priority];

    return (
        <div onClick={onSelect} className={`p-4 border-l-4 ${priority.border} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'} rounded-r-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
            <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{notification.title}</p>
                {!notification.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1"></div>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{office?.name || 'System Wide'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 truncate">{notification.body}</p>
            <div className="flex justify-between items-center mt-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${priority.bg} ${priority.text}`}>{notification.priority}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    )
};


const NotificationPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { notifications } = state;
    const [selectedOfficeId, setSelectedOfficeId] = useState<string | 'all'>('all');
    const [selectedMunicipality, setSelectedMunicipality] = useState<string | 'all'>('all');
    const [selectedWard, setSelectedWard] = useState<string | 'all'>('all');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(notifications[0] || null);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const municipalities = useMemo(() => [...new Set(notifications.map(n => n.office.district).filter(Boolean))], [notifications]);
    
    const wards = useMemo(() => {
        if (selectedMunicipality === 'all') {
            return [...new Set(notifications.map(n => n.office.ward).filter(Boolean))].sort((a,b) => parseInt(a) - parseInt(b));
        }
        return [...new Set(notifications.filter(n => n.office.district === selectedMunicipality).map(n => n.office.ward).filter(Boolean))].sort((a,b) => parseInt(a) - parseInt(b));
    }, [notifications, selectedMunicipality]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const officeMatch = selectedOfficeId === 'all' || n.office.office_id === selectedOfficeId;
            const municipalityMatch = selectedMunicipality === 'all' || n.office.district === selectedMunicipality;
            const wardMatch = selectedWard === 'all' || n.office.ward === selectedWard;
            const readMatch = filter === 'all' || !n.read;
            return officeMatch && municipalityMatch && wardMatch && readMatch;
        });
    }, [notifications, selectedOfficeId, selectedMunicipality, selectedWard, filter]);
    
    useEffect(() => {
        if (filteredNotifications.length > 0 && !filteredNotifications.find(n => n.id === selectedNotification?.id)) {
            setSelectedNotification(filteredNotifications[0]);
        } else if (filteredNotifications.length === 0) {
            setSelectedNotification(null);
        }
    }, [filteredNotifications, selectedNotification]);

    const handleSelectNotification = (notification: Notification) => {
        setSelectedNotification(notification);
        if(!notification.read) {
            dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId: notification.id, read: true } });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md min-h-[70vh] flex">
            {/* Left Sidebar - Office Tree */}
            <div className="w-1/4 border-r dark:border-gray-700 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Offices</h3>
                <ul className="space-y-1">
                    <li>
                        <button onClick={() => setSelectedOfficeId('all')} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedOfficeId === 'all' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>All Offices</button>
                    </li>
                    {MOCK_OFFICES.map(office => (
                        <li key={office.id}>
                            <button onClick={() => setSelectedOfficeId(office.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${selectedOfficeId === office.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{office.name}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Center Feed - Notifications List */}
            <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                <div className="p-4 border-b dark:border-gray-700 sticky top-0 bg-gray-50 dark:bg-gray-900/50 z-10 space-y-3">
                    <div className="flex space-x-2">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
                        <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-sm rounded-full ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Unread</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <select value={selectedMunicipality} onChange={(e) => {setSelectedMunicipality(e.target.value); setSelectedWard('all');}} className="w-full text-xs border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm">
                            <option value="all">All Municipalities</option>
                            {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="w-full text-xs border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm" disabled={wards.length === 0}>
                            <option value="all">All Wards</option>
                            {wards.map(w => <option key={w} value={w}>Ward {w}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {filteredNotifications.map(n => (
                        <NotificationCard key={n.id} notification={n} isSelected={selectedNotification?.id === n.id} onSelect={() => handleSelectNotification(n)} />
                    ))}
                </div>
            </div>

            {/* Right Detail Pane */}
            <div className="w-5/12 p-6 overflow-y-auto">
                {selectedNotification ? (
                    <div>
                        <h2 className="text-xl font-bold mb-2">{selectedNotification.title}</h2>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span>{MOCK_OFFICES.find(o => o.id === selectedNotification.office.office_id)?.name}</span>
                            <span>&bull;</span>
                            <span>{new Date(selectedNotification.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedNotification.body}</p>
                        
                        <div className="mt-6 pt-6 border-t dark:border-gray-700">
                            <h4 className="font-semibold mb-2">Audit Trail</h4>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                {selectedNotification.audit.map((entry, i) => (
                                    <li key={i}>
                                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                        <span className="capitalize"> {entry.action} by {entry.actor}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <BellIcon className="w-16 h-16 mb-4"/>
                        <p>Select a notification to view details.</p>
                    </div>
                )}
            </div>
        </div>
    )
}


// --- Sub-components for Application Management ---

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string; description: string; }> = ({ icon: Icon, title, value, description }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>
    </div>
);

const OfficeDashboard: React.FC<{
    setView: (view: 'dashboard' | 'queue') => void;
    applications: Application[];
    services: Service[];
    allCitizenProfiles: Profile[];
}> = ({ setView, applications, services, allCitizenProfiles }) => {

    const isToday = (someDate: Date) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
               someDate.getMonth() === today.getMonth() &&
               someDate.getFullYear() === today.getFullYear();
    };

    const stats = useMemo(() => {
        const pendingStatuses = ['Submitted', 'Processing', 'More Info Requested'];
        const totalPending = applications.filter(a => pendingStatuses.includes(a.status)).length;
        const pendingToday = applications.filter(a => pendingStatuses.includes(a.status) && isToday(new Date(a.submittedAt))).length;
        
        const completedToday = applications.filter(a => {
            const lastStatus = a.statusHistory[a.statusHistory.length - 1];
            return (a.status === 'Approved' || a.status === 'Rejected') && lastStatus && isToday(new Date(lastStatus.timestamp));
        }).length;

        return { totalPending, pendingToday, completedToday };
    }, [applications]);

     const serviceVolumeData = useMemo(() => {
        return services.map(s => ({
            label: s.name,
            value: applications.filter(a => a.serviceId === s.id && (a.status === 'Processing' || a.status === 'Submitted')).length
        })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
    }, [applications, services]);

    const recentApplications = useMemo(() => {
        return [...applications].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);
    }, [applications]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold">Office Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, here's your workload overview.</p>
                </div>
                 <button 
                    onClick={() => setView('queue')}
                    className="bg-[#C8102E] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition mt-2 sm:mt-0"
                >
                    View Full Application Queue
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={HourglassIcon} title="Today's Pending Cases" value={stats.pendingToday.toString()} description="New requests received today." />
                <StatCard icon={BriefcaseIcon} title="Total Pending" value={stats.totalPending.toString()} description="All unresolved applications." />
                <StatCard icon={CheckCircleIcon} title="Completed Today" value={stats.completedToday.toString()} description="Applications approved or rejected today." />
                <StatCard icon={HistoryIcon} title="Avg. Processing Time" value="2.5 Days" description="Based on last 7 days." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart title="Pending Volume By Service" data={serviceVolumeData} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h4>
                    <ul className="space-y-4">
                        {recentApplications.map(app => {
                             const citizen = allCitizenProfiles.find(p => p.id === app.userId);
                             const service = services.find(s => s.id === app.serviceId);
                             return (
                                <li key={app.id} className="flex items-center space-x-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-xs shrink-0">
                                        {citizen?.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            <span className="font-bold">{citizen?.name || 'Unknown'}</span> applied for <span className="font-bold">{service?.name || 'a service'}</span>.
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(app.submittedAt).toLocaleString()}</p>
                                    </div>
                                </li>
                             )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ApplicationQueue: React.FC<{
    setView: (view: 'dashboard' | 'queue') => void;
}> = ({ setView }) => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, allCitizenProfiles } = state;

    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const filteredApplications = useMemo(() => 
        applications.filter(app => app.serviceId === selectedServiceId),
        [applications, selectedServiceId]
    );

    const queue = useMemo(() => 
        filteredApplications.filter(app => app.status === 'Approved').sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()),
        [filteredApplications]
    );

     const handleCallNext = () => {
        const nextInQueue = queue[0];
        if (nextInQueue && nextInQueue.token) {
            dispatch({ type: 'CALL_NEXT_TOKEN', payload: nextInQueue.token });
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                 <button onClick={() => setView('dashboard')} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#003893] dark:hover:text-blue-400 mr-4">
                    &larr; Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold">Application Queue</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <select 
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md w-full sm:w-auto"
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
             <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Token</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredApplications.length > 0 ? filteredApplications.sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map((app) => {
                            const citizen = allCitizenProfiles.find(p => p.id === app.userId);
                            return (
                                <tr key={app.id} onClick={() => setSelectedApp(app)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{app.token || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{citizen?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(app.submittedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.status}</td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No applications for this service.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedApp && (
                <ApplicationDetailModal 
                    application={selectedApp}
                    service={services.find(s => s.id === selectedApp.serviceId)}
                    citizen={allCitizenProfiles.find(p => p.id === selectedApp.userId)}
                    onClose={() => setSelectedApp(null)}
                />
            )}
        </div>
    );
};


// --- Main Admin Portal Component ---
const AdminPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, allCitizenProfiles, allWalletDocuments } = state;
    
    const [activeTab, setActiveTab] = useState('applications');
    const [applicationView, setApplicationView] = useState<'dashboard' | 'queue'>('dashboard');
    
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [isServiceEditorOpen, setIsServiceEditorOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Profile | null>(null);
    const [viewingCitizenWallet, setViewingCitizenWallet] = useState<Profile | null>(null);
    

    const citizensWithDocCount = useMemo(() => {
        return allCitizenProfiles.map(profile => {
            const docCount = allWalletDocuments.filter(doc => doc.user_id === profile.id).length;
            const pendingCount = allWalletDocuments.filter(doc => doc.user_id === profile.id && doc.verificationStatus === 'pending').length;
            return { ...profile, docCount, pendingCount };
        });
    }, [allCitizenProfiles, allWalletDocuments]);

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
        { name: 'Notifications', id: 'notifications', icon: BellIcon },
        { name: 'Services', id: 'services', icon: BriefcaseIcon },
        { name: 'Citizens', id: 'citizens', icon: UsersIcon },
        { name: 'Analytics', id: 'analytics', icon: TrendingUpIcon },
    ];

    const citizenWalletDocs = useMemo(() => {
        if (!viewingCitizenWallet) return [];
        return allWalletDocuments.filter(doc => doc.user_id === viewingCitizenWallet.id);
    }, [viewingCitizenWallet, allWalletDocuments]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <main>
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex shrink-0 items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg -mb-px focus:outline-none ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-[#003893] text-[#003893] dark:text-blue-400 dark:border-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
                
                {activeTab === 'applications' && (
                    applicationView === 'dashboard'
                    ? <OfficeDashboard 
                        setView={setApplicationView} 
                        applications={applications} 
                        services={services} 
                        allCitizenProfiles={allCitizenProfiles} 
                      />
                    : <ApplicationQueue setView={setApplicationView} />
                )}

                 {activeTab === 'citizens' && (
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Citizen Management</h2>
                        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {citizensWithDocCount.map(citizen => (
                                        <tr key={citizen.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{citizen.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{citizen.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {citizen.docCount} total
                                                {citizen.pendingCount > 0 && 
                                                    <span className="ml-2 text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{citizen.pendingCount} pending</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => setViewingCitizenWallet(citizen)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">View Wallet</button>
                                                <button onClick={() => openUserEditor(citizen)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'notifications' && <NotificationPortal />}

                {activeTab === 'analytics' && <AnalyticsPage applications={applications} services={services} />}
                
                 {activeTab === 'services' && (
                     <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-2xl font-bold">Service Configuration</h2>
                             <button onClick={() => openServiceEditor(null)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Create Service</button>
                        </div>
                         <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                               <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Fee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {services.map(service => (
                                        <tr key={service.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{service.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">NPR {service.fee}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick={() => openServiceEditor(service)} className="text-blue-600 hover:underline">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                     </div>
                 )}

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
            {viewingCitizenWallet && (
                 <DigitalWalletPage
                    citizen={viewingCitizenWallet}
                    walletDocuments={citizenWalletDocs}
                    onVerify={handleVerify}
                    onReject={handleReject}
                    onClose={() => setViewingCitizenWallet(null)}
                 />
            )}
        </div>
    );
};

export default AdminPortal;