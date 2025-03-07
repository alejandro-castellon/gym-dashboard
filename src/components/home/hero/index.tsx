import Image from "next/image";

{
  /*pagina inicio */
}

const inicio =
  "Gestiona tu gimnasio de manera inteligente desde cualquier lugar de forma fácil y segura con CM";

const inicio1 =
  "Accede a todas las herramientas que necesitas para administrar tu gimnasio, optimizar el seguimiento de tus clientes y hacer crecer tu negocio.  ";

const frase1 = "Que es clubs manager?";
const frase1p1 =
  "Es una plataforma integral diseñada para la gestión eficiente de gimnasios y centros deportivos. Con Clubs Manager, puedes: ";
const frase1p2 = "Administrar clientes y sus membresías.";
const frase1p3 = "Controlar ingresos y métricas clave.";
const frase1p4 = "Registrar check-ins diarios.";
const frase1p5 = "Personalizar precios, horarios y servicios.";

{
  /*como funciona */
}

const pag3frase1 = "¿Como funciona Clubs manager?";
const pag3frase1p1 =
  "Regístrate y crea tu gimnasio, Configura el perfil de tu gimnasio con horarios, precios y servicios.";
const pag3frase2p2 =
  "Elige el plan ideal para ti, selecciona el plan que mejor se adapte a las necesidades de tu negocio";
const pag3frase2p3 =
  "Personaliza y gestiona, añade clientes, registra membresías, realiza check-ins diarios y lleva el control financiero.";
const pag3frase2p4 =
  "Analiza y crece, visualiza reportes detallados, sigue el progreso de tus ingresos y optimiza tus estrategias con datos en tiempo real.";

export default function Hero() {
  return (
    <div>
      <section className="flex justify-between items-center gap-8 mt-24">
        <h1 className="text-5xl font-bold max-w-lg leading-snug">{inicio}</h1>
        <Image
          src="/landing/dashboard.png"
          alt="Clubs Manager"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </section>

      <section className="flex justify-between items-center gap-8 mt-24">
        <h1 className="text-xl text-gray-600 mt-4 max-w-lg">{inicio1}</h1>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-bold mb-4">{frase1}</h2>
        <p className="text-xl max-w-2x1 leading-relaxed">{frase1p1}</p>
        <p className="text-xl max-w-2x1 leading-relaxed">{frase1p2}</p>
        <p className="text-xl max-w-2x1 leading-relaxed">{frase1p3}</p>
        <p className="text-xl max-w-2x1 leading-relaxed">{frase1p4}</p>
        <p className="text-xl max-w-2x1 leading-relaxed">{frase1p5}</p>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-bold mb-8">{pag3frase1}</h2>
        <ul className="text-xl space-y-4">
          <li>{pag3frase1p1}</li>
          <li>{pag3frase2p2}</li>
          <li>{pag3frase2p3}</li>
          <li>{pag3frase2p4}</li>
        </ul>
      </section>
    </div>
  );
}
