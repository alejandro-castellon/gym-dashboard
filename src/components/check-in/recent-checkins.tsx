import { getRecentGymCheckins } from "@/lib/supabase/data";
import { Attendance } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Función para formatear fecha y hora
const formatDateTime = (dateString: string, timeString: string) => {
  if (!dateString || !timeString) return "Fecha no disponible";

  // Extraemos solo HH:mm:ss de timeString (ignorar zona horaria)
  const cleanTime = timeString.split(".")[0]; // "00:36:15"

  // Unimos la fecha y la hora en formato ISO
  const date = new Date(`${dateString}T${cleanTime}`);

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // AM/PM
  });
};

export default async function RecentCheckIns() {
  const checkins: Attendance[] = await getRecentGymCheckins();

  return (
    <div className="rounded-lg border p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Check-ins recientes</h2>
      {checkins?.length > 0 ? (
        <Table>
          <TableCaption>Lista de check-ins recientes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-left">Fecha y hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkins.map((checkin) => (
              <TableRow key={checkin.attendance_id}>
                <TableCell className="font-medium">
                  {checkin.user_name}
                </TableCell>
                <TableCell className="text-left">
                  {formatDateTime(checkin.attendance_date, checkin.check_in)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-center">
          No hay check-ins recientes.
        </p>
      )}
    </div>
  );
}
