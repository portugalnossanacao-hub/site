import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { HARDTEK } from "../lib/constants";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success(t.contact.form.success);
      setForm({ name: "", email: "", service: "", message: "" });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Contact form error:", err);
      }
      toast.error(t.contact.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: info */}
          <div className="reveal lg:col-span-5">
            <span className="overline">{t.contact.overline}</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
              {t.contact.subtitle}
            </p>

            <div className="mt-10 space-y-5">
              <a
                data-testid="contact-phone-link"
                href={`tel:${HARDTEK.phoneRaw}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:border-orange-500/40 hover:bg-zinc-900/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {t.contact.phone}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-white group-hover:text-orange-300">
                    {HARDTEK.phoneDisplay}
                  </div>
                </div>
              </a>

              <a
                data-testid="contact-email-link"
                href={`mailto:${HARDTEK.email}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:border-orange-500/40 hover:bg-zinc-900/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {t.contact.email}
                  </div>
                  <div className="mt-1 break-all font-display text-lg font-semibold text-white group-hover:text-orange-300">
                    {HARDTEK.email}
                  </div>
                </div>
              </a>

              <div
                data-testid="contact-address"
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {t.contact.address}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-white">
                    {HARDTEK.address.line}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {HARDTEK.address.city} · {HARDTEK.address.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal lg:col-span-7">
            <form
              data-testid="contact-form"
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl sm:p-10"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.contact.form.name}
                  </label>
                  <input
                    data-testid="contact-input-name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    maxLength={120}
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.contact.form.email}
                  </label>
                  <input
                    data-testid="contact-input-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {t.contact.form.service}
                </label>
                <select
                  data-testid="contact-input-service"
                  name="service"
                  value={form.service}
                  onChange={onChange}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="">{t.contact.form.selectService}</option>
                  {t.contact.form.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {t.contact.form.message}
                </label>
                <textarea
                  data-testid="contact-input-message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={5}
                  maxLength={3000}
                  className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="..."
                />
              </div>

              <button
                data-testid="contact-submit-button"
                type="submit"
                disabled={loading}
                className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.contact.form.send}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
