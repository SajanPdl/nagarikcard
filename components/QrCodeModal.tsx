import React, { useState, useEffect } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { Profile } from '../types';

interface QrCodeModalProps {
  user: Profile;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ user, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const qrValue = JSON.stringify({
        userId: user.id,
        name: user.name,
        token: 'DL-KTM-105', // Example token
        expiry: Date.now() + timeLeft * 1000,
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-xs sm:max-w-sm w-full text-center relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                 <h2 className="text-xl font-bold mb-4">Your Dynamic QR ID</h2>
                 <p className="text-sm text-gray-600 mb-6">Present this code for verification. It is valid for a limited time for your security.</p>
                 <div className="p-4 border-4 border-gray-200 rounded-lg inline-block">
                    <QRCode value={qrValue} size={200} />
                 </div>
                 <div className={`mt-6 font-bold text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
                    Expires in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                 </div>
            </div>
        </div>
    );
};

export default QrCodeModal;