import { Metadata } from "next";
import { Suspense } from "react";
import MembershipDashboardSkeleton from "@/components/dashboard/clients/skeleton";
import MembershipInfo from "@/components/dashboard/clients/membership";
import { getActiveUserMembership } from "@/lib/supabase/data";
export const metadata: Metadata = {
  title: "Mi membresía",
};

export default async function Page() {
  const membership = await getActiveUserMembership();
  return (
    <main>
      <h1 className="text-2xl font-medium">Mi membresía</h1>
      <Suspense fallback={<MembershipDashboardSkeleton />}>
        <MembershipInfo membership={membership} />
      </Suspense>
    </main>
  );
}
