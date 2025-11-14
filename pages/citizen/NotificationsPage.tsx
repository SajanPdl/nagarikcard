
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Notification, Office } from '../../types';
import { BellIcon, CheckCircleIcon, AlertTriangleIcon, BriefcaseIcon, CreditCardIcon, MessageSquareIcon, FileTextIcon } from '../../components/icons';
import { MOCK_OFFICES } from '../../constants';

const priorityStyles = {
    critical: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-400 dark:border-red-600', text: 'text-red-700 dark:text-red-300', icon: AlertTriangleIcon },
    high: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-400 dark:border-orange-500', text: 'text-orange-700 dark:text-orange-300', icon: AlertTriangleIcon },
    medium: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-400 dark:border-yellow-500', text: 'text-yellow-700 dark:text-yellow-300', icon: BellIcon },
    low: { bg: 'bg-gray-50 dark:bg-gray-800/20', border: 'border-gray-300 dark:border-gray-600', text: 'text-gray-600 dark:text-gray-400', icon: BellIcon },
};


const NotificationCard: React.FC<{ notification: Notification, onMarkRead?: () => void }> = ({ notification, onMarkRead }) => {
    const priority = priorityStyles[notification.priority];
    const Icon = priority.icon;

    return (
        <div className={`p-4 rounded-lg border-l-4 ${priority.border} ${priority.bg} ${notification.read ? 'opacity-70' : ''}`}>
            <div className="flex items-start">
                <Icon className={`w-6 h-6 mr-4 mt-1 shrink-0 ${priority.text}`} />
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <h3 className={`font-bold ${priority.text}`}>{notification.title}</h3>
                        {!notification.read && onMarkRead &&
                            <button onClick={onMarkRead} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mark as Read</button>
                        }
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{notification.body}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

const allNotificationCategories = [
    { id: 'all', name: 'All Notifications', icon: BellIcon },
    { id: 'application', name: 'Application Updates', icon: BriefcaseIcon, type: 'request_status_update' },
    { id: 'payment', name: 'Payments', icon: CreditCardIcon, type: 'payment_confirmation' },
    { id: 'announcement', name: 'Announcements', icon: MessageSquareIcon, type: 'announcement' },
    { id: 'system', name: 'System Notices', icon: FileTextIcon, type: 'system_notice' },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangleIcon, type: 'emergency_alert' },
];

const NotificationsPage: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { notifications, profile } = state;
    const [activeCategory, setActiveCategory] = useState('all');

    // New filter states
    const [selectedOfficeId, setSelectedOfficeId] = useState<string | 'all'>('all');
    const [selectedMunicipality, setSelectedMunicipality] = useState<string | 'all'>('all');
    const [selectedWard, setSelectedWard] = useState<string | 'all'>('all');

    const pageTitle = profile ? 'Notification Center' : 'Public Announcements';

    const visibleCategories = useMemo(() => {
        if (profile) {
            return allNotificationCategories;
        }
        return allNotificationCategories.filter(c => ['all', 'announcement', 'system', 'emergency'].includes(c.id));
    }, [profile]);

    const baseNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (profile) {
                return n.visibility === 'public' || (n.visibility === 'private' && n.target_user_id === profile.id)
            }
            return n.visibility === 'public';
        });
    }, [notifications, profile]);

    const filteredNotifications = useMemo(() => {
        const activeCatInfo = visibleCategories.find(c => c.id === activeCategory);
        return baseNotifications
            .filter(n => activeCategory === 'all' || n.type === activeCatInfo?.type)
            .filter(n => selectedOfficeId === 'all' || n.office.office_id === selectedOfficeId)
            .filter(n => selectedMunicipality === 'all' || n.office.district === selectedMunicipality)
            .filter(n => selectedWard === 'all' || n.office.ward === selectedWard);
    }, [baseNotifications, activeCategory, visibleCategories, selectedOfficeId, selectedMunicipality, selectedWard]);

    // Deriving filter options from the base list of notifications
    const offices = useMemo(() => MOCK_OFFICES.filter(office => baseNotifications.some(n => n.office.office_id === office.id)), [baseNotifications]);
    const municipalities = useMemo(() => [...new Set(baseNotifications.map(n => n.office.district).filter(Boolean))], [baseNotifications]);
    const wards = useMemo(() => {
        if (selectedMunicipality === 'all') {
            return [...new Set(baseNotifications.map(n => n.office.ward).filter(Boolean))].sort((a,b) => parseInt(a) - parseInt(b));
        }
        return [...new Set(baseNotifications.filter(n => n.office.district === selectedMunicipality).map(n => n.office.ward).filter(Boolean))].sort((a,b) => parseInt(a) - parseInt(b));
    }, [baseNotifications, selectedMunicipality]);

    const handleMarkRead = (id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId: id, read: true } });
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">{pageTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md sticky top-24">
                        <h3 className="font-semibold text-lg mb-4 px-2">Categories</h3>
                        <ul className="space-y-1">
                            {visibleCategories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                                            activeCategory === cat.id 
                                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <cat.icon className="w-5 h-5"/>
                                        <span>{cat.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select value={selectedOfficeId} onChange={(e) => setSelectedOfficeId(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm text-sm">
                                <option value="all">All Offices</option>
                                {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                             <select value={selectedMunicipality} onChange={(e) => {setSelectedMunicipality(e.target.value); setSelectedWard('all');}} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm text-sm">
                                <option value="all">All Municipalities</option>
                                {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm text-sm" disabled={wards.length === 0}>
                                <option value="all">All Wards</option>
                                {wards.map(w => <option key={w} value={w}>Ward {w}</option>)}
                            </select>
                        </div>
                    </div>

                     <div className="space-y-4">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map(n => (
                                <NotificationCard key={n.id} notification={n} onMarkRead={profile ? () => handleMarkRead(n.id) : undefined} />
                            ))
                        ) : (
                            <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <BellIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-xl text-gray-700 dark:text-gray-200">No Notifications Found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NotificationsPage;
