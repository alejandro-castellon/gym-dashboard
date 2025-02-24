import { Gym } from "@/types";
import { getUserGyms } from "@/lib/supabase/data";

export default async function GymDashboard() {
  const gym: Gym = await getUserGyms();
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
