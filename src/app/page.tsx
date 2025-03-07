import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Services from "@/components/home/services";
import Prices from "@/components/home/prices";
import About from "@/components/home/about";
import Contact from "@/components/home/contact";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen p-8">
      <Header />
      <Hero />
      <Features />
      <Services />
      <Prices />
      <About />
      <Contact />
    </div>
  );
}
