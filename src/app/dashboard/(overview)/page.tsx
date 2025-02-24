import { Suspense } from "react";
import { Metadata } from "next";
import MembershipDashboard from "@/components/dashboard/memberships";
import GymDashboard from "@/components/dashboard/gyms";
import { getUserRole } from "@/lib/supabase/data";
import GymDashboardSkeleton from "@/components/dashboard/gyms/skeleton";
import MembershipDashboardSkeleton from "@/components/dashboard/memberships/skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

function RoleBasedData(isAdmin: boolean) {
  if (isAdmin) {
    return <GymDashboard />;
  } else {
    return <MembershipDashboard />;
  }
}

export default async function DashboardPage() {
  const isAdmin = await getUserRole();
  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Dashboard</h1>
      <Suspense
        fallback={
          (isAdmin && <GymDashboardSkeleton />) || (
            <MembershipDashboardSkeleton />
          )
        }
      >
        {RoleBasedData(isAdmin)}
      </Suspense>
    </div>
  );
}
