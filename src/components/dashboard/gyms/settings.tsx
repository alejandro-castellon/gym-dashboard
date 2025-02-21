"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { updateProfile } from "@/lib/supabase/actions";
import Link from "next/link";

export default function SettingsForm() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    ci: user?.ci || "",
    fecha_nacimiento: user?.fecha_nacimiento || "",
  });

  const [initialData, setInitialData] = useState(formData);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      ci: user?.ci || "",
      fecha_nacimiento: user?.fecha_nacimiento || "",
    });
    setInitialData({
      name: user?.name || "",
      ci: user?.ci || "",
      fecha_nacimiento: user?.fecha_nacimiento || "",
    });
  }, [user]);

  // Maneja los cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Detecta si hay cambios
  useEffect(() => {
    setIsChanged(
      formData.name !== initialData.name ||
        formData.ci !== initialData.ci ||
        formData.fecha_nacimiento !== initialData.fecha_nacimiento
    );
  }, [formData, initialData]);

  // Restablece los valores iniciales
  const handleCancel = () => {
    setFormData(initialData);
  };

  // Lógica para guardar los datos
  const handleSave = () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("ci", formData.ci);
    formDataToSubmit.append("fecha_nacimiento", formData.fecha_nacimiento);

    // Guardar los datos
    updateProfile(formDataToSubmit);

    // Actualizar los datos iniciales y cambiar el estado
    setInitialData(formData);
    setIsChanged(false);

    // Esperar un poco antes de recargar la página para asegurarse de que los datos estén guardados
    setTimeout(() => {
      window.location.reload();
    }, 500); // 500ms de espera (ajusta el tiempo según necesites)
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
