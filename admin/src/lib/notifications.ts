import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type Paginated } from "@/lib/api";

export type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string | null;
  link?: string | null;
  user?: string | null;
  read: boolean;
  createdAt: string;
};

type NotificationList = Paginated<Notification> & { unread: number };

export function useNotifications(params: { page?: number; unread?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () =>
      (
        await api.get<NotificationList>("/notifications", {
          params: { page: params.page ?? 1, limit: params.limit ?? 20, ...(params.unread ? { unread: "true" } : {}) },
        })
      ).data,
    refetchInterval: 60_000,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markRead = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: invalidate,
  });
  const markAllRead = useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/notifications/${id}`),
    onSuccess: invalidate,
  });

  return { markRead, markAllRead, remove };
}
