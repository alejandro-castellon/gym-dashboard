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

export default async function MembershipDashboard() {
  const data: Membership = await getUserMembership();

  const checkMembershipStatus = () => {
    const currentDate = new Date();
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "Activa";
    } else if (currentDate > endDate) {
      return "Vencida";
    }
  };

  if (data) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Información de la membresía */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Membresía</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Gimnasio:</strong> {data.gyms?.name}
            </p>
            <p>
              <strong>Inicio:</strong> {data.start_date}
            </p>
            <p>
              <strong>Vencimiento:</strong> {data.end_date}
            </p>
            <p
              className={
                checkMembershipStatus() === "Activa"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              <strong>Estado:</strong> {checkMembershipStatus()}
            </p>
          </CardContent>
        </Card>

        {/* Horarios del gimnasio */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios del Gimnasio</CardTitle>
          </CardHeader>
          <CardContent>
            {data.gyms && (
              <div className="grid gap-2">
                {Object.entries(data.gyms.hours).map(([day, hours]) => (
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
                data.gyms?.is_open ? "text-green-600" : "text-red-600"
              }`}
            >
              Actualmente el gimnasio está{" "}
              {data.gyms?.is_open ? "abierto" : "cerrado"}.
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
