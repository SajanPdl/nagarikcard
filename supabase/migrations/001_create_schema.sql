-- Migration: create schema for nagarikcard demo
-- This migration creates tables for offices, profiles, services, service_offices,
-- wallet_documents, applications and seeds demo data matching constants.ts

BEGIN;

-- Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
        CREATE TYPE role_type AS ENUM ('citizen','admin','kiosk');
    END IF;
END
$$ LANGUAGE plpgsql;

-- Document verification status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'doc_verification_status') THEN
        CREATE TYPE doc_verification_status AS ENUM ('pending','verified','rejected');
    END IF;
END
$$ LANGUAGE plpgsql;

-- Application status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('Pending Payment','Submitted','Processing','Approved','Called','More Info Requested','Rejected');
    END IF;
END
$$ LANGUAGE plpgsql;

-- Payment status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('Paid','Unpaid');
    END IF;
END
$$ LANGUAGE plpgsql;

-- Offices
CREATE TABLE IF NOT EXISTS offices (
    id text PRIMARY KEY,
    name text NOT NULL
);

-- Profiles (citizens/admins/kiosk users)
CREATE TABLE IF NOT EXISTS profiles (
    id text PRIMARY KEY,
    name text NOT NULL,
    phone text,
    email text,
    role role_type NOT NULL DEFAULT 'citizen',
    office_id text REFERENCES offices(id)
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id text PRIMARY KEY,
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    category text,
    description text,
    required_docs text[] DEFAULT ARRAY[]::text[],
    estimated_time text,
    fee numeric DEFAULT 0,
    form_schema jsonb DEFAULT '{}'::jsonb
);

-- Join table: which offices offer which services
CREATE TABLE IF NOT EXISTS service_offices (
    service_id text REFERENCES services(id) ON DELETE CASCADE,
    office_id text REFERENCES offices(id) ON DELETE CASCADE,
    PRIMARY KEY(service_id, office_id)
);

-- Wallet documents
CREATE TABLE IF NOT EXISTS wallet_documents (
    id text PRIMARY KEY,
    user_id text REFERENCES profiles(id) ON DELETE CASCADE,
    doc_type text NOT NULL,
    file_name text,
    hash text,
    verification_status doc_verification_status DEFAULT 'pending',
    storage_path text,
    created_at timestamptz DEFAULT now()
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id text PRIMARY KEY,
    service_id text REFERENCES services(id) ON DELETE SET NULL,
    user_id text REFERENCES profiles(id) ON DELETE SET NULL,
    submitted_at timestamptz DEFAULT now(),
    status application_status DEFAULT 'Submitted',
    payment_status payment_status DEFAULT 'Unpaid',
    status_history jsonb DEFAULT '[]'::jsonb,
    token text,
    office_id text REFERENCES offices(id),
    form_data jsonb DEFAULT '{}'::jsonb,
    predicted_delay text,
    sentiment text,
    updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id serial PRIMARY KEY,
    profile_id text REFERENCES profiles(id) ON DELETE CASCADE,
    message text NOT NULL,
    type text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_service ON applications(service_id);
CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallet_documents(user_id);

-- Seed demo data
-- Offices
INSERT INTO offices (id, name)
SELECT * FROM (VALUES
    ('office-1','Transport Management Office, Ekantakuna'),
    ('office-2','District Administration Office, Kathmandu'),
    ('office-3','Land Revenue Office, Dillibazar'),
    ('office-4','Company Registrar Office, Tripureshwor')
) AS v(id,name)
WHERE NOT EXISTS (SELECT 1 FROM offices WHERE id = v.id);

-- Profiles
INSERT INTO profiles (id, name, phone, email, role, office_id)
SELECT * FROM (VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef','Maya Kumari Thapa','+9779841000000','maya.thapa@email.com','citizen'::role_type,NULL),
    ('b2c3d4e5-f6a7-8901-2345-67890abcdef1','Hari Prasad Sharma',NULL,'admin@gov.np','admin'::role_type,'office-2'),
    ('c3d4e5f6-a7b8-9012-3456-7890abcdef2','Kiosk User',NULL,'kiosk@gov.np','kiosk'::role_type,'office-1')
) AS v(id,name,phone,email,role,office_id)
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = v.id);

-- Services
INSERT INTO services (id, code, name, category, description, required_docs, estimated_time, fee, form_schema)
SELECT * FROM (VALUES
    ('svc-dl-renew','DL_RENEW','Driving License Renewal','Transport','Renew your expired or soon-to-be-expired driving license.',ARRAY['citizenship','driving_license'],'3 Working Days',1500,
        '{"title":"Driving License Renewal Application","properties":{"name":{"type":"string","title":"Full Name","mapping":"user.name"},"licenseNumber":{"type":"string","title":"Existing License Number","mapping":"wallet.driving_license.number"},"expiryDate":{"type":"date","title":"Expiry Date","mapping":"wallet.driving_license.expiry"}},"required":["name","licenseNumber","expiryDate"]}'::jsonb),
    ('svc-birth-cert','BIRTH_CERT','Birth Certificate Request','Civil Registration','Apply for a new birth certificate for a newborn.',ARRAY['citizenship','hospital_report'],'7 Working Days',100,
        '{"title":"Birth Certificate Application","properties":{"childName":{"type":"string","title":"Child''s Name","mapping":""},"fatherName":{"type":"string","title":"Father''s Name","mapping":"user.name"},"motherName":{"type":"string","title":"Mother''s Name","mapping":""}},"required":["childName","fatherName","motherName"]}'::jsonb),
    ('svc-land-tax','LAND_TAX','Land Tax Payment','Revenue','Pay your annual land revenue and property taxes online.',ARRAY['citizenship','land_ownership_cert'],'1 Day',2500,
        '{"title":"Land Tax Payment","properties":{"ownerName":{"type":"string","title":"Land Owner Name","mapping":"user.name"},"plotNumber":{"type":"string","title":"Plot Number (Kitta No.)","mapping":"wallet.land_ownership_cert.plot"}},"required":["ownerName","plotNumber"]}'::jsonb
    )
) AS v(id,code,name,category,description,required_docs,estimated_time,fee,form_schema)
WHERE NOT EXISTS (SELECT 1 FROM services WHERE id = v.id);

-- Service offices links
INSERT INTO service_offices (service_id, office_id)
SELECT * FROM (VALUES
    ('svc-dl-renew','office-1'),
    ('svc-birth-cert','office-2'),
    ('svc-land-tax','office-3')
) AS v(sid,oid)
WHERE NOT EXISTS (SELECT 1 FROM service_offices WHERE service_id = v.sid AND office_id = v.oid);

-- Wallet documents
INSERT INTO wallet_documents (id, user_id, doc_type, file_name, hash, verification_status, storage_path, created_at)
SELECT * FROM (VALUES
    ('doc-1','a1b2c3d4-e5f6-7890-1234-567890abcdef','citizenship','citizenship_maya.pdf','a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2','verified'::doc_verification_status,'a1b2c3d4-e5f6-7890-1234-567890abcdef/citizenship_maya.pdf', now()),
    ('doc-2','a1b2c3d4-e5f6-7890-1234-567890abcdef','driving_license','license_maya.jpg','b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3','verified'::doc_verification_status,'a1b2c3d4-e5f6-7890-1234-567890abcdef/license_maya.jpg', now()),
    ('doc-3','a1b2c3d4-e5f6-7890-1234-567890abcdef','passport','passport_maya.pdf','c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3','pending'::doc_verification_status,'a1b2c3d4-e5f6-7890-1234-567890abcdef/passport_maya.pdf', now())
) AS v(id,user_id,doc_type,file_name,hash,verification_status,storage_path,created_at)
WHERE NOT EXISTS (SELECT 1 FROM wallet_documents WHERE id = v.id);

-- Applications
INSERT INTO applications (id, service_id, user_id, submitted_at, status, payment_status, token, office_id, form_data, predicted_delay, sentiment, status_history)
SELECT * FROM (VALUES
    (
        'app-1',
        'svc-dl-renew',
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        now() - interval '3 days',
        'Processing'::application_status,
        'Paid'::payment_status,
        'TKN-4581',
        'office-1',
        '{"name":"Maya Kumari Thapa","licenseNumber":"12-34-567890","expiryDate":"2024-09-30"}'::jsonb,
        '+1 day due to high volume',
        'neutral',
        jsonb_build_array(
            jsonb_build_object('status','Pending Payment','timestamp', to_char(now() - interval '3 days' - interval '10 seconds','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xabc1'),
            jsonb_build_object('status','Submitted','timestamp', to_char(now() - interval '3 days' - interval '5 seconds','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xdef2'),
            jsonb_build_object('status','Processing','timestamp', to_char(now() - interval '1 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xjkl4')
        )
    ),
    (
        'app-2',
        'svc-land-tax',
        'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        now() - interval '10 days',
        'Approved'::application_status,
        'Paid'::payment_status,
        'TKN-1123',
        'office-3',
        '{"ownerName":"Maya Kumari Thapa","plotNumber":"102-KA-45"}'::jsonb,
        NULL,
        'positive',
        jsonb_build_array(
            jsonb_build_object('status','Pending Payment','timestamp', to_char(now() - interval '10 days' - interval '10 seconds','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xabc1'),
            jsonb_build_object('status','Submitted','timestamp', to_char(now() - interval '10 days' - interval '5 seconds','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xdef2'),
            jsonb_build_object('status','Processing','timestamp', to_char(now() - interval '8 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xjkl4'),
            jsonb_build_object('status','Approved','timestamp', to_char(now() - interval '5 days','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'hash','0xmno5')
        )
    )
) AS v(id,service_id,user_id,submitted_at,status,payment_status,token,office_id,form_data,predicted_delay,sentiment,status_history)
WHERE NOT EXISTS (SELECT 1 FROM applications WHERE id = v.id);

COMMIT;
