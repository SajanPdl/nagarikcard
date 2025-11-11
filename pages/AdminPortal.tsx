import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Service, Application } from '../types';
import { NepalFlagIcon } from '../components/icons';

const AdminPortal: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const { applications, services, user, profile, wallet } = state;
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
    
    const filteredApplications = useMemo(() => 
        applications.filter(app => app.serviceId === selectedServiceId),
        [applications, selectedServiceId]
    );

    const queue = useMemo(() => 
        filteredApplications.filter(app => app.status === 'Approved'),
        [filteredApplications]
    );

    const handleCallNext = () => {
        const nextInQueue = queue[0];
        if (nextInQueue && nextInQueue.token) {
            dispatch({ type: 'CALL_NEXT_TOKEN', payload: nextInQueue.token });
        }
    };

    const handleVerifyDocument = () => {
        // In a real app, you would select a user/document to verify.
        // Here we just verify the first unverified doc of the mock user for demo.
        // Fix: Corrected property access from state.user to state.profile and state.wallet
        if(profile?.role === 'citizen' && wallet.length > 0) {
            const docToVerify = wallet.find(d => !d.verified);
            if(docToVerify) {
                dispatch({ type: 'VERIFY_DOCUMENT', payload: docToVerify.id });
                alert(`Document ${docToVerify.fileName} for user ${profile.name} has been verified.`);
            } else {
                alert('All documents for the demo user are already verified.');
            }
        } else {
            alert('This demo action only works when a citizen is logged in. Please log in as a citizen to test this.')
        }
    }

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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.userId}</td>
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
                        <p className="text-sm text-gray-600 mb-4">Review and verify citizen-uploaded documents. This is a demo action.</p>
                        <button onClick={handleVerifyDocument} className="w-full bg-[#003893] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition">
                            Verify Next Document
                        </button>
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
