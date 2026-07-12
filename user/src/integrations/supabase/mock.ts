// ---------------------------------------------------------------------------
// Client FACTICE remplaçant Supabase (auth + accès données).
// Objectif : faire tourner l'app sans backend. Les identifiants sont en dur.
// À remplacer plus tard par des appels au backend Node.js.
// ---------------------------------------------------------------------------

export type User = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

export type Session = { user: User; access_token: string };

type Account = { id: string; email: string; password: string; full_name: string; role: "admin" | "formateur" | "client" };

// --- Comptes de démonstration (identifiants factices) ----------------------
export const DEMO_ACCOUNTS: Account[] = [
  { id: "u-admin", email: "admin@office.cg", password: "admin1234", full_name: "Admin Démo", role: "admin" },
  { id: "u-formateur", email: "formateur@office.cg", password: "formateur1234", full_name: "Formateur Démo", role: "formateur" },
  { id: "u-client", email: "client@office.cg", password: "client1234", full_name: "Client Démo", role: "client" },
];

// --- Données en mémoire (seed minimal) -------------------------------------
const store: Record<string, Record<string, unknown>[]> = {
  user_roles: DEMO_ACCOUNTS.map((a) => ({ user_id: a.id, role: a.role })),
  profiles: DEMO_ACCOUNTS.map((a) => ({ id: a.id, email: a.email, full_name: a.full_name })),
  internship_offers: [],
  applications: [],
  notifications: [],
  companies: [],
  business_requests: [],
  business_documents: [],
  business_request_events: [],
  pre_registrations: [],
  quote_requests: [],
  newsletter_subscribers: [],
  site_settings: [],
  branding: [],
};

// --- État d'authentification ----------------------------------------------
const SESSION_KEY = "mock_auth_session";
type Listener = (event: string, session: Session | null) => void;
const listeners = new Set<Listener>();
let session: Session | null = null;

function persist() {
  if (typeof window === "undefined") return;
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function restore() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) session = JSON.parse(raw);
  } catch {
    /* ignore */
  }
}
restore();

function emit(event: string) {
  for (const l of listeners) l(event, session);
}

function toUser(a: Account): User {
  return { id: a.id, email: a.email, user_metadata: { full_name: a.full_name }, app_metadata: { role: a.role } };
}

const auth = {
  async getSession() {
    return { data: { session }, error: null };
  },
  async getUser() {
    return { data: { user: session?.user ?? null }, error: null };
  },
  async getClaims(_token?: string) {
    return { data: { claims: session ? { sub: session.user.id } : null }, error: null };
  },
  onAuthStateChange(cb: Listener) {
    listeners.add(cb);
    // Émet l'état initial de façon asynchrone (comme Supabase).
    setTimeout(() => cb("INITIAL_SESSION", session), 0);
    return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const acc = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!acc || acc.password !== password) {
      return { data: { session: null, user: null }, error: { message: "Invalid login credentials" } };
    }
    session = { user: toUser(acc), access_token: `mock-token-${acc.id}` };
    persist();
    emit("SIGNED_IN");
    return { data: { session, user: session.user }, error: null };
  },
  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: { full_name?: string } } }) {
    const exists = DEMO_ACCOUNTS.some((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { data: { user: null, session: null }, error: { message: "User already registered" } };
    const acc: Account = { id: `u-${crypto.randomUUID()}`, email: email.trim(), password, full_name: options?.data?.full_name ?? "", role: "client" };
    DEMO_ACCOUNTS.push(acc);
    store.user_roles.push({ user_id: acc.id, role: "client" });
    store.profiles.push({ id: acc.id, email: acc.email, full_name: acc.full_name });
    return { data: { user: toUser(acc), session: null }, error: null };
  },
  async signOut() {
    session = null;
    persist();
    emit("SIGNED_OUT");
    return { error: null };
  },
};

// --- Query builder chaînable & thenable ------------------------------------
type Filter = { col: string; val: unknown };

class QueryBuilder implements PromiseLike<{ data: unknown; error: null }> {
  private table: string;
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private payload: unknown;
  private filters: Filter[] = [];
  private orMatches: Filter[] | null = null;
  private orders: { col: string; asc: boolean }[] = [];
  private limitN: number | null = null;
  private mode: "many" | "single" | "maybe" = "many";

  constructor(table: string) {
    this.table = table;
  }

  private rows(): Record<string, unknown>[] {
    return store[this.table] ?? (store[this.table] = []);
  }

  select(_cols?: string) { if (this.op !== "insert" && this.op !== "update" && this.op !== "upsert" && this.op !== "delete") this.op = "select"; return this; }
  insert(payload: unknown) { this.op = "insert"; this.payload = payload; return this; }
  update(payload: unknown) { this.op = "update"; this.payload = payload; return this; }
  upsert(payload: unknown) { this.op = "upsert"; this.payload = payload; return this; }
  delete() { this.op = "delete"; return this; }
  eq(col: string, val: unknown) { this.filters.push({ col, val }); return this; }
  neq(col: string, val: unknown) { this.filters.push({ col, val: { __neq: val } }); return this; }
  is(col: string, val: unknown) { this.filters.push({ col, val }); return this; }
  in(col: string, vals: unknown[]) { this.filters.push({ col, val: { __in: vals } }); return this; }
  match(obj: Record<string, unknown>) { for (const k in obj) this.filters.push({ col: k, val: obj[k] }); return this; }
  or(expr: string) {
    // Supporte "col.eq.val,col2.eq.val2" (opérateur eq uniquement).
    this.orMatches = expr.split(",").map((part) => {
      const [col, , ...rest] = part.split(".");
      return { col, val: rest.join(".") };
    });
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) { this.orders.push({ col, asc: opts?.ascending !== false }); return this; }
  limit(n: number) { this.limitN = n; return this; }
  single() { this.mode = "single"; return this; }
  maybeSingle() { this.mode = "maybe"; return this; }

  private applyFilters(list: Record<string, unknown>[]): Record<string, unknown>[] {
    let out = list.filter((row) =>
      this.filters.every((f) => {
        const v = f.val as { __neq?: unknown; __in?: unknown[] } | unknown;
        if (v && typeof v === "object" && "__neq" in (v as object)) return row[f.col] !== (v as { __neq: unknown }).__neq;
        if (v && typeof v === "object" && "__in" in (v as object)) return (v as { __in: unknown[] }).__in.includes(row[f.col]);
        return row[f.col] === f.val;
      }),
    );
    if (this.orMatches) {
      out = out.filter((row) => this.orMatches!.some((f) => String(row[f.col]) === String(f.val)));
    }
    return out;
  }

  private compute(): unknown {
    const rows = this.rows();
    let result: Record<string, unknown>[] = [];

    if (this.op === "insert" || this.op === "upsert") {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      result = (items as Record<string, unknown>[]).map((item) => ({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...item,
      }));
      rows.push(...result);
    } else if (this.op === "update") {
      result = this.applyFilters(rows);
      for (const row of result) Object.assign(row, this.payload as Record<string, unknown>);
    } else if (this.op === "delete") {
      result = this.applyFilters(rows);
      store[this.table] = rows.filter((r) => !result.includes(r));
    } else {
      result = this.applyFilters(rows);
      for (const o of this.orders) {
        result = [...result].sort((a, b) => {
          const av = a[o.col] as string, bv = b[o.col] as string;
          if (av === bv) return 0;
          return (av > bv ? 1 : -1) * (o.asc ? 1 : -1);
        });
      }
      if (this.limitN != null) result = result.slice(0, this.limitN);
    }

    if (this.mode === "single") return result[0] ?? null;
    if (this.mode === "maybe") return result[0] ?? null;
    return result;
  }

  then<TResult1 = { data: unknown; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve({ data: this.compute(), error: null }).then(onfulfilled, onrejected);
  }
}

export function createMockClient() {
  return {
    auth,
    from(table: string) {
      return new QueryBuilder(table);
    },
  };
}

export type MockClient = ReturnType<typeof createMockClient>;
