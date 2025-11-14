import { Profile, Service, WalletDocument, Application, Office, PaymentDue, Transaction, Notification, OfficeBranch, FAQ, Kiosk, PolicyCircular, AuditLog } from './types';

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

export const MOCK_SUPER_ADMIN_PROFILE: Profile = {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
    name: 'Rastra Sevak',
    email: 'superadmin@gov.np',
    role: 'super_admin',
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
        verificationStatus: 'verified',
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/citizenship_maya.pdf`,
        issuedDate: '2010-05-20',
        documentNumber: '27-01-70-12345'
    },
    {
        id: 'doc-2',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'driving_license',
        fileName: 'license_maya.jpg',
        hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
        verificationStatus: 'verified',
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/license_maya.jpg`,
        issuedDate: '2022-08-15',
        expiryDate: '2027-08-14',
        documentNumber: 'BAG-123456-DL'
    },
     {
        id: 'doc-3',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'passport',
        fileName: 'passport_maya.pdf',
        hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
        verificationStatus: 'pending',
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/passport_maya.pdf`,
    },
    {
        id: 'doc-4',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'pan_card',
        fileName: 'pan_card.jpg',
        hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
        verificationStatus: 'verified',
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/pan_card.jpg`,
        documentNumber: '123456789'
    },
    {
        id: 'doc-5',
        user_id: MOCK_CITIZEN_PROFILE.id,
        docType: 'health_card',
        fileName: 'health_insurance.pdf',
        hash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
        verificationStatus: 'rejected',
        storage_path: `${MOCK_CITIZEN_PROFILE.id}/health_insurance.pdf`,
        documentNumber: 'HI-987654321',
        expiryDate: '2025-01-01'
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
        predictedDelay: '+1 day due to high volume',
        sentiment: 'neutral',
        statusHistory: [
            { status: 'Pending Payment', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 10000), hash: '0xabc1' },
            { status: 'Submitted', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 5000), hash: '0xdef2' },
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
        sentiment: 'positive',
        statusHistory: [
             { status: 'Pending Payment', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 10000), hash: '0xabc1' },
            { status: 'Submitted', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 5000), hash: '0xdef2' },
            { status: 'Processing', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), hash: '0xjkl4' },
            { status: 'Approved', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), hash: '0x mno5' },
        ],
    },
];

export const MOCK_PAYMENTS_DUE: PaymentDue[] = [
    {
        id: 'pay-1',
        title: 'Vehicle Tax 2081/82',
        amount: 5000,
        dueDate: '2024-09-15',
        relatedService: 'Annual Vehicle Tax'
    },
    {
        id: 'pay-2',
        title: 'Property Tax - Kathmandu Metropolitian City',
        amount: 8500,
        dueDate: '2024-10-01',
        relatedService: 'Annual Property Tax'
    }
];

export const MOCK_TRANSACTION_HISTORY: Transaction[] = [
    { id: 'txn-1', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: 'Driving License Renewal Fee', amount: 1500, status: 'Completed' },
    { id: 'txn-2', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), description: 'Land Tax Payment', amount: 2500, status: 'Completed' },
    { id: 'txn-3', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), description: 'Vehicle Tax 2080/81', amount: 4800, status: 'Completed' },
];


export const MOCK_ALL_CITIZENS = [MOCK_CITIZEN_PROFILE];
export const MOCK_ALL_WALLET_DOCS = [...MOCK_WALLET];

// --- MOCK NOTIFICATIONS ---

const KATHMANDU_DAO: OfficeBranch = {
    ministry: 'Ministry of Home Affairs',
    department: 'District Administration',
    district: 'Kathmandu',
    ward: '11',
    office_id: MOCK_OFFICES[1].id,
};

const EKANTAKUNA_TMO: OfficeBranch = {
    ministry: 'Ministry of Physical Infrastructure and Transport',
    department: 'Transport Management',
    district: 'Lalitpur',
    ward: '5',
    office_id: MOCK_OFFICES[0].id,
};

const DILLIBAZAR_LRO: OfficeBranch = {
    ministry: 'Ministry of Land Management, Cooperatives and Poverty Alleviation',
    department: 'Land Revenue',
    district: 'Kathmandu',
    ward: '10',
    office_id: MOCK_OFFICES[2].id,
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        office: EKANTAKUNA_TMO,
        type: 'request_status_update',
        priority: 'medium',
        title: 'Application Approved: Driving License Renewal',
        body: 'Your application for Driving License Renewal (Token: TKN-4581) has been approved. Please visit the office for biometrics.',
        related_request_id: 'app-1',
        visibility: 'private',
        target_user_id: MOCK_CITIZEN_PROFILE.id,
        created_by: 'system_auto',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: false,
        audit: [
            { actor: 'system_auto', action: 'created', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ]
    },
    {
        id: 'notif-2',
        office: KATHMANDU_DAO,
        type: 'announcement',
        priority: 'low',
        title: 'Public Holiday Announcement',
        body: 'All District Administration Offices will be closed on Friday for a public holiday. Please plan your visits accordingly.',
        visibility: 'public',
        created_by: MOCK_ADMIN_PROFILE.id,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        audit: [
            { actor: MOCK_ADMIN_PROFILE.id, action: 'created', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { actor: MOCK_CITIZEN_PROFILE.id, action: 'read', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        ]
    },
    {
        id: 'notif-3',
        office: EKANTAKUNA_TMO,
        type: 'emergency_alert',
        priority: 'critical',
        title: 'URGENT: System Maintenance',
        body: 'The Transport Management Office online portal will be down for emergency maintenance tonight from 11 PM to 2 AM.',
        visibility: 'public',
        created_by: 'system_admin',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: false,
        audit: [
            { actor: 'system_admin', action: 'created', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) }
        ]
    },
    {
        id: 'notif-4',
        office: DILLIBAZAR_LRO,
        type: 'payment_confirmation',
        priority: 'medium',
        title: 'Payment Received for Land Tax',
        body: 'We have successfully received your payment of NPR 2,500 for Land Tax application TKN-1123.',
        related_request_id: 'app-2',
        visibility: 'private',
        target_user_id: MOCK_CITIZEN_PROFILE.id,
        created_by: 'payment_gateway',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: true,
        audit: [
            { actor: 'payment_gateway', action: 'created', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
        ]
    },
    {
        id: 'notif-5',
        office: KATHMANDU_DAO,
        type: 'system_notice',
        priority: 'high',
        title: 'New Service Available: National ID Card',
        body: 'Citizens can now apply for their National ID Card through the GovFlow portal. Please ensure your citizenship document is verified in your wallet.',
        visibility: 'public',
        created_by: MOCK_ADMIN_PROFILE.id,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        read: false,
        audit: [
            { actor: MOCK_ADMIN_PROFILE.id, action: 'created', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ]
    },
];

export const MOCK_FAQS: FAQ[] = [
    { q: "What is GovFlow?", a: "GovFlow is a digital platform designed to make it easy for citizens to access government services online. You can apply for services, track your application status, and manage your official documents in one secure place." },
    { q: "How do I start an application?", a: "From the dashboard, click 'Apply for Service' to see the service catalog. Choose the service you need and click 'Start'. The system will guide you through the process, using documents from your digital wallet to auto-fill forms." },
    { q: "What does 'document verification' mean?", a: "When you upload a document to your digital wallet, it is sent to the relevant government authority for verification. Once verified, you can use it for any service without needing to re-submit it. This process ensures your documents are authentic and secure." },
    { q: "How long does it take for my application to be approved?", a: "Processing times vary by service. Each service in the catalog provides an estimated time. You can track the real-time status of your application on the 'My Applications' page." },
    { q: "How do I renew my driving license?", a: "You can renew your driving license by navigating to the 'Service Catalog', selecting 'Driving License Renewal', and starting the application. Ensure your current license and citizenship are verified in your wallet." },
];

export const MOCK_KIOSKS: Kiosk[] = [
    { id: 'kiosk-01', location: 'New Road, Kathmandu', municipality: 'Kathmandu', status: 'Online', lastSync: new Date(Date.now() - 5 * 60 * 1000), printCount: 124 },
    { id: 'kiosk-02', location: 'Lakeside, Pokhara', municipality: 'Pokhara', status: 'Online', lastSync: new Date(Date.now() - 2 * 60 * 1000), printCount: 88 },
    { id: 'kiosk-03', location: 'Bus Park, Biratnagar', municipality: 'Biratnagar', status: 'Offline', lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), printCount: 210 },
    { id: 'kiosk-04', location: 'DAO Office, Butwal', municipality: 'Butwal', status: 'Maintenance', lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), printCount: 56 },
];

export const MOCK_POLICIES: PolicyCircular[] = [
    { id: 'pol-01', title: 'Updated Land Tax Regulations 2081', publishedDate: new Date('2024-07-15'), status: 'Active', url: '#' },
    { id: 'pol-02', title: 'Digital Signature Usage Guidelines', publishedDate: new Date('2024-06-20'), status: 'Active', url: '#' },
    { id: 'pol-03', title: 'Public Holiday Circular for Ashadh', publishedDate: new Date('2024-06-01'), status: 'Archived', url: '#' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'log-1', timestamp: new Date(Date.now() - 2 * 60 * 1000), actorId: MOCK_ADMIN_PROFILE.id, actorName: MOCK_ADMIN_PROFILE.name, action: 'APPROVE_APPLICATION', details: 'Approved application TKN-1123 for service svc-land-tax.', ipAddress: '202.51.74.110' },
    { id: 'log-2', timestamp: new Date(Date.now() - 5 * 60 * 1000), actorId: MOCK_SUPER_ADMIN_PROFILE.id, actorName: MOCK_SUPER_ADMIN_PROFILE.name, action: 'SUSPEND_USER', details: 'Suspended officer account: officer@gov.np.', ipAddress: '110.34.22.81' },
    { id: 'log-3', timestamp: new Date(Date.now() - 15 * 60 * 1000), actorId: 'system', actorName: 'System', action: 'KIOSK_STATUS_CHANGE', details: 'Kiosk kiosk-03 reported status: Offline.', ipAddress: '127.0.0.1' },
    { id: 'log-4', timestamp: new Date(Date.now() - 30 * 60 * 1000), actorId: MOCK_CITIZEN_PROFILE.id, actorName: MOCK_CITIZEN_PROFILE.name, action: 'SUBMIT_APPLICATION', details: 'Submitted application for service svc-dl-renew.', ipAddress: '182.93.88.2' },
    { id: 'log-5', timestamp: new Date(Date.now() - 60 * 60 * 1000), actorId: MOCK_SUPER_ADMIN_PROFILE.id, actorName: MOCK_SUPER_ADMIN_PROFILE.name, action: 'PUBLISH_POLICY', details: 'Published new policy: Updated Land Tax Regulations 2081.', ipAddress: '110.34.22.81' },
    { id: 'log-6', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), actorId: MOCK_ADMIN_PROFILE.id, actorName: MOCK_ADMIN_PROFILE.name, action: 'LOGIN_SUCCESS', details: 'User logged in successfully.', ipAddress: '202.51.74.110' },
    { id: 'log-7', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), actorId: MOCK_CITIZEN_PROFILE.id, actorName: MOCK_CITIZEN_PROFILE.name, action: 'UPLOAD_DOCUMENT', details: 'Uploaded document passport_maya.pdf to wallet.', ipAddress: '182.93.88.2' },
];