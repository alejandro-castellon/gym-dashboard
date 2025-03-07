const pag4frase1 = "Precios";

const pag4frase2 = "Estandar";
const pag4frase2p1 = "50 dls";
const pag4frase2p2 = "70 miembros activos";
const pag4frase2p3 = "Todas las características incluidas.";

const pag4frase3 = "Plus";
const pag4frase3p1 = "100 dls";
const pag4frase3p2 = "150 miembros activos";
const pag4frase3p3 = "Todas las características incluidas.";

const pag4frase4 = "Profesional";
const pag4frase4p1 = "145 dls";
const pag4frase4p2 = "Miembros activos ilimitados";
const pag4frase4p3 = "Todas las características incluidas.";

const pag4frase5 = "Personalizado";
const pag4frase5p1 = "Módulos a medida.";
const pag4frase5p2 = "Todas las características incluidas.";
const pag4frase5p3 = "Contáctanos.";

export default function Prices() {
  return (
    <div>
      <section className="mt-16">
        <h2 className="text-4xl font-bold mb-8">{pag4frase1}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{pag4frase2}</h3>
            <ul className="text-lg">
              <li>{pag4frase2p1}</li>
              <li>{pag4frase2p2}</li>
              <li>{pag4frase2p3}</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{pag4frase3}</h3>
            <ul className="text-lg">
              <li>{pag4frase3p1}</li>
              <li>{pag4frase3p2}</li>
              <li>{pag4frase3p3}</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{pag4frase4}</h3>
            <ul className="text-lg">
              <li>{pag4frase4p1}</li>
              <li>{pag4frase4p2}</li>
              <li>{pag4frase4p3}</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{pag4frase5}</h3>
            <ul className="text-lg">
              <li>{pag4frase5p1}</li>
              <li>{pag4frase5p2}</li>
              <li>{pag4frase5p3}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
