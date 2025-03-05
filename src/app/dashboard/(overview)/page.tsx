import { Suspense } from "react";
import { Metadata } from "next";
import { getUserRole } from "@/lib/supabase/data";
import ClientDashboard from "@/components/dashboard/clients";
import GymDashboard from "@/components/dashboard/gyms";
import GymDashboardSkeleton from "@/components/dashboard/gyms/skeleton";
import MembershipDashboardSkeleton from "@/components/dashboard/clients/skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

function RoleBasedData(isAdmin: boolean, id: string) {
  if (isAdmin) {
    return <GymDashboard />;
  } else {
    return <ClientDashboard id={id} />;
  }
}

export default async function DashboardPage() {
  const data = await getUserRole();
  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>
      <Suspense
        fallback={
          (data.admin && <GymDashboardSkeleton />) || (
            <MembershipDashboardSkeleton />
          )
        }
      >
        {RoleBasedData(data.admin, data.id)}
      </Suspense>
    </div>
  );
}
