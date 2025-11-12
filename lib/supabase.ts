import { createClient } from '@supabase/supabase-js';

/**
 * Initialize Supabase client.
 *
 * This file attempts to read the environment variables from several common places so it works
 * in a Vite development environment as well as other runtimes.
 *
 * Provide the following environment variables (example values already provided by you):
 * NEXT_PUBLIC_SUPABASE_URL
 * NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const getEnv = () => {
	// Vite exposes envs via import.meta.env; fallback to process.env for other runtimes
	const meta: any = typeof import.meta !== 'undefined' ? import.meta : {};
	const envFromMeta = meta.env || {};

	const url = envFromMeta.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || envFromMeta.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
	const anonKey = envFromMeta.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envFromMeta.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

	return { url, anonKey };
};

const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } = getEnv();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// Developer-friendly warning. The app will continue to work with mocks when client is not configured.
	// Do not throw here so the dev server can start even if env vars are missing.
	// If you want to enforce presence, change this to throw an Error.
	// eslint-disable-next-line no-console
	console.warn('[supabase] Supabase env vars not found. supabase client not initialized.');
}

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export type SupabaseClient = ReturnType<typeof createClient> | null;

export default supabase;
