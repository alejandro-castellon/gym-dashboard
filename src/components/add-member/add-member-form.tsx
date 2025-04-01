"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  createUserInSupabaseAuth,
  createMembership,
} from "@/lib/supabase/actions";
import { UserPlus } from "lucide-react";
import { GymSettings, GymPrices } from "@/types";
import { addMonths, subDays, lastDayOfMonth } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SettingsFormProps {
  gymSettings: GymSettings;
  members: string[];
}

const membershipTypes: Record<number, string> = {
  1: "Mensual",
  2: "Trimestral",
  3: "Semestral",
  4: "Anual",
  5: "Día por medio mensual",
};

const clientSchema = z.object({
  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Por favor ingrese un email válido")
    .transform((val: string) => val.toLowerCase().trim()),
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .transform((val: string) => val.trim()),
  ci: z.string()
    .min(1, "El número de CI es obligatorio")
    .regex(/^\d+$/, "El número de CI debe ser numérico")
    .transform((val: string) => val.trim()),
  phone: z.string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), "El número de teléfono debe ser numérico")
    .transform((val: string | undefined) => val?.trim() || ""),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function AddMember({ gymSettings, members }: SettingsFormProps) {
  const getTodayDate = () => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  const getEndDateByMembership = (
    startDate: string,
    membershipType: number
  ) => {
    const date = new Date(startDate);
    let monthsToAdd: number;

    switch (membershipType) {
      case 1:
        monthsToAdd = 1;
        break; // Mensual
      case 2:
        monthsToAdd = 3;
        break; // Trimestral
      case 3:
        monthsToAdd = 6;
        break; // Semestral
      case 4:
        monthsToAdd = 12;
        break; // Anual
      case 5:
        monthsToAdd = 1;
        break; // Día por medio
      default:
        throw new Error("Tipo de membresía no válido");
    }

    // Sumamos los meses exactos
    const futureDate = addMonths(date, monthsToAdd);

    // Si el día de inicio es el primero del mes, ajustamos al último día del mes de la membresía
    if (date.getUTCDate() === 1) {
      return lastDayOfMonth(futureDate).toISOString().split("T")[0];
    }

    // En caso contrario, restamos 1 día al resultado normal
    return subDays(futureDate, 1).toISOString().split("T")[0];
  };

  const initialFormData = {
    email: "",
    start_date: getTodayDate(),
    end_date: "",
    price: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<GymPrices | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const handleSelectChange = (value: string) => {
    const membership = gymSettings.gymPrices.find(
      (price) => price.membership_type_id.toString() === value
    );
    if (!membership) return;

    setSelectedMembership(membership);
    setFormData((prev) => ({
      ...prev,
      end_date: getEndDateByMembership(
        prev.start_date,
        membership.membership_type_id
      ),
      price: membership.price.toString(),
    }));
    setIsChanged(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [id]: value };

      // Si el usuario cambia la fecha de inicio, recalculamos la fecha de finalización
      if (id === "start_date" && selectedMembership) {
        updatedData.end_date = getEndDateByMembership(
          value,
          selectedMembership.membership_type_id
        );
      }

      return updatedData;
    });
    setIsChanged(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedMembership(null);
    setIsChanged(false);
  };

  const handleSave = () => {
    if (!selectedMembership) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("email", formData.email.toLowerCase().trim());
    formDataToSubmit.append("start_date", formData.start_date);
    formDataToSubmit.append("end_date", formData.end_date);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("gym_id", gymSettings.id);
    formDataToSubmit.append(
      "membership_type_id",
      selectedMembership.membership_type_id.toString()
    );
    createMembership(formDataToSubmit);
    setFormData(initialFormData);
    setSelectedMembership(null);
    setIsChanged(false);
  };

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
      // Actualizar el email en el formData principal
      setFormData(prev => ({
        ...prev,
        email: data.email.toLowerCase().trim()
      }));
      setSearchTerm(data.email.toLowerCase().trim());
      
      reset();
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        return member.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [members, searchTerm]
  );

  return (
    <div>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
            <Dialog>
                  <DialogTrigger asChild>
                    <p className="text-xs text-muted-foreground underline cursor-pointer hover:text-primary transition ml-auto">
                      El usuario no tiene cuenta?
                    </p>
                  </DialogTrigger>
                  <DialogContent className="p-4 bg-white shadow-lg rounded-md border border-gray-200 sm:w-full md:w-80">
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                      Instrucciones
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-700">
                      <div className="space-y-3">
                        <p>
                          <span className="font-semibold">1. </span>Introduce el
                          correo electrónico del cliente.
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">2. </span>Presiona el
                          botón{" "}
                          <span className="underline text-primary">
                            Crear cuenta
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">3. </span>La
                          contraseña será el nombre del correo electrónico.
                        </p>
                        <p className="font-semibold">Ejemplo:</p>
                        <p>Email: clubsmanager@example.com</p>
                        <p>Contraseña: clubsmanager</p>
                        <p>
                          <span className="font-semibold">4. </span>Continua
                          creando la membresía.
                        </p>
                      </div>
                    </DialogDescription>

                    <DialogFooter>
                      <DialogClose asChild>
                        <button className="text-primary font-medium text-sm">
                          Cerrar
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        setSearchTerm("");
                      }}
                    >
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
                      Por favor, complete todos los campos para crear la cuenta
                      del cliente.
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
              </div>
              <Command
                className="rounded-lg border shadow-md"
                shouldFilter={false}
              >
                <CommandInput
                  placeholder="Introduce el correo electrónico"
                  value={searchTerm}
                  onValueChange={(value) => {
                    setSearchTerm(value);
                    setOpen(!!value);
                    setFormData((prev) => ({ ...prev, email: value })); // Para mantener formData sincronizado
                  }}
                  typeof="email"
                />
                {open && (
                  <CommandList>
                    {filteredMembers.length > 0 && (
                      <CommandGroup>
                        {filteredMembers.map((member) => (
                          <CommandItem
                            key={member}
                            className="flex items-center gap-2 hover:bg-white/20 hover:cursor-pointer"
                            onSelect={() => {
                              setSearchTerm(member);
                              handleChange({
                                target: {
                                  id: "email",
                                  value: member,
                                },
                              } as React.ChangeEvent<HTMLInputElement>);
                              setOpen(false); // Cierra el dropdown
                            }}
                          >
                            <p>{member}</p>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                )}
              </Command>
            </div>
            {(filteredMembers.some((member) => member === formData.email) ||
              (searchTerm && searchTerm.includes("@"))) && (
              <>
                <div>
                  <Label htmlFor="memb">Membresía</Label>
                  <Select
                    onValueChange={handleSelectChange}
                    value={
                      selectedMembership?.membership_type_id.toString() || ""
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de membresía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Membresía</SelectLabel>
                        {gymSettings.gymPrices
                          .filter((price) => price.price !== null && price.price !== undefined) // Filtra los precios nulos
                          .map(({ membership_type_id }) => (
                            <SelectItem
                              key={membership_type_id}
                              value={membership_type_id.toString()}
                            >
                              {membershipTypes[membership_type_id]}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex md:space-x-10">
                  <div className="mr-2">
                    <Label htmlFor="start_date">Fecha de inicio</Label>
                    <Input
                      id="start_date"
                      onChange={handleChange}
                      value={formData.start_date}
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date" className="ml-1">
                      Fecha de finalización
                    </Label>
                    <Input
                      id="end_date"
                      value={formData.end_date}
                      type="date"
                      className="pr-1 md:pr-3"
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price">Precio</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Bs
                    </span>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      readOnly
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel} disabled={!isChanged}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!isChanged}>
          Guardar
        </Button>
      </CardFooter>
    </div>
  );
}
