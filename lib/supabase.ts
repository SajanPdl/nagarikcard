import { createClient } from '@supabase/supabase-js';
import { Profile, WalletDocument, Service, Application, Office } from '../types';

// Initialize Supabase client
// Environment variables are defined in env.d.ts and .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// AUTHENTICATION
// ============================================================================

export async function signUpWithEmail(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user || null;
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// ============================================================================
// PROFILES
// ============================================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data as Profile;
}

export async function createProfile(profile: Profile): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data as Profile;
}

// ============================================================================
// WALLET DOCUMENTS
// ============================================================================

export async function getWalletDocuments(userId: string): Promise<WalletDocument[]> {
  const { data, error } = await supabase
    .from('wallet_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wallet documents:', error);
    return [];
  }

  return data as WalletDocument[];
}

export async function addWalletDocument(
  doc: WalletDocument
): Promise<WalletDocument | null> {
  const { data, error } = await supabase
    .from('wallet_documents')
    .insert([doc])
    .select()
    .single();

  if (error) {
    console.error('Error adding wallet document:', error);
    return null;
  }

  return data as WalletDocument;
}

export async function updateWalletDocument(
  docId: string,
  updates: Partial<WalletDocument>
): Promise<WalletDocument | null> {
  const { data, error } = await supabase
    .from('wallet_documents')
    .update(updates)
    .eq('id', docId)
    .select()
    .single();

  if (error) {
    console.error('Error updating wallet document:', error);
    return null;
  }

  return data as WalletDocument;
}

// ============================================================================
// STORAGE (FILE UPLOAD/DOWNLOAD)
// ============================================================================

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return data?.path || null;
}

export function getPublicFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_offices (
        offices (*)
      )
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data as Service[];
}

export async function getServiceById(serviceId: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_offices (
        offices (*)
      )
    `)
    .eq('id', serviceId)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }

  return data as Service;
}

// ============================================================================
// OFFICES
// ============================================================================

export async function getOffices(): Promise<Office[]> {
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching offices:', error);
    return [];
  }

  return data as Office[];
}

export async function getOfficeById(officeId: string): Promise<Office | null> {
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .eq('id', officeId)
    .single();

  if (error) {
    console.error('Error fetching office:', error);
    return null;
  }

  return data as Office;
}

// ============================================================================
// APPLICATIONS
// ============================================================================

export async function getApplications(userId?: string): Promise<Application[]> {
  let query = supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return data as Application[];
}

export async function getApplicationById(appId: string): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', appId)
    .single();

  if (error) {
    console.error('Error fetching application:', error);
    return null;
  }

  return data as Application;
}

export async function submitApplication(
  app: Omit<Application, 'id' | 'created_at' | 'updated_at'>
): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .insert([app])
    .select()
    .single();

  if (error) {
    console.error('Error submitting application:', error);
    return null;
  }

  return data as Application;
}

export async function updateApplicationStatus(
  appId: string,
  status: string,
  paymentStatus?: string
): Promise<Application | null> {
  const updates: any = { status };

  if (paymentStatus) {
    updates.payment_status = paymentStatus;
  }

  // Add to status history
  const existing = await getApplicationById(appId);
  if (existing?.statusHistory) {
    updates.status_history = [
      ...existing.statusHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).substr(2, 8)}`,
      },
    ];
  }

  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', appId)
    .select()
    .single();

  if (error) {
    console.error('Error updating application status:', error);
    return null;
  }

  return data as Application;
}

export async function getApplicationsByStatus(status: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', status)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications by status:', error);
    return [];
  }

  return data as Application[];
}

// ============================================================================
// QUEUE TOKENS
// ============================================================================

export async function getQueueTokens(officeId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('queue_tokens')
    .select('*')
    .eq('office_id', officeId)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching queue tokens:', error);
    return [];
  }

  return data;
}

export async function callQueueToken(tokenId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('queue_tokens')
    .update({
      status: 'called',
      called_at: new Date().toISOString(),
    })
    .eq('id', tokenId)
    .select()
    .single();

  if (error) {
    console.error('Error calling queue token:', error);
    return null;
  }

  return data;
}

export async function completeQueueToken(tokenId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('queue_tokens')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', tokenId)
    .select()
    .single();

  if (error) {
    console.error('Error completing queue token:', error);
    return null;
  }

  return data;
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToApplicationUpdates(
  userId: string,
  callback: (application: Application) => void
) {
  const subscription = supabase
    .channel(`applications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        callback(payload.new as Application);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToQueueTokens(
  officeId: string,
  callback: (token: any) => void
) {
  const subscription = supabase
    .channel(`queue_tokens:${officeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'queue_tokens',
        filter: `office_id=eq.${officeId}`,
      },
      (payload: any) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToProfileUpdates(
  userId: string,
  callback: (profile: Profile) => void
) {
  const subscription = supabase
    .channel(`profiles:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload: any) => {
        callback(payload.new as Profile);
      }
    )
    .subscribe();

  return subscription;
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

export async function getApplicationsForAdmin(
  officeId?: string,
  status?: string
): Promise<Application[]> {
  let query = supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (officeId) {
    query = query.eq('office_id', officeId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching admin applications:', error);
    return [];
  }

  return data as Application[];
}

export async function verifyDocument(
  docId: string,
  verified: boolean
): Promise<WalletDocument | null> {
  const { data, error } = await supabase
    .from('wallet_documents')
    .update({
      verification_status: verified ? 'verified' : 'rejected',
    })
    .eq('id', docId)
    .select()
    .single();

  if (error) {
    console.error('Error verifying document:', error);
    return null;
  }

  return data as WalletDocument;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('offices').select('count()', { count: 'exact' });
    return !error && data !== null;
  } catch {
    return false;
  }
}

export async function getStats() {
  try {
    const { count: officeCount } = await supabase
      .from('offices')
      .select('count()', { count: 'exact' });

    const { count: serviceCount } = await supabase
      .from('services')
      .select('count()', { count: 'exact' });

    const { count: applicationCount } = await supabase
      .from('applications')
      .select('count()', { count: 'exact' });

    return {
      offices: officeCount || 0,
      services: serviceCount || 0,
      applications: applicationCount || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { offices: 0, services: 0, applications: 0 };
  }
}
