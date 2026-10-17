import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingBlock } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";
import { BusinessRequestPage } from "@/pages/BusinessRequestPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { MediaPage } from "@/pages/MediaPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ResourceDetailPage } from "@/pages/ResourceDetailPage";
import { ResourceListPage } from "@/pages/ResourceListPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { UsersPage } from "@/pages/UsersPage";

function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><LoadingBlock /></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}

function RequireAdmin() {
  const { can } = useAuth();
  return can("admin") ? <Outlet /> : <Navigate to="/" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="business-requests/:id" element={<BusinessRequestPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route element={<RequireAdmin />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
          {/* Ressources génériques : /quotes, /offers/new, /posts/:id… */}
          <Route path=":resource" element={<ResourceListPage />} />
          <Route path=":resource/:id" element={<ResourceDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
