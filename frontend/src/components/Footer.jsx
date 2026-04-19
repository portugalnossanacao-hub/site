import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { HARDTEK } from "../lib/constants";

function TikTokIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.88a8.16 8.16 0 0 0 4.77 1.52V8a4.85 4.85 0 0 1-1.84-1.31z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#services", label: t.nav.services },
    { href: "#about", label: t.nav.about },
    { href: "#testimonials", label: t.nav.testimonials },
    { href: "#contact", label: t.nav.contact },
  ];

  const go = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-white/5 bg-zinc-950 pt-20 pb-10"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-[#2b1810] shadow-[0_0_30px_rgba(234,88,12,0.35)]">
                <img
                  src="/hardtek-logo.jpg"
                  alt="Hardtek"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold tracking-tight text-white">
                  Hard<span className="text-orange-400">tek</span>
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
                  Votre PC, notre priorité
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              {t.footer.tagline}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                data-testid="footer-social-instagram"
                href={HARDTEK.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                data-testid="footer-social-tiktok"
                href={HARDTEK.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              {t.footer.quick}
            </div>
            <ul className="mt-5 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    data-testid={`footer-link-${l.href.slice(1)}`}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              {t.nav.contact}
            </div>
            <ul className="mt-5 space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <a
                  href={`tel:${HARDTEK.phoneRaw}`}
                  className="hover:text-white"
                >
                  {HARDTEK.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <a
                  href={`mailto:${HARDTEK.email}`}
                  className="break-all hover:text-white"
                >
                  {HARDTEK.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <span>
                  {HARDTEK.address.line}, {HARDTEK.address.city},{" "}
                  {HARDTEK.address.country}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-500">
            © {year} {HARDTEK.name}. {t.footer.rights}
          </p>
          <p className="text-xs text-zinc-600">
            {HARDTEK.social.instagramHandle} · {HARDTEK.social.tiktokHandle}
          </p>
        </div>
      </div>
    </footer>
  );
}
