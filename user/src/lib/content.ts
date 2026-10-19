import { api } from "@/lib/api";

/**
 * Contenus administrés depuis le back-office et servis par l'API.
 * Ce module remplace les données autrefois figées dans le code du site.
 */

export type Formation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string | null;
  program: string[];
  duration?: string | null;
  level?: string | null;
  price?: string | null;
  certifying: boolean;
  imageUrl?: string | null;
  order: number;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string | null;
  readTime?: string | null;
  featured: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  contractType: string;
  sector?: string | null;
  duration?: string | null;
  requirements?: string | null;
  expiresAt?: string | null;
  createdAt: string;
};

export type SiteSettings = {
  contact: Record<string, string>;
  legal: Record<string, string>;
  social: Record<string, string>;
  ceo: Record<string, string>;
};

export async function fetchFormations(category?: string): Promise<Formation[]> {
  const { data } = await api.get<{ items: Formation[] }>("/formations", {
    params: category ? { category } : undefined,
  });
  return data.items;
}

export async function fetchFormation(slug: string): Promise<Formation> {
  const { data } = await api.get<{ item: Formation }>(`/formations/${slug}`);
  return data.item;
}

export async function fetchPosts(category?: string): Promise<Post[]> {
  const { data } = await api.get<{ items: Post[]; total: number }>("/posts", {
    params: { limit: 100, ...(category && category !== "Tous" ? { category } : {}) },
  });
  return data.items;
}

export async function fetchPost(slug: string): Promise<Post> {
  const { data } = await api.get<{ item: Post }>(`/posts/${slug}`);
  return data.item;
}

export async function fetchOffers(): Promise<Offer[]> {
  const { data } = await api.get<{ items: Offer[] }>("/offers");
  return data.items;
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await api.get<{ settings: SiteSettings }>("/settings");
  return data.settings;
}

/**
 * Rendu du texte d'un article : une ligne « ## » devient un sous-titre, une
 * ligne « - » un élément de liste, le reste un paragraphe. Même convention que
 * l'aide affichée dans le back-office.
 */
export type PostBlock =
  { type: "h"; text: string } | { type: "p"; text: string } | { type: "ul"; items: string[] };

export function parseContent(content: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2).trim());
    } else {
      flushList();
      blocks.push({ type: "p", text: line });
    }
  }
  flushList();

  return blocks;
}
