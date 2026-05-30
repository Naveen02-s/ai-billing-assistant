import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({ roles }) {
  const { user, token } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
