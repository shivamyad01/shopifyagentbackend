import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import AppLayout from "./components/layout/AppLayout";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantAnalytics from "./pages/tenant/TenantAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTenants from "./pages/admin/AdminTenants";
import AdminStores from "./pages/admin/AdminStores";
import StoreConnectedPage from "./pages/admin/StoreConnectedPage";

function RequireAuth({ children, adminOnly = false }) {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isSuperAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  if (!isAuthenticated) return children;
  return <Navigate to={isSuperAdmin ? "/admin" : "/app"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout variant="tenant" />
            </RequireAuth>
          }
        >
          <Route index element={<TenantDashboard />} />
          <Route path="analytics" element={<TenantAnalytics />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth adminOnly>
              <AppLayout variant="admin" />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="stores" element={<AdminStores />} />
        </Route>

        <Route
          path="/stores/connected"
          element={
            <RequireAuth adminOnly>
              <AppLayout variant="admin" />
            </RequireAuth>
          }
        >
          <Route index element={<StoreConnectedPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}
