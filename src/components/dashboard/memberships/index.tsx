import { Membership } from "@/types";
import { getUserMembership } from "@/lib/supabase/data";

export default async function MembershipDashboard() {
  const membership: Membership = await getUserMembership();
  if (membership) {
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

  return <div>No hay datos disponibles para tu perfil</div>;
}
