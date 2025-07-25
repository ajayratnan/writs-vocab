// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// DEBUG: log the URL so we know which project we’re hitting
console.log('🔑 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
