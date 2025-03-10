"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const smoothScroll = (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
): void => {
  const href = e.currentTarget.getAttribute("href");
  if (href && href.startsWith("#")) {
    e.preventDefault(); // Prevenir la acción predeterminada del enlace
    const targetId = href.substring(1); // Obtener el id del elemento
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (window.location.pathname !== "/") {
      // Volver a cargar la página principal
      window.location.href = `/#${targetId}`;
    }
  }
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md shadow-md h-16 md:h-20 flex items-center px-6 z-50 bg-white/20 dark:bg-black/20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <Image
          src="/logo-letras.png"
          alt="logo"
          width={200}
          height={40}
          className="hidden md:block"
        />
      </Link>

      {/* Menú de navegación (escondido en móviles) */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-6 font-medium">
          {[
            { label: "Inicio", href: "#hero" },
            { label: "Funciones", href: "#features" },
            { label: "Servicios", href: "#services" },
            { label: "Precios", href: "#prices" },
            { label: "Nosotros", href: "#about" },
            { label: "Contacto", href: "#contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-gray-400 transition-colors"
                onClick={(e) => {
                  smoothScroll(e); // Llamar a la función para hacer el desplazamiento suave
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botones y menú hamburguesa */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Botón de inicio de sesión (visible en pantallas grandes) */}
        <div className="hidden md:block">
          <Button asChild size="lg">
            <Link href="/sign-in">Iniciar sesión</Link>
          </Button>
        </div>

        {/* Botón de tema (visible en pantallas grandes) */}
        <div className="hidden md:block">
          <ModeToggle />
        </div>

        {/* Menú hamburguesa en móviles */}
        <button
          className="md:hidden p-2 rounded-md bg-gray-200 dark:bg-neutral-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú desplegable con animaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-white dark:bg-neutral-900 shadow-md flex flex-col items-center gap-4 py-6 md:hidden"
          >
            {[
              { label: "Inicio", href: "#hero" },
              { label: "Funciones", href: "#features" },
              { label: "Servicios", href: "#services" },
              { label: "Precios", href: "#prices" },
              { label: "Nosotros", href: "#about" },
              { label: "Contacto", href: "#contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg hover:text-gray-900 transition-colors"
                onClick={(e) => {
                  setIsOpen(false); // Cerrar el menú
                  smoothScroll(e); // Llamar a la función para hacer el desplazamiento suave
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Botón de inicio de sesión en móviles */}
            <Button asChild size="lg" className="w-3/4">
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>

            {/* Botón de tema en móviles */}
            <ModeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
