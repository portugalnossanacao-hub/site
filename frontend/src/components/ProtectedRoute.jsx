import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading || user === null) {
    return (
      <div
        data-testid="auth-loading"
        className="flex min-h-screen items-center justify-center bg-[#0d0907] text-zinc-400"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-sm">Vérification…</span>
      </div>
    );
  }

  if (!user || !user.email) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
