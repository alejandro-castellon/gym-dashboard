"use client";
import { useState } from "react";
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
  createUserInSupabaseAuth,
  createMembership,
} from "@/lib/supabase/actions";
import { UserPlus } from "lucide-react";
import { GymSettings, GymPrices } from "@/types";
import { addMonths, subDays, lastDayOfMonth } from "date-fns";

interface SettingsFormProps {
  data: GymSettings;
}

const membershipTypes: Record<number, string> = {
  1: "Mensual",
  2: "Trimestral",
  3: "Semestral",
  4: "Anual",
  5: "Día por medio mensual",
};

export default function AddClient({ data }: SettingsFormProps) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

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

  const handleSelectChange = (value: string) => {
    const membership = data.gymPrices.find(
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
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("start_date", formData.start_date);
    formDataToSubmit.append("end_date", formData.end_date);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("gym_id", data.id);
    formDataToSubmit.append(
      "membership_type_id",
      selectedMembership.membership_type_id.toString()
    );
    createMembership(formDataToSubmit);
    setFormData(initialFormData);
    setSelectedMembership(null);
    setIsChanged(false);
  };

  const handleCreateUser = async () => {
    if (formData.email) await createUserInSupabaseAuth(formData.email);
  };

  return (
    <div>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
                <Button
                  type="button"
                  onClick={handleCreateUser}
                  disabled={!formData.email}
                  size="sm"
                >
                  <UserPlus />
                </Button>
              </div>
              <Input
                id="email"
                placeholder="Introduce el email"
                onChange={handleChange}
                value={formData.email}
                type="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="memb">Membresía</Label>
              <Select
                onValueChange={handleSelectChange}
                value={selectedMembership?.membership_type_id.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de membresía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Membresía</SelectLabel>
                    {data.gymPrices
                      .filter((price) => price.price !== null) // Filtra los precios nulos
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
