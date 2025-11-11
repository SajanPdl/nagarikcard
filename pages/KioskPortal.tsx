import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { MOCK_APPLICATIONS, MOCK_CITIZEN_PROFILE } from '../constants';
import { CheckCircleIcon, NepalFlagIcon, KeyIcon, XIcon } from '../components/icons';

const KioskPortal: React.FC = () => {
    const { dispatch } = useContext(AppContext);
    const [qrInput, setQrInput] = useState('');
    const [scannedData, setScannedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    
    // --- Mock QR Payloads ---
    const VALIDITY_DURATION_SECONDS = 15;
    const generateQrPayload = (expiryOffset: number, token: string, name: string, userId: string) => JSON.stringify({
        userId: userId,
        name: name,
        token: token,
        expiry: Date.now() + expiryOffset * 1000,
    }, null, 2);
    
    const validApplication = MOCK_APPLICATIONS.find(app => app.status === 'Processing' && app.token);
    const validCitizen = validApplication ? MOCK_CITIZEN_PROFILE : { name: 'Test User', id: 'test-id'};
    
    const MOCK_VALID_QR = generateQrPayload(VALIDITY_DURATION_SECONDS, validApplication?.token || 'TKN-DEMO', validCitizen.name, validCitizen.id);
    const MOCK_EXPIRED_QR = generateQrPayload(-60, 'TKN-EXPIRED', 'Expired User', 'expired-id');
    const MOCK_INVALID_QR = 'this-is-not-a-valid-json-string';
    

    useEffect(() => {
        if (!scannedData || timeLeft === null) return;

        if (timeLeft <= 0) {
            setScannedData(null);
            setError("Expired Code");
            setTimeLeft(null);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => (prevTime ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timerId);
    }, [scannedData, timeLeft]);

    const handleVerify = (code: string) => {
        setError(null);
        setScannedData(null);
        setTimeLeft(null);

        if (!code.trim()) {
            setError("Input cannot be empty");
            return;
        }

        try {
            const payload = JSON.parse(code);

            if (!payload.expiry || !payload.userId || !payload.token || !payload.name) {
                 throw new Error("Invalid payload structure");
            }

            if (payload.expiry < Date.now()) {
                throw new Error("Expired Code");
            }
            
            const remainingValidity = Math.floor((payload.expiry - Date.now()) / 1000);

            // Redact name for privacy
            const nameParts = payload.name.split(' ');
            const redactedName = `${nameParts[0].charAt(0)}. ${nameParts.length > 1 ? nameParts[nameParts.length-1] : ''}`;
            
            setScannedData({
                name: redactedName,
                token: payload.token,
                status: 'VERIFIED'
            });

            setTimeLeft(remainingValidity);
        } catch (e: any) {
            if(e.message === "Expired Code") {
                setError("Expired Code");
            } else {
                setError("Invalid Code");
            }
            setScannedData(null);
        }
    };

    const handleTestCase = (testCase: string) => {
        setQrInput(testCase);
        handleVerify(testCase);
    }

    const handleReset = () => {
        setScannedData(null);
        setError(null);
        setTimeLeft(null);
        setQrInput('');
    }
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
                        <p className="text-gray-500 mb-4">Manually enter a QR code payload or use a test case.</p>
                        <textarea
                            value={qrInput}
                            onChange={(e) => setQrInput(e.target.value)}
                            className="w-full h-24 p-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder='e.g., {"userId": "...", "expiry": 1716386400000, ...}'
                        />
                        <button 
                            onClick={() => handleVerify(qrInput)}
                            className="w-full mt-4 bg-[#003893] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-800 transition flex items-center justify-center space-x-2"
                        >
                            <KeyIcon className="w-5 h-5" />
                            <span>Verify Code</span>
                        </button>
                         <div className="mt-6">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Or use a test case</p>
                            <div className="flex justify-center space-x-2">
                                <button onClick={() => handleTestCase(MOCK_VALID_QR)} className="text-sm bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-md hover:bg-green-200 transition">Valid</button>
                                <button onClick={() => handleTestCase(MOCK_EXPIRED_QR)} className="text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-md hover:bg-yellow-200 transition">Expired</button>
                                <button onClick={() => handleTestCase(MOCK_INVALID_QR)} className="text-sm bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-md hover:bg-red-200 transition">Invalid</button>
                            </div>
                        </div>
                    </>
                )}

                {scannedData && (
                    <div className="animate-fade-in">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600">{scannedData.status}</h2>
                        <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                            <p><span className="font-semibold">Name:</span> {scannedData.name}</p>
                            <p><span className="font-semibold">Token:</span> {scannedData.token}</p>
                        </div>
                         {timeLeft !== null && (
                            <div className="mt-4 font-bold text-lg text-gray-700">
                                Expires in: <span className={timeLeft < 11 ? 'text-red-500 animate-pulse' : ''}>{formatTime(timeLeft)}</span>
                            </div>
                        )}
                         <button onClick={handleReset} className="mt-8 w-full bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition">Scan Next</button>
                    </div>
                )}
                
                {error && (
                     <div className="animate-fade-in">
                         <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <XIcon className="w-16 h-16 text-red-500" />
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