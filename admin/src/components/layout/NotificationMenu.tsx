import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

import { Button, Spinner } from "@/components/ui/primitives";
import { useNotificationActions, useNotifications, type Notification } from "@/lib/notifications";
import { cn, timeAgo } from "@/lib/utils";

// Couleurs de la charte ; le rouge seulement pour une erreur.
const DOT: Record<Notification["type"], string> = {
  info: "bg-brand",
  success: "bg-navy dark:bg-silver",
  warning: "bg-transparent ring-2 ring-inset ring-brand",
  error: "bg-destructive",
};

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications({ limit: 8 });
  const { markRead, markAllRead } = useNotificationActions();
  const unread = data?.unread ?? 0;

  const openNotification = (notification: Notification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative">
      <Button variant="outline" size="icon" onClick={() => setOpen((v) => !v)} aria-label={`Notifications${unread ? ` (${unread} non lues)` : ""}`} className="relative border-border">
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan px-1 text-[10px] font-bold text-navy-deep ring-2 ring-surface">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              {unread > 0 && (
                <button className="inline-flex items-center gap-1 text-xs text-brand-strong hover:underline" onClick={() => markAllRead.mutate()}>
                  <CheckCheck className="h-3.5 w-3.5" /> Tout marquer comme lu
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : !data?.items.length ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">Aucune notification.</p>
              ) : (
                data.items.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => openNotification(notification)}
                    className={cn("flex w-full gap-3 border-b border-border px-4 py-3 text-left transition last:border-0 hover:bg-muted", !notification.read && "bg-accent/40")}
                  >
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", notification.read ? "bg-transparent" : DOT[notification.type])} />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm", !notification.read && "font-semibold")}>{notification.title}</span>
                      {notification.message && <span className="block truncate text-xs text-muted-foreground">{notification.message}</span>}
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">{timeAgo(notification.createdAt)}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
            <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t border-border px-4 py-2.5 text-center text-sm text-brand-strong hover:bg-muted">
              Voir toutes les notifications
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
