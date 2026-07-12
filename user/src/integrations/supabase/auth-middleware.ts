// Middleware d'auth FACTICE (remplace la vérification de token Supabase).
// Non utilisé actuellement ; laisse simplement passer la requête.
// À remplacer par la vérification du token du futur backend Node.js.
import { createMiddleware } from "@tanstack/react-start";

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => next(),
);
