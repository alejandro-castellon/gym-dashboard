import { Suspense } from "react";
import { Metadata } from "next";
import { getUserRole } from "@/lib/supabase/data";
import MemberDashboard from "@/components/dashboard/members";
import GymDashboard from "@/components/dashboard/gyms";
import {
  GymDashboardSkeleton,
  MembersDashboardSkeleton,
} from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Dashboard",
};

function RoleBasedData(isAdmin: boolean, id: string) {
  if (isAdmin) {
    return <GymDashboard id={id} />;
  } else {
    return <MemberDashboard id={id} />;
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
            <MembersDashboardSkeleton />
          )
        }
      >
        {RoleBasedData(data.admin, data.id)}
      </Suspense>
    </div>
  );
}
