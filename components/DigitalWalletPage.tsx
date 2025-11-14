
import React from 'react';
import { Profile, WalletDocument, DocumentType } from '../types';
import { UsersIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, IdCardIcon, HealthIcon, LandPlotIcon } from './icons';

interface DigitalWalletPageProps {
    citizen: Profile;
    walletDocuments: WalletDocument[];
    onVerify: (documentId: string) => void;
    onReject: (documentId: string) => void;
    onClose: () => void;
}

const getDocumentIcon = (docType: DocumentType) => {
    const className = "w-6 h-6 text-gray-500";
    switch(docType) {
        case 'citizenship':
        case 'driving_license':
        case 'passport':
        case 'pan_card':
            return <IdCardIcon className={className} />;
        case 'health_card':
            return <HealthIcon className={className} />;
        case 'land_ownership':
            return <LandPlotIcon className={className} />;
        default:
            return <FileTextIcon className={className} />;
    }
}

const getStatusInfo = (status: WalletDocument['verificationStatus']) => {
    switch (status) {
        case 'verified': return { text: 'Verified', icon: <CheckCircleIcon className="w-4 h-4" />, color: 'bg-green-100 text-green-800' };
        case 'pending': return { text: 'Pending', icon: <AlertTriangleIcon className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' };
        case 'rejected': return { text: 'Rejected', icon: <XCircleIcon className="w-4 h-4" />, color: 'bg-red-100 text-red-800' };
    }
};

const DigitalWalletPage: React.FC<DigitalWalletPageProps> = ({ citizen, walletDocuments, onVerify, onReject, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-3xl w-full relative max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl font-light">&times;</button>
                
                <div className="border-b dark:border-gray-700 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Digital Wallet: {citizen.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Review and manage citizen's documents.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {walletDocuments.length > 0 ? walletDocuments.map(doc => {
                        const statusInfo = getStatusInfo(doc.verificationStatus);
                        return (
                            <div key={doc.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {getDocumentIcon(doc.docType)}
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{doc.docType.replace(/_/g, ' ')}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{doc.fileName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.text}</span>
                                    </div>
                                    {doc.verificationStatus === 'pending' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => onVerify(doc.id)} className="bg-green-100 text-green-700 hover:bg-green-200 text-xs font-bold py-1 px-2 rounded-md">Verify</button>
                                            <button onClick={() => onReject(doc.id)} className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold py-1 px-2 rounded-md">Reject</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16">
                            <FileTextIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">No Documents Found</h3>
                            <p className="text-gray-500 dark:text-gray-400">This citizen has not uploaded any documents yet.</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DigitalWalletPage;
