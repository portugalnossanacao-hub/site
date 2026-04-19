import {
  Wrench,
  Settings2,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { IMAGES } from "../lib/constants";

function ServiceList({ items }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  const { t } = useLang();

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="reveal flex flex-col items-start gap-6 sm:max-w-3xl">
          <span className="overline" data-testid="services-overline">
            {t.services.overline}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
            {t.services.title}
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t.services.subtitle}
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12 lg:gap-8">
          {/* Hero card - Repair */}
          <article
            data-testid="service-card-repair"
            className="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 md:col-span-8 md:row-span-2"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-500 group-hover:opacity-55"
              style={{ backgroundImage: `url(${IMAGES.repair})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/30" />

            <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
                  <Wrench className="h-3 w-3" />
                  01
                </div>

                <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t.services.repair.label}
                </h3>
                <ServiceList items={t.services.repair.items} />
              </div>

              <button
                onClick={scrollToContact}
                data-testid="service-cta-repair"
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-orange-400/50 hover:bg-orange-500/10"
              >
                {t.services.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </article>

          {/* Config card */}
          <article
            data-testid="service-card-config"
            className="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-8 md:col-span-4 transition-all hover:border-orange-500/40"
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl transition-all duration-500 group-hover:bg-orange-500/20"
              aria-hidden
            />
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-orange-600 to-orange-800 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)]">
              <Settings2 className="h-5 w-5" />
            </div>
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
              02
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">
              {t.services.config.label}
            </h3>
            <ServiceList items={t.services.config.items} />
          </article>

          {/* Sales card */}
          <article
            data-testid="service-card-sales"
            className="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 md:col-span-4 transition-all hover:border-orange-500/40"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-500 group-hover:opacity-35"
              style={{ backgroundImage: `url(${IMAGES.sales})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-transparent" />

            <div className="relative p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-orange-600 to-orange-800 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)]">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
                03
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">
                {t.services.sales.label}
              </h3>
              <ServiceList items={t.services.sales.items} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
