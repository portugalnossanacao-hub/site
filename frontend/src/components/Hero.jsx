import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { IMAGES, HARDTEK } from "../lib/constants";

export default function Hero() {
  const { t } = useLang();

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-[100vh] overflow-hidden pt-28"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroBg})` }}
        aria-hidden
      />
      {/* Dark overlay + radial blue glow */}
      <div className="absolute inset-0 -z-10 bg-[#0d0907]/80" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-radial-blue" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-6 py-20 sm:px-8 lg:py-32">
        <div className="fade-up max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.hero.overline}</span>
          </div>

          <h1
            data-testid="hero-title"
            className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl"
          >
            {t.hero.title1}
            <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-sky-200 bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-cta-quote"
              onClick={() => scrollTo("#contact")}
              className="btn-primary"
            >
              {t.hero.ctaQuote}
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              data-testid="hero-cta-call"
              href={`tel:${HARDTEK.phoneRaw}`}
              className="btn-secondary"
            >
              <Phone className="h-4 w-4" />
              {t.hero.ctaContact}
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div
          data-testid="hero-stats"
          className="mt-20 grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:mt-24 sm:grid-cols-3 sm:gap-8"
        >
          {t.hero.stats.map((s, i) => (
            <div key={s.k ?? i} className="relative">
              <div className="font-display text-3xl font-bold text-white sm:text-4xl">
                {s.k}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
                {s.v}
              </div>
              {i < t.hero.stats.length - 1 && (
                <div className="absolute right-0 top-1 hidden h-10 w-px bg-white/10 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0d0907]" />
    </section>
  );
}
