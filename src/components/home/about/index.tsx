"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/landingContent";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  return (
    <section id="about" className="pt-20 sm:pt-24 px-8">
      <motion.h2
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {about.mainTitle}
      </motion.h2>
      <motion.p
        className="text-lg text-center text-gray-700 dark:text-gray-400 mt-2 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {about.mainDescription}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {about.features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4 text-primary ">
              {index + 1}.
            </h1>
            <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
            <p className="text-lg">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.h3
        className="text-3xl font-bold text-center mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {about.callToActionTitle}
      </motion.h3>

      <motion.p
        className="text-lg text-center text-gray-700 dark:text-gray-400 mt-4 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
      >
        {about.callToActionDescription}
      </motion.p>
      <motion.div
        className="text-3xl font-bold text-center mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Button
          size="lg"
          className="bg-primary text-white px-6 py-3 text-lg rounded-lg shadow-lg"
          onClick={() => router.push("/sign-up")}
        >
          Registrate
        </Button>
      </motion.div>
    </section>
  );
}
