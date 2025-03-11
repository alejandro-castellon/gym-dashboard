import { User2, Mail, Phone, Calendar, CreditCard, Users } from "lucide-react";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ClientInfoProps {
  client: User;
  isActive: boolean;
}

export default function ClientInfo({ client, isActive }: ClientInfoProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  function calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" alt={client.name} />
          <AvatarFallback className="text-xl">
            {getInitials(client?.name || "Usuario")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Membresía Activa" : "No tiene Membresía Activa"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Carnet</p>
            <p>{client.ci}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">
              Fecha de Nacimiento
            </p>
            <p>{client.fecha_nacimiento}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Género</p>
            <p>{client.gender}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{client.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Celular</p>
            <p>{client.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User2 className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Edad</p>
            <p>{calcularEdad(client.fecha_nacimiento)} años</p>
          </div>
        </div>
      </div>
    </div>
  );
}
