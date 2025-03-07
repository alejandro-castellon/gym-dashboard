const frase2 = "¿Por que elegirnos?";
const frase22 =
  "En Clubs Manager, nacimos con una visión clara: simplificar la gestión de gimnasios y centros deportivos a través de la  tecnología. Sabemos lo desafiante que puede ser administrar clientes, membresías y finanzas, por eso creamos una plataforma intuitiva que combina eficiencia y simplicidad.";
const frase2p1 = "Facil de usar";
const frase2p11 =
  "Una plataforma intuitiva, diseñada para que cualquier administrador pueda gestionar su gimnasio sin complicaciones.";
const frase2p2 = "Adaptable";
const frase2p22 =
  "Perfecta para gimnasios de todos los tamaños, desde estudios pequeños hasta grandes centros deportivos.";
const frase2p3 = "Datos seguridad";
const frase2p33 =
  "La información de tu negocio y de tus clientes está protegida con las mejores prácticas de seguridad digital.";

const pag3frase3 = "!!Comienza ahora!!";
const pag3frase3p1 =
  "No esperes más para digitalizar y potenciar tu gimnasio. Elige el plan perfecto y lleva la gestión de tu negocio al siguiente nivel.";

export default function About() {
  return (
    <div>
      <section className="mt-16">
        <h2 className="text-4xl font-bold mb-8">{frase2}</h2>
        <p className="text-lg mt-2">{frase22}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{frase2p1}</h3>
            <p className="text-lg">{frase2p11}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{frase2p2}</h3>
            <p className="text-lg">{frase2p22}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-2">{frase2p3}</h3>
            <p className="text-lg">{frase2p33}</p>
          </div>
        </div>

        <h3 className="text-3xl font-bold mt-8">{pag3frase3}</h3>
        <p className="text-lg mt-2">{pag3frase3p1}</p>
      </section>
    </div>
  );
}
