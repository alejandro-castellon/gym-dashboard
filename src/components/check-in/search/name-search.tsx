"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Membership } from "@/types";
import { registerAttendance } from "@/lib/supabase/actions";
import { checkIfAlreadyCheckedIn } from "@/lib/supabase/data";

interface MembershipHistoryProps {
  memberships: Membership[];
}

export default function NameSearch({ memberships }: MembershipHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembership, setSelectedMembership] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckIn = async () => {
    if (!selectedMembership) return;
    try {
      // Verificar si el usuario ya hizo check-in hoy
      const alreadyCheckedIn = await checkIfAlreadyCheckedIn(
        selectedMembership
      );

      if (alreadyCheckedIn) {
        setMessage("❌ El miembro ya ha registrado su asistencia hoy.");
        return;
      }

      await registerAttendance(selectedMembership.toString());
      setMessage("✅ Check-in realizado correctamente");
      setSearchTerm("");
    } catch (error) {
      setMessage(`❌ Error al registrar asistencia: ${error}`);
    } finally {
      router.push("/dashboard/checkin");
      setTimeout(() => {
        setMessage(null);
      }, 4000);
    }
  };

  const filteredMemberships = memberships.filter((member) =>
    member.users?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Command className="rounded-lg border bg-white/20">
        <CommandInput
          placeholder="Buscar clientes..."
          className="text-white placeholder-white/50"
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        {message && (
          <p className="mt-2 text-center text-sm text-white py-4">{message}</p>
        )}
        <CommandList>
          {searchTerm ? (
            filteredMemberships.length > 0 ? (
              <CommandGroup>
                {filteredMemberships.map((member) => (
                  <AlertDialog key={member.id}>
                    <AlertDialogTrigger asChild>
                      <button
                        className="text-left w-full"
                        onClick={() => setSelectedMembership(member.id)}
                      >
                        <CommandItem className="flex items-center gap-2 text-white hover:bg-white/20 hover:cursor-pointer">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt={member.users?.name}
                            />
                            <AvatarFallback>
                              {member.users?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "CM"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p>{member.users?.name}</p>
                            <p className="text-sm ">
                              Días restantes: {member.days_left}
                            </p>
                          </div>
                          <div className="ml-auto">Check In →</div>
                        </CommandItem>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás seguro de realizar esta acción?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Usuario: {member.users?.name}
                          <br />
                          Dias restantes: {member.days_left}
                          <br />
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCheckIn}>
                          Confirmar Check In
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="text-center text-white p-4">
                No se encontraron resultados.
              </CommandEmpty>
            )
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
}
