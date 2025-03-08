import { Metadata } from "next";
import { Suspense } from "react";
import { MembersDashboardSkeleton } from "@/components/ui/skeletons";
import MembershipInfo from "@/components/dashboard/members/membership";
import { getActiveUserMembership } from "@/lib/supabase/data";
export const metadata: Metadata = {
  title: "Mi membresía",
};

export default async function Page() {
  const membership = await getActiveUserMembership();
  return (
    <main>
      <h1 className="text-2xl font-medium">Mi membresía</h1>
      <Suspense fallback={<MembersDashboardSkeleton />}>
        <MembershipInfo membership={membership} />
      </Suspense>
    </main>
  );
}
