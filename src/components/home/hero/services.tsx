"use client";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  ChartSpline,
  DollarSign,
  CreditCard,
  Heart,
  CircleHelp,
  Shapes,
  Users,
} from "lucide-react";
import { heroContent } from "@/lib/landingContent";
import { motion } from "framer-motion";

export default function Services() {
  const features = [
    {
      title: "Gestión de Clientes",
      description:
        "Administra fácilmente la información y el seguimiento de tus miembros.",
      icon: <Users />,
    },
    {
      title: "Control de Membresías",
      description:
        "Maneja diferentes tipos de membresías y pagos de forma eficiente.",
      icon: <CreditCard />,
    },
    {
      title: "Sistema de Check-in",
      description:
        "Registra y monitorea la asistencia de tus clientes en tiempo real.",
      icon: <CalendarCheck />,
    },
    {
      title: "Reportes y Análisis",
      description:
        "Obtén insights valiosos sobre el rendimiento de tu gimnasio.",
      icon: <ChartSpline />,
    },
    {
      title: "Precios inigualables",
      description: "Nuestros precios son los mejores del mercado.",
      icon: <DollarSign />,
    },
    {
      title: "Soporte al cliente 24/7",
      description: "Estamos disponibles el 100% del tiempo.",
      icon: <CircleHelp />,
    },
    {
      title: "Facilidad de uso",
      description: "Tan fácil como usar un Apple y tan caro como comprar uno.",
      icon: <Shapes />,
    },
    {
      title: "Y todo lo demás",
      description:
        "Se me acabaron las ideas. Acepta mis más sinceras disculpas.",
      icon: <Heart />,
    },
  ];

  return (
    <section className="pt-16 px-6 sm:px-10">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 150 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-4">
          {heroContent.queEsCM.titulo}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {heroContent.queEsCM.descripcion}
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-full mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
        index >= 4 && "hidden md:flex" // Oculta elementos con índice >= 4 en móviles
      )}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none md:block" />
      )}
      <div className="mb-4 relative z-10 px-10 text-primary">{icon}</div>
      <div className="text-2xl font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-md text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </motion.div>
  );
};
