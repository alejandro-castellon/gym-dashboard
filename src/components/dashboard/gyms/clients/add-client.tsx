"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createUserInSupabaseAuth,
  createMembership,
} from "@/lib/supabase/actions";
import { IconUserPlus } from "@tabler/icons-react"; // Importa un ícono, puedes cambiarlo según lo desees

export default function AddClientForm() {
  const initialFormData = {
    email: "",
    start_date: "",
    end_date: "",
    price: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isChanged, setIsChanged] = useState(false);

  // Maneja los cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedFormData = { ...formData, [id]: value };
    setFormData(updatedFormData);
    setIsChanged(
      JSON.stringify(updatedFormData) !== JSON.stringify(initialFormData)
    );
  };

  // Restablece los valores iniciales
  const handleCancel = () => {
    setFormData(initialFormData);
    setIsChanged(false);
  };

  // Lógica para guardar los datos
  const handleSave = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("start_date", formData.start_date);
    formDataToSubmit.append("end_date", formData.end_date);
    formDataToSubmit.append("price", formData.price);
    createMembership(formDataToSubmit);
    setFormData(initialFormData);
    setIsChanged(false);
  };

  // Lógica para crear usuario
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="start_date">Fecha de inicio</Label>
              <Input
                id="start_date"
                onChange={handleChange}
                value={formData.start_date}
                type="date"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="end_date">Fecha de finalización</Label>
              <Input
                id="end_date"
                onChange={handleChange}
                value={formData.end_date}
                type="date"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                placeholder="Precio"
                step="0.01"
                onChange={handleChange}
                value={formData.price}
                required
              />
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
