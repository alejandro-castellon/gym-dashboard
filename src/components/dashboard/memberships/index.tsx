import { Membership } from "@/types";
import { getUserMembership } from "@/lib/supabase/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const weekdayTranslations: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

// Orden de los días de la semana
const weekdayOrder: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

export default async function MembershipDashboard() {
  const membership: Membership = await getUserMembership();

  const checkMembershipStatus = () => {
    const currentDate = new Date();

    const currentDateString = currentDate.toISOString().split("T")[0];

    const endDate = new Date(membership.end_date);
    const endDateString = endDate.toISOString().split("T")[0];

    const timeDiff = endDate.getDate() - currentDate.getDate() + 1;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    console.log(endDate.getDate(), currentDate.getDate(), daysLeft);
    if (endDateString >= currentDateString) {
      return { status: "Activa", daysLeft };
    } else return { status: "Vencida", daysLeft: 0 };
  };

  if (membership) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Información de la membresía */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Membresía</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Gimnasio:</strong> {membership.gyms?.name}
            </p>
            <p>
              <strong>Inicio:</strong> {membership.start_date.toString()}
            </p>
            <p>
              <strong>Vencimiento:</strong> {membership.end_date.toString()}
            </p>
            <p
              className={
                checkMembershipStatus().status === "Activa"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              <strong>Estado:</strong> {checkMembershipStatus().status} (
              {checkMembershipStatus().daysLeft} días restantes)
            </p>
          </CardContent>
        </Card>

        {/* Horarios del gimnasio */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios del Gimnasio</CardTitle>
          </CardHeader>
          <CardContent>
            {membership.gyms && (
              <div className="grid gap-2">
                {Object.entries(membership.gyms.hours)
                  .sort(([a], [b]) => weekdayOrder[a] - weekdayOrder[b])
                  .map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{weekdayTranslations[day]}</span>
                      <span>
                        {hours.open} - {hours.close}
                      </span>
                    </div>
                  ))}
              </div>
            )}
            <p
              className={`mt-4 font-medium ${
                membership.gyms?.is_open ? "text-green-600" : "text-red-600"
              }`}
            >
              Actualmente el gimnasio está{" "}
              {membership.gyms?.is_open ? "abierto" : "cerrado"}.
            </p>
          </CardContent>
        </Card>

        {/* Soporte */}
        <div className="text-center">
          <Button variant="default">Contactar Soporte</Button>
        </div>
      </div>
    );
  }

  return <div>No hay datos disponibles para tu perfil</div>;
}
