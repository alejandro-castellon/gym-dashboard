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
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { createMembership } from "@/lib/supabase/actions";
import { GymSettings, GymPrices } from "@/types";
import { addMonths, subDays, lastDayOfMonth } from "date-fns";
import CreateMemberDialog from "./create-member-form";
import CreateMemberInfoDialog from "./create-member-info";
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
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Por favor ingrese un email válido")
    .transform((val: string) => val.toLowerCase().trim()),
  membershipTypes: z
    .string()
    .min(1, "Selecciona un tipo de membresía")
    .transform((val: string) => val.trim()),
  metodoPago: z
    .string()
    .min(1, "Selecciona un método de pago")
    .transform((val: string) => val.trim()),
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
  const metodosPago = ["Efectivo", "QR"];

  const [formData, setFormData] = useState(initialFormData);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<GymPrices | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      email: "",
      membershipTypes: "",
      metodoPago: "",
    },
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

  const handleSelectPago = (value: string) => {
    setSelectedPaymentMethod(value);
    setFormData((prev) => ({
      ...prev,
      metodo_pago: value,
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
    setSelectedPaymentMethod("");
    setSearchTerm("");
    setOpen(false);
    setIsChanged(false);
  };

  const onSubmit = async (data: ClientFormData) => {
    if (!selectedMembership) return;
    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("email", data.email);
      formDataToSubmit.append("start_date", formData.start_date);
      formDataToSubmit.append("end_date", formData.end_date);
      formDataToSubmit.append("price", formData.price);
      formDataToSubmit.append("gym_id", gymSettings.id);
      formDataToSubmit.append(
        "membership_type_id",
        selectedMembership.membership_type_id.toString()
      );
      formDataToSubmit.append("metodo_pago", data.metodoPago);

      await createMembership(formDataToSubmit);
    } finally {
      setFormData(initialFormData);
      setSelectedMembership(null);
      setSelectedPaymentMethod("");
      setSearchTerm("");
      setOpen(false);
      setIsChanged(false);
      setLoading(false);
      reset();
    }
  };

  const handleUserCreated = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      email: email,
    }));
    setSearchTerm(email);
    setValue("email", email);
    setOpen(false);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <CreateMemberInfoDialog />
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
                <CreateMemberDialog onUserCreated={handleUserCreated} />
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
                    setFormData((prev) => ({ ...prev, email: value }));
                    setValue("email", value);
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
                              setValue("email", member);
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
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            {(filteredMembers.some((member) => member === formData.email) ||
              (searchTerm && searchTerm.includes("@"))) && (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <Label htmlFor="memb">Membresía</Label>
                    <Select
                      onValueChange={(value) => {
                        handleSelectChange(value);
                        setValue("membershipTypes", value);
                        clearErrors("membershipTypes");
                      }}
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
                            .filter(
                              (price) =>
                                price.price !== null &&
                                price.price !== undefined
                            ) // Filtra los precios nulos
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
                    {errors.membershipTypes && (
                      <p className="text-sm text-red-500">
                        {errors.membershipTypes.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="metodo">Método de pago</Label>
                    <Select
                      onValueChange={(value) => {
                        handleSelectPago(value);
                        setValue("metodoPago", value);
                        clearErrors("metodoPago");
                      }}
                      value={selectedPaymentMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Método</SelectLabel>
                          <SelectItem value={metodosPago[0]}>
                            {metodosPago[0]}
                          </SelectItem>
                          <SelectItem value={metodosPago[1]}>
                            {metodosPago[1]}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.metodoPago && (
                      <p className="text-sm text-red-500">
                        {errors.metodoPago.message}
                      </p>
                    )}
                  </div>
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
                  {selectedPaymentMethod && (
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
                  )}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              handleCancel();
              reset();
            }}
            disabled={!isChanged}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!isChanged}>
            {loading ? "Creando..." : "Crear membresía"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
