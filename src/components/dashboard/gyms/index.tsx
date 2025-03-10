import { Gym, Membership } from "@/types";
import { getUserGyms } from "@/lib/supabase/data";
import { getAllGymMemberships } from "@/lib/supabase/data";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { HandCoins, UserCheck, UsersIcon, UserMinus } from "lucide-react";
import { RecentClients } from "./recent-clients";
import { Overview } from "./overview";
import { OpenGymButton } from "./open-gym";

interface GymDashboardProps {
  id: string;
}

export default async function GymDashboard(props: GymDashboardProps) {
  const gym: Gym = await getUserGyms(props.id);
  const memberships: Membership[] =
    (await getAllGymMemberships(Number(gym.id))) || [];

  // Total de membresías de todos los meses
  const totalMemberships = memberships.length;

  // Función para obtener el mes y año de una fecha
  const getMonthYear = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}`; // Devuelve 'yyyy-mm'
  };

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0]; // Obtener solo la fecha sin la hora

  const activeMemberships = memberships.filter((membership) => {
    const endDate = new Date(membership.end_date);
    const endDateString = endDate.toISOString().split("T")[0]; // Obtener solo la fecha sin la hora

    // Comparar las fechas sin tener en cuenta la hora
    return endDateString >= currentDateString;
  });

  // Membresías que están activas y a menos de una semana de expirar
  const fewDaysMemberships = activeMemberships.filter((membership) => {
    const endDate = new Date(membership.end_date);
    const endDateString = endDate.toISOString().split("T")[0]; // Obtener solo la fecha sin la hora

    // Calcular la diferencia de días
    const timeDiffInMs = endDate.getTime() - currentDate.getTime();
    const diffInDays = timeDiffInMs / (1000 * 60 * 60 * 24);

    return (
      endDateString >= currentDateString && // Aún no ha expirado
      diffInDays <= 7 // Menos de 7 días
    );
  });

  // Calcular el porcentaje de aumento de membresías activas en este mes con respecto al total de membresías
  const percentageIncrease = totalMemberships
    ? (activeMemberships.length / totalMemberships) * 100
    : 0;

  // Calcular los ingresos totales
  const totalIngresos = memberships.reduce(
    (sum, membership) => sum + membership.price,
    0
  );

  // Calcular los ingresos totales de este mes
  const currentMonthIngresos = memberships
    .filter(
      (membership) =>
        getMonthYear(membership.start_date) === getMonthYear(currentDate)
    )
    .reduce((sum, membership) => sum + membership.price, 0);

  // Filtrar las membresías del mes actual
  const currentMonthClients = memberships.filter(
    (membership) =>
      getMonthYear(membership.start_date) === getMonthYear(currentDate)
  );

  // Ordenar por fecha de inicio (de más reciente a más antiguo)
  const latestClients = currentMonthClients
    .sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    )
    .slice(0, 10); // Obtener los últimos 10 clientes

  if (gym) {
    return (
      <div className="space-y-4">
        <div className="flex text-xl font-semibold py-4 space-x-4 items-center">
          <div>{gym.name}</div>
          <OpenGymButton isOpen={gym.is_open} gymId={gym.id} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Membresías Activas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Membresías Activas
              </CardTitle>
              <UserCheck />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeMemberships.length}
              </div>
              <p className="text-xs text-muted-foreground">Usuarios vigentes</p>
            </CardContent>
          </Card>

          {/* Total miembros con pocos dias */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Membresías Con Pocos Días
              </CardTitle>
              <UserMinus />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fewDaysMemberships.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Menos de 7 días de membresía
              </p>
            </CardContent>
          </Card>

          {/* Total Membresías */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Membresías
              </CardTitle>
              <UsersIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMemberships}</div>
              <p className="text-xs text-muted-foreground">
                {percentageIncrease > 0
                  ? `+${percentageIncrease.toFixed(1)}% este mes`
                  : percentageIncrease < 0
                  ? `${percentageIncrease.toFixed(1)}%`
                  : "Sin aumento este mes"}
              </p>
            </CardContent>
          </Card>

          {/* Total Ingresos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ingresos
              </CardTitle>
              <HandCoins />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalIngresos.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentMonthIngresos > 0
                  ? `Ingresos este mes: $${currentMonthIngresos.toFixed(2)}`
                  : "Sin aumento este mes"}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ingresos</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <Overview data={memberships} />
            </CardContent>
          </Card>
          <Card className="md:col-span-3 col-span-4">
            <CardHeader>
              <CardTitle>Miembros recientes</CardTitle>
              <CardDescription>
                Se inscribieron {currentMonthClients.length} miembros este mes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentClients data={latestClients} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <div>No hay datos disponibles para tu perfil</div>;
}
