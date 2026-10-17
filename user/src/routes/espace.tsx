import { createFileRoute } from "@tanstack/react-router";

import { AccountLayout } from "@/components/account/AccountLayout";

// Espace client : layout commun à toutes les pages /espace/*, réservé aux
// visiteurs connectés (la redirection vers /connexion est faite par le layout).
export const Route = createFileRoute("/espace")({
  head: () => ({
    meta: [{ title: "Mon espace — Office Management" }, { name: "robots", content: "noindex" }],
  }),
  component: AccountLayout,
});
