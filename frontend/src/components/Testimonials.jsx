import { Star, Quote } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { IMAGES } from "../lib/constants";

export default function Testimonials() {
  const { t } = useLang();
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-24 sm:py-32"
    >
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${IMAGES.testimonialsBg})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="reveal flex flex-col items-start gap-4 sm:max-w-2xl">
          <span className="overline">{t.testimonials.overline}</span>
          <h2 className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.testimonials.items.map((item, i) => (
            <article
              key={`${item.name}-${i}`}
              data-testid={`testimonial-card-${i}`}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-orange-500/40 hover:bg-zinc-900/80"
            >
              <Quote
                className="absolute right-5 top-5 h-8 w-8 text-orange-500/20 transition-colors group-hover:text-orange-500/40"
                aria-hidden
              />

              <div
                className="flex items-center gap-1"
                data-testid={`testimonial-stars-${i}`}
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="h-4 w-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-zinc-300">
                “{item.quote}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 font-display font-bold text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {item.name}
                  </div>
                  <div className="text-xs text-zinc-500">{item.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
