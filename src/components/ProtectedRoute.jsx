import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
