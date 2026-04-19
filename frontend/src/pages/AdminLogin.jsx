import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { useAuth, formatApiError } from "../contexts/AuthContext";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user && user.email) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setError(formatApiError(err?.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      className="relative flex min-h-screen items-center justify-center bg-[#0d0907] px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-blue opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <form
        data-testid="admin-login-form"
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl sm:p-10"
      >
        <a
          href="/"
          className="mb-8 flex items-center gap-3"
          data-testid="admin-login-logo"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-[#2b1810]">
            <img
              src="/hardtek-logo.jpg"
              alt="Hardtek"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold text-white">
              Hard<span className="text-orange-400">tek</span>
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
              Admin
            </span>
          </div>
        </a>

        <div className="flex items-center gap-2 text-orange-300">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            Espace administrateur
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold text-white">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Accédez aux messages reçus via le formulaire.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                data-testid="admin-login-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="admin@hardtek.ch"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                data-testid="admin-login-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>
        </div>

        {error && (
          <div
            data-testid="admin-login-error"
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <button
          data-testid="admin-login-submit"
          type="submit"
          disabled={loading}
          className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connexion…
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        <a
          href="/"
          className="mt-6 block text-center text-xs text-zinc-500 hover:text-zinc-300"
          data-testid="admin-login-back-home"
        >
          ← Retour au site
        </a>
      </form>
    </div>
  );
}
