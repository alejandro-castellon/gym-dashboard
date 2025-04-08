import { Metadata } from "next";
import { getUserRole } from "@/lib/supabase/data";
import MemberDashboard from "@/components/dashboard/members";
import GymDashboard from "@/components/dashboard/gyms";

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
      {RoleBasedData(data.admin, data.id)}
    </div>
  );
}
