"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Attendance } from "@/types";
import { cn } from "@/lib/utils";

interface AttendanceTrackerProps {
  attendanceData: Attendance[];
}

export default function AttendanceTracker({
  attendanceData,
}: AttendanceTrackerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleString("es-ES", { month: "long" });
  const year = currentMonth.getFullYear();

  // Formatear hora en formato 12 horas AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return "Fecha no disponible";
    const cleanTime = timeString.split(".")[0]; // "12:23:14"
    const [hours, minutes, seconds] = cleanTime.split(":").map(Number);
    // Determinar AM o PM
    const period = hours >= 12 ? "p. m." : "a. m.";
    // Convertir a formato de 12 horas
    const formattedHours = hours % 12 || 12; // 0 se convierte en 12
    // Formatear salida
    return `${formattedHours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")} ${period}`;
  };
  // Crear array de días en el mes
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Verificar si hay asistencia en un día específico
  const hasAttendance = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0]; // Convertir a formato YYYY-MM-DD
    return attendanceData.some((a) => a.date.split("T")[0] === date);
  };

  // Obtener detalles de asistencia para un día específico
  const getAttendanceDetails = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return attendanceData.filter((a) => a.date.split("T")[0] === date);
  };

  // Calcular estadísticas de asistencia
  const totalAttendancesThisMonth = attendanceData.filter((a) => {
    const attendanceDate = new Date(a.date).toISOString().split("T")[0]; // Normalizar a YYYY-MM-DD
    const currentMonthDate = new Date(currentMonth).toISOString().split("T")[0]; // Normalizar a YYYY-MM-DD
    return (
      attendanceDate.slice(0, 7) === currentMonthDate.slice(0, 7) // Comparar año y mes
    );
  }).length;

  const attendanceRate = Math.round(
    (totalAttendancesThisMonth / daysInMonth) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Registro de Asistencias</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">
            {monthName} {year}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="py-2 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-12 rounded-md p-1" />
          ))}

          {days.map((day) => {
            const attended = hasAttendance(day);
            const attendanceDetails = getAttendanceDetails(day);

            return (
              <div
                key={day}
                className={cn(
                  "flex h-12 flex-col items-center justify-center rounded-md p-1 text-sm",
                  attended
                    ? "bg-green-100 font-medium text-green-800"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-800"
                )}
                title={
                  attended
                    ? `Asistió: ${attendanceDetails
                        .map((a) => formatTime(a.check_in))
                        .join(", ")}`
                    : "No asistió"
                }
              >
                <span>{day}</span>
                {attended && <CalendarIcon className="h-3 w-3" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 p-4">
        <div>
          <p className="text-sm text-gray-500">Total de asistencias</p>
          <p className="text-2xl font-bold">{totalAttendancesThisMonth}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tasa de asistencia</p>
          <p className="text-2xl font-bold">{attendanceRate}%</p>
        </div>
      </div>
    </div>
  );
}
