import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserInSupabaseAuth } from "@/lib/supabase/actions";

const clientSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Por favor ingrese un email válido")
    .transform((val: string) => val.toLowerCase().trim()),
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .transform((val: string) => val.trim()),
  ci: z
    .string()
    .min(1, "El número de CI es obligatorio")
    .regex(/^\d+$/, "El número de CI debe ser numérico")
    .transform((val: string) => val.trim()),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "El número de teléfono debe ser numérico"
    )
    .transform((val: string | undefined) => val?.trim() || ""),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CreateMemberProps {
  onUserCreated: (email: string) => void;
}

export default function CreateMemberDialog({
  onUserCreated,
}: CreateMemberProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const handleCreateUser = async (data: ClientFormData) => {
    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("email", data.email.toLowerCase().trim());
      formDataToSubmit.append("name", data.name);
      formDataToSubmit.append("ci", data.ci);
      formDataToSubmit.append("phone", data.phone);
      formDataToSubmit.append("gender", data.gender || "");
      formDataToSubmit.append("fecha_nacimiento", data.birthDate || "");

      await createUserInSupabaseAuth(formDataToSubmit);
    } finally {
      onUserCreated(data.email.toLowerCase().trim());
      reset();
      setLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" className="ml-2">
          {loading ? (
            "Creando cuenta..."
          ) : (
            <>
              <UserPlus />
              Crear cuenta
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[450px] rounded-2xl shadow-xl p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-2xl font-semibold">
          Crear nueva cuenta
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Por favor, complete todos los campos para crear la cuenta del cliente.
        </DialogDescription>
        <div className="grid gap-5">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="ejemplo@correo.com"
              className="rounded-xl shadow-sm"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ejemplo: Juan Pérez"
              className="rounded-xl shadow-sm"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="ci">Número de CI *</Label>
            <Input
              id="ci"
              {...register("ci")}
              placeholder="Ingrese su cédula de identidad"
              className="rounded-xl shadow-sm"
            />
            {errors.ci && (
              <p className="text-sm text-red-500">{errors.ci.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Ejemplo: 71234567"
              className="rounded-xl shadow-sm"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between sm:justify-start sm:gap-10">
            <div className="flex flex-col gap-1">
              <Label htmlFor="gender">Género</Label>
              <Select
                onValueChange={(value) => {
                  setValue("gender", value);
                }}
              >
                <SelectTrigger className="rounded-xl shadow-sm">
                  <SelectValue placeholder="Selecciona el género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                className="rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit(handleCreateUser)}
            type="submit"
            className="w-full rounded-2xl py-6 text-lg transition hover:scale-[1.02] focus:ring-2 focus:ring-primary"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
