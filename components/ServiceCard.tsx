import React, { useContext } from 'react';
import { Service } from '../types';
import { AppContext } from '../context/AppContext';

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
    const { state } = useContext(AppContext);
    const userWalletDocs = state.wallet.map(d => d.docType) || [];
    const missingDocs = service.requiredDocs.filter(doc => !userWalletDocs.includes(doc));
    
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-[#003893]">{service.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{service.category}</p>
        <p className="text-gray-600 text-sm mt-3 ">{service.description}</p>
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase">Required</p>
          <p className="text-sm">{service.requiredDocs.map(d => d.replace('_',' ')).join(', ')}</p>
          {missingDocs.length > 0 && <p className="text-xs text-red-500 mt-1">Missing from wallet: {missingDocs.join(', ')}</p>}
        </div>
      </div>
       <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div>
            <p className="text-xs text-gray-500">Fee</p>
            <p className="font-bold text-lg text-gray-800">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(service.fee)}</p>
        </div>
        <button 
          onClick={onSelect} 
          className="bg-[#C8102E] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;