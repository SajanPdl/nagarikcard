import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MOCK_USER } from '../constants'; // For demo data
import { CheckCircleIcon, NepalFlagIcon } from '../components/icons';

const KioskPortal: React.FC = () => {
    const { dispatch } = useContext(AppContext);
    const [scannedData, setScannedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = () => {
        // In a real app, this would use the camera. Here we simulate a scan.
        setError(null);
        try {
            // This is a mock JWT payload.
            const mockPayload = {
                userId: MOCK_USER.id,
                name: MOCK_USER.name,
                token: 'DL-KTM-105',
                expiry: Date.now() + 5 * 60 * 1000 // Expires in 5 minutes
            };

            // Simulate verification
            if (mockPayload.expiry < Date.now()) {
                throw new Error("Expired Code");
            }
            
            // Redact info for display
            const redactedName = `${mockPayload.name.split(' ')[0].charAt(0)}. ${mockPayload.name.split(' ').length > 1 ? mockPayload.name.split(' ')[1] : ''}`;
            
            setScannedData({
                name: redactedName,
                token: mockPayload.token,
                status: 'VERIFIED'
            });

        } catch (e) {
            setError("Invalid or Expired Code");
            setScannedData(null);
        }
    };

    const handleReset = () => {
        setScannedData(null);
        setError(null);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
             <div className="absolute top-4 right-4">
                <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm font-medium text-gray-600 hover:text-[#C51E3A]">Logout</button>
            </div>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="flex justify-center items-center space-x-3 mb-6">
                    <NepalFlagIcon className="h-8 w-auto" />
                    <h1 className="text-xl font-bold text-gray-800">Verification Kiosk</h1>
                </div>

                {!scannedData && !error && (
                    <>
                        <div className="w-48 h-48 mx-auto my-6 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">Ready to Scan</p>
                        </div>
                        <button 
                            onClick={handleScan}
                            className="w-full bg-[#003893] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-800 transition"
                        >
                            Simulate QR Scan
                        </button>
                    </>
                )}

                {scannedData && (
                    <div className="animate-fade-in">
                        <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-green-600">{scannedData.status}</h2>
                        <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                            <p><span className="font-semibold">Name:</span> {scannedData.name}</p>
                            <p><span className="font-semibold">Token:</span> {scannedData.token}</p>
                        </div>
                         <button onClick={handleReset} className="mt-8 w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition">Scan Next</button>
                    </div>
                )}
                
                {error && (
                     <div className="animate-fade-in">
                         <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <span className="text-5xl text-red-500">×</span>
                         </div>
                        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
                        <button onClick={handleReset} className="mt-8 w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition">Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KioskPortal;
