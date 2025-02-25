import { Gym, Membership } from "@/types";
import { getUserGyms } from "@/lib/supabase/data";
import { getGymMemberships } from "@/lib/supabase/data";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { HandCoins, UserCheck, UsersIcon } from "lucide-react";
import { RecentClients } from "./recent-clients";
import { Overview } from "./overview";
import { OpenGymButton } from "./open-gym";

export default async function GymDashboard() {
  const gym: Gym = await getUserGyms();
  const memberships: Membership[] = (await getGymMemberships()) || [];

  // Función para obtener el mes y año de una fecha
  const getMonthYear = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}`; // Devuelve 'yyyy-mm'
  };

  const currentDate = new Date();

  // Total de membresías de todos los meses
  const totalMemberships = memberships.length;

  // Membresías activas, considerando las que están activas en este momento
  const activeMemberships = memberships.filter(
    (membership) =>
      new Date(membership.start_date) <= currentDate &&
      new Date(membership.end_date) >= currentDate
  );

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
        getMonthYear(membership.start_date) ===
        getMonthYear(currentDate.toISOString())
    )
    .reduce((sum, membership) => sum + membership.price, 0);

  // Calcular los ingresos totales de este mes
  const currentMonthClients = memberships.filter(
    (membership) =>
      getMonthYear(membership.start_date) ===
      getMonthYear(currentDate.toISOString())
  );

  if (gym) {
    return (
      <div className="space-y-4">
        <div className="flex text-xl font-semibold py-4 space-x-4 items-center">
          <div>Mi gimnasio - {gym.name}</div>
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
            <CardContent className="pl-2">
              <Overview data={memberships} />
            </CardContent>
          </Card>
          <Card className="md:col-span-3 col-span-4">
            <CardHeader>
              <CardTitle>Clientes recientes</CardTitle>
              <CardDescription>
                Se inscribieron {currentMonthClients.length} clientes este mes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentClients data={currentMonthClients} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <div>No hay datos disponibles para tu perfil</div>;
}
