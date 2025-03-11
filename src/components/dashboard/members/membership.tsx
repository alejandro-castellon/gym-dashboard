import { Membership } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getActiveUserMembership } from "@/lib/supabase/data";

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

export default async function MembershipInfo() {
  const membership: Membership = await getActiveUserMembership();
  const checkMembershipStatus = () => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date(currentDate);
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);
    const endDate = new Date(membership.end_date);
    const sevenDaysString = sevenDaysFromNow.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

    if (endDateString > sevenDaysString) {
      return { status: "Activa" };
    } else {
      return { status: "Por expirar" };
    }
  };

  if (membership.id) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
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
                  : "text-yellow-600"
              }
            >
              <strong>Estado:</strong> {checkMembershipStatus().status} (
              {membership.days_left} días restantes)
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

  return (
    <div className="text-center mt-12">No tienes una membresía activa</div>
  );
}
