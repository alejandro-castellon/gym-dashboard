"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { updateProfile } from "@/lib/supabase/actions";
import Link from "next/link";

export default function ProfileData() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const [initialData, setInitialData] = useState(formData);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
    });
    setInitialData({
      name: user?.name || "",
    });
  }, [user]);

  // Maneja los cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Detecta si hay cambios
  useEffect(() => {
    setIsChanged(formData.name !== initialData.name);
  }, [formData, initialData]);

  // Restablece los valores iniciales
  const handleCancel = () => {
    setFormData(initialData);
  };

  // Lógica para guardar los datos
  const handleSave = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    updateProfile(formDataToSubmit);
    setInitialData(formData); // Actualiza los datos iniciales después de guardar
    setIsChanged(false);
  };
  return (
    <div>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                placeholder="Tu email"
                value={user?.email || ""}
                type="email"
                disabled
              />
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/update-email">
                <Button>Cambiar email</Button>
              </Link>
              <Link href="/dashboard/reset-password">
                <Button>Cambiar contraseña</Button>
              </Link>
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
