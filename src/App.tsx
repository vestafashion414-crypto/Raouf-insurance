import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuoteForm from "./components/QuoteForm";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <QuoteForm />
        <Services />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
