export interface Profile {
  id: string; // user UUID from auth.users
  phone?: string;
  email?: string;
  name: string;
  role: 'citizen' | 'admin' | 'kiosk' | 'super_admin';
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
  id:string;
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

export type CitizenPage = 'dashboard' | 'onboarding' | 'service-catalog' | 'application' | 'my-applications' | 'nagarik-wallet' | 'help' | 'community-impact' | 'profile-settings' | 'notifications';

export interface OfficeBranch {
  ministry?: string;
  department?: string;
  district?: string;
  ward?: string;
  office_id: string;
}

export interface NotificationAudit {
  actor: string; // user ID or system
  action: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  office: OfficeBranch;
  type: 'announcement' | 'request_status_update' | 'task_assignment' | 'payment_confirmation' | 'kiosk_sync_alert' | 'emergency_alert' | 'system_notice';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  body: string;
  related_request_id?: string; // e.g., application.id
  visibility: 'public' | 'internal' | 'private'; // private means for a specific user
  target_user_id?: string; // if visibility is private
  created_by: string; // user ID or system
  created_at: Date;
  read: boolean;
  audit: NotificationAudit[];
}

export type KioskScreen = 'login' | 'dashboard' | 'service_categories' | 'service_list' | 'application' | 'payment' | 'receipt' | 'goodbye' | 'my_applications';
export type Language = 'en' | 'np';

export type Theme = 'light' | 'dark';

export interface AccessibilityState {
    fontSize: 'normal' | 'large' | 'xlarge';
    contrast: 'normal' | 'high';
}

export interface FAQ {
    q: string;
    a: string;
}

export interface Kiosk {
  id: string;
  location: string;
  municipality: string;
  status: 'Online' | 'Offline' | 'Maintenance';
  lastSync: Date;
  printCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface PolicyCircular {
  id: string;
  title: string;
  publishedDate: Date;
  status: 'Active' | 'Archived';
  url: string; // link to the document
}