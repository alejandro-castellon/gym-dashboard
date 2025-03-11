import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Prices from "@/components/home/prices";
import About from "@/components/home/about";
import Contact from "@/components/home/contact";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Prices />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
