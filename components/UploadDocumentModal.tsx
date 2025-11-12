import React, { useState } from 'react';
import { WalletDocument, DocumentType } from '../types';
import { sha256 } from '../pages/CitizenPortal';
import { UploadCloudIcon } from './icons';

interface UploadDocumentModalProps {
    userId: string;
    onClose: () => void;
    onUpload: (doc: WalletDocument) => void;
}

const docTypes = [
    { value: 'driving_license', label: 'Driving License' },
    { value: 'passport', label: 'Passport' },
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'land_ownership', label: 'Land Ownership' },
    { value: 'academic_certificate', label: 'Academic Certificate' },
];

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ userId, onClose, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState(docTypes[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !docType) {
            setError('Please select a document type and a file.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const hash = await sha256(file);
            const newDoc: WalletDocument = {
                id: `doc-${Date.now()}`,
                user_id: userId,
                // FIX: Cast string docType to DocumentType to match the WalletDocument interface.
                docType: docType as DocumentType,
                fileName: file.name,
                hash,
                verificationStatus: 'pending',
                storage_path: `${userId}/${docType}-${Date.now()}-${file.name}`,
                file: file,
                previewUrl: URL.createObjectURL(file),
            };

            // Simulate upload delay
            setTimeout(() => {
                onUpload(newDoc);
                setIsLoading(false);
                onClose();
            }, 1500);

        } catch (err) {
            setError('Failed to process file. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Document</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {docTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                {file ? (
                                    <p className="text-sm text-gray-800 font-semibold">{file.name}</p>
                                ) : (
                                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-[#C8102E] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition disabled:bg-gray-400">
                            {isLoading ? 'Uploading...' : 'Add to Wallet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;