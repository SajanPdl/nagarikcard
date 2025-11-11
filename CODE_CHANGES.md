# 🔄 BACKEND INTEGRATION - CODE CHANGES

Complete code snippets ready to copy-paste into your components.

---

## 1️⃣ AppContext.tsx - Load Real Services

### Import Supabase
```typescript
import * as supabase from '../lib/supabase';
```

### Replace useEffect for services
```typescript
// ❌ OLD: Use mock data
useEffect(() => {
  dispatch({ type: 'SET_SERVICES', payload: MOCK_SERVICES });
}, []);

// ✅ NEW: Load from Supabase
useEffect(() => {
  const loadServices = async () => {
    const services = await supabase.getServices();
    dispatch({ type: 'SET_SERVICES', payload: services || [] });
  };
  
  loadServices();
}, []);
```

### Add new useEffect for user data
```typescript
// ✅ NEW: Load user-specific data
useEffect(() => {
  const loadUserData = async () => {
    const user = await supabase.getCurrentUser();
    
    if (!user) {
      // User not logged in
      dispatch({ type: 'SET_SESSION', payload: null });
      return;
    }
    
    // Set session
    dispatch({ type: 'SET_SESSION', payload: user });
    
    // Load profile
    const profile = await supabase.getProfile(user.id);
    if (profile) {
      dispatch({ type: 'SET_PROFILE', payload: profile });
    }
    
    // Load applications
    const apps = await supabase.getApplications(user.id);
    dispatch({ type: 'SET_APPLICATIONS', payload: apps || [] });
    
    // Load wallet documents
    const docs = await supabase.getWalletDocuments(user.id);
    dispatch({ type: 'SET_WALLET_DOCUMENTS', payload: docs || [] });
  };
  
  loadUserData();
}, []);
```

---

## 2️⃣ LoginPage.tsx - Real Authentication

### Sign In
```typescript
import * as supabase from '../lib/supabase';

const handleSignIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    
    const { data, error } = await supabase.signInWithEmail(email, password);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    if (data?.user) {
      // Get profile
      const profile = await supabase.getProfile(data.user.id);
      
      if (!profile) {
        setError('Profile not found. Please sign up first.');
        return;
      }
      
      // Update context
      dispatch({ type: 'SET_SESSION', payload: data.user });
      dispatch({ type: 'SET_PROFILE', payload: profile });
      
      // Navigate based on role
      const destination = profile.role === 'admin' 
        ? '/admin-portal' 
        : profile.role === 'kiosk'
        ? '/kiosk-portal'
        : '/citizen-portal';
      
      navigate(destination);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Sign Up
```typescript
const handleSignUp = async (email: string, password: string, name: string) => {
  try {
    setLoading(true);
    
    // Create auth user
    const { data, error } = await supabase.signUpWithEmail(email, password);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    if (data?.user) {
      // Create profile
      const profile = await supabase.createProfile({
        id: data.user.id,
        email,
        name,
        role: 'citizen', // Default role
      });
      
      if (profile) {
        setSuccess('Account created! Please check your email to verify.');
        setEmail('');
        setPassword('');
      }
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Sign Out
```typescript
const handleSignOut = async () => {
  await supabase.signOut();
  dispatch({ type: 'SET_SESSION', payload: null });
  dispatch({ type: 'SET_PROFILE', payload: null });
  navigate('/');
};
```

---

## 3️⃣ CitizenPortal.tsx - Real Applications

### Load Applications
```typescript
import * as supabase from '../lib/supabase';
import { useEffect, useState } from 'react';

export const CitizenPortal = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContext(AppContext);
  
  useEffect(() => {
    const loadApplications = async () => {
      if (state.session?.user) {
        const apps = await supabase.getApplications(state.session.user.id);
        setApplications(apps || []);
      }
      setLoading(false);
    };
    
    loadApplications();
  }, [state.session?.user?.id]);
  
  // Listen to real-time updates
  useEffect(() => {
    if (!state.session?.user?.id) return;
    
    const subscription = supabase.subscribeToApplicationUpdates(
      state.session.user.id,
      (updatedApp) => {
        setApplications(prev => 
          prev.map(app => app.id === updatedApp.id ? updatedApp : app)
        );
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [state.session?.user?.id]);
  
  return (
    <div>
      {applications.map(app => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
};
```

### Submit Application
```typescript
const handleSubmit = async (formData: any) => {
  try {
    setLoading(true);
    
    const user = state.session?.user;
    if (!user) {
      setError('Not logged in');
      return;
    }
    
    const newApp = await supabase.submitApplication({
      service_id: selectedServiceId,
      user_id: user.id,
      status: 'Pending Payment',
      payment_status: 'Unpaid',
      form_data: formData,
      submitted_at: new Date(),
    });
    
    if (newApp) {
      setApplications(prev => [newApp, ...prev]);
      setSuccess('Application submitted successfully!');
      setShowForm(false);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 4️⃣ AdminPortal.tsx - Queue Management

### Load Queue Tokens
```typescript
import * as supabase from '../lib/supabase';
import { useEffect, useState } from 'react';

export const AdminPortal = () => {
  const [queue, setQueue] = useState([]);
  const { state } = useContext(AppContext);
  
  const officeId = state.profile?.office_id;
  
  useEffect(() => {
    if (!officeId) return;
    
    const loadQueue = async () => {
      const tokens = await supabase.getQueueTokens(officeId);
      setQueue(tokens || []);
    };
    
    loadQueue();
  }, [officeId]);
  
  // Real-time queue updates
  useEffect(() => {
    if (!officeId) return;
    
    const subscription = supabase.subscribeToQueueTokens(
      officeId,
      (updatedToken) => {
        setQueue(prev => {
          const filtered = prev.filter(t => t.id !== updatedToken.id);
          return [updatedToken, ...filtered];
        });
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [officeId]);
  
  return (
    <div>
      {queue.map(token => (
        <QueueCard key={token.id} token={token} />
      ))}
    </div>
  );
};
```

### Call Next Token
```typescript
const handleCallNext = async (tokenId: string) => {
  try {
    await supabase.callQueueToken(tokenId);
    // Queue will update via real-time subscription
  } catch (err: any) {
    setError(err.message);
  }
};
```

### Complete Token
```typescript
const handleComplete = async (tokenId: string) => {
  try {
    await supabase.completeQueueToken(tokenId);
    // Queue will update via real-time subscription
  } catch (err: any) {
    setError(err.message);
  }
};
```

### Verify Document
```typescript
const handleVerifyDocument = async (docId: string, approved: boolean) => {
  try {
    await supabase.verifyDocument(docId, approved);
    setSuccess(approved ? 'Document verified!' : 'Document rejected.');
  } catch (err: any) {
    setError(err.message);
  }
};
```

---

## 5️⃣ File Upload - Document Storage

### Upload Document
```typescript
import * as supabase from '../lib/supabase';

const handleUploadDocument = async (file: File, docType: string) => {
  try {
    setLoading(true);
    
    const user = state.session?.user;
    if (!user) {
      setError('Not logged in');
      return;
    }
    
    // Calculate file hash
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Upload file
    const path = `${user.id}/${file.name}`;
    const uploadedPath = await supabase.uploadFile('wallet-documents', path, file);
    
    if (!uploadedPath) {
      setError('Upload failed');
      return;
    }
    
    // Create document record
    const doc = await supabase.addWalletDocument({
      user_id: user.id,
      doc_type: docType,
      file_name: file.name,
      hash: hashHex,
      verification_status: 'pending',
      storage_path: uploadedPath,
    });
    
    if (doc) {
      setDocuments(prev => [doc, ...prev]);
      setSuccess('Document uploaded successfully!');
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Get Public URL
```typescript
const getDocumentUrl = (storagePath: string) => {
  return supabase.getPublicFileUrl('wallet-documents', storagePath);
};
```

---

## 6️⃣ Remove Mock Data

### In constants.ts, comment out (or keep as backup):
```typescript
// export const MOCK_SERVICES = [...]; // Now load from Supabase
// export const MOCK_APPLICATIONS = [...]; // Now load from Supabase
// export const MOCK_WALLET = [...]; // Now load from Supabase
```

---

## ✅ Integration Checklist

- [ ] Add `import * as supabase from '../lib/supabase'` to each file
- [ ] Replace MOCK_SERVICES with `supabase.getServices()`
- [ ] Update LoginPage.tsx with real auth
- [ ] Update CitizenPortal.tsx with real apps
- [ ] Update AdminPortal.tsx with real queue
- [ ] Add real-time subscriptions
- [ ] Test all flows
- [ ] Remove unused mock constants

---

## 🧪 Test Integration

```bash
npm run dev
```

Then:
1. Sign up new user
2. Login
3. Browse services
4. Submit application
5. Check admin queue
6. Verify document

---

## 🆘 Common Issues

**Issue:** "Cannot find module"  
**Fix:** Check import path is correct

**Issue:** "User not found"  
**Fix:** User must be logged in first

**Issue:** "Type errors"  
**Fix:** Ensure returned data matches your types.ts

**Issue:** "Real-time not updating"  
**Fix:** Check database realtime is enabled for the table

---

**You're ready to code!** 🚀
