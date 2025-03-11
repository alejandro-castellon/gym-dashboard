import { Metadata } from "next";
import { Suspense } from "react";
import { MembersDashboardSkeleton } from "@/components/ui/skeletons";
import MembershipInfo from "@/components/dashboard/members/membership";
export const metadata: Metadata = {
  title: "Mi membresía",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-2xl font-medium">Mi membresía</h1>
      <Suspense fallback={<MembersDashboardSkeleton />}>
        <MembershipInfo />
      </Suspense>
    </main>
  );
}
