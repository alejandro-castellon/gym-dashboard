import { Suspense } from "react";
import { Metadata } from "next";
import MembershipDashboard from "@/components/dashboard/memberships";
import GymDashboard from "@/components/dashboard/gyms";
import { getUserRole } from "@/lib/supabase/data";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function RoleBasedData() {
  const isAdmin = await getUserRole();
  if (isAdmin) {
    return <GymDashboard />;
  } else {
    return <MembershipDashboard />;
  }
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <Suspense
        fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}
      >
        <RoleBasedData />
      </Suspense>
    </div>
  );
}
