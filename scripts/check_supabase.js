// checks for presence of public supabase env vars and prints masked info
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || null;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || null;

function mask(s) {
  if (!s) return 'MISSING';
  if (s.length <= 8) return s.replace(/./g, '*');
  return s.slice(0, 6) + '...' + s.slice(-4);
}

console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? 'FOUND' : 'MISSING');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', anon ? 'FOUND' : 'MISSING');
if (url) console.log('masked url:', mask(url));
if (anon) console.log('anon key length:', anon.length);

// quick connectivity test: try a simple HEAD fetch to the url (no key)
if (url) {
  const https = require('https');
  try {
    const u = new URL(url);
    const opts = { method: 'HEAD', host: u.host, path: u.pathname };
    const req = https.request(opts, (res) => {
      console.log('HEAD statusCode:', res.statusCode);
      process.exit(0);
    });
    req.on('error', (e) => {
      console.error('HEAD request error:', e.message);
      process.exit(2);
    });
    req.end();
  } catch (e) {
    console.error('Invalid URL:', e.message);
    process.exit(3);
  }
} else {
  process.exit(0);
}
