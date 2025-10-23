import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using mock client');
}

export const supabase = supabaseUrl && supabaseAnonKey ? 
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'cortexify-web',
      },
    },
  }) : 
  // Mock client when environment variables are missing
  {
    auth: {
      signUp: () => ({ data: null, error: null }),
      signInWithPassword: () => ({ data: null, error: null }),
      signOut: () => ({ error: null }),
      getSession: () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: () => ({ data: null, error: null }),
      resetPasswordForEmail: () => ({ data: null, error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
          select: () => ({ data: [], error: null })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => ({ data: null, error: null })
            })
          })
        })
      })
    })
  };

export default supabase;
