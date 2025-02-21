import { Suspense } from "react";
import { Metadata } from "next";
import MembershipDashboard from "@/components/dashboard/memberships";
import GymDashboard from "@/components/dashboard/gyms";
import {
  getUserGyms,
  getUserMembership,
  getUserRole,
} from "@/lib/supabase/data";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Componente que primero verifica el rol y luego carga los datos adecuados
async function RoleBasedData() {
  // Primero verificamos el rol del usuario
  const isAdmin = await getUserRole();

  if (isAdmin) {
    // Si es admin, solo cargamos los datos del gimnasio
    const gym = await getUserGyms();
    return <GymDashboard gym={gym} />;
  } else {
    // Si es cliente, solo cargamos los datos de membresía
    const membership = await getUserMembership();
    return <MembershipDashboard membership={membership} />;
  }
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense
        fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}
      >
        <RoleBasedData />
      </Suspense>
    </div>
  );
}
