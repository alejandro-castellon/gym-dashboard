"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateGymData } from "@/lib/supabase/actions";
import { GymSettings } from "@/types";
import { useUser } from "@/context/UserContext";

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

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

interface SettingsFormProps {
  data: GymSettings;
}

export default function Settings({ data }: SettingsFormProps) {
  const [formData, setFormData] = useState<GymSettings>(
    data || {
      name: "",
      hours: {
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" },
      },
      gymPrices: [
        { membership_type_id: 1, price: 0 }, // Precio mensual
        { membership_type_id: 2, price: 0 }, // Precio trimestral
        { membership_type_id: 3, price: 0 }, // Precio semestral
        { membership_type_id: 4, price: 0 }, // Precio anual
        { membership_type_id: 5, price: 0 }, // Precio día por medio
      ],
    }
  );
  const [initialData, setInitialData] = useState(formData);
  const [isChanged, setIsChanged] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    day: Weekday,
    type: "open" | "close"
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: { ...prev.hours[day], [type]: value },
      },
    }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    membershipTypeId: number
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      gymPrices: prev.gymPrices.map((price) =>
        price.membership_type_id === membershipTypeId
          ? { ...price, price: parseFloat(value) }
          : price
      ),
    }));
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  const handleSave = () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    Object.entries(formData.hours).forEach(([day, hours]) => {
      formDataToSubmit.append(`${day}_open`, hours.open);
      formDataToSubmit.append(`${day}_close`, hours.close);
    });

    formData.gymPrices.forEach((price) => {
      formDataToSubmit.append(
        `price_${price.membership_type_id}`,
        price.price?.toString() || ""
      );
    });

    formDataToSubmit.append("id", user?.id || "");
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
              <div className="flex justify-center font-semibold">
                <span className="mt-4 md:mb-2">Precios</span>
              </div>

              {[
                { id: 1, label: "Mensual" },
                { id: 2, label: "Trimestral" },
                { id: 3, label: "Semestral" },
                { id: 4, label: "Anual" },
                { id: 5, label: "Día por medio" },
              ].map((membership) => (
                <div key={membership.id} className="flex justify-between">
                  <Label htmlFor={`price_${membership.id}`} className="pt-4">
                    {`Membresía ${membership.label}`}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      Bs
                    </span>
                    <Input
                      id={`price_${membership.id}`}
                      placeholder="0.0"
                      value={
                        formData.gymPrices.find(
                          (price) => price.membership_type_id === membership.id
                        )?.price || ""
                      }
                      type="number"
                      onChange={(e) => handlePriceChange(e, membership.id)}
                      className="pl-8"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center font-semibold">
                <span className="mt-4 md:mb-2">Horarios</span>
              </div>
              {weekdays.map((day) => {
                const { open, close } = formData.hours[day];
                return (
                  <div key={day} className="flex items-center">
                    <Label
                      htmlFor={`${day}-open`}
                      className="w-1/4 mr-4 md:mr-20"
                    >
                      {weekdayTranslations[day]}
                    </Label>
                    <Input
                      id={`${day}-open`}
                      type="time"
                      value={open}
                      onChange={(e) => handleChange(e, day, "open")}
                      className="pr-1 md:pr-3"
                    />
                    <Label htmlFor={`${day}-close`} className="mx-1 md:mx-3">
                      -
                    </Label>
                    <Input
                      id={`${day}-close`}
                      type="time"
                      value={close}
                      onChange={(e) => handleChange(e, day, "close")}
                      className="pr-1 md:pr-3"
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
