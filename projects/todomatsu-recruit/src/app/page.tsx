import Hero from "@/components/Hero/Hero";
import CompanyIntro from "@/components/CompanyIntro/CompanyIntro";
import CeoMessage from "@/components/CeoMessage/CeoMessage";
import EntryCta from "@/components/EntryCta/EntryCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanyIntro />
      <CeoMessage />
      <EntryCta />
    </main>
  );
}
