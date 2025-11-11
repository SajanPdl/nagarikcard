# ⚡ BACKEND QUICK REFERENCE

## 🎯 What You Have

**Backend Server:** Supabase PostgreSQL  
**API:** GraphQL + REST (via PostgREST)  
**Auth:** Email/password + JWT  
**Real-time:** WebSocket subscriptions  
**Status:** ✅ **READY TO USE**

---

## 📦 Import Supabase

```typescript
import * as supabase from '../lib/supabase';
```

---

## 🔑 Key Functions

### Auth
```typescript
supabase.signInWithEmail(email, password)
supabase.signUpWithEmail(email, password)
supabase.signOut()
supabase.getCurrentUser()
supabase.getCurrentSession()
```

### Data
```typescript
supabase.getServices()
supabase.getApplications(userId)
supabase.getWalletDocuments(userId)
supabase.getOffices()
```

### Actions
```typescript
supabase.submitApplication(app)
supabase.updateApplicationStatus(appId, status)
supabase.uploadFile(bucket, path, file)
supabase.verifyDocument(docId, verified)
```

### Real-time
```typescript
supabase.subscribeToApplicationUpdates(userId, callback)
supabase.subscribeToQueueTokens(officeId, callback)
```

---

## 💻 Common Patterns

### Get Data
```typescript
const data = await supabase.getServices();
console.log(data);
```

### Create Record
```typescript
const app = await supabase.submitApplication({
  service_id: id,
  user_id: userId,
  status: 'Pending Payment',
  form_data: { /* ... */ }
});
```

### Update Record
```typescript
await supabase.updateApplicationStatus(appId, 'Processing');
```

### Listen to Changes
```typescript
supabase.subscribeToApplicationUpdates(userId, (app) => {
  console.log('Updated:', app);
});
```

---

## 📊 Data Structure

### Service
```
{
  id: UUID
  code: "DL_RENEW"
  name: "Driving License Renewal"
  fee: 1500
  offices: [{ id, name }]
}
```

### Application
```
{
  id: UUID
  service_id: UUID
  user_id: UUID
  status: "Processing"
  payment_status: "Paid"
  form_data: { /* user input */ }
  status_history: [{ status, timestamp, hash }]
}
```

---

## 🧪 Test

```bash
node test-backend.mjs
```

Should show:
- ✅ API Status: 200
- ✅ Found 4 offices
- ✅ Found 3 services

---

## 🔗 Environment

```bash
VITE_SUPABASE_URL=https://pnpunwkoahocofqeqysl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (JWT token)
```

**Location:** `.env.local` (auto-loaded by Vite)

---

## 📚 Full Guide

See: `BACKEND_INTEGRATION.md` (complete integration steps)

---

**Backend Status:** ✅ Production Ready  
**Time to integrate:** ~2 hours  
**Start:** Read `BACKEND_INTEGRATION.md`

🚀 Ready to code!
