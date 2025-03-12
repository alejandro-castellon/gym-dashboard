import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL de tu proyecto Supabase
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ Service Role Key (solo en backend)
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

export default supabaseAdmin;
