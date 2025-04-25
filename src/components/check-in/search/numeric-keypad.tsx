"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Membership } from "@/types";
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
import { registerAttendance } from "@/lib/supabase/actions";
import { checkIfAlreadyCheckedIn } from "@/lib/supabase/data";

interface MembershipHistoryProps {
  memberships: Membership[];
}

export default function NumericKeypad({ memberships }: MembershipHistoryProps) {
  const [ci, setCi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<Membership | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setCi((prev) => prev.slice(0, -1));
      setMessage("");
    } else if (key === "erase") {
      setCi("");
      setMessage("");
    } else {
      setCi((prev) => (prev + key).slice(0, 7)); // Limit to 7 digits
    }
  };

  const handleValidationAndOpenDialog = () => {
    if (ci.length < 7) {
      setMessage("⚠️ El CI debe tener 7 dígitos.");
      return;
    }

    // Buscar la membresía del usuario usando el CI ingresado
    const membership = memberships.find((m) => m.users?.ci.toString() === ci);
    if (!membership) {
      setMessage("❌ Usuario no encontrado");
      return;
    }
    setSelectedMembership(membership);
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedMembership) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Verificar si el usuario ya hizo check-in hoy
      const alreadyCheckedIn = await checkIfAlreadyCheckedIn(
        selectedMembership.id
      );

      if (alreadyCheckedIn) {
        setMessage("❌ El miembro ya ha registrado su asistencia hoy.");
        setIsLoading(false);
        return;
      }

      // Llamada a la función para registrar la asistencia
      if (selectedMembership.days_left !== undefined) {
        await registerAttendance(
          selectedMembership.id.toString(),
          selectedMembership.days_left
        );
      } else {
        setMessage("❌ Error: días restantes no definidos.");
      }
      setMessage("✅ Check-in realizado correctamente");
      setSelectedMembership(null);
    } catch (error) {
      setMessage(`❌ Error al registrar asistencia: ${error}`);
    } finally {
      setIsLoading(false);
      router.push("/dashboard/checkin");
    }
  };

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "erase",
    "0",
    "delete",
  ];

  const getKeyContent = (key: string) => {
    switch (key) {
      case "erase":
        return <X className="h-6 w-6" />;
      case "delete":
        return <Delete className="h-6 w-6" />;
      default:
        return key;
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={ci}
        readOnly
        placeholder="Introduce el CI..."
        className="w-full rounded-md bg-white/20 p-4 text-center text-xl text-white placeholder-white/50 focus:outline-none"
      />

      {message && <p className="text-center text-sm text-white">{message}</p>}

      <div className="grid grid-cols-3 gap-4">
        {keys.map((key) => (
          <Button
            key={key}
            onClick={() => handleKeyPress(key)}
            disabled={isLoading}
            variant="ghost"
            className={cn(
              "h-16 w-full rounded-full bg-white/20 text-2xl text-white hover:bg-white/30 disabled:opacity-50",
              (key === "delete" || key === "submit") && "text-base"
            )}
          >
            {getKeyContent(key)}
          </Button>
        ))}
      </div>

      {/* Mostrar el botón para abrir el diálogo de confirmación */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isLoading}
            className="w-full bg-green-500 py-6 text-lg font-medium hover:bg-green-600"
            onClick={handleValidationAndOpenDialog} // Llamar a la función de validación antes de abrir el diálogo
          >
            {isLoading ? "Registrando..." : "Check In →"}
          </Button>
        </AlertDialogTrigger>

        {/* Solo mostrar el AlertDialog si un usuario es encontrado */}
        {selectedMembership && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Estás seguro de realizar esta acción?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Usuario: {selectedMembership.users?.name}
                <br />
                Dias restantes: {selectedMembership.days_left}
                <br />
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedMembership(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmCheckIn}>
                Confirmar Check In
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  );
}
