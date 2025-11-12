import React, { useState, useEffect, useContext } from 'react';
import { Service, FormSchema } from '../types';
import { AppContext } from '../context/AppContext';
import { MOCK_OFFICES } from '../constants';
import { XCircleIcon } from './icons';

interface ServiceEditorModalProps {
    serviceToEdit: Service | null;
    onSave: (service: Service) => void;
    onClose: () => void;
}

const emptyService: Omit<Service, 'id' | 'code'> = {
    name: '',
    category: '',
    description: '',
    requiredDocs: [],
    estimatedTime: '',
    fee: 0,
    offices: [],
    formSchema: {
        title: '',
        properties: {},
        required: [],
    },
};

type FormSchemaProperty = {
    key: string;
    type: string;
    title: string;
    mapping: string;
};

const ServiceEditorModal: React.FC<ServiceEditorModalProps> = ({ serviceToEdit, onSave, onClose }) => {
    const [serviceData, setServiceData] = useState<Omit<Service, 'id' | 'code'>>(emptyService);
    const [formSchemaProps, setFormSchemaProps] = useState<FormSchemaProperty[]>([]);

    useEffect(() => {
        if (serviceToEdit) {
            setServiceData(serviceToEdit);
            // FIX: Replaced spread operator with explicit property assignments.
            // This avoids potential type inference issues with `Object.entries` on indexed types,
            // which was likely causing both reported compilation errors.
            const propsArray = Object.entries(serviceToEdit.formSchema.properties).map(([key, value]) => ({
                key,
                type: (value as any).type,
                title: (value as any).title,
                mapping: (value as any).mapping,
            }));
            setFormSchemaProps(propsArray);
        } else {
            setServiceData(emptyService);
            setFormSchemaProps([]);
        }
    }, [serviceToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setServiceData(prev => ({ ...prev, [name]: name === 'fee' ? parseFloat(value) : value }));
    };

    const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const docs = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
        setServiceData(prev => ({ ...prev, requiredDocs: docs }));
    };

    const handleOfficeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Explicitly type `option` as HTMLOptionElement to resolve type inference issue.
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        const selectedOffices = MOCK_OFFICES.filter(office => selectedOptions.includes(office.id));
        setServiceData(prev => ({ ...prev, offices: selectedOffices }));
    };

    const handleSchemaPropChange = (index: number, field: keyof FormSchemaProperty, value: string) => {
        const newProps = [...formSchemaProps];
        newProps[index][field] = value;
        setFormSchemaProps(newProps);
    };

    const addSchemaProp = () => {
        setFormSchemaProps([...formSchemaProps, { key: '', title: '', type: 'string', mapping: '' }]);
    };
    
    const removeSchemaProp = (index: number) => {
        setFormSchemaProps(formSchemaProps.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalSchema: FormSchema = {
            title: `${serviceData.name} Application`,
            properties: formSchemaProps.reduce((acc, prop) => {
                if (prop.key) {
                    acc[prop.key] = { type: prop.type, title: prop.title, mapping: prop.mapping };
                }
                return acc;
            }, {} as FormSchema['properties']),
            required: formSchemaProps.map(p => p.key).filter(Boolean),
        };

        const finalService: Service = {
            ...serviceData,
            id: serviceToEdit?.id || `svc-${Date.now()}`,
            code: serviceToEdit?.code || serviceData.name.toUpperCase().replace(/\s/g, '_').slice(0,10),
            formSchema: finalSchema,
        };

        onSave(finalService);
    };

    const selectedOfficeIds = serviceData.offices.map(o => o.id);

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{serviceToEdit ? 'Edit Service' : 'Create New Service'}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input type="text" name="name" value={serviceData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input type="text" name="category" value={serviceData.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={serviceData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fee (NPR)</label>
                            <input type="number" name="fee" value={serviceData.fee} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estimated Time</label>
                            <input type="text" name="estimatedTime" value={serviceData.estimatedTime} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="e.g., 3 Working Days" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Required Documents</label>
                        <input type="text" value={serviceData.requiredDocs.join(', ')} onChange={handleDocsChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Comma-separated, e.g., citizenship, photo" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Associated Offices</label>
                         <select multiple value={selectedOfficeIds} onChange={handleOfficeChange} className="mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm">
                            {MOCK_OFFICES.map(office => (
                                <option key={office.id} value={office.id}>{office.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Form Schema Builder */}
                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Form Schema Builder</h3>
                        <p className="text-sm text-gray-500 mb-4">Define the fields for the citizen's application form.</p>
                        <div className="space-y-3">
                            {formSchemaProps.map((prop, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-md">
                                    <input type="text" placeholder="Field Key (no spaces)" value={prop.key} onChange={e => handleSchemaPropChange(index, 'key', e.target.value)} className="col-span-3 border-gray-300 rounded-md shadow-sm text-sm" />
                                    <input type="text" placeholder="Display Title" value={prop.title} onChange={e => handleSchemaPropChange(index, 'title', e.target.value)} className="col-span-3 border-gray-300 rounded-md shadow-sm text-sm" />
                                     <select value={prop.type} onChange={e => handleSchemaPropChange(index, 'type', e.target.value)} className="col-span-2 border-gray-300 rounded-md shadow-sm text-sm">
                                        <option value="string">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                    </select>
                                    <input type="text" placeholder="Data Mapping (optional)" value={prop.mapping} onChange={e => handleSchemaPropChange(index, 'mapping', e.target.value)} className="col-span-3 border-gray-300 rounded-md shadow-sm text-sm" />
                                    <button type="button" onClick={() => removeSchemaProp(index)} className="col-span-1 text-red-500 hover:text-red-700">
                                        <XCircleIcon className="w-5 h-5 mx-auto" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSchemaProp} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                            + Add Form Field
                        </button>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" className="bg-[#C51E3A] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition">Save Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceEditorModal;