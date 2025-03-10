"use client";

import Link from "next/link";
import Image from "next/image";
import { socialLinks } from "@/lib/landingContent";
import { PhoneIcon, MapPinIcon, Mail } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="mx-auto max-w-full pt-24 px-4 sm:px-6 lg:px-8">
      <div className="my-12 grid grid-cols-1 gap-y-10 sm:grid-cols-6 lg:grid-cols-12">
        {/* COLUMN-1 Logo y Slogan */}
        <div className="sm:col-span-6 lg:col-span-5">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
            <Image src="/logo-letras.png" alt="logo" width={220} height={50} />
          </Link>
          <h3 className="text-xs font-medium mt-5 mb-4 lg:mb-16 text-gray-700 dark:text-gray-300">
            Gestiona tu gimnasio de manera inteligente.
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((items, i) => (
              <Link href={items.link} key={i} target="_blank">
                <div className="bg-white h-10 w-10 shadow-xl text-base rounded-full flex items-center justify-center transition-transform duration-500 transform hover:translate-y-[-8px] hover:bg-primary">
                  <Image
                    src={items.imgSrc}
                    alt={items.imgSrc}
                    width={items.width}
                    height={2}
                    className="transition-all duration-500 transform hover:invert"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* COLUMN-2/3/4 Enlaces */}
        <div className="sm:col-span-3">
          <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul>
            {[
              { label: "Inicio", href: "#hero" },
              { label: "Funciones", href: "#features" },
              { label: "Servicios", href: "#services" },
              { label: "Precios", href: "#prices" },
              { label: "Nosotros", href: "#about" },
              { label: "Contacto", href: "#contact" },
            ].map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className="hover:text-gray-400"
                  onClick={(e) => {
                    smoothScroll(e); // Llamar a la función para hacer el desplazamiento suave
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN-5 Contacto */}
        <div className="sm:col-span-6 lg:col-span-4">
          <p className="text-black text-xl font-semibold mb-9">Contacto</p>
          <ul>
            <li className="mb-5 flex items-center">
              <PhoneIcon className="h-5 w-5 mr-2 text-primary" />
              (+591) 65369944 - (+591) 70712345
            </li>
            <li className="mb-5 flex items-center">
              <MapPinIcon className="h-6 w-6 mr-2 text-primary" />
              Av. America Nro. 1234 Cochabamba-Bolivia
            </li>
            <li className="mb-5 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              admin@clubmanager.com
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Rights */}
      <div className="py-10 md:flex items-center justify-between border-t border-t-bordertop">
        <h4 className="text-slate-700 dark:text-slate-400 text-sm text-center md:text-start font-normal">
          @2025 - Clubs Manager. All Rights Reserved by{" "}
          <Link href="https://licasoftware.vercel.app/" target="_blank">
            Licasoftware.com
          </Link>
        </h4>
        <div className="flex gap-5 mt-5 md:mt-0 justify-center md:justify-start">
          <h4 className="text-slate-700 dark:text-slate-400 text-sm font-normal">
            <Link href="/privacy-policy" target="_blank">
              Privacy policy
            </Link>
          </h4>
          <div className="h-5 bg-bordertop w-0.5"></div>
          <h4 className="text-slate-700 dark:text-slate-400 text-sm font-normal">
            <Link href="/terms-and-conditions" target="_blank">
              Terms & conditions
            </Link>
          </h4>
        </div>
      </div>
    </footer>
  );
}
