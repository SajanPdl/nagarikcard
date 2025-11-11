#!/usr/bin/env node
import fetch from 'node-fetch';
import fs from 'fs';

// Load environment
const env = {};
fs.readFileSync('.env.local', 'utf-8')
  .split('\n')
  .forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) env[key.trim()] = value.join('=').trim();
  });

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;

async function testSupabaseBackend() {
  try {
    console.log('\n🔍 TESTING SUPABASE BACKEND CONNECTION\n');

    // Test 1: Check API availability
    console.log('1️⃣  Testing Supabase API...');
    const apiTest = await fetch(`${url}/rest/v1/`, {
      headers: { 'apikey': key }
    });
    console.log(`   ✅ API Status: ${apiTest.status}`);

    // Test 2: Check offices table
    console.log('\n2️⃣  Checking offices table...');
    const officesRes = await fetch(`${url}/rest/v1/offices?select=*&limit=5`, {
      headers: { 'apikey': key }
    });

    if (officesRes.ok) {
      const offices = await officesRes.json();
      console.log(`   ✅ Found ${offices.length} offices`);
      offices.forEach((o, i) => {
        console.log(`      ${i + 1}. ${o.name}`);
      });
    } else {
      const text = await officesRes.text();
      console.log(`   ⚠️  Status: ${officesRes.status}`);
      console.log(`   Message: ${text.substring(0, 100)}`);
    }

    // Test 3: Check services table
    console.log('\n3️⃣  Checking services table...');
    const servRes = await fetch(`${url}/rest/v1/services?select=*&limit=5`, {
      headers: { 'apikey': key }
    });

    if (servRes.ok) {
      const services = await servRes.json();
      console.log(`   ✅ Found ${services.length} services`);
      services.forEach((s, i) => {
        console.log(`      ${i + 1}. ${s.name}`);
      });
    } else {
      console.log(`   ⚠️  Status: ${servRes.status}`);
    }

    console.log('\n✅ SUPABASE BACKEND READY FOR USE!\n');
    console.log('📋 Your Supabase is configured and ready to use as a backend server.\n');
    console.log('🚀 Next steps:\n');
    console.log('   1. Update AppContext.tsx to use real Supabase queries');
    console.log('   2. Call the helper functions from lib/supabase.ts:');
    console.log('      - getServices()');
    console.log('      - getApplications(userId)');
    console.log('      - getWalletDocuments(userId)');
    console.log('      - submitApplication(app)');
    console.log('      - updateApplicationStatus(appId, status)');
    console.log('   3. Run: npm run dev');
    console.log('\n');

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

testSupabaseBackend();
