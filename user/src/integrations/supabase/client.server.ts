// Client serveur FACTICE (remplace le client "service role" Supabase).
// Non utilisé actuellement ; conservé pour compatibilité d'import.
import { createMockClient } from "./mock";

// import { supabaseAdmin } from "@/integrations/supabase/client.server";
export const supabaseAdmin = createMockClient();
