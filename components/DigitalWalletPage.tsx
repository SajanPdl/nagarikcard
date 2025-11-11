import React from 'react';
import { WalletDocument } from '../types';
import { FileTextIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon, FilePlusIcon } from './icons';

interface DigitalWalletPageProps {
    wallet: WalletDocument[];
    onAddDocument: () => void;
}

const DocumentCard: React.FC<{ doc: WalletDocument }> = ({ doc }) => {
    const getStatusInfo = (status: WalletDocument['verificationStatus']) => {
        switch (status) {
            case 'verified': return { text: 'Verified', icon: <CheckCircleIcon className="w-5 h-5" />, color: 'bg-green-100 text-green-800', borderColor: 'border-green-300' };
            case 'pending': return { text: 'Pending', icon: <AlertTriangleIcon className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-300' };
            case 'rejected': return { text: 'Rejected', icon: <XCircleIcon className="w-5 h-5" />, color: 'bg-red-100 text-red-800', borderColor: 'border-red-300' };
        }
    };
    const statusInfo = getStatusInfo(doc.verificationStatus);

    return (
        <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${statusInfo.borderColor} flex flex-col justify-between`}>
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <FileTextIcon className="w-8 h-8 text-gray-400" />
                        <div>
                            <h3 className="font-bold text-gray-800 capitalize">{doc.docType.replace(/_/g, ' ')}</h3>
                            <p className="text-sm text-gray-500">{doc.fileName}</p>
                        </div>
                    </div>
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                    </div>
                </div>
                <p className="text-xs font-mono break-all mt-4 text-gray-400">Hash: {doc.hash}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-2 text-sm">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition">View</button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition">Download</button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition">Replace</button>
            </div>
        </div>
    )
}

const DigitalWalletPage: React.FC<DigitalWalletPageProps> = ({ wallet, onAddDocument }) => {
    return (
        <div className="relative">
            <h2 className="text-2xl font-bold mb-6">Digital Document Vault</h2>
            {wallet.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wallet.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700">Your vault is empty</h3>
                    <p className="text-gray-500 mt-2">Add documents to get started with services.</p>
                </div>
            )}
            <button
                onClick={onAddDocument}
                className="fixed bottom-20 right-6 bg-[#C51E3A] text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-110 z-40"
                aria-label="Add New Document"
            >
                <FilePlusIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default DigitalWalletPage;