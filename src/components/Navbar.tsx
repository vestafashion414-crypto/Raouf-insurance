import { useEffect, useState } from "react";
import { Phone, ShieldCheck, Menu, X, Languages } from "lucide-react";
import { useLang } from "../lib/LanguageContext";
import { CONTACT } from "../data";

export default function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("navQuote"), href: "#quote" },
    { label: t("navServices"), href: "#services" },
    { label: t("navWhyUs"), href: "#why-us" },
    { label: t("navReviews"), href: "#reviews" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold-500/20 bg-ink-950/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-lux flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3" aria-label="RAOUF Insurance Services home">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-900 shadow-gold">
            <ShieldCheck className="h-6 w-6 text-gold-400" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-wide text-gold-200">{t("brandName")}</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-400">
              {t("brandTagline")}
            </p>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-gray-300 transition-colors hover:text-gold-200"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={toggle}
            className="flex h-10 items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/5 px-4 text-sm font-medium text-gold-200 transition-all hover:bg-gold-500/15"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a href={`tel:${CONTACT.phoneIntl}`} className="btn-ghost">
            <Phone className="h-4 w-4" />
            {CONTACT.phone}
          </a>
          <a href="#quote" className="btn-gold">{t("navGetQuote")}</a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gold-500/15 bg-ink-950/98 backdrop-blur-xl lg:hidden">
          <div className="container-lux flex flex-col gap-2 py-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition-colors hover:bg-gold-500/10 hover:text-gold-200"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={toggle}
              className="mt-2 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gold-200 transition-colors hover:bg-gold-500/10"
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "العربية" : "English"}
            </button>
            <div className="mt-3 flex flex-col gap-3">
              <a href={`tel:${CONTACT.phoneIntl}`} className="btn-outline-gold w-full">
                <Phone className="h-4 w-4" />
                {t("navCall")} {CONTACT.phone}
              </a>
              <a href="#quote" onClick={() => setOpen(false)} className="btn-gold w-full">
                {t("navGetQuote")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
