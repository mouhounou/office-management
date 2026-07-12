// Client FACTICE (remplace Supabase). Un vrai backend Node.js viendra plus tard.
// L'API exposée (supabase.auth.*, supabase.from(...)) reste compatible avec le
// reste du code afin de ne rien casser côté consommateurs.
import { createMockClient } from "./mock";
export type { User } from "./mock";

// import { supabase } from "@/integrations/supabase/client";
export const supabase = createMockClient();
