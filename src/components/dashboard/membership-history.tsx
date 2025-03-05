import { CheckCircle } from "lucide-react";
import type { Membership } from "@/types";
import { cn } from "@/lib/utils";

interface MembershipHistoryProps {
  memberships: Membership[];
}

const membershipTypeLabels: { [key: number]: string } = {
  1: "Plan Mensual",
  2: "Plan Trimestral",
  3: "Plan Semestral",
  4: "Plan Anual",
  5: "Plan Día por medio",
};

export default function MembershipHistory({
  memberships,
}: MembershipHistoryProps) {
  // Sort memberships by start date (newest first)
  const sortedMemberships = [...memberships].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  const realDate = (date: Date) => {
    const dateObj = new Date(date); // Ensure date is a Date object
    const day = dateObj.getUTCDate();
    const month = dateObj.getUTCMonth() + 1; // Los meses en JavaScript son 0-indexados
    const year = dateObj.getUTCFullYear();

    // Retornar en formato dd/mm/yyyy
    return `${day < 10 ? `0${day}` : day}/${
      month < 10 ? `0${month}` : month
    }/${year}`;
  };
  const isActive = (date: Date): boolean => {
    const currentDate = new Date();
    const endDate = new Date(date);

    // Convert dates to YYYY-MM-DD format
    const today = currentDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

    return endDateString >= today;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Historial de Membresías</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Activa</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            <span className="text-xs">Expirada</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedMemberships.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay membresías registradas
          </p>
        ) : (
          sortedMemberships.map((membership) => (
            <div
              key={membership.id}
              className={cn(
                "rounded-lg border p-4 transition-all",
                isActive(membership.end_date)
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {membershipTypeLabels[
                        membership.membership_type_id as number
                      ] || "Desconocido"}
                    </h4>
                    {isActive(membership.end_date) ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Activa
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        Expirada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {realDate(membership.start_date)} -{" "}
                    {realDate(membership.end_date)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-medium">
                      Bs {membership.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Método de pago</p>
                    <p className="font-medium">Efectivo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pagado</p>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
