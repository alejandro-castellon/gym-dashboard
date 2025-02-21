import { Metadata } from "next";
import {
  getUserGyms,
  getUserMembership,
  getUserRole,
} from "@/lib/supabase/data";
import { Gym, Membership } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  try {
    const isAdmin = await getUserRole();

    if (isAdmin) {
      const gym: Gym = await getUserGyms();
      return (
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 flex-1 w-full h-screen">
            <div className="flex items-center gap-4">Hey, {gym.name}!</div>
          </div>
        </div>
      );
    } else {
      const membership: Membership = await getUserMembership();
      return (
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 flex-1 w-full h-screen">
            <div className="flex items-center gap-4">
              Hey, tienes una membresía en{" "}
              {membership.gyms?.name ?? "un gimnasio desconocido"} desde{" "}
              {membership.start_date} hasta {membership.end_date}.
            </div>
          </div>
        </div>
      );
    }
  } catch (error) {
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );
  }
}
