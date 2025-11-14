import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Application, Service, Profile, Office, Kiosk, PolicyCircular, AuditLog, Notification, OfficeBranch } from '../types';
import { 
    GovFlowLogoIcon, BellIcon, BuildingIcon, CheckCircleIcon, ChevronDownIcon,
    FileTextIcon, GlobeIcon, HistoryIcon, HourglassIcon, KeyIcon, LogOutIcon, MapPinIcon,
    MessageSquareIcon, SparklesIcon, TrendingUpIcon, UsersIcon, BriefcaseIcon, ShieldLockIcon, BookOpenIcon,
    PowerIcon, EditIcon, XCircleIcon
} from '../components/icons';
import { MOCK_OFFICES, MOCK_ADMIN_PROFILE, MOCK_SUPER_ADMIN_PROFILE } from '../constants';

// --- Reusable Components ---

const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string; change?: string; }> = ({ icon: Icon, title, value, change }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
        </div>
        {change && <p className="text-xs text-green-600 mt-2">{change}</p>}
    </div>
);

const ServiceLoadMap: React.FC = () => {
    // These are representative coordinates for a Nepal map SVG
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
        if (requests > 100) return 'rgba(200, 16, 46, 0.9)'; // Strong red
        if (requests > 60) return 'rgba(249, 115, 22, 0.9)';  // Orange
        return 'rgba(250, 204, 21, 0.9)'; // Yellow
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md h-full">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Load Heatmap</h3>
             <div className="relative aspect-[16/9] -mx-2 sm:-mx-0">
                 <svg width="100%" height="100%" viewBox="0 0 1002 558" preserveAspectRatio="xMidYMid meet">
                    <path d="M991.6 410.7l-22.1-3.3-13.8-13.4-25.9-4.8-15.6 3.3-15.8-9-22.9-2-14-11.2-21.7 3.1-18-12.8-15.8-0.2-14-15.4-26.6-1.5-11.2 5.2-16-16.2-22.1 3.3-10-8.8-19.1-1.3-10.8 9.7-20.9-2-14.2 11-10-15.8-17.7-2.3-18.4 13.8-10.8-14-19.1-1.5-13.8 11.2-12.3-13.4-19.1-3.1-16.9 13.6-13-14-20-4.8-13.6 12.5-14.2-12.5-20.4-3.1-12.5 14.2-16-12.8-19.8-1.5-12.6 14.2-15.1-12.5-18.4-0.2-11.7 11.2-18.2-1.3-11.2 12.5-18.2-2.9-10.3 10-17.1-1.5-11.7 12.5-16.9-2.9-9.3 11.2-18.2-2.9-10.8 11.2-16-1.5-11.2 12.5-13-10-18.4 1.3-9.7 10-16-4.4-11.7 11.2-16-1.5-10.8 10-16-4.4-11.7 11.2-14.7-2.9-10.8 10-16.9-4.4-10.8 11.2-13.8-2.9-10.8 11.2-13-1.5-10 12.5-13.8-2.9-9.3 11.2-14.7-2.9-9.3 11.2-10 1.3-5.6 12.5-8.4-1.5-6.7 12.5-9.3-1.5-6.5 13.6-8.4-1.3-6.7 14.7.2 11.2-8.4 2.9-1.5 11.2-8.4 2.9 1.3 12.5-8.4 2.9 2.9 11.2-8.4 2.9 2.9 12.5 10 2.9 4.4 11.2 10 2.9 2.9 12.5 10 1.5 4.4 11.2 11.2 1.5 2.9 12.5 11.2 2.9 2.9 11.2 11.2 2.9 2.9 11.2 12.5 1.5 1.5 12.5 12.5 2.9 1.5 11.2 12.5 2.9 2.9 11.2 11.2 1.5 2.9 11.2 12.5 2.9 1.5 11.2 12.5 2.9 1.5 11.2 12.5 2.9 1.5 10 13.8 1.5 1.5 10 13.8 1.5 2.9 11.2 12.5 1.5 1.5 11.2 13.8 1.5 1.5 10 13.8 1.5 2.9 11.2 12.5 1.5 1.5 11.2 13.8 1.5 1.5 10 13.8 1.5 2.9 10 12.5 1.5 1.5 10 13.8 1.5 2.9 10 12.5 1.5 1.5 10 13.8 1.5 1.5-12.5 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2-1.5 1.5-11.2 11.2z"
                        fill="#e2e8f0" className="dark:fill-gray-700" stroke="#a0aec0" strokeWidth="1"/>
                    {cities.map((city) => (
                        <circle key={city.name} cx={city.cx} cy={city.cy} r={city.r} fill={getColor(city.requests)} stroke="white" strokeWidth="1">
                            <title>{`${city.name}: ${city.requests} Requests`}</title>
                        </circle>
                    ))}
                </svg>
            </div>
        </div>
    );
};

// --- Child Components for Tabs ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-6 animate-fade-in">
    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
    {children}
  </div>
);

const OfficeManagement = () => (
  <Section title="Office & Department Management">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Government Offices</h2>
        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition text-sm">Add New Office</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Office Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Office ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {MOCK_OFFICES.map(office => (
              <tr key={office.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{office.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{office.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Section>
);

const UserManagement = () => {
    const { state, dispatch } = useContext(AppContext);
    const [tab, setTab] = useState('officers');
    const officers = [MOCK_ADMIN_PROFILE, MOCK_SUPER_ADMIN_PROFILE];

    return (
        <Section title="User Management">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-4 p-4">
                        <button onClick={() => setTab('officers')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${tab === 'officers' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Officers</button>
                        <button onClick={() => setTab('citizens')} className={`px-3 py-1.5 text-sm font-medium rounded-md ${tab === 'citizens' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Citizens</button>
                    </nav>
                </div>
                <div className="p-6">
                    {tab === 'officers' && (
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assigned Office</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {officers.map(officer => (
                                    <tr key={officer.id}>
                                        <td className="px-6 py-4 text-sm font-medium">{officer.name}</td>
                                        <td className="px-6 py-4 text-sm capitalize">{officer.role.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 text-sm">{officer.officeId ? MOCK_OFFICES.find(o => o.id === officer.officeId)?.name : 'National'}</td>
                                        <td className="px-6 py-4 text-sm space-x-2">
                                            <button onClick={() => dispatch({type: 'SUSPEND_USER', payload: officer.id})} className="text-red-600 hover:text-red-900">Suspend</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {tab === 'citizens' && (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Verified Docs</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {state.allCitizenProfiles.map(citizen => (
                                    <tr key={citizen.id}>
                                        <td className="px-6 py-4 text-sm font-medium">{citizen.name}</td>
                                        <td className="px-6 py-4 text-sm">{citizen.email}</td>
                                        <td className="px-6 py-4 text-sm">{state.allWalletDocuments.filter(d => d.user_id === citizen.id && d.verificationStatus === 'verified').length}</td>
                                        <td className="px-6 py-4 text-sm text-red-600 hover:text-red-900 cursor-pointer">Block</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Section>
    )
};

const KioskManagement = () => {
    const { state, dispatch } = useContext(AppContext);
    
    const getStatusColor = (status: Kiosk['status']) => {
        if (status === 'Online') return 'bg-green-500';
        if (status === 'Offline') return 'bg-red-500';
        return 'bg-yellow-500';
    };

    return (
        <Section title="Kiosk Management">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.kiosks.map(kiosk => (
                    <div key={kiosk.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-lg">{kiosk.location}</h3>
                                <p className="text-sm text-gray-500">{kiosk.municipality}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(kiosk.status)}`}></div>
                                <span className="text-sm font-semibold">{kiosk.status}</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-4 space-y-1">
                            <p>Last Sync: {kiosk.lastSync.toLocaleTimeString()}</p>
                            <p>Prints Today: {kiosk.printCount}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex space-x-2">
                            <button className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold py-1.5 px-3 rounded-md flex items-center justify-center space-x-1.5"><PowerIcon className="w-4 h-4"/><span>Reboot</span></button>
                            <button className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold py-1.5 px-3 rounded-md">Sync Content</button>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const NotificationBroadcast = () => {
    const { state, dispatch } = useContext(AppContext);
    const [formData, setFormData] = useState({ title: '', body: '', priority: 'medium', visibility: 'public', office: 'all' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const mockOffice: OfficeBranch = formData.office === 'all' 
            ? { office_id: 'system-wide' }
            : { office_id: formData.office, district: MOCK_OFFICES.find(o => o.id === formData.office)?.name.split(', ')[1] };

        const payload = {
            office: mockOffice,
            type: 'announcement' as const,
            priority: formData.priority as "medium",
            title: formData.title,
            body: formData.body,
            visibility: formData.visibility as "public",
        };

        dispatch({ type: 'BROADCAST_NOTIFICATION', payload });
        setFormData({ title: '', body: '', priority: 'medium', visibility: 'public', office: 'all' });
    };

    return (
        <Section title="Notification Broadcast System">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Notification Title" required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    <textarea name="body" value={formData.body} onChange={handleChange} placeholder="Notification body..." required rows={5} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                    <div className="grid grid-cols-3 gap-4">
                        <select name="priority" value={formData.priority} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical</option>
                        </select>
                         <select name="visibility" value={formData.visibility} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="public">Public</option>
                            <option value="internal">Internal</option>
                        </select>
                         <select name="office" value={formData.office} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            <option value="all">All Offices</option>
                            {MOCK_OFFICES.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition">Send Broadcast</button>
                </form>
            </div>
        </Section>
    );
};

const PolicyCompliance = () => {
    const { state } = useContext(AppContext);
    return (
        <Section title="Policy & Compliance">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Public Circulars & Notices</h2>
                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition text-sm">Publish New</button>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {state.policies.map(policy => (
                        <li key={policy.id} className="py-3 flex justify-between items-center">
                            <div>
                                <a href={policy.url} className="font-medium hover:underline">{policy.title}</a>
                                <p className="text-sm text-gray-500">Published: {policy.publishedDate.toLocaleDateString()}</p>
                            </div>
                             <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{policy.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
};

const AnalyticsInsights = () => (
  <Section title="Analytics & Insights">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">AI-Powered Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold">Service Demand Forecast</h3>
                <p className="text-sm mt-1">15% increase in transport services expected in Q4.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold">Bottleneck Detection</h3>
                <p className="text-sm mt-1">Land Tax verification is averaging 48 hours longer than SLA.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">AI Recommendation</h3>
                <p className="text-sm mt-1">"Consider automating initial document checks for license renewals to reduce processing time by 20%."</p>
            </div>
        </div>
    </div>
  </Section>
);

const AuditSecurity = () => {
    const { state } = useContext(AppContext);
    return (
        <Section title="Audit, Security & Logs">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-semibold mb-4">System Event Log</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                                <th className="px-4 py-2 text-left font-medium">Actor</th>
                                <th className="px-4 py-2 text-left font-medium">Action</th>
                                <th className="px-4 py-2 text-left font-medium">Details</th>
                                <th className="px-4 py-2 text-left font-medium">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-mono">
                            {state.auditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-4 py-2 whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{log.actorName}</td>
                                    <td className="px-4 py-2"><span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{log.action}</span></td>
                                    <td className="px-4 py-2">{log.details}</td>
                                    <td className="px-4 py-2">{log.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </Section>
    )
};


// --- Main Government Portal Component ---

const GovernmentPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, allCitizenProfiles, profile } = state;
    const [activeTab, setActiveTab] = useState('dashboard');

    const totalRequests = useMemo(() => applications.length, [applications]);
    const totalCitizens = useMemo(() => allCitizenProfiles.length, [allCitizenProfiles]);
    const totalOffices = useMemo(() => MOCK_OFFICES.length, []);
    const citizenSatisfaction = useMemo(() => {
        const sentiments = applications.map(a => a.sentiment).filter(Boolean);
        if (sentiments.length === 0) return 0;
        const positive = sentiments.filter(s => s === 'positive').length;
        return Math.round((positive / sentiments.length) * 100);
    }, [applications]);
    
    const pendingByOffice = useMemo(() => {
        const pendingStatuses = ['Submitted', 'Processing', 'More Info Requested'];
        return MOCK_OFFICES.map(office => ({
            name: office.name,
            count: applications.filter(app => app.officeId === office.id && pendingStatuses.includes(app.status)).length
        }));
    }, [applications]);

    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: TrendingUpIcon },
        { id: 'offices', name: 'Office Management', icon: BuildingIcon },
        { id: 'users', name: 'User Management', icon: UsersIcon },
        { id: 'kiosks', name: 'Kiosk Management', icon: KeyIcon },
        { id: 'broadcast', name: 'Notification Broadcast', icon: BellIcon },
        { id: 'policy', name: 'Policy & Compliance', icon: BookOpenIcon },
        { id: 'analytics', name: 'Analytics & Insights', icon: SparklesIcon },
        { id: 'audit', name: 'Audit & Security', icon: ShieldLockIcon },
    ];

    const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
        <button
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
        </button>
    );

    const DashboardContent = () => (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Government Overview Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Macro-level insights into the GovFlow ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={FileTextIcon} title="Total Requests" value={totalRequests.toLocaleString()} change="+5% this week" />
                <StatCard icon={UsersIcon} title="Verified Citizens" value={totalCitizens.toLocaleString()} />
                <StatCard icon={BuildingIcon} title="Offices Online" value={totalOffices.toString()} />
                <StatCard icon={CheckCircleIcon} title="Citizen Satisfaction" value={`${citizenSatisfaction}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ServiceLoadMap />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Real-time Queue Health</h3>
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {pendingByOffice.map(office => (
                             <li key={office.name} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-300 truncate pr-4">{office.name}</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">{office.count} pending</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-purple-500"/> AI Predictions</h3>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Service Demand Forecast:</strong> Expect a 15% increase in Transport-related services next month.</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Procedural Bottleneck:</strong> Land Tax Payment process shows a 48-hour delay at the document verification stage.</p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-2">AI Suggestion: “Reduce license renewal steps from 6 → 4”</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Fraud Detection Signals</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No critical fraud signals detected in the last 24 hours.</p>
                </div>
            </div>

        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardContent />;
            case 'offices': return <OfficeManagement />;
            case 'users': return <UserManagement />;
            case 'kiosks': return <KioskManagement />;
            case 'broadcast': return <NotificationBroadcast />;
            case 'policy': return <PolicyCompliance />;
            case 'analytics': return <AnalyticsInsights />;
            case 'audit': return <AuditSecurity />;
            default: return <DashboardContent />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 flex flex-col">
                <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
                    <GovFlowLogoIcon className="h-10 w-auto" />
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 dark:text-white">GovFlow</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin Portal</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map(item => <NavLink key={item.id} item={item} />)}
                </nav>
                 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full" src={`https://ui-avatars.com/api/?name=${profile?.name.replace(' ','+')}&background=random`} alt="User avatar" />
                        <div className="ml-3">
                             <p className="text-sm font-semibold text-gray-800 dark:text-white">{profile?.name}</p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">National Admin</p>
                        </div>
                     </div>
                     <button onClick={() => dispatch({type: 'LOGOUT'})} className="flex items-center w-full mt-4 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg">
                        <LogOutIcon className="w-5 h-5 mr-3"/>
                        Logout
                     </button>
                </div>
            </aside>
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default GovernmentPortal;