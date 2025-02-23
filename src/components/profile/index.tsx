"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { updateProfile } from "@/lib/supabase/actions";
import Link from "next/link";

export default function ProfileData() {
  const { user } = useUser();

  // Usamos useMemo para evitar que initialState se recalule en cada render
  const initialState = useMemo(
    () => ({
      name: user?.name || "",
      ci: user?.ci || "",
      fecha_nacimiento: user?.fecha_nacimiento || "",
    }),
    [user]
  );

  const [formData, setFormData] = useState(initialState);
  const [isChanged, setIsChanged] = useState(false);

  // Actualiza los valores al cambiar el usuario
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]); // Usamos initialState como dependencia

  // Detecta si hay cambios
  useEffect(() => {
    setIsChanged(
      formData.name !== initialState.name ||
        formData.ci !== initialState.ci ||
        formData.fecha_nacimiento !== initialState.fecha_nacimiento
    );
  }, [formData, initialState]); // Aseguramos que ambas dependencias estén presentes

  // Maneja los cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Restablece los valores iniciales
  const handleCancel = () => setFormData(initialState);

  // Lógica para guardar los datos
  const handleSave = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("ci", formData.ci);
    formDataToSubmit.append("fecha_nacimiento", formData.fecha_nacimiento);

    updateProfile(formDataToSubmit);
    setIsChanged(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
              <Label htmlFor="ci">Carnet</Label>
              <Input
                id="ci"
                placeholder="Tu carnet"
                value={formData.ci}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                type="date"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Tu email"
                value={user?.email || ""}
                type="email"
                readOnly
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
