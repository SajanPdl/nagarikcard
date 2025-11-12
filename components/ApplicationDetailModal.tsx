import React, { useContext } from 'react';
import { Application, Service, Profile } from '../types';
import { FileTextIcon, HourglassIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from './icons';
import { AppContext } from '../context/AppContext';

interface ApplicationDetailModalProps {
  application?: Application | null;
  service?: Service | null;
  citizen?: Profile | null;
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, service, citizen, onClose }) => {
  const { dispatch } = useContext(AppContext);
  if (!application || !service || !citizen) return null;

  const handleAction = (type: 'APPROVE' | 'REJECT' | 'REQUEST_INFO') => {
      if(!application) return;

      if(type === 'APPROVE') {
          dispatch({ type: 'APPROVE_APPLICATION', payload: application.id });
      } else if (type === 'REJECT') {
          dispatch({ type: 'REJECT_APPLICATION', payload: application.id });
      } else {
          dispatch({ type: 'REQUEST_INFO_APPLICATION', payload: application.id });
      }
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
        
        <div className="border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>
            <p className="text-gray-500">Token: <span className="font-semibold text-gray-700">{application.token || 'N/A'}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 flex items-center mb-2"><UsersIcon className="w-5 h-5 mr-2 text-blue-500" />Applicant Details</h3>
                <p className="text-sm"><span className="text-gray-500">Name:</span> {citizen.name}</p>
                <p className="text-sm"><span className="text-gray-500">User ID:</span> <span className="font-mono text-xs">{citizen.id}</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 flex items-center mb-2"><FileTextIcon className="w-5 h-5 mr-2 text-green-500" />Submitted Data</h3>
                {Object.entries(application.formData).map(([key, value]) => {
                    const field = service.formSchema.properties[key];
                    return (
                        <p key={key} className="text-sm">
                            <span className="text-gray-500">{field?.title || key}:</span> {String(value)}
                        </p>
                    );
                })}
            </div>
        </div>

        <div>
            <h3 className="font-bold text-gray-700 flex items-center mb-4"><HourglassIcon className="w-5 h-5 mr-2 text-yellow-500" />Status History</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Blockchain Hash</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {application.statusHistory.map((entry, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{entry.status}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">{entry.hash}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-sm text-gray-500">Current status: <span className="font-bold">{application.status}</span></p>
             <div className="flex items-center gap-2">
                 {application.status === 'Processing' && (
                    <>
                        <button onClick={() => handleAction('APPROVE')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm">
                            <CheckCircleIcon className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleAction('REQUEST_INFO')} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2 text-sm">
                           <HourglassIcon className="w-4 h-4" /> Request Info
                        </button>
                        <button onClick={() => handleAction('REJECT')} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm">
                            <XCircleIcon className="w-4 h-4" /> Reject
                        </button>
                    </>
                 )}
                 <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition text-sm">
                    Close
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;