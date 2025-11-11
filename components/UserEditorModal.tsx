import React, { useState, useEffect } from 'react';
import { Profile } from '../types';

interface UserEditorModalProps {
    userToEdit: Profile | null;
    onSave: (user: Profile) => void;
    onClose: () => void;
}

const UserEditorModal: React.FC<UserEditorModalProps> = ({ userToEdit, onSave, onClose }) => {
    const [userData, setUserData] = useState<Profile | null>(userToEdit);

    useEffect(() => {
        setUserData(userToEdit);
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (userData) {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userData) {
            onSave(userData);
        }
    };

    if (!userData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Citizen Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userData.phone || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#003893] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-800 transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditorModal;
