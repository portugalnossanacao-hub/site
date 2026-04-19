import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Mail,
  Phone as PhoneIcon,
  LogOut,
  Trash2,
  Inbox,
  Loader2,
  RefreshCcw,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-orange-400" />
      </div>
      <div className="mt-2 font-display text-3xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-CH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/contact`);
      setMessages(data || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/admin/login");
        return;
      }
      toast.error("Impossible de charger les messages.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await axios.delete(`${API}/contact/${id}`);
      setMessages((m) => m.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Message supprimé.");
    } catch {
      toast.error("Suppression impossible.");
    }
  };

  const todayCount = messages.filter((m) => {
    try {
      return new Date(m.created_at).toDateString() === new Date().toDateString();
    } catch {
      return false;
    }
  }).length;

  return (
    <div
      data-testid="admin-dashboard"
      className="min-h-screen bg-[#0d0907] text-white"
    >
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3" data-testid="admin-home-link">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-[#2b1810]">
              <img
                src="/hardtek-logo.jpg"
                alt="Hardtek"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-extrabold">
                Hard<span className="text-orange-400">tek</span>
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
                Espace admin
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <button
              data-testid="admin-refresh"
              onClick={fetchMessages}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-orange-500/40 hover:text-white sm:inline-flex"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Actualiser
            </button>
            <span className="hidden text-xs text-zinc-400 sm:inline">
              {user?.email}
            </span>
            <button
              data-testid="admin-logout"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_22px_-8px_rgba(234,88,12,0.6)] transition-colors hover:bg-orange-500"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Messages de contact
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Toutes les demandes envoyées via le formulaire du site.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total" value={messages.length} icon={Inbox} />
          <StatCard label="Aujourd’hui" value={todayCount} icon={MessageSquare} />
          <StatCard
            label="Email admin"
            value={user?.email || "—"}
            icon={Mail}
          />
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* List */}
          <div
            data-testid="admin-messages-list"
            className="rounded-3xl border border-white/10 bg-zinc-900/60 lg:col-span-5"
          >
            {loading ? (
              <div className="flex items-center justify-center py-20 text-zinc-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement…
              </div>
            ) : messages.length === 0 ? (
              <div
                data-testid="admin-empty"
                className="flex flex-col items-center gap-3 py-20 text-center text-zinc-400"
              >
                <Inbox className="h-10 w-10 text-zinc-600" />
                <div className="font-semibold text-white">Aucun message</div>
                <div className="text-sm">
                  Les soumissions du formulaire apparaîtront ici.
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {messages.map((m) => {
                  const active = selected?.id === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        data-testid={`admin-message-item-${m.id}`}
                        onClick={() => setSelected(m)}
                        className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors ${
                          active
                            ? "bg-orange-500/10"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display font-bold ${
                            active
                              ? "bg-orange-500 text-white"
                              : "bg-white/5 text-orange-300"
                          }`}
                        >
                          {(m.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-semibold text-white">
                              {m.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-zinc-500">
                              {formatDate(m.created_at)}
                            </span>
                          </div>
                          <div className="mt-0.5 truncate text-xs text-zinc-400">
                            {m.service || "—"} · {m.email}
                          </div>
                          <div className="mt-1 line-clamp-2 text-sm text-zinc-300">
                            {m.message}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Detail */}
          <div
            data-testid="admin-message-detail"
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 lg:col-span-7"
          >
            {!selected ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center text-zinc-400">
                <MessageSquare className="h-10 w-10 text-zinc-600" />
                <div className="text-sm">
                  Sélectionnez un message dans la liste pour voir les détails.
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                      {selected.service || "Demande générale"}
                    </div>
                    <h2 className="mt-1 font-display text-2xl font-bold">
                      {selected.name}
                    </h2>
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatDate(selected.created_at)}
                    </div>
                  </div>
                  <button
                    data-testid="admin-delete-message"
                    onClick={() => handleDelete(selected.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/50 p-3 text-sm hover:border-orange-500/40"
                    data-testid="admin-msg-email-link"
                  >
                    <Mail className="h-4 w-4 text-orange-300" />
                    <span className="truncate text-white">{selected.email}</span>
                  </a>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/50 p-3 text-sm">
                    <PhoneIcon className="h-4 w-4 text-orange-300" />
                    <span className="truncate text-zinc-400">
                      {selected.service || "Service non précisé"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Message
                  </div>
                  <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-zinc-950/50 p-5 text-sm leading-relaxed text-zinc-200">
                    {selected.message}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
