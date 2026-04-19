import { useState, useMemo } from "react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Cpu,
  Bug,
  Zap,
  MonitorSmartphone,
  Wrench,
  ShoppingBag,
  Settings2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { HARDTEK } from "../lib/constants";

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0020.885 3.488z" />
    </svg>
  );
}

const DEVICES_META = [
  { key: "laptop", icon: Laptop },
  { key: "desktop", icon: Monitor },
  { key: "smartphone", icon: Smartphone },
  { key: "custom", icon: Cpu },
];

const ISSUES_META = [
  { key: "slow_virus", icon: Bug },
  { key: "wont_start", icon: Zap },
  { key: "screen", icon: MonitorSmartphone },
  { key: "build_pc", icon: Cpu },
  { key: "setup", icon: Settings2 },
  { key: "buy", icon: ShoppingBag },
  { key: "repair", icon: Wrench },
  { key: "other", icon: HelpCircle },
];

export default function QuickQuote() {
  const { t, lang } = useLang();
  const q = t.quickQuote;
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState(null);
  const [issue, setIssue] = useState(null);

  const waLink = useMemo(() => {
    if (!device || !issue) return "";
    const intro = {
      fr: "Bonjour Hardtek, je souhaite un devis express :",
      en: "Hello Hardtek, I would like a quick quote:",
      pt: "Olá Hardtek, gostaria de um orçamento rápido:",
      it: "Ciao Hardtek, vorrei un preventivo rapido:",
      de: "Hallo Hardtek, ich hätte gerne ein schnelles Angebot:",
    }[lang];
    const dLabel = q.devices.find((d) => d.key === device)?.label || "";
    const iLabel = q.issues.find((i) => i.key === issue)?.label || "";
    const msg = `${intro}\n• ${q.deviceLabel}: ${dLabel}\n• ${q.issueLabel}: ${iLabel}`;
    return `https://wa.me/${HARDTEK.whatsappRaw}?text=${encodeURIComponent(msg)}`;
  }, [device, issue, lang, q]);

  const reset = () => {
    setDevice(null);
    setIssue(null);
    setStep(0);
  };

  const progress = Math.round(((step + 1) / 3) * 100);

  return (
    <section
      id="quick-quote"
      data-testid="quick-quote-section"
      className="relative py-24 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="reveal mb-10 flex flex-col items-center gap-4 text-center">
          <span className="overline">{q.overline}</span>
          <h2 className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
            {q.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
            {q.subtitle}
          </p>
        </div>

        <div
          data-testid="quick-quote-card"
          className="reveal relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl sm:p-10"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

          {/* Progress */}
          <div className="relative mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i <= step
                      ? "w-10 bg-gradient-to-r from-orange-500 to-orange-400"
                      : "w-6 bg-white/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {q.step} {step + 1}/3 · {progress}%
            </span>
          </div>

          {/* Step 1: device */}
          {step === 0 && (
            <div data-testid="quick-quote-step-1">
              <h3 className="font-display text-2xl font-semibold text-white">
                {q.q1}
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {q.devices.map((d, i) => {
                  const Icon = DEVICES_META[i]?.icon || Laptop;
                  const active = device === d.key;
                  return (
                    <button
                      key={d.key}
                      data-testid={`qq-device-${d.key}`}
                      onClick={() => {
                        setDevice(d.key);
                        setTimeout(() => setStep(1), 120);
                      }}
                      className={`group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                        active
                          ? "border-orange-500/60 bg-orange-500/10"
                          : "border-white/10 bg-zinc-950/40 hover:border-orange-500/40 hover:bg-orange-500/5"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-orange-500 text-white"
                            : "bg-white/5 text-orange-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {d.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: issue */}
          {step === 1 && (
            <div data-testid="quick-quote-step-2">
              <h3 className="font-display text-2xl font-semibold text-white">
                {q.q2}
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {q.issues.map((iss, i) => {
                  const Icon = ISSUES_META[i]?.icon || HelpCircle;
                  const active = issue === iss.key;
                  return (
                    <button
                      key={iss.key}
                      data-testid={`qq-issue-${iss.key}`}
                      onClick={() => {
                        setIssue(iss.key);
                        setTimeout(() => setStep(2), 120);
                      }}
                      className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-orange-500/60 bg-orange-500/10"
                          : "border-white/10 bg-zinc-950/40 hover:border-orange-500/40 hover:bg-orange-500/5"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                          active
                            ? "bg-orange-500 text-white"
                            : "bg-white/5 text-orange-300"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {iss.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  data-testid="qq-back"
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {q.back}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: result */}
          {step === 2 && device && issue && (
            <div data-testid="quick-quote-step-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white">
                  {q.ready}
                </h3>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{q.deviceLabel}</span>
                  <span className="font-semibold text-white">
                    {q.devices.find((d) => d.key === device)?.label}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{q.issueLabel}</span>
                  <span className="font-semibold text-white">
                    {q.issues.find((i) => i.key === issue)?.label}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-sm text-zinc-400">{q.resultHint}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  data-testid="qq-whatsapp-cta"
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-display font-semibold text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.55)] transition-transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {q.sendWhatsapp}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  data-testid="qq-reset"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-display font-semibold text-zinc-200 transition-colors hover:border-white/30 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  {q.restart}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
