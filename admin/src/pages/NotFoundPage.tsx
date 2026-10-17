import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { Button, EmptyState } from "@/components/ui/primitives";

export function NotFoundPage() {
  return (
    <EmptyState
      icon={Compass}
      title="Page introuvable"
      description="Le lien est peut-être incomplet ou l'élément a été supprimé."
      action={
        <Link to="/">
          <Button variant="outline">Retour au tableau de bord</Button>
        </Link>
      }
    />
  );
}
