import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type AnyRecord, type Paginated } from "@/lib/api";

/**
 * Accès CRUD générique aux ressources de l'API (`/companies`, `/quotes`…).
 * Les clés de cache commencent toujours par le chemin de la ressource : une
 * mutation invalide ainsi la liste, la fiche et le tableau de bord d'un coup.
 */

export type ListParams = Record<string, string | number | undefined>;

function clean(params: ListParams) {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all"));
}

export function useList<T = AnyRecord>(path: string, params: ListParams = {}, enabled = true) {
  return useQuery({
    queryKey: [path, "list", clean(params)],
    queryFn: async () => (await api.get<Paginated<T>>(`/${path}`, { params: clean(params) })).data,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useItem<T = AnyRecord>(path: string, id?: string) {
  return useQuery({
    queryKey: [path, "item", id],
    queryFn: async () => (await api.get<{ item: T }>(`/${path}/${id}`)).data.item,
    enabled: Boolean(id),
  });
}

function useInvalidate(path: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [path] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };
}

export function useCreate<T = AnyRecord>(path: string) {
  const invalidate = useInvalidate(path);
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => (await api.post<{ item: T }>(`/${path}`, body)).data.item,
    onSuccess: invalidate,
  });
}

export function useUpdate<T = AnyRecord>(path: string, id?: string) {
  const invalidate = useInvalidate(path);
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => (await api.patch<{ item: T }>(`/${path}/${id}`, body)).data.item,
    onSuccess: invalidate,
  });
}

export function useRemove(path: string) {
  const invalidate = useInvalidate(path);
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/${path}/${id}`);
    },
    onSuccess: invalidate,
  });
}

/** Paramètres de liste gardés dans l'URL (?page=2&status=new) : partageables et conservés au retour. */
export function paramsFrom(search: URLSearchParams, keys: string[]) {
  const params: ListParams = { page: Number(search.get("page")) || 1, q: search.get("q") ?? "" };
  for (const key of keys) params[key] = search.get(key) ?? "";
  return params;
}
