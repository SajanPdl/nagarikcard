# 🎯 SUPABASE BACKEND INTEGRATION GUIDE

**Status:** ✅ Backend Server Ready
**Database:** 7 tables with 4 offices, 3 services
**API:** All endpoints tested and working
**Authentication:** Supabase Auth configured

---

## 🎉 What's Configured

### ✅ Completed
- [x] Supabase project linked
- [x] Database schema created (7 tables)
- [x] Sample data seeded (4 offices, 3 services)
- [x] Environment variables set (.env.local)
- [x] Complete backend client (lib/supabase.ts)
- [x] All helper functions ready
- [x] API connection verified ✅

### ⏳ Next: Integrate with React

---

## 📚 Available Backend Functions

All functions are in `lib/supabase.ts` and ready to use:

### Authentication
```typescript
signUpWithEmail(email, password)        // Create new user
signInWithEmail(email, password)        // Login user
signOut()                                // Logout
getCurrentUser()                         // Get current user
getCurrentSession()                      // Get session token
```

### User Profiles
```typescript
getProfile(userId)                       // Get user profile
updateProfile(userId, updates)           // Update profile
createProfile(profile)                   // Create new profile
```

### Documents (Wallet)
```typescript
getWalletDocuments(userId)              // Get all user documents
addWalletDocument(doc)                  // Add new document
updateWalletDocument(docId, updates)    // Update document
verifyDocument(docId, verified)         // Admin: Verify/reject document
```

### Services
```typescript
getServices()                            // Get all available services
getServiceById(serviceId)                // Get single service
getOffices()                             // Get all offices
getOfficeById(officeId)                  // Get single office
```

### Applications (Service Requests)
```typescript
getApplications(userId)                  // Get user's applications
getApplicationById(appId)                // Get single application
submitApplication(app)                   // Submit new application
updateApplicationStatus(appId, status)   // Update application status
getApplicationsByStatus(status)          // Get apps by status
getApplicationsForAdmin(officeId, status) // Admin: Filter applications
```

### Queue Management
```typescript
getQueueTokens(officeId)                // Get waiting queue
callQueueToken(tokenId)                 // Admin: Call next person
completeQueueToken(tokenId)             // Admin: Mark as complete
```

### File Storage
```typescript
uploadFile(bucket, path, file)          // Upload to storage
getPublicFileUrl(bucket, path)          // Get public file URL
deleteFile(bucket, path)                // Delete file
```

### Real-time Subscriptions
```typescript
subscribeToApplicationUpdates(userId, callback)    // Listen for app updates
subscribeToQueueTokens(officeId, callback)         // Listen for queue changes
subscribeToProfileUpdates(userId, callback)        // Listen for profile changes
```

### Utilities
```typescript
checkConnection()                        // Test backend connectivity
getStats()                               // Get summary stats
```

---

## 🚀 Integration Steps

### Step 1: Update AppContext.tsx

Replace mock data initialization with real Supabase queries:

**Before (Mock):**
```typescript
const [state, dispatch] = useReducer(reducer, initialState);

useEffect(() => {
  // Load mock data
  dispatch({ type: 'SET_SERVICES', payload: MOCK_SERVICES });
  dispatch({ type: 'SET_APPLICATIONS', payload: MOCK_APPLICATIONS });
}, []);
```

**After (Real):**
```typescript
import * as supabase from '../lib/supabase';

const [state, dispatch] = useReducer(reducer, initialState);

useEffect(() => {
  const loadData = async () => {
    // Load real services from backend
    const services = await supabase.getServices();
    dispatch({ type: 'SET_SERVICES', payload: services });
  };
  
  loadData();
}, []);

// Load user data when authenticated
useEffect(() => {
  const loadUserData = async () => {
    const user = await supabase.getCurrentUser();
    if (user) {
      dispatch({ type: 'SET_SESSION', payload: user });
      
      const profile = await supabase.getProfile(user.id);
      if (profile) {
        dispatch({ type: 'SET_PROFILE', payload: profile });
      }
      
      const apps = await supabase.getApplications(user.id);
      dispatch({ type: 'SET_APPLICATIONS', payload: apps });
    }
  };
  
  loadUserData();
}, []);
```

### Step 2: Replace Component Mock Data

**CitizenPortal.tsx:**
```typescript
import * as supabase from '../lib/supabase';

// Instead of: const [applications] = state.applications
// Use:
const [applications, setApplications] = useState([]);

useEffect(() => {
  const loadApps = async () => {
    const user = await supabase.getCurrentUser();
    if (user) {
      const apps = await supabase.getApplications(user.id);
      setApplications(apps);
    }
  };
  loadApps();
}, []);
```

**AdminPortal.tsx:**
```typescript
import * as supabase from '../lib/supabase';

const [queue, setQueue] = useState([]);

useEffect(() => {
  const loadQueue = async () => {
    const tokens = await supabase.getQueueTokens(officeId);
    setQueue(tokens);
  };
  loadQueue();
}, [officeId]);

// Listen for real-time queue updates
useEffect(() => {
  const subscription = supabase.subscribeToQueueTokens(officeId, (token) => {
    setQueue(prev => [...prev.filter(t => t.id !== token.id), token]);
  });
  
  return () => subscription.unsubscribe();
}, [officeId]);
```

### Step 3: Update Application Submission

**Before:**
```typescript
const handleSubmit = (data) => {
  const newApp = { ...MOCK_APPLICATIONS[0], ...data };
  dispatch({ type: 'UPSERT_APPLICATION', payload: newApp });
};
```

**After:**
```typescript
const handleSubmit = async (data) => {
  const user = await supabase.getCurrentUser();
  if (user) {
    const newApp = await supabase.submitApplication({
      ...data,
      user_id: user.id,
      status: 'Pending Payment',
      payment_status: 'Unpaid',
      submitted_at: new Date(),
    });
    
    if (newApp) {
      dispatch({ type: 'UPSERT_APPLICATION', payload: newApp });
      showSuccess('Application submitted successfully!');
    }
  }
};
```

### Step 4: Update Authentication

**LoginPage.tsx:**
```typescript
import * as supabase from '../lib/supabase';

const handleLogin = async (email, password) => {
  const { data, error } = await supabase.signInWithEmail(email, password);
  
  if (error) {
    showError(error.message);
    return;
  }
  
  if (data.user) {
    dispatch({ type: 'SET_SESSION', payload: data.user });
    const profile = await supabase.getProfile(data.user.id);
    dispatch({ type: 'SET_PROFILE', payload: profile });
    navigate('/citizen-portal');
  }
};

const handleSignUp = async (email, password) => {
  const { data, error } = await supabase.signUpWithEmail(email, password);
  
  if (error) {
    showError(error.message);
    return;
  }
  
  if (data.user) {
    await supabase.createProfile({
      id: data.user.id,
      email,
      name: email.split('@')[0],
      role: 'citizen',
    });
    
    showSuccess('Account created! Please check your email.');
  }
};
```

---

## 🔌 Quick Reference

### Import Supabase Functions
```typescript
import * as supabase from '../lib/supabase';
```

### Get Current User
```typescript
const user = await supabase.getCurrentUser();
console.log(user?.id);  // User UUID
```

### Fetch Services
```typescript
const services = await supabase.getServices();
services.forEach(s => console.log(s.name));
```

### Submit Application
```typescript
const app = await supabase.submitApplication({
  service_id: serviceId,
  user_id: userId,
  status: 'Pending Payment',
  payment_status: 'Unpaid',
  form_data: { /* user input */ },
});
```

### Listen to Real-time Updates
```typescript
const subscription = supabase.subscribeToApplicationUpdates(
  userId,
  (app) => {
    console.log('Application updated:', app);
    setApplications(prev => 
      prev.map(a => a.id === app.id ? app : a)
    );
  }
);

// Clean up when component unmounts
return () => subscription.unsubscribe();
```

---

## 🔐 Security Notes

### Row-Level Security (RLS) Enabled
- ✅ Users can only see their own documents
- ✅ Only admins can verify/reject documents
- ✅ Only admins can update application status
- ✅ Queue tokens are view-restricted

### Environment Variables
- ✅ Stored in `.env.local` (not committed)
- ✅ Using anon key (safe for client-side)
- ✅ Never expose service role key to client

### Best Practices
```typescript
// ❌ DON'T: Log sensitive data
console.log(user.session.access_token);

// ✅ DO: Only log non-sensitive data
console.log(user.id, user.email);

// ✅ DO: Handle errors gracefully
try {
  const result = await supabase.getProfile(userId);
} catch (error) {
  console.error('Failed to load profile');
}
```

---

## 🧪 Testing Queries

### Test Connection
```bash
node test-backend.mjs
```

### Test in Browser Console
```javascript
// After app loads with user logged in
import * as supabase from './lib/supabase';

// Test getting services
const services = await supabase.getServices();
console.table(services);

// Test getting user profile
const user = await supabase.getCurrentUser();
const profile = await supabase.getProfile(user.id);
console.log(profile);
```

---

## 📊 API Response Examples

### Services
```json
[
  {
    "id": "uuid",
    "code": "DL_RENEW",
    "name": "Driving License Renewal",
    "category": "Transport",
    "fee": 1500,
    "required_docs": ["citizenship", "driving_license"],
    "form_schema": { /* form definition */ }
  }
]
```

### Applications
```json
[
  {
    "id": "uuid",
    "service_id": "uuid",
    "user_id": "uuid",
    "status": "Processing",
    "payment_status": "Paid",
    "token": "TKN-1234",
    "form_data": { /* submitted data */ },
    "status_history": [ /* array of status changes */ ]
  }
]
```

### Queue Tokens
```json
[
  {
    "id": "uuid",
    "token": "TKN-1234",
    "status": "waiting",
    "called_at": null,
    "completed_at": null
  }
]
```

---

## 🆘 Troubleshooting

### "Table not found" Error
**Cause:** RLS policy blocking access
**Fix:** Check Supabase Dashboard → Authentication → See if you're logged in

### "401 Unauthorized"
**Cause:** Invalid or expired auth token
**Fix:** User needs to login again

### "Connection refused"
**Cause:** Network issues or invalid credentials
**Fix:** Check `.env.local` has correct credentials and Supabase project is running

### "Type errors in TypeScript"
**Cause:** Missing types from Supabase responses
**Fix:** Ensure responses match your `types.ts` interfaces

---

## 📝 Checklist: Integration Complete

- [ ] Updated `.env.local` with VITE_ prefix
- [ ] Reviewed `lib/supabase.ts` functions
- [ ] Updated AppContext.tsx to use real data
- [ ] Updated CitizenPortal with real applications
- [ ] Updated AdminPortal with real queue
- [ ] Updated LoginPage with real authentication
- [ ] Tested login flow
- [ ] Tested application submission
- [ ] Tested document upload (optional)
- [ ] Tested real-time updates (optional)

---

## 🎓 Learn More

- **Supabase Docs:** https://supabase.com/docs
- **React + Supabase:** https://supabase.com/docs/guides/with-react
- **PostgreSQL RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **Real-time:** https://supabase.com/docs/guides/realtime

---

## ✨ Summary

Your **Supabase backend is fully configured and ready to use**. 

**Backend Status:**
- ✅ Database: 7 tables created
- ✅ Data: 4 offices + 3 services seeded
- ✅ API: All endpoints working
- ✅ Security: RLS policies enabled
- ✅ Real-time: Subscriptions ready
- ✅ Client: `lib/supabase.ts` with 25+ functions

**Next Action:**
Integrate the backend functions into your React components following the steps above. Start with AppContext.tsx and work through each page.

**Time to Full Integration:** ~1-2 hours

---

**Questions?** Check the function documentation in `lib/supabase.ts` or refer to the Supabase docs above.

**Ready to code!** 🚀
