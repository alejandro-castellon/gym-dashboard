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
  const [loading, setLoading] = useState(false);
  const { gymId } = useUser();
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

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

  const isDayClosed = (day: Weekday) => {
    return (
      formData.hours[day].open === "close" &&
      formData.hours[day].close === "close"
    );
  };

  const toggleDayClosed = (day: Weekday) => {
    if (isDayClosed(day)) {
      // If currently closed, set to default empty values
      setFormData((prev) => ({
        ...prev,
        hours: {
          ...prev.hours,
          [day]: { open: "", close: "" },
        },
      }));
    } else {
      // If currently open, set to closed
      setFormData((prev) => ({
        ...prev,
        hours: {
          ...prev.hours,
          [day]: { open: "close", close: "close" },
        },
      }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, name: value });

    // Clear name error when user types
    if (errors.name && value.trim() !== "") {
      setErrors({ ...errors, name: undefined });
    }
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

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del gimnasio es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (JSON.stringify(formData) === JSON.stringify(initialData)) return;

      if (!validateForm()) return;

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

      formDataToSubmit.append("id", gymId?.toString() || "");
      await updateGymData(formDataToSubmit);
    } finally {
      setLoading(false);
      setInitialData(formData);
      setIsChanged(false);
    }
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
                onChange={handleNameChange}
                onBlur={() => {
                  if (!formData.name.trim()) {
                    setErrors({
                      ...errors,
                      name: "El nombre del gimnasio es obligatorio",
                    });
                  }
                }}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
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
                  <div className="relative w-36 sm:w-64">
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
                const closed = isDayClosed(day);
                const { open, close } = formData.hours[day];
                return (
                  <div key={day} className="flex items-center mb-3">
                    <Label
                      htmlFor={`${day}-toggle`}
                      className="w-1/4 mr-2 md:mr-20"
                    >
                      {weekdayTranslations[day]}
                    </Label>
                    <div className="flex items-center flex-grow">
                      <div className="flex items-center mr-1 sm:mr-4">
                        <Input
                          type="checkbox"
                          id={`${day}-toggle`}
                          checked={closed}
                          onChange={() => toggleDayClosed(day)}
                          className="h-4 w-4"
                        />
                      </div>
                      {!closed ? (
                        <div className="flex items-center flex-grow">
                          <Input
                            id={`${day}-open`}
                            type="time"
                            value={open}
                            onChange={(e) => handleChange(e, day, "open")}
                            className="w-24 pr-0 sm:w-full sm:pr-3"
                          />
                          <Label
                            htmlFor={`${day}-close`}
                            className="mx-1 md:mx-3"
                          >
                            -
                          </Label>
                          <Input
                            id={`${day}-close`}
                            type="time"
                            value={close}
                            onChange={(e) => handleChange(e, day, "close")}
                            className="w-24 pr-0 sm:w-full sm:pr-3"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground ml-2">
                          Cerrado todo el día
                        </div>
                      )}
                    </div>
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
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </CardFooter>
    </div>
  );
}
