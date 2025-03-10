"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { landingContent } from "@/lib/landingContent";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const handleRegister = () => {
    router.push("/sign-up");
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center w-full min-h-screen space-y-24 mt-24 sm:mt-0"
    >
      {/* Hero Principal - Pantalla Completa */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full min-h-screen">
        <motion.div
          className="max-w-lg text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            {landingContent.hero.titulo}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            {landingContent.hero.descripcion}
          </p>
          <motion.button
            className="mt-6 px-6 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow-md hover:bg-primary/90 transition"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={handleRegister}
          >
            Empezar ahora
          </motion.button>
        </motion.div>

        {/* Imagen con animación */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/landing/dashboard.png"
            alt="Clubs Manager"
            width={800}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </div>

      {/* Sección: ¿Qué es Clubs Manager? - Aparece al hacer scroll */}
      <motion.div
        className="max-w-2xl text-center py-20"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-4">
          {landingContent.queEsCM.titulo}
        </h2>
        <p className="text-xl text-gray-600">
          {landingContent.queEsCM.descripcion}
        </p>
        <ul className="text-lg text-gray-800 mt-4 space-y-2">
          {landingContent.queEsCM.beneficios.map((item, index) => (
            <motion.li
              key={index}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              ✅ {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Sección: ¿Cómo funciona Clubs Manager? */}
      <motion.div
        className="max-w-2xl text-center py-20"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-8">
          {landingContent.comoFunciona.titulo}
        </h2>
        <ul className="text-lg text-gray-800 space-y-4">
          {landingContent.comoFunciona.pasos.map((item, index) => (
            <motion.li
              key={index}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              🔹 {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
