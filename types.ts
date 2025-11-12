export interface Profile {
  id: string; // user UUID from auth.users
  phone?: string;
  email?: string;
  name: string;
  role: 'citizen' | 'admin' | 'kiosk';
  officeId?: string;
}

export type DocumentType = 
  | 'citizenship' 
  | 'driving_license' 
  | 'passport' 
  | 'pan_card'
  | 'health_card'
  | 'birth_certificate'
  | 'land_ownership'
  | 'academic_certificate';

export interface WalletDocument {
  id: string;
  user_id: string;
  docType: DocumentType;
  fileName: string;
  hash: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  file?: File; // Client-side only
  previewUrl?: string; // Client-side only
  storage_path: string;
  // Optional metadata
  issuedDate?: string;
  expiryDate?: string;
  documentNumber?: string;
}

export interface PaymentDue {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  relatedService: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  status: 'Completed' | 'Failed';
}

export interface Service {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  requiredDocs: string[];
  estimatedTime: string;
  formSchema: FormSchema;
  offices: Office[];
  fee: number;
}

export interface Office {
  id: string;
  name: string;
}

export interface FormSchema {
  title: string;
  properties: {
    [key: string]: {
      type: string;
      title: string;
      mapping: string;
    };
  };
  required: string[];
}

export interface Application {
  id: string;
  serviceId: string;
  userId: string;
  submittedAt: Date;
  status: 'Pending Payment' | 'Submitted' | 'Processing' | 'Approved' | 'Called' | 'More Info Requested' | 'Rejected';
  paymentStatus: 'Paid' | 'Unpaid';
  statusHistory: {
    status: string;
    timestamp: Date;
    hash: string;
  }[];
  token?: string;
  officeId?: string;
  formData: Record<string, any>;
  predictedDelay?: string; // e.g., "+2 days"
  sentiment?: 'positive' | 'neutral' | 'negative';
}