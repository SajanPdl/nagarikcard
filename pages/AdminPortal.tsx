import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Service, Application, WalletDocument } from '../types';
import { NepalFlagIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from '../components/icons';

const StatusBadge: React.FC<{ status: WalletDocument['verificationStatus']}> = ({ status }) => {
    // Fix: Renamed the second 'text' property to 'textColor' to avoid duplicate keys.
    const statusMap = {
        verified: { text: 'Verified', icon: <CheckCircleIcon className="w-4 h-4" />, bg: 'bg-green-100', textColor: 'text-green-800' },
        pending: { text: 'Pending', icon: <AlertTriangleIcon className="w-4 h-4" />, bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
        rejected: { text: 'Rejected', icon: <XCircleIcon className="w-4 h-4" />, bg: 'bg-red-100', textColor: 'text-red-800' },
    }
    const currentStatus = statusMap[status];

    return (
        // Fix: Updated to use the new 'textColor' property for styling.
        <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.textColor}`}>
            {currentStatus.icon}
            <span>{currentStatus.text}</span>
        </div>
    );
};


const AdminPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, allCitizenProfiles, allWalletDocuments } = state;
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
    const [selectedUserId, setSelectedUserId] = useState<string>(allCitizenProfiles[0]?.id || '');
    
    const filteredApplications = useMemo(() => 
        applications.filter(app => app.serviceId === selectedServiceId),
        [applications, selectedServiceId]
    );

    const queue = useMemo(() => 
        filteredApplications.filter(app => app.status === 'Approved'),
        [filteredApplications]
    );

    const selectedUserDocs = useMemo(() => 
        allWalletDocuments.filter(doc => doc.user_id === selectedUserId),
        [allWalletDocuments, selectedUserId]
    );

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


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                </div>
                <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Queue Management */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Live Service Queue</h2>
                    <div className="flex items-center justify-between mb-4">
                        <select 
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <button 
                            onClick={handleCallNext} 
                            disabled={queue.length === 0}
                            className="bg-[#C51E3A] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-400"
                        >
                            Call Next
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {queue.length > 0 ? queue.map((app, index) => (
                                    <tr key={app.id} className={index === 0 ? 'bg-blue-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.token}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.userId.substring(0,8)}...</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index === 0 ? 'Now Serving' : `Waiting (${index})`}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-500">No citizens in queue for this service.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right side: Other Admin Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4">Document Verification</h3>
                        <p className="text-sm text-gray-600 mb-4">Select a citizen to review their documents.</p>
                        
                        <select 
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            disabled={allCitizenProfiles.length === 0}
                        >
                             {allCitizenProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                             {selectedUserDocs.length > 0 ? selectedUserDocs.map(doc => (
                                <div key={doc.id} className="border border-gray-200 p-3 rounded-lg bg-gray-50/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">{doc.fileName}</p>
                                            <p className="text-xs text-gray-500 capitalize">{doc.docType.replace(/_/g, ' ')}</p>
                                        </div>
                                        <StatusBadge status={doc.verificationStatus} />
                                    </div>
                                    {doc.verificationStatus === 'pending' && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                                            <button onClick={() => handleVerify(doc.id)} className="flex-1 bg-green-600 text-white text-sm font-bold py-1.5 px-3 rounded-md hover:bg-green-700 transition">
                                                Verify
                                            </button>
                                            <button onClick={() => handleReject(doc.id)} className="flex-1 bg-red-600 text-white text-sm font-bold py-1.5 px-3 rounded-md hover:bg-red-700 transition">
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-sm text-center text-gray-500 py-4">No documents found for this user.</p>}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4">System Status</h3>
                         <div className="flex items-center text-green-600">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span>All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPortal;