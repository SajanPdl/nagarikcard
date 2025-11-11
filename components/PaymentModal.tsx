import React from 'react';
import { Application, Service } from '../types';

interface PaymentModalProps {
  application: Application;
  service?: Service;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ application, service, onPaymentSuccess, onClose }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Complete Your Payment</h2>
        <p className="text-center text-gray-600 mb-6">to finalize your application for <span className="font-semibold">{service.name}</span>.</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
            <p className="text-gray-500">Total Amount Due</p>
            <p className="text-4xl font-extrabold text-[#003893]">{new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(service.fee)}</p>
        </div>
        
        <div className="space-y-4">
            <p className="text-sm font-semibold text-center text-gray-500">Choose a payment method</p>
            <button className="w-full flex items-center justify-center p-3 border-2 border-green-500 rounded-lg font-semibold text-green-600 hover:bg-green-50 transition">
                {/* Dummy eSewa Logo */}
                <span className="w-6 h-6 bg-green-500 rounded-full mr-3"></span>
                Pay with eSewa
            </button>
             <button className="w-full flex items-center justify-center p-3 border-2 border-purple-500 rounded-lg font-semibold text-purple-600 hover:bg-purple-50 transition">
                {/* Dummy Khalti Logo */}
                 <span className="w-6 h-6 bg-purple-500 rounded-full mr-3"></span>
                Pay with Khalti
            </button>
        </div>
        
        <div className="mt-8">
            <button 
                onClick={onPaymentSuccess} 
                className="w-full bg-[#C51E3A] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition"
            >
                Simulate Successful Payment
            </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
