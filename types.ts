export interface Profile {
  id: string; // user UUID from auth.users
  phone?: string;
  email?: string;
  name: string;
  role: 'citizen' | 'admin' | 'kiosk';
  officeId?: string;
}

export interface WalletDocument {
  id: string;
  user_id: string;
  docType: string;
  fileName: string;
  hash: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  file?: File; // Client-side only
  previewUrl?: string; // Client-side only
  storage_path: string;
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
  status: 'Pending Payment' | 'Submitted' | 'Processing' | 'Approved' | 'Called';
  paymentStatus: 'Paid' | 'Unpaid';
  statusHistory: {
    status: string;
    timestamp: Date;
    hash: string;
  }[];
  token?: string;
  officeId?: string;
  formData: Record<string, any>;
}