"use client";

import { Gym } from "@/types";

interface DashboardProps {
  gym: Gym | null;
}

export default function GymDashboard({ gym }: DashboardProps) {
  if (gym) {
    return (
      <div className="flex flex-1">
        <div className="flex flex-col gap-2 flex-1 w-full h-screen">
          <div className="flex items-center gap-4">Hey Admin, {gym.name}!</div>
        </div>
      </div>
    );
  }

  return <div>No hay datos disponibles para tu perfil</div>;
}
