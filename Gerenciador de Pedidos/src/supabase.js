import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bukymjywmmwywmajkafd.supabase.co';
// ATENÇÃO: Essa chave é a 'service_role' key. Em aplicações de produção puramente frontend
// é mais seguro usar a 'anon' key e habilitar Row Level Security (RLS) no Supabase.
// Como estamos migrando e usando localmente, usaremos essa para facilitar.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1a3ltanl3bW13eXdtYWprYWZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTQ1MzUyNiwiZXhwIjoyMTAxMDI5NTI2fQ.hzeZGi0EArDajX_k_C7AQEhFChARe4Aa7h6DMP4sEvU';

export const supabaseAuthClient = createClient(supabaseUrl, supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
