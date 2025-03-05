import { Metadata } from "next";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/memberships/skeleton";
import MembershipTable from "@/components/memberships/get-data";

export const metadata: Metadata = {
  title: "Membresias",
};

export default async function Page() {
  return (
    <main>
      <h1 className="text-2xl font-medium">Membresías</h1>
      <Suspense fallback={<DataTableSkeleton />}>
        <MembershipTable />
      </Suspense>
    </main>
  );
}
