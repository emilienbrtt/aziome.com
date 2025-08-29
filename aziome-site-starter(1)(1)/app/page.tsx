import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Process from "@/components/Process";
import Trust from "@/components/Trust";
import Integrations from "@/components/Integrations";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Solutions />
      <Process />
      <Trust />
      <Integrations />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
