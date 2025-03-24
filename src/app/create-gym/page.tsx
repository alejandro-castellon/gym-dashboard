'use client'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function Page() {
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>({});

  const days = [
    { id: 'monday', name: 'Lunes' },
    { id: 'tuesday', name: 'Martes' },
    { id: 'wednesday', name: 'Miércoles' },
    { id: 'thursday', name: 'Jueves' },
    { id: 'friday', name: 'Viernes' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' },
  ];

  const handleCheckboxChange = (dayId: string) => {
    setClosedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl border p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Crea tu Gimnasio</CardTitle>
          <CardDescription>
            Completa la información de tu gimnasio, después podrás realizar modificaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-semibold">Nombre del Gimnasio</Label>
              <Input id="name" name="name" placeholder="Ej: Iron Gym Cochabamba" required />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Horarios por día</h3>
              <div className="flex flex-col gap-4">
                {days.map((day) => (
                  <div key={day.id} className="border rounded-xl p-4 bg-background shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
                      <Label className="font-medium w-28">{day.name}</Label>
                      {!closedDays[day.id] && (
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <div className="flex flex-col">
                            <Label htmlFor={`${day.id}-open`}>Apertura</Label>
                            <Input
                              type="time"
                              id={`${day.id}-open`}
                              name={`${day.id}-open`}
                              required
                            />
                          </div>
                          <div className="flex flex-col">
                            <Label htmlFor={`${day.id}-close`}>Cierre</Label>
                            <Input
                              type="time"
                              id={`${day.id}-close`}
                              name={`${day.id}-close`}
                              required
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-auto">
                        <Checkbox
                          id={`${day.id}-closed`}
                          name={`${day.id}-closed`}
                          checked={closedDays[day.id]}
                          onCheckedChange={() => handleCheckboxChange(day.id)}
                        />
                        <Label htmlFor={`${day.id}-closed`} className="text-sm">
                          Cerrado
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SubmitButton
              className="text-white rounded-md h-10 w-full font-medium"
              pendingText="Ingresando..."
            >
              Crear Gimnasio
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
