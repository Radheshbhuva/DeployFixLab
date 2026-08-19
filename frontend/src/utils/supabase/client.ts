import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://qedrwezcgjdxfyqqeyfm.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_q9dtY-BGtHHKE8qAgAM2mg_k54MTMcB';

export const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

export const supabase = createClient();
