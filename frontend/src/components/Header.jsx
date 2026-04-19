import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { LANGS } from "../lib/translations";

function LogoMark() {
  return (
    <div className="flex items-center gap-3" data-testid="site-logo">
      <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-[#2b1810] shadow-[0_0_30px_rgba(234,88,12,0.35)]">
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
        <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-orange-400/80 sm:block">
          Votre PC, notre priorité
        </span>
      </div>
    </div>
  );
}

function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        data-testid="language-selector-button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-orange-500/50 hover:text-white transition-all"
      >
        <span>{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          data-testid="language-selector-menu"
          className="absolute right-0 mt-2 w-24 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl"
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              data-testid={`language-option-${l.code}`}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-xs font-semibold transition-colors ${
                l.code === lang
                  ? "bg-orange-600/20 text-orange-300"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: t.nav.home, id: "home" },
    { href: "#services", label: t.nav.services, id: "services" },
    { href: "#about", label: t.nav.about, id: "about" },
    { href: "#testimonials", label: t.nav.testimonials, id: "testimonials" },
    { href: "#contact", label: t.nav.contact, id: "contact" },
  ];

  const go = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="#home" onClick={(e) => go(e, "#home")} className="shrink-0">
          <LogoMark />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              data-testid={`nav-link-${l.id}`}
              onClick={(e) => go(e, l.href)}
              className="group relative text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-orange-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <a
            href="#contact"
            data-testid="nav-quote-cta"
            onClick={(e) => go(e, "#contact")}
            className="hidden rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(234,88,12,0.6)] transition-all hover:bg-orange-500 md:inline-flex"
          >
            {t.nav.quote}
          </a>
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-200 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div
          data-testid="mobile-menu"
          className="border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                data-testid={`mobile-nav-link-${l.id}`}
                onClick={(e) => go(e, l.href)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              data-testid="mobile-quote-cta"
              onClick={(e) => go(e, "#contact")}
              className="mt-2 rounded-full bg-orange-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t.nav.quote}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
