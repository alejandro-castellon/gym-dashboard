const pag5frase1 = "Contactanos para resolver tus dudas.";
const pag5frase2 =
  "Estamos aquí para responder tus preguntas, brindarte soporte y ofrecerte toda la información que necesitas sobre Clubs Manager.";
const pag5frase3 =
  "Si buscas optimizar la administración de tu gimnasio, controlar tus membresías y potenciar tus ingresos, no dudes en ponerte en contacto con nosotros.";
const pag5frase4 = "whatsapp - 71442851";
const pag5frase5 = "email - 8wYvD@example.com";

export default function Contact() {
  return (
    <div>
      <section className="mt-16">
        <h2 className="text-4xl font-bold mb-8">{pag5frase1}</h2>
        <p className="text-xl mb-4">{pag5frase2}</p>
        <p className="text-lg mb-8">{pag5frase3}</p>

        <div className="flex flex-col space-y-4">
          <p>{pag5frase4}</p>
          <p>{pag5frase5}</p>
        </div>
      </section>
    </div>
  );
}
