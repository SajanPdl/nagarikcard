import React from 'react';
import { Application, Service, Office } from '../types';
import { CheckCircleIcon, HourglassIcon, FileCheckIcon, CreditCardIcon } from './icons';

interface ApplicationTrackerProps {
  application: Application;
  services: Service[];
  offices: Office[];
  onPay?: () => void;
}

const getIconForStatus = (status: string, isLastActive: boolean) => {
    const className = `w-6 h-6 ${isLastActive ? 'text-white' : 'text-gray-400'}`;
    if(status === 'Pending Payment') return <CreditCardIcon className={className} />;
    if(status === 'Submitted') return <FileCheckIcon className={className} />;
    if(status === 'Processing') return <HourglassIcon className={className} />;
    if(status === 'Approved' || status === 'Called') return <CheckCircleIcon className={className} />;
    return null;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ application, services, offices, onPay }) => {
  const service = services.find(s => s.id === application.serviceId);
  const office = offices.find(o => o.id === application.officeId);

  const statuses = ['Pending Payment', 'Submitted', 'Processing', 'Approved'];
  const currentStatusIndex = statuses.indexOf(application.status);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{service?.name || 'Unknown Service'}</h3>
          <p className="text-sm text-gray-500">Token: <span className="font-semibold text-gray-700">{application.token || 'N/A'}</span></p>
          <p className="text-sm text-gray-500">Office: {office?.name || 'N/A'}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            application.status === 'Approved' ? 'bg-green-100 text-green-800' : 
            application.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'
        }`}>
          {application.status}
        </span>
      </div>
      
      {application.status === 'Called' && (
          <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
              <p className="font-bold">You are being called to a counter now!</p>
          </div>
      )}

      {application.status === 'Pending Payment' && onPay && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md flex justify-between items-center">
              <p className="text-sm text-yellow-800">Your application is awaiting payment to proceed.</p>
              <button onClick={onPay} className="bg-yellow-500 text-white font-bold text-sm py-1 px-3 rounded-md hover:bg-yellow-600 transition">
                  Pay Now
              </button>
          </div>
      )}

      <div className="mt-6">
        <div className="flex items-center">
            {statuses.map((status, index) => (
                <React.Fragment key={status}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-[#003893]' : 'bg-gray-200'}`}>
                            {getIconForStatus(status, index === currentStatusIndex)}
                        </div>
                        <p className={`text-xs mt-2 font-semibold w-20 ${index <= currentStatusIndex ? 'text-[#003893]' : 'text-gray-500'}`}>{status}</p>
                    </div>
                    {index < statuses.length - 1 && (
                        <div className={`flex-1 h-1 ${index < currentStatusIndex ? 'bg-[#003893]' : 'bg-gray-200'}`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">History</h4>
        <ul className="text-xs text-gray-500 space-y-1">
            {application.statusHistory.map(h => (
                <li key={h.timestamp.toISOString()} className="flex justify-between">
                    <span>{h.status}</span>
                    <span>{h.timestamp.toLocaleString()}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplicationTracker;
