import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { T, type Lang } from "../data";

interface LangCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  toggle: () => void;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("raouf-lang") : null;
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.dir = dir;
    localStorage.setItem("raouf-lang", lang);
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "en" ? "ar" : "en"));

  const t = (key: string): string => {
    const val = T[lang][key];
    return val ?? key;
  };

  return (
    <Ctx.Provider value={{ lang, dir, toggle, setLang, t }}>{children}</Ctx.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
