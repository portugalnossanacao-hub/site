import { Zap, Eye, Award } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { IMAGES } from "../lib/constants";

const ICONS = [Zap, Eye, Award];

export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Image column */}
          <div className="reveal relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img
                src={IMAGES.about}
                alt="Hardtek workshop"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-xl sm:block glow-blue">
              <div className="font-display text-3xl font-bold text-white">
                100%
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Satisfaction
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="reveal lg:col-span-7">
            <span className="overline">{t.about.overline}</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
              {t.about.title}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            <div className="divider-gradient mt-10" />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {t.about.values.map((v, i) => {
                const Icon = ICONS[i] || Award;
                return (
                  <div
                    key={v.title}
                    data-testid={`about-value-${i}`}
                    className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-5 transition-all hover:border-orange-500/40 hover:bg-zinc-900/80"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold text-white">
                      {v.title}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
