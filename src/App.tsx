import { useState } from "react";
import QuoteForm from "./components/QuoteForm";
import DocumentUpload from "./components/DocumentUpload";
import AboutSection from "./components/AboutSection";
import BottomBar from "./components/BottomBar";
import { type QuoteFormData, type PriceResult } from "./data";

type View = "form" | "documents";

export default function App() {
  const [view, setView] = useState<View>("form");
  const [form, setForm] = useState<QuoteFormData | null>(null);
  const [price, setPrice] = useState<PriceResult | null>(null);

  const handlePriceCalculated = (formData: QuoteFormData, result: PriceResult) => {
    setForm(formData);
    setPrice(result);
    if (!result.needsContact) {
      setView("documents");
    }
  };

  const handleNewQuote = () => {
    setForm(null);
    setPrice(null);
    setView("form");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 pb-20">
      {view === "form" && <QuoteForm onPriceCalculated={handlePriceCalculated} />}
      {view === "documents" && form && price && (
        <DocumentUpload form={form} price={price} onNewQuote={handleNewQuote} />
      )}
      <AboutSection />
      <BottomBar onGetQuote={() => { setView("form"); }} />
    </div>
  );
}
