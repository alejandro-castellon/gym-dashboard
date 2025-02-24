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
import { IconUserPlus } from "@tabler/icons-react";
import { Gym } from "@/types";

interface SettingsFormProps {
  data: Gym;
}

export default function AddClient({ data }: SettingsFormProps) {
  // Funciones para fechas
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  // Función para calcular la fecha de finalización según la membresía
  const getEndDateByMembership = (startDate: string, type: string) => {
    const date = new Date(startDate);
    switch (type) {
      case "mes":
        date.setMonth(date.getMonth() + 1);
        break;
      case "trimes":
        date.setMonth(date.getMonth() + 3);
        break;
      case "semes":
        date.setMonth(date.getMonth() + 6);
        break;
      case "anio":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date.toISOString().split("T")[0];
  };

  const calculatePriceByMembership = (type: string) => {
    const basePrice = data.price;
    switch (type) {
      case "mes":
        return basePrice;
      case "trimes":
        return basePrice * 3;
      case "semes":
        return basePrice * 6;
      case "anio":
        return basePrice * 12;
      default:
        return 0; // Precio inicial si no se selecciona nada
    }
  };

  const initialFormData = {
    email: "",
    start_date: getTodayDate(),
    end_date: "",
    price: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState("");

  // Nueva función para manejar el cambio del Select
  const handleSelectChange = (value: string) => {
    setSelectedMembership(value); // Guardamos la membresía seleccionada
    setFormData((prev) => ({
      ...prev,
      end_date: getEndDateByMembership(prev.start_date, value),
      price: calculatePriceByMembership(value).toString(),
    }));
    setIsChanged(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    const updatedFormData = { ...formData, [id]: value };
    if (id === "start_date" && selectedMembership) {
      updatedFormData.end_date = getEndDateByMembership(
        value,
        selectedMembership
      );
    }

    setFormData(updatedFormData);
    setIsChanged(updatedFormData.email !== "" || updatedFormData.price !== "0");
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setSelectedMembership("");
    setIsChanged(false);
  };

  const handleSave = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("start_date", formData.start_date);
    formDataToSubmit.append("end_date", formData.end_date);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("gym_id", data.id);
    createMembership(formDataToSubmit);
    setFormData(initialFormData);
    setSelectedMembership("");
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
                  <IconUserPlus />
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
                value={selectedMembership || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de membresía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Membresía</SelectLabel>
                    <SelectItem value="mes">Mensual</SelectItem>
                    <SelectItem value="trimes">Trimestral</SelectItem>
                    <SelectItem value="semes">Semestral</SelectItem>
                    <SelectItem value="anio">Anual</SelectItem>
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
                  className="pr-1 md:pr-3"
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
                  placeholder="Introduce el precio"
                  onChange={handleChange}
                  value={formData.price}
                  required
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
