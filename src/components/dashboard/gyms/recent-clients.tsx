import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Membership } from "@/types";

interface RecentClientsProps {
  data: Membership[];
}

export function RecentClients({ data }: RecentClientsProps) {
  // Ordenar las membresías por la fecha de inicio (start_date)
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB.getTime() - dateA.getTime(); // Ordenar de más reciente a más antiguo
  });
  return (
    <div className="space-y-8">
      {sortedData.map((membership, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>
              {membership.user_email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {membership.user_email}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(membership.start_date).getUTCDate()}/
              {new Date(membership.start_date).getUTCMonth() + 1}/
              {new Date(membership.start_date).getUTCFullYear()} -{" "}
              {new Date(membership.end_date).getUTCDate()}/
              {new Date(membership.end_date).getUTCMonth() + 1}/
              {new Date(membership.end_date).getUTCFullYear()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            ${membership.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
