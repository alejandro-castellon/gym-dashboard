import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Membership } from "@/types";

interface RecentClientsProps {
  data: Membership[];
}

export function RecentClients({ data }: RecentClientsProps) {
  // Ordenar las membresías por fecha de inicio (más recientes primero)
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <div className="space-y-7 overflow-hidden">
      {sortedData.map((membership, index) => {
        const startDate = new Date(membership.start_date);
        const endDate = new Date(membership.end_date);

        return (
          <div key={index} className="flex items-center flex-wrap gap-2">
            {/* Avatar */}
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>
                {membership.user_email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Información del usuario */}
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {membership.user_email}
              </p>
              <p className="text-xs text-muted-foreground">
                {`${startDate.getUTCDate()}/${
                  startDate.getUTCMonth() + 1
                }/${startDate.getUTCFullYear()} - ${endDate.getUTCDate()}/${
                  endDate.getUTCMonth() + 1
                }/${endDate.getUTCFullYear()}`}
              </p>
            </div>

            {/* Precio */}
            <div className="text-right font-medium">
              ${membership.price.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
