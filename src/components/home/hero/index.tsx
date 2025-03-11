"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { heroContent } from "@/lib/landingContent";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Services from "./services";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [background, setBackground] = useState<string | null>(null); // <- Estado para evitar el SSR mismatch
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    // Solo se ejecuta en el cliente
    setBackground(
      theme === "dark"
        ? "url('https://smart-lighting.es/wp-content/uploads/2022/09/0-signify-everlas-gym-lighting.jpg')"
        : "url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
    );
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Imagen de fondo con efecto parallax */}
        {background && ( // Renderiza solo cuando el estado está listo
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: background,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
            role="img"
            aria-label="Gimnasio moderno con equipamiento avanzado"
          />
        )}

        {/* Overlay para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Contenido del hero */}
        <div className="relative text-white text-center px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Clubs Manager
          </motion.h1>
          <motion.div
            className="text-lg text-gray-100 md:text-2xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TextGenerateEffect words={heroContent.descripcion} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-primary text-white px-6 py-3 text-lg rounded-lg shadow-lg"
              onClick={() => router.push("/sign-up")}
            >
              Comienza Ahora
            </Button>
          </motion.div>
        </div>
      </section>
      <Services />
    </>
  );
}
