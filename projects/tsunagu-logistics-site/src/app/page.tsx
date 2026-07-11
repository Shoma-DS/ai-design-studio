import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Intro from "@/components/Intro/Intro";
import MessagePin from "@/components/MessagePin/MessagePin";
import ServiceCarousel from "@/components/ServiceCarousel/ServiceCarousel";
import MarqueeBand from "@/components/MarqueeBand/MarqueeBand";
import NumbersSection from "@/components/NumbersSection/NumbersSection";
import ServiceList from "@/components/ServiceList/ServiceList";
import ContactSection from "@/components/ContactSection/ContactSection";
import CtaBand from "@/components/CtaBand/CtaBand";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <MessagePin />
        <ServiceCarousel />
        <MarqueeBand />
        <NumbersSection />
        <ServiceList />
        <ContactSection />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
