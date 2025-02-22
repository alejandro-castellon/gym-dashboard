"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGymData } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/context/UserContext";

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Mapeo de los días en inglés a español
const weekdayTranslations: Record<Weekday, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function SettingsForm() {
  const supabase = createClient();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    gym_hours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });
  const [initialData, setInitialData] = useState(formData);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchGym = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("gyms")
          .select("*")
          .contains("admin_ids", [user.id])
          .single();

        if (error) {
          console.error("Error al obtener los gimnasios:", error);
        } else if (data) {
          setFormData({
            name: data.name,
            gym_hours: data.hours,
          });
          setInitialData({
            name: data.name,
            gym_hours: data.hours,
          });
        }
      }
    };

    fetchGym();
  }, [user, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    day: Weekday,
    type: "open" | "close"
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      gym_hours: {
        ...prev.gym_hours,
        [day]: { ...prev.gym_hours[day], [type]: value },
      },
    }));
  };

  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData, initialData]);

  const handleCancel = () => {
    setFormData(initialData);
  };

  const handleSave = () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    Object.entries(formData.gym_hours).forEach(([day, hours]) => {
      formDataToSubmit.append(`${day}_open`, hours.open);
      formDataToSubmit.append(`${day}_close`, hours.close);
    });
    updateGymData(formDataToSubmit);
    setInitialData(formData);
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
                placeholder="Nombre del gimnasio"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {/* Añadir labels "Abre" y "Cierra" arriba de las horas */}
              <div className="flex justify-center font-semibold">
                <span className="mt-4 md:mb-2">Horarios</span>
              </div>
              {/* Renderizar las horas de apertura y cierre */}
              {weekdays.map((day) => {
                const { open, close } = formData.gym_hours[day];
                return (
                  <div key={day} className="flex items-center">
                    <Label
                      htmlFor={`${day}-open`}
                      className="w-1/4 mr-4 md:mr-20"
                    >
                      {weekdayTranslations[day]}{" "}
                      {/* Muestra el día en español */}
                    </Label>
                    <Input
                      id={`${day}-open`}
                      type="time"
                      value={open}
                      onChange={(e) => handleChange(e, day, "open")}
                    />
                    <Label htmlFor={`${day}-close`} className="mx-1 md:mx-3">
                      -
                    </Label>
                    <Input
                      id={`${day}-close`}
                      type="time"
                      value={close}
                      onChange={(e) => handleChange(e, day, "close")}
                    />
                  </div>
                );
              })}
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
