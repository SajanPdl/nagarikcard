import { Profile, Service, WalletDocument, Application, Office } from './types';

export const MOCK_OFFICES: Office[] = [
  { id: 'office-1', name: 'Transport Management Office, Ekantakuna' },
  { id: 'office-2', name: 'District Administration Office, Kathmandu' },
  { id: 'office-3', name: 'Land Revenue Office, Dillibazar' },
  { id: 'office-4', name: 'Company Registrar Office, Tripureshwor' },
];

export const MOCK_USER = {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Maya Kumari Thapa',
};

// --- MOCK PROFILES ---
export const MOCK_CITIZEN_PROFILE: Profile = {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Maya Kumari Thapa',
    phone: '+9779841000000',
    email: 'maya.thapa@email.com',
    role: 'citizen',
};

export const MOCK_ADMIN_PROFILE: Profile = {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    name: 'Hari Prasad Sharma',
    email: 'admin@gov.np',
    role: 'admin',
    officeId: 'office-2',
};

export const MOCK_KIOSK_PROFILE: Profile = {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
    name: 'Kiosk User',
    email: 'kiosk@gov.np',
    role: 'kiosk',
    officeId: 'office-1',
};


// --- MOCK SERVICES ---
export const MOCK_SERVICES: Service[] = [
    {
        id: 'svc-dl-renew',
        code: 'DL_RENEW',
        name: 'Driving License Renewal',
        category: 'Transport',
        description: 'Renew your expired or soon-to-be-expired driving license.',
        requiredDocs: ['citizenship', 'driving_license'],
        estimatedTime: '3 Working Days',
        fee: 1500,
        offices: [MOCK_OFFICES[0]],
        formSchema: {
            title: 'Driving License Renewal Application',
            properties: {
                name: { type: 'string', title: 'Full Name', mapping: 'user.name' },
                licenseNumber: { type: 'string', title: 'Existing License Number', mapping: 'wallet.driving_license.number' },
                expiryDate: { type: 'date', title: 'Expiry Date', mapping: 'wallet.driving_license.expiry' },
            },
            required: ['name', 'licenseNumber', 'expiryDate'],
        },
    },
    {
        id: 'svc-birth-cert',
        code: 'BIRTH_CERT',
        name: 'Birth Certificate Request',
        category: 'Civil Registration',
        description: 'Apply for a new birth certificate for a newborn.',
        requiredDocs: ['citizenship', 'hospital_report'],
        estimatedTime: '7 Working Days',
        fee: 100,
        offices: [MOCK_OFFICES[1]],
        formSchema: {
            title: 'Birth Certificate Application',
            properties: {
                childName: { type: 'string', title: "Child's Name", mapping: '' },
                fatherName: { type: 'string', title: "Father's Name", mapping: 'user.name' },
                motherName: { type: 'string', title: "Mother's Name", mapping: '' },
            },
            required: ['childName', 'fatherName', 'motherName'],
        },
    },
    {
        id: 'svc-land-tax',
        code: 'LAND_TAX',
        name: 'Land Tax Payment',
        category: 'Revenue',
        description: 'Pay your annual land revenue and property taxes online.',
        requiredDocs: ['citizenship', 'land_ownership_cert'],
        estimatedTime: '1 Day',
        fee: 2500,
        offices: [MOCK_OFFICES[2]],
        formSchema: {
            title: 'Land Tax Payment',
            properties: {
                ownerName: { type: 'string', title: 'Land Owner Name', mapping: 'user.name' },
                plotNumber: { type: 'string', title: 'Plot Number (Kitta No.)', mapping: 'wallet.land_ownership_cert.plot' },
            },
            required: ['ownerName', 'plotNumber'],
        },
    },
];


// --- MOCK WALLET DOCUMENTS for Maya Thapa ---
export const MOCK_WALLET: WalletDocument[] = [
    {
        id: 'doc-1',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'citizenship',
        fileName: 'citizenship_maya.pdf',
        hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
        verified: true,
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/citizenship_maya.pdf`,
    },
    {
        id: 'doc-2',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'driving_license',
        fileName: 'license_maya.jpg',
        hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
        verified: true,
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/license_maya.jpg`,
    },
];


// --- MOCK APPLICATIONS for Maya Thapa ---
export const MOCK_APPLICATIONS: Application[] = [
    {
        id: 'app-1',
        serviceId: 'svc-dl-renew',
        userId: MOCK_CITIZEN_PROFILE.id,
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'Processing',
        paymentStatus: 'Paid',
        token: 'TKN-4581',
        officeId: MOCK_OFFICES[0].id,
        formData: {
            name: 'Maya Kumari Thapa',
            licenseNumber: '12-34-567890',
            expiryDate: '2024-09-30'
        },
        statusHistory: [
            { status: 'Pending Payment', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 10000), hash: '0xabc1' },
            { status: 'Payment Confirmed', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 5000), hash: '0xdef2' },
            { status: 'Submitted', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), hash: '0xghi3' },
            { status: 'Processing', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), hash: '0xjkl4' },
        ],
    },
    {
        id: 'app-2',
        serviceId: 'svc-land-tax',
        userId: MOCK_CITIZEN_PROFILE.id,
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        status: 'Approved',
        paymentStatus: 'Paid',
        token: 'TKN-1123',
        officeId: MOCK_OFFICES[2].id,
        formData: {
            ownerName: 'Maya Kumari Thapa',
            plotNumber: '102-KA-45'
        },
        statusHistory: [
             { status: 'Pending Payment', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 10000), hash: '0xabc1' },
            { status: 'Payment Confirmed', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 5000), hash: '0xdef2' },
            { status: 'Submitted', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), hash: '0xghi3' },
            { status: 'Processing', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), hash: '0xjkl4' },
            { status: 'Approved', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), hash: '0x mno5' },
        ],
    },
];