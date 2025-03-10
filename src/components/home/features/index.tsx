const pag2frase1 = "¿Que recibes cuando eres parte de clubs manager?";

const pag2frase2 = "Gestión administrativa";
const pag2frase2p1 =
  "Base de datos de clientes: registra y organiza información clave como nombres, correos, tipo de membresía y fechas de inicio y vencimiento.";
const pag2frase2p2 =
  "Control de membresías: seguimiento claro de membresías activas, próximas a vencer y expiradas.";
const pag2frase2p3 =
  "Historial de clientes: consulta el registro completo de cada cliente, desde pagos hasta check-ins.";

const pag2frase3 = " Control de asistencias";
const pag2frase3p1 =
  "Registro de entradas: permite a los administradores llevar un control de las visitas diarias de cada cliente.";
const pag2frase3p2 =
  "Búsqueda rápida: localiza clientes por nombre o CI y marca su asistencia con un solo clic.";

const pag2frase3p3 =
  "Historial de accesos: visualiza quién ha ingresado y cuántas veces a lo largo del tiempo.";

const pag2frase4 = "Gestión financiera";
const pag2frase4p1 =
  "Historial de pagos: lleva un registro claro de cada transacción, incluyendo fechas, montos y clientes asociados.";
const pag2frase4p2 =
  "Reportes financieros: accede a gráficos y métricas sobre ingresos mensuales y totales.";
const pag2frase4p3 =
  "Recordatorios de pago: identifica membresías próximas a vencer para comunicarte con los clientes a tiempo..";

const pag2frase5 = "Analsis y reportes";
const pag2frase5p1 =
  "Panel de métricas clave: visualiza datos como el número total de clientes, membresías activas y próximos vencimientos.";
const pag2frase5p2 =
  " Gráficas interactivas: compara ingresos mensuales y el rendimiento financiero de tu gimnasio.";
const pag2frase5p3 =
  "Seguimiento de crecimiento: identifica patrones y toma decisiones informadas con base en datos en tiempo real.";

export default function Features() {
  return (
    <section id="features" className="pt-20 sm:pt-24">
      <h2 className="text-4xl font-bold mb-8">{pag2frase1}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{pag2frase2}</h3>
          <ul className="text-lg">
            <li>{pag2frase2p1}</li>
            <li>{pag2frase2p2}</li>
            <li>{pag2frase2p3}</li>
          </ul>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{pag2frase3}</h3>
          <ul className="text-lg">
            <li>{pag2frase3p1}</li>
            <li>{pag2frase3p2}</li>
            <li>{pag2frase3p3}</li>
          </ul>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{pag2frase4}</h3>
          <ul className="text-lg">
            <li>{pag2frase4p1}</li>
            <li>{pag2frase4p2}</li>
            <li>{pag2frase4p3}</li>
          </ul>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{pag2frase5}</h3>
          <ul className="text-lg">
            <li>{pag2frase5p1}</li>
            <li>{pag2frase5p2}</li>
            <li>{pag2frase5p3}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
